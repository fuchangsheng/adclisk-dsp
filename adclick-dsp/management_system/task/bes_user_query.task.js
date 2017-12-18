/*
 * @file  bes_user_query.task.js
 * @description bes user audit query timer task
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.3.14
 * @version 1.5
 */

'use strict';
var MODULENAME = 'bes_user_query.task.logic';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');
var request = require('request');

//models
var mAdxAuditUserModel = require('../model/adlib_audit_users').create();

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
    mLogger.debug('BES user audit query task start...');

    mAsync.waterfall([
        // 1.get uncheck users
        function(next) {
            var sqlstr = 'Select user_id,update_time from ' + mAdxAuditUserModel.tableName;
            sqlstr += ' Where adx_id = ' + ADXID;
            sqlstr += ' And audit_status = ' + ADCONSTANTS.AUDIT.UNCHECK.code;
            sqlstr += ';';
            var query = {
                sqlstr: sqlstr
            };
            mAdxAuditUserModel.query(query, function(err, rows) {
                if (err) {
                    mLogger.error('Failed to get uncheck users.');
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
        function(users, next) {
            var total = users.length;
            var userList = [];
            for (var i = 0; i < total; i = i + MAXQUERY) {
                var tmp = users.slice(i, i+MAXQUERY);
                userList.push(tmp);
            }
            mAsync.map(userList, function(user, cb) {
                var ids = [];
                var expire_ids = [];
                var date = mMoment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                date = mMoment(date).subtract(2, 'days');
                for (var i = 0; i < user.length; i++) {
                    if (mMoment(date).isBefore(user[i].update_time)) {
                        expire_ids.push(user[i].user_id);
                    } else {
                        ids.push(user[i].user_id);
                    }
                }
                mAsync.series([
                    //2.1 update expire user status to failed
                    function(nx) {
                        if (expire_ids.length === 0) {
                            next(null);
                        } else {
                            var sqlstr = 'UPDATE ' + mAdxAuditUserModel.tableName;
                            sqlstr += ' SET audit_status = ' + ADCONSTANTS.AUDIT.FAILED.code;
                            sqlstr += ' WHERE adx_id = ' + ADXID;
                            sqlstr += ' AND user_id in(' + expire_ids.join(',') + ');';
                            var query = {
                                sqlstr: sqlstr
                            };
                            mAdxAuditUserModel.query(query, function(err) {
                                if (err) {
                                    nx(err);
                                } else {
                                    nx(null);
                                }
                            });                           
                        }
                    },
                    //2.2 query status
                    function(nx) {
                        var query = {
                            users: ids
                        };
                        bes.userAuditQuery(query, function(err, res) {
                            if (err) {
                                mLogger.error('Failed to query audit status from BES.');
                                cb(null);
                            } else {
                                cb(null, res);
                            }
                        });
                    }
                ], function(err, resDate) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, resDate);
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
            mLogger.error('Failed to excute BES user audit query task.');
        } else {
            mLogger.debug('BES user audit query task finished.');
        }
    });
};

module.exports.taskCallback = taskCallback;
