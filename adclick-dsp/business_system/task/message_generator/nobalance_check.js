/*
 * @file  nobalance_check.js
 * @description balance 0 yuan check task API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.03.09
 * @version 1.2.0
 */
'use strict';
var MODULENAME = 'nobalance_check.logic';

//system modules
var mMoment = require('moment');
var mAsync = require('async');

var TaskManager = require('./../task_manager');
var MessageCenter = require('../../logic/messageCenter/message_notify_api');

// db modules
var mADPlanModel = require('../../model/adlib_plans').create();
var mAdLibUserModel = require('../../model/adlib_user').create();
var mAdUserModel = require('../../model/dsp_aduser').create();
var mMessageNotifyStatusModel = require('../../model/msg_notify_status').create();

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mUtils = require('../../../utils/utils');

function nobalanceNotifyMessage(user_id, user_name, cb) {
    return function(cb) {
        var param = {};
        var content = ADCONSTANTS.MESSAGESUBCATEGORIES.FINANCIALNOBALANCE.name;
        content += '，账户名：' + user_name + '，请及时确认';

        param.user_id = Number(user_id);
        param.categories = ADCONSTANTS.MESSAGECATEGORIES.FINANCIAL.code;
        param.subcategories = ADCONSTANTS.MESSAGESUBCATEGORIES.FINANCIALNOBALANCE.code;
        param.content = content;
        param.sms_param = {user_name: user_name,user_id: user_id+''};

        MessageCenter.notifyMessage(param, function(err){
            if(err) {
                mLogger.error(err);
            } else {

            }
            cb(null);
        });
    };
}

function processCheckCallback() {
    var msglog = ' to check no balance task';
    mLogger.debug('Try' + msglog);

    var needUpdateUserIds = [];
    var needCreateUserIds = [];

    mAsync.waterfall([
        function(next) {
            var curTime = mMoment();
            var fromTime = mMoment().subtract(1, 'h');

            var sqlstr = 'select * from ' + mAdLibUserModel.tableName;
            sqlstr += ' where balance<= 0';

            var query = {
                sqlstr : sqlstr,
            }

            mAdLibUserModel.query(query, next);
        },
        // filter user_ids which has not been sent this message
        function(user_rows, next) {
            var user_ids = [];
            for(var i in user_rows) {
                user_ids.push(user_rows[i].user_id);
            }
            if(user_ids.length == 0) {
                return next(null, user_rows);
            }

            // will do action in database
            var sqlstr = 'select * from ' + mMessageNotifyStatusModel.tableName;
            sqlstr += ' where categories=' + ADCONSTANTS.MESSAGECATEGORIES.FINANCIAL.code;
            sqlstr += ' and subcategories=' + ADCONSTANTS.MESSAGESUBCATEGORIES.FINANCIALNOBALANCE.code;
            sqlstr += ' and user_id in (' + user_ids.join(',') + ');';

            var query = {
                sqlstr : sqlstr,
            }

            mMessageNotifyStatusModel.query(query, function(err, rows) {
                if(err) {
                    next(err);
                } else {
                    var fileterUserRows = [];
                    for(var i in user_rows) {
                        var found = false;
                        for(var j in rows) {
                            if(user_rows[i].user_id == rows[j].user_id) {
                                found = true;
                                break;
                            }
                        }

                        // find out
                        if(found) {
                            if(rows[j].status != ADCONSTANTS.MESSAGESTAUS.HASSENT.code) {
                                fileterUserRows.push(user_rows[i]);
                                needUpdateUserIds.push(user_rows[i].user_id);
                            }
                        } else {
                            fileterUserRows.push(user_rows[i]);
                            needCreateUserIds.push(user_rows[i].user_id);
                        }
                    }
                    next(null, fileterUserRows);
                }
            });
        },
        function(user_rows, next) {
            var list = [];
            for(var i in user_rows) {
                var user_name = user_rows[i].user_name;
                var user_id = user_rows[i].user_id;
                list.push(nobalanceNotifyMessage(user_id, user_name));
            }
            if(list.length == 0) {
                return next(null, user_rows);
            }

            mAsync.series(list, function(err) {
                next(null, user_rows);
            });
        },
        // update status
        function(user_rows, next) {
            if(needUpdateUserIds.length == 0) {
                return next(null, user_rows);
            }

            var sqlstr = 'update ' + mMessageNotifyStatusModel.tableName;
            sqlstr += ' set status=' + ADCONSTANTS.MESSAGESTAUS.HASSENT.code;
            sqlstr += ' ,update_time="' + mMoment().format(ADCONSTANTS.DATATIMEFORMAT) + '"';
            sqlstr += ' where categories=' + ADCONSTANTS.MESSAGECATEGORIES.FINANCIAL.code;
            sqlstr += ' and subcategories=' + ADCONSTANTS.MESSAGESUBCATEGORIES.FINANCIALNOBALANCE.code;
            sqlstr += ' and user_id in (' + needUpdateUserIds.join(',') + ');'

            var query = {
                sqlstr : sqlstr,
            }

            // will do action in database
            mMessageNotifyStatusModel.query(query, function(err, effect){
                if(err) {
                    next(err);
                } else {
                    next(null, user_rows);
                }
            });
        },
        // create new status
        function(user_rows, next) {
            if(needCreateUserIds.length == 0) {
                return next(null, user_rows);
            }

            var values = [];
            for(var i in needCreateUserIds) {
                var user_id = needCreateUserIds[i];
                var value = {
                    user_id: user_id,
                    categories: ADCONSTANTS.MESSAGECATEGORIES.FINANCIAL.code,
                    subcategories: ADCONSTANTS.MESSAGESUBCATEGORIES.FINANCIALNOBALANCE.code,
                    status: ADCONSTANTS.MESSAGESTAUS.HASSENT.code
                };
                values.push(value);
            }

            var query = {
                fields: values[0],
                values: values,
            }
            
            mMessageNotifyStatusModel.create(query, function(err, effect){
                if(err) {
                    next(err);
                } else {
                    next(null, user_rows);
                }
            });
        },
    ], function(err, data) {
        if(err) {
            mLogger.error('Failed' + msglog);
        }  else {
            mLogger.debug('Success' + msglog);
        }
    });
    
}

module.exports.processCheckCallback = processCheckCallback;