/*
 * @file  account_to_day_limit_check.js
 * @description plan cost day limit check task API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.03.09
 * @version 1.3.0
 */
'use strict';
var MODULENAME = 'account_to_day_limit_check.logic';

//system modules
var mMoment = require('moment');
var mAsync = require('async');

var TaskManager = require('./../task_manager');
var MessageCenter = require('../../logic/messageCenter/message_notify_api');

// db modules
var mADPlanModel = require('../../model/adlib_plans').create();
var mAdLibUserModel = require('../../model/adlib_user').create();
var mAdUserModel = require('../../model/dsp_aduser').create();
var mCostModel = require('../../model/adlib_palo_charge').create();
var mMessageNotifyStatusModel = require('../../model/msg_notify_status').create();

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mUtils = require('../../../utils/utils');

function accountDayLimitNotifyMessage(user_id, daily_limit) {
    daily_limit = mUtils.fenToYuan(daily_limit);
    return function(cb) {
        var param = {};
        var content = ADCONSTANTS.MESSAGESUBCATEGORIES.ACCOUNTOVERDAYLIMIT.name;
        content += '，用户ID：' + user_id +' 日限额：' + daily_limit+ '元';

        param.user_id = Number(user_id);
        param.categories = ADCONSTANTS.MESSAGECATEGORIES.ACCOUNT.code;
        param.subcategories = ADCONSTANTS.MESSAGESUBCATEGORIES.ACCOUNTOVERDAYLIMIT.code;
        param.content = content;
        param.sms_param = {daily_limit: daily_limit + ''};

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
    var msglog = ' to check cost day limit task';
    mLogger.debug('Try' + msglog);

    var needUpdateUserIds = [];
    var needCreateUserIds = [];

    mAsync.waterfall([
        function(next) {
            var start = mMoment().startOf('day').format(ADCONSTANTS.DATATIMEFORMAT);
            var end = mMoment().endOf('day').format(ADCONSTANTS.DATATIMEFORMAT);

            var sqlstr = 'select * from ' + mADPlanModel.tableName;
            sqlstr += ' where plan_status=0';
            sqlstr += ' and plan_cycle!="000000000000000000000000000000000000000000"';
            sqlstr += ' and end_time > "'+start+'"';
            sqlstr += ' order by user_id';

            var query = {
                sqlstr : sqlstr,
            }
            mADPlanModel.query(query, function(err, rows) {
                if(err) {
                    next(err);
                } else {
                    var filterRows = [];
                    for(var i in rows) {
                        var duration = mUtils.getDurationDays(start, end, rows[i].plan_cycle);
                        if(duration > 0) {
                            filterRows.push(rows[i]);
                        }
                    }

                    next(null, filterRows);
                }
            });
        },
        function(plan_rows, next) {
            var cur_user_id = (plan_rows.length > 0) ? plan_rows[0].user_id : -1;
            var planInfo = {};  // {user_id : {budget: budget}
            var budget = 0;
            for(var i in plan_rows) {
                var user_id = plan_rows[i].user_id;
                if(user_id == cur_user_id) {
                    budget += plan_rows[i].budget;
                } else {
                    planInfo[cur_user_id] = {budget : budget};
                    cur_user_id = user_id;
                    budget = plan_rows[i].budget;
                }
                // end of plan_rows
                if(i == (plan_rows.length-1)) {
                    planInfo[cur_user_id] = {budget : budget};
                }
            }
            next(null, planInfo);
        },
        function(planInfo, next) {
            var start = mMoment().startOf('day').format(ADCONSTANTS.DATATIMEFORMAT);
            var end = mMoment().endOf('day').format(ADCONSTANTS.DATATIMEFORMAT);

            var sqlstr = 'select user_id, sum(cost)/1000 as cost_total from ' + mCostModel.tableName;
            sqlstr += ' where date between "'+start+'"' + 'and "'+end+'"';
            sqlstr += ' group by user_id';

            mCostModel.query({sqlstr: sqlstr}, function(err, rows) {
                if(err) {
                    next(err);
                } else {
                    for(var i in rows) {
                        var user_id = rows[i].user_id;
                        if(user_id in planInfo) {
                            var cost_total = rows[i].cost_total;
                            var budget = planInfo[user_id].budget;
                            planInfo[user_id].cost = cost_total;
                            if(cost_total > budget) {
                                var msg = 'Cost day limit error! current cost total = ' + cost_total + ', but budget = ' + budget;
                                planInfo[user_id].limit = true;
                                mLogger.error(msg);
                            } else if(cost_total == budget) {
                                planInfo[user_id].limit = true;
                            } else {

                            }
                        }
                    }
                    next(null, planInfo);
                }
            });
        },
        // filter user_ids which has not been sent this message
        function(planInfo, next) {
            var user_ids = [];
            for(var user_id in planInfo) {
                var info = planInfo[user_id];
                if(info.limit) {
                    user_ids.push(user_id);
                }
            }
            if(user_ids.length == 0) {
                return next(null, planInfo);
            }

            // will do action in database
            var sqlstr = 'select * from ' + mMessageNotifyStatusModel.tableName;
            sqlstr += ' where categories=' + ADCONSTANTS.MESSAGECATEGORIES.ACCOUNT.code;
            sqlstr += ' and subcategories=' + ADCONSTANTS.MESSAGESUBCATEGORIES.ACCOUNTOVERDAYLIMIT.code;
            sqlstr += ' and user_id in (' + user_ids.join(',') + ');';

            var query = {
                sqlstr : sqlstr,
            }

            mMessageNotifyStatusModel.query(query, function(err, rows) {
                if(err) {
                    next(err);
                } else {
                    var fileterPlanInfo = {};
                    var found = false;
                    for(var user_id in planInfo) {
                        for(var j in rows) {
                            if(user_id == rows[j].user_id) {
                                found = true;
                                break;
                            }
                        }
                        // find out
                        if(found) {
                            if(rows[j].status != ADCONSTANTS.MESSAGESTAUS.HASSENT.code) {
                                fileterPlanInfo[user_id] = planInfo[user_id];
                                needUpdateUserIds.push(user_id);
                            }
                        } else {
                            if(planInfo[user_id].limit) {
                                fileterPlanInfo[user_id] = planInfo[user_id];
                                needCreateUserIds.push(user_id);
                            }
                        }
                    }
                    next(null, fileterPlanInfo);
                }
            });
        },
        function(planInfo, next) {
            var list = [];
            for(var user_id in planInfo) {
                var limit = planInfo[user_id].limit;
                var daily_limit = planInfo[user_id].budget;
                if(limit) {
                    list.push(accountDayLimitNotifyMessage(user_id, daily_limit) );
                }
            }

            if(list.length == 0) {
                return next(null, planInfo);
            }

            mAsync.series(list, function(err) {
                next(null, planInfo);
            });
        },
        // update status
        function(planInfo, next) {
            if(needUpdateUserIds.length == 0) {
                return next(null, planInfo);
            }

            var sqlstr = 'update ' + mMessageNotifyStatusModel.tableName;
            sqlstr += ' set status=' + ADCONSTANTS.MESSAGESTAUS.HASSENT.code;
            sqlstr += ' ,update_time="' + mMoment().format(ADCONSTANTS.DATATIMEFORMAT) + '"';
            sqlstr += ' where categories=' + ADCONSTANTS.MESSAGECATEGORIES.ACCOUNT.code;
            sqlstr += ' and subcategories=' + ADCONSTANTS.MESSAGESUBCATEGORIES.ACCOUNTOVERDAYLIMIT.code;
            sqlstr += ' and user_id in (' + needUpdateUserIds.join(',') + ');'

            var query = {
                sqlstr : sqlstr,
            }

            // will do action in database
            mMessageNotifyStatusModel.query(query, function(err, effect){
                if(err) {
                    next(err);
                } else {
                    next(null, planInfo);
                }
            });
        },
        // create new status
        function(planInfo, next) {
            if(needCreateUserIds.length == 0) {
                return next(null, planInfo);
            }

            var values = [];
            for(var i in needCreateUserIds) {
                var user_id = needCreateUserIds[i];
                var value = {
                    user_id: user_id,
                    categories: ADCONSTANTS.MESSAGECATEGORIES.ACCOUNT.code,
                    subcategories: ADCONSTANTS.MESSAGESUBCATEGORIES.ACCOUNTOVERDAYLIMIT.code,
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
                    next(null, planInfo);
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

function resetStatus() {
    var sqlstr = 'update ' + mMessageNotifyStatusModel.tableName;
    sqlstr += ' set status=' + ADCONSTANTS.MESSAGESTAUS.NOTSENT.code;
    sqlstr += ' ,update_time="' + mMoment().format(ADCONSTANTS.DATATIMEFORMAT) + '"';
    sqlstr += ' where categories=' + ADCONSTANTS.MESSAGECATEGORIES.ACCOUNT.code;
    sqlstr += ' and subcategories=' + ADCONSTANTS.MESSAGESUBCATEGORIES.ACCOUNTOVERDAYLIMIT.code;

    var query = {
        sqlstr : sqlstr,
    }

    var msg = ' to maintain status of day limit check.'
    mLogger.debug('Try' + msg);
    // will do action in database
    mMessageNotifyStatusModel.query(query, function(err, effect){
        if(err) {
            mLogger.error('Failed' + msg);
        } else {
            mLogger.debug('Success' + msg);
        }
    });
}

module.exports.processCheckCallback = processCheckCallback;
module.exports.resetStatus = resetStatus;