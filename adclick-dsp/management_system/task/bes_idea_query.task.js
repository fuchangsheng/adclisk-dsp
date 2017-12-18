/*
 * @file  bes_idea_query.task.js
 * @description bes idea audit query timer task
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.3.14
 * @version 1.5 
 */

'use strict';
var MODULENAME = 'bes_idea_query.task.logic';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');
var request = require('request');

//models
var mAdxAuditIdeaModel = require('../model/adlib_audit_ideas').create();

//utils
var mLogger = require('../../utils/logger')(MODULENAME);
var mDataHelper = require('../../utils/data_helper');
var mUtils = require('../../utils/utils');

//common constants
var ERRCODE = require('../../common/errCode');
var ADCONSTANTS = require('../../common/adConstants');

//private constants
var ADXID = ADCONSTANTS.ADXLIST.BES.code;
var bes = require('../logic/adx/bes_adx');
var MAXQUERY = 100;

var taskCallback = function() {
    mLogger.debug('BES idea audit query task start...');

    mAsync.waterfall([
        // 1.get uncheck ideas
        function(next) {
            var sqlstr = 'Select idea_id from ' + mAdxAuditIdeaModel.tableName;
            sqlstr += ' Where adx_id = ' + ADXID;
            sqlstr += ' And audit_status = ' + ADCONSTANTS.AUDIT.UNCHECK.code;
            sqlstr += ';';
            var query = {
                sqlstr: sqlstr
            };
            mAdxAuditIdeaModel.query(query, function(err, rows) {
                if (err) {
                    mLogger.error('Failed to get uncheck ideas.');
                } else {
                    if (!rows &&  rows.length === 0) {
                        mLogger.debug('No ideas to query!');
                        next(null);
                    } else {
                        next(null, rows);
                    }
                }
            });
        },
        // 2.query every record
        function(ideas, next) {
            var total = ideas.length;
            var ideaList = [];
            for (var i = 0; i < total; i = i + MAXQUERY) {
                var tmp = ideas.slice(i, i+MAXQUERY);
                ideaList.push(tmp);
            }
            mAsync.map(ideaList, function(idea, cb) {
                var ids = [];
                for (var i = 0; i < idea.length; i++) {
                    ids.push(idea[i].idea_id);
                }
                var param = {
                    ideas: ids
                };
                bes.ideaAuditQuery(param, function(err, res) {
                    if (err) {
                        mLogger.error('Failed to query audit status from BES.');
                        cb(null);
                    } else {
                        cb(null, res);
                    }
                });
            }, function(err, data) {
                if (err) {
                    next(err);
                } else {
                    next(null, data);
                }
            });
        } 
    ], function(err, result) {
        if (err) {
            mLogger.error('Failed to excute BES idea audit query task.');
        } else {
            mLogger.debug('BES idea audit query task finished.');
        }
    });
};

module.exports.taskCallback = taskCallback;
