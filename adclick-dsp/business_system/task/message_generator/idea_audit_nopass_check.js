/*
 * @file  idea_audit_nopass_check.js
 * @description idea audit nopass notify API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2017.03.09
 * @version 1.3.0
 */
'use strict';
var MODULENAME = 'idea_audit_nopass_check.logic';

//system modules
var mMoment = require('moment');
var mAsync = require('async');

var TaskManager = require('./../task_manager');
var MessageCenter = require('../../logic/messageCenter/message_notify_api');

// db modules
var mAdClickIdeaAuditModel = require('../../model/adclick_audit_ideas').create();
var mAdIdeaModel = require('../../model/adlib_ideas').create();
var mMessageNotifyStatusModel = require('../../model/msg_notify_status').create();

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mUtils = require('../../../utils/utils');

function ideaNopassNotifyMessage(user_id, idea_name, failure_message) {
    return function(cb) {
        var param = {};
        var content = ADCONSTANTS.MESSAGESUBCATEGORIES.CHECKADFAIL.name;
        content += '，广告名：' + idea_name + ',失败原因：' + failure_message +'，请及时确认';

        param.user_id = Number(user_id);
        param.categories = ADCONSTANTS.MESSAGECATEGORIES.AUDIT.code;
        param.subcategories = ADCONSTANTS.MESSAGESUBCATEGORIES.CHECKADFAIL.code;
        param.content = content;
        param.sms_param = {ad_name: idea_name,reason: failure_message};

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
    var msglog = ' to check idea nopass check.';
    mLogger.debug('Try' + msglog);

    var needUpdateUserIds = [];
    var needCreateUserIds = [];

    mAsync.waterfall([
        function(next) {
            var curTime = mMoment().format(ADCONSTANTS.DATATIMEFORMAT);
            var fromTime = mMoment().subtract(1, 'h').format(ADCONSTANTS.DATATIMEFORMAT);

            var sqlstr = 'select * from ' + mAdClickIdeaAuditModel.tableName;
            sqlstr += ' where audit_status=' + ADCONSTANTS.AUDIT.FAILED.code;
            sqlstr += ' and update_time <= "'+curTime+'"';
            sqlstr += ' and update_time > "'+fromTime+'"';

            var query = {
                sqlstr : sqlstr,
            }
            mAdClickIdeaAuditModel.query(query, next);
        },
        function(audit_idea_rows, next) {
            var idea_id_obj = {};
            var idea_ids = [];
            for(var i in audit_idea_rows) {
                var audit_idea = audit_idea_rows[i].idea_id;
                idea_id_obj[audit_idea] = audit_idea;
            }
            idea_ids = Object.keys(idea_id_obj);

            if(idea_ids.length == 0) {
                return next(null, audit_idea_rows);
            }

            var sqlstr = 'select * from ' + mAdIdeaModel.tableName;
            sqlstr += ' where idea_id in (' + idea_ids.join(',') + ')';

            mAdIdeaModel.query({sqlstr: sqlstr}, function(err, rows) {
                if(err) {
                    next(err);
                } else {
                    for(var i in audit_idea_rows) {
                        var audit_idea = audit_idea_rows[i];
                        audit_idea.idea_name = '';
                        for(var j in rows) {
                            if(audit_idea.user_id == rows[j].user_id) {
                                audit_idea.idea_name = rows[j].idea_name;
                                break;
                            }
                        }
                    }
                    next(null, audit_idea_rows);
                }
            });
        },
        function(audit_idea_rows, next) {
            var list = [];
            for(var i in audit_idea_rows) {
                var user_id = audit_idea_rows[i].user_id;
                var idea_name = audit_idea_rows[i].idea_name;
                var failure_message = audit_idea_rows[i].failure_message;
                list.push(ideaNopassNotifyMessage(user_id, idea_name, failure_message));
            }

            if(list.length == 0) {
                return next(null, audit_idea_rows);
            }

            mAsync.series(list, function(err) {
                next(null, audit_idea_rows);
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