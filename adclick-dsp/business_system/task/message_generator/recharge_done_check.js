/*
 * @file  recharge_done_check.js
 * @description recharge done check task API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2017.03.08
 * @version 1.2.0
 */
'use strict';
var MODULENAME = 'recharge_done_check.logic';

//system modules
var mMoment = require('moment');
var mAsync = require('async');

var TaskManager = require('./../task_manager');
var MessageCenter = require('../../logic/messageCenter/message_notify_api');

// db modules
var mADPlanModel = require('../../model/adlib_plans').create();
var mAdLibUserModel = require('../../model/adlib_user').create();
var mAdUserModel = require('../../model/dsp_aduser').create();
var mAdRechargeModel = require('../../model/account_recharge_log').create();
var mMessageNotifyStatusModel = require('../../model/msg_notify_status').create();

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mUtils = require('../../../utils/utils');

// check per 10 min
function rechargeDoneMessageNotify(recharge_log) {
    return function(cb) {
        var param = {};
        var content = ADCONSTANTS.MESSAGESUBCATEGORIES.FINANCIALRECHARGEDONE.name;
        content += '-[账户名]' + recharge_log.user_name;
        content += '，[账户ID]' + recharge_log.user_id;
        content += '，[入账金额]' + mUtils.fenToYuan(recharge_log.amount);
        content += '，[余额]' + mUtils.fenToYuan(recharge_log.balance/1000);
        content += '，请及时确认。';

        param.user_id = Number(recharge_log.user_id);
        param.categories = ADCONSTANTS.MESSAGECATEGORIES.FINANCIAL.code;
        param.subcategories = ADCONSTANTS.MESSAGESUBCATEGORIES.FINANCIALRECHARGEDONE.code;
        param.content = content;
        param.sms_param = {
            user_name: recharge_log.user_name,
            user_id: recharge_log.user_id+'',
            record_account: mUtils.fenToYuan(recharge_log.amount)+'',
            account: mUtils.fenToYuan(recharge_log.balance/1000)+''
        };

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
    var logmsg = ' to check recharge done task.';
    mLogger.debug('Try' + logmsg);

    var recharge_user_ids = [];

    mAsync.waterfall([
        function(next) {
            var curTime = mMoment();
            var fromTime = mMoment().subtract(10, 'm');

            var sqlstr = 'select * from ' + mAdRechargeModel.tableName;
            sqlstr += ' where charge_status=' + ADCONSTANTS.REACHAGESTATUS.SUCCESS.code;
            sqlstr += ' and (update_time>="' + fromTime.format(ADCONSTANTS.DATATIMEFORMAT)+'"';
            sqlstr += ' and update_time<"' + curTime.format(ADCONSTANTS.DATATIMEFORMAT) + '")';

            var query = {
                sqlstr : sqlstr,
            }

            mAdRechargeModel.query(query, next);
        },
        function(recharge_rows, next) {
            var user_id_obj = {};
            for(var i in recharge_rows) {
                user_id_obj[recharge_rows[i].user_id] = recharge_rows[i].user_id;
            }
            recharge_user_ids = Object.keys(user_id_obj);

            if(recharge_user_ids.length === 0) {
                return next(null, recharge_rows);
            }

            var sqlstr = 'select balance, user_name, user_id from ' + mAdLibUserModel.tableName;
            sqlstr += ' where user_id in (' + recharge_user_ids.join(',')+');';

            var query = {
                sqlstr: sqlstr,
            }

            mAdLibUserModel.query(query, function(err, rows) {
                if(err) {
                    next(err);
                } else {
                    for(var i in recharge_rows) {
                        var recharge_log = recharge_rows[i];
                        recharge_log.user_name = '';
                        recharge_log.balance = 0;
                        for(var j in rows) {
                            if(recharge_log.user_id == rows[j].user_id) {
                                recharge_log.user_name = rows[j].user_name;
                                recharge_log.balance = rows[j].balance;
                                break;
                            }
                        }
                    }
                    next(null, recharge_rows);
                }
            });
        },
        function(recharge_rows, next) {
            var list = [];
            for(var i in recharge_rows) {
                var recharge_log = recharge_rows[i];
                list.push(rechargeDoneMessageNotify(recharge_log));
            }
            if(list.length == 0) {
                return next(null, recharge_rows);
            }

            mAsync.series(list, function(err) {
                next(null, recharge_rows);
            });
        },
        // update status
        function(recharge_rows, next) {
            if(recharge_user_ids.length == 0) {
                return next(null, recharge_rows);
            }

            var sqlstr = 'update ' + mMessageNotifyStatusModel.tableName;
            sqlstr += ' set status=' + ADCONSTANTS.MESSAGESTAUS.NOTSENT.code;
            sqlstr += ' ,update_time="' + mMoment().format(ADCONSTANTS.DATATIMEFORMAT)+'"';
            sqlstr += ' where categories=' + ADCONSTANTS.MESSAGECATEGORIES.FINANCIAL.code;
            sqlstr += ' and (subcategories=' + ADCONSTANTS.MESSAGESUBCATEGORIES.FINANCIALNOBALANCE.code;
            sqlstr += ' or subcategories=' + ADCONSTANTS.MESSAGESUBCATEGORIES.FINANCIALBALANCE500.code;
            sqlstr += ' or subcategories=' + ADCONSTANTS.MESSAGESUBCATEGORIES.FINANCIALBALANCE3DAY.code + ')';
            sqlstr += ' and user_id in (' + recharge_user_ids.join(',') + ');'

            var query = {
                sqlstr : sqlstr,
            }

            // will do action in database
            mMessageNotifyStatusModel.query(query, function(err, effect){
                if(err) {
                    next(err);
                } else {
                    next(null, recharge_rows);
                }
            });
        },
    ], function(err, data) {
        if(err) {
            mLogger.error('Failed' + logmsg);
        } else {
            mLogger.debug('Success' + logmsg);
        }
    });
}

module.exports.processCheckCallback = processCheckCallback;