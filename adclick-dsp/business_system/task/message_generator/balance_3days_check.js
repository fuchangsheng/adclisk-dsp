/*
 * @file  balance_3days_check.js
 * @description balance 3days check task API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2017.01.10
 * @version 1.3.0
 */
'use strict';
var MODULENAME = 'balance_3days_check.logic';

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

function balance3DaysNotifyMessage(user_id, user_name) {
    return function(cb) {
        var param = {};
        var content = ADCONSTANTS.MESSAGESUBCATEGORIES.FINANCIALBALANCE3DAY.name;
        content += '，账户名：' + user_name + '，请及时确认';

        param.user_id = Number(user_id);
        param.categories = ADCONSTANTS.MESSAGECATEGORIES.FINANCIAL.code;
        param.subcategories = ADCONSTANTS.MESSAGESUBCATEGORIES.FINANCIALBALANCE3DAY.code;
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

function get3DaysBudgetInfo(plan_rows) {
    var now = mMoment().format(ADCONSTANTS.DATATIMEFORMAT);
    var end = mMoment().add(2, 'd').endOf('day');
    var budget3DaysInfo = {};

    for(var i in plan_rows) {
        var row = plan_rows[i];
        var user_id = plan_rows.user_id;
        var budget = plan_rows.budget;
        var cycle = plan_rows.cycle;
        var duration = mUtils.getDurationDays(now, end, cycle);
        if(typeof budget3DaysInfo[user_id] == 'undefined') {
            budget3DaysInfo[user_id] = budget*duration;
        } else {
            budget3DaysInfo[user_id] += budget*duration;
        }
    }

    for(var user_id in budget3DaysInfo) {
        var days3Budget = budget3DaysInfo[user_id];
        budget3DaysInfo[user_id] = {budget: days3Budget};
    }

    return budget3DaysInfo;
}

function processCheckCallback() {
    var msglog = ' to check balance beyond 3day task';
    mLogger.debug('Try' + msglog);

    var needUpdateUserIds = [];
    var needCreateUserIds = [];

    mAsync.waterfall([
        function(next) {
            // calculate after 3 days total budget.
            var now = mMoment().format(ADCONSTANTS.DATATIMEFORMAT);
            var end = mMoment().add(2, 'd').endOf('day');

            var sqlstr = 'select * from ' + mADPlanModel.tableName;
            sqlstr += ' where plan_status=0';
            sqlstr += ' and plan_cycle!="000000000000000000000000000000000000000000"';
            sqlstr += ' and start_time <= "'+end+'"';
            sqlstr += ' and end_time > "'+now+'"'
            sqlstr += ' order by user_id';

            var query = {
                sqlstr : sqlstr,
            }
            mADPlanModel.query(query, next);
        },
        function(plan_rows, next) {
            var budgetInfo = get3DaysBudgetInfo(plan_rows);
            var user_ids = Object.keys(budgetInfo);

            if(user_ids.length == 0) {
                return next(null, budgetInfo);
            }

            var sqlstr = 'select user_name, user_id, balance from ' + mAdLibUserModel.tableName;
            sqlstr += ' where user_id in (' + user_ids.join(',')+');';

            var query = {
                sqlstr: sqlstr,
            };

            mAdLibUserModel.query(query, function(err, rows) {
                if(err) {
                    next(err);
                } else {
                    for(var user_id in budgetInfo) {
                        var info = budgetInfo[user_id];
                        info.user_name = '';
                        info.balance = 0;
                        info.status = true;
                        for(var i in rows) {
                            if(user_id == rows[i].user_id) {
                                info.user_name = rows[i].user_name;
                                info.balance = rows[i].balance/1000;
                                // balance > budget
                                info.status = (info.balance >= info.budget);
                                break;
                            }
                        }
                    }

                    next(null, budgetInfo);
                }
            });
        },
        // filter status - do query in database
        function(budgetInfo, next) {
            var user_ids = Object.keys(budgetInfo);
            if(user_ids.length == 0) {
                return next(null, budgetInfo);
            }

            // will do action in database
            var sqlstr = 'select * from ' + mMessageNotifyStatusModel.tableName;
            sqlstr += ' where categories=' + ADCONSTANTS.MESSAGECATEGORIES.FINANCIAL.code;
            sqlstr += ' and subcategories=' + ADCONSTANTS.MESSAGESUBCATEGORIES.FINANCIALBALANCE3DAY.code;
            sqlstr += ' and user_id in (' + user_ids.join(',') + ');';

            var query = {
                sqlstr : sqlstr,
            }

            mMessageNotifyStatusModel.query(query, function(err, rows) {
                if(err) {
                    next(err);
                } else {
                    var filterBudgetInfo = {};
                    for(var i in rows) {
                        var key = rows[i].user_id;
                        var value = budgetInfo[key];
                        if(key in budgetInfo) {
                            if(rows[i].status != ADCONSTANTS.MESSAGESTAUS.HASSENT.code) {
                                filterBudgetInfo[key] = value;
                                needUpdateUserIds.push(key);
                            }
                        } else {                            
                            filterBudgetInfo[key] = value;
                            needCreateUserIds.push(key);
                        }
                    }
                    next(null, filterBudgetInfo);
                }
            });
        },
        function(budgetInfo, next) {
            var list = [];
            for(var user_id in budgetInfo) {
                var user_name = budgetInfo[user_id].user_name;
                list.push(balance3DaysNotifyMessage(user_id, user_name) );
            }

            if(list.length == 0) {
                return next(null, budgetInfo);
            }

            mAsync.series(list, function(err) {
                next(null, budgetInfo);
            })
        },
        // update status
        function(budgetInfo, next) {
            if(needUpdateUserIds.length == 0) {
                return next(null, budgetInfo);
            }

            var sqlstr = 'update ' + mMessageNotifyStatusModel.tableName;
            sqlstr += ' set status=' + ADCONSTANTS.MESSAGESTAUS.HASSENT.code;
            sqlstr += ' ,update_time="' + mMoment().format(ADCONSTANTS.DATATIMEFORMAT) + '"';
            sqlstr += ' where categories=' + ADCONSTANTS.MESSAGECATEGORIES.FINANCIAL.code;
            sqlstr += ' and subcategories=' + ADCONSTANTS.MESSAGESUBCATEGORIES.FINANCIALBALANCE3DAY.code;
            sqlstr += ' and user_id in (' + needUpdateUserIds.join(',') + ');'

            var query = {
                sqlstr : sqlstr,
            }

            // will do action in database
            mMessageNotifyStatusModel.query(query, function(err, effect){
                if(err) {
                    next(err);
                } else {
                    next(null, budgetInfo);
                }
            });
        },
        // create new status
        function(budgetInfo, next) {
            if(needCreateUserIds.length == 0) {
                return next(null, budgetInfo);
            }

            var values = [];
            for(var i in needCreateUserIds) {
                var user_id = needCreateUserIds[i];
                var value = {
                    user_id: user_id,
                    categories: ADCONSTANTS.MESSAGECATEGORIES.FINANCIAL.code,
                    subcategories: ADCONSTANTS.MESSAGESUBCATEGORIES.FINANCIALBALANCE3DAY.code,
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
                    next(null, budgetInfo);
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