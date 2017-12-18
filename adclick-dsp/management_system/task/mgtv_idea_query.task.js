/*
 * @file  mgtv_idea_query.task.js
 * @description mang guo TV ideas audit query timer task
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.3.14
 * @version 1.5
 */

'use strict';
var MODULENAME = 'mgtv_idea_query.task.logic';

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
var ADXID = ADCONSTANTS.ADXLIST.ADX_MGTV.code;
var mgtv = require('../logic/adx/mgtv_adx');

var taskCallback = function() {
    mLogger.debug('MGTV audit query task start...');

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
        function(args, next) {
            mAsync.map(args, function(idea, cb) {
                var idea_id = idea.idea_id;
                var ideas = [];
                ideas.push(idea_id);
                var param = {
                    ideas: ideas
                };
                mgtv.ideaAuditQuery(param, function(err, res) {
                    if (err) {
                        mLogger.error('Failed to query audit status from MGTV for idea: ' + idea_id);
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
            mLogger.error('Failed to excute MGTV timer task.');
        } else {
            mLogger.debug('MGTV timer task finished.');
        }
    });
};

module.exports.taskCallback = taskCallback;
