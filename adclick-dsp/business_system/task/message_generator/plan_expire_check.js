/*
 * @file  plan_expire_check.js
 * @description plan expire check task API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.03.09
 * @version 1.3.0
 */
'use strict';
var MODULENAME = 'plan_expire_check.logic';

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

function planExpireNotifyMessage(user_id, plan_name, end_time) {
    return function(cb) {
        var param = {};
        var content = ADCONSTANTS.MESSAGESUBCATEGORIES.ACCOUNTADEXPIRE.name;
        content += '，广告名：' + plan_name;
        content += '，到期时间：' + end_time;
        content += ',请及时确认';

        param.user_id = Number(user_id);
        param.categories = ADCONSTANTS.MESSAGECATEGORIES.ACCOUNT.code;
        param.subcategories = ADCONSTANTS.MESSAGESUBCATEGORIES.ACCOUNTADEXPIRE.code;
        param.content = content;
        param.sms_param = {ad_name: plan_name,deadline_date: mMoment(end_time).format('MM/DD HH时').toString()};

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
    var msglog = ' to check balance beyond 3day task';
    mLogger.debug('Try' + msglog);

    var needUpdateUserIds = [];
    var needCreateUserIds = [];

    mAsync.waterfall([
        function(next) {
            // calculate after 3 days total budget.
            var now = mMoment().format(ADCONSTANTS.DATATIMEFORMAT);
            var end = mMoment().add(2, 'd').endOf('day').format(ADCONSTANTS.DATATIMEFORMAT);

            var sqlstr = 'select * from ' + mADPlanModel.tableName;
            sqlstr += ' where plan_status=0';
            sqlstr += ' and plan_cycle!="000000000000000000000000000000000000000000"';
            sqlstr += ' and end_time <= "'+end+'"';
            sqlstr += ' and end_time > "'+now+'"'
            sqlstr += ' order by user_id';

            var query = {
                sqlstr : sqlstr,
            }
            mADPlanModel.query(query, next);
        },        
        function(plan_rows, next) {
            var list = [];
            for(var i in plan_rows) {
                var user_id = plan_rows[i].user_id;
                var plan_name = plan_rows[i].plan_name;
                var end_time = mMoment(plan_rows[i].end_time).format(ADCONSTANTS.DATATIMEFORMAT);
                list.push(planExpireNotifyMessage(user_id, plan_name, end_time));
            }

            if(list.length == 0) {
                return next(null, plan_rows);
            }

            mAsync.series(list, function(err) {
                next(null, plan_rows);
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