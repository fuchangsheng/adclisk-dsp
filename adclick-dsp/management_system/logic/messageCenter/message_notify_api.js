/*
/*
 * @file  message_notify_api.js
 * @description dsp message notify API
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.11.24
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'message_notify_api.logic';

//system
var mAsync = require('async');

//models
var mAdUser = require('../../model/dsp_aduser').create();
var mAdUserOperatorsModel = require('../../model/aduser_operators').create();
var mMsgNotifyLogModel = require('../../model/msg_notify_log').create();
var mMsgNotifyReceiver = require('../../model/msg_notify_receivers').create();
var mMsgListModel = require('../../model/msg_list').create();
var mMsgNotifySetModel = require('../../model/msg_notify_set').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mUtils = require('../../../utils/utils');
var mDataHelper = require('../../../utils/data_helper');
var mMailHelper = require('../../../utils/mail_helper');

//constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

function notifyMessage(param, fn){
    try{
        var msg_id = mDataHelper.createId(MODULENAME);
        processEmailAndSmsTask(msg_id, param, fn);
        processInternalMessageTask(msg_id, param, fn);
    }catch(e){
        mLogger.error('Failed to handle msg notify task, '+e);
        fn(e);
    }
}

function processEmailAndSmsTask(msg_id, param, fn){
    if( typeof param.user_id != 'number' || typeof param.subcategories != 'number'){
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});
    }

    mAsync.waterfall([
        //[1] found out the msg set
        function(next) {
            var match = {
                user_id: param.user_id,
                subcategories : param.subcategories,
            }
            var select = {
                channel: 1,
            }
            var query = {
                select: select,
                match, match,
            }

            mMsgNotifySetModel.lookup(query, function(err, rows){
                if(err){
                    next(err);
                }else{
                    if(rows.length === 0){            
                        var msg = 'Not found the userid or subcategories';
                        mLogger.error(msg);
                        return next({code: ERRCODE.PARAM_INVALID, msg: msg});
                    }
                    next(null, rows[0]);
                }
            });
        },//[2] 
        function(row, next) {
            var match = {
                user_id: param.user_id,
                audit_status: ADCONSTANTS.AUDIT.PASS.code,
            };
            var select = {
                type: 1,
                receiver: '1',
            };
            var query = {
                select: select,
                match: match,
            };
            var channel = row.channel;

            mMsgNotifyReceiver.lookup(query, function(err, rows){
                if(err){
                    mLogger.error(err.msg);
                    next(err);
                }else{
                    for(var x in rows){
                        var email_params = {};
                        email_params.receiver = rows[x].receiver;
                        email_params.content = param.content;

                        var sms_params = {};
                        sms_params.subcategories = param.subcategories;
                        sms_params.receiver = rows[x].receiver;
                        sms_params.sms_param = param.sms_param;

                        var user_params = {};
                        user_params.user_id = param.user_id;
                        user_params.msg_id = msg_id;

                        mLogger.debug('channel = ' + channel);

                        switch(channel){
                        case ADCONSTANTS.MESSAGECHANNEL.SMS.code:
                            if(ADCONSTANTS.RECEIVERTYPE.SMS.code === rows[x].type){
                                processSmsTask(user_params, sms_params, fn);
                            }
                            break;
                        case ADCONSTANTS.MESSAGECHANNEL.EMAIL.code:
                            if(ADCONSTANTS.RECEIVERTYPE.EMAIL.code === rows[x].type){
                                processEmailTask(user_params, email_params, fn);
                            } 
                            break;
                        case ADCONSTANTS.MESSAGECHANNEL.SMSEMAIL.code:
                        case ADCONSTANTS.MESSAGECHANNEL.EMAILSMS.code:
                            if(ADCONSTANTS.RECEIVERTYPE.EMAIL.code === rows[x].type){
                                processEmailTask(user_params, email_params, fn);
                            } else if(ADCONSTANTS.RECEIVERTYPE.SMS.code === rows[x].type){
                                processSmsTask(user_params, sms_params, fn);
                            } else {

                            }
                            break;
                        default:
                            break;
                        }                            
                    }
                }
            });
        },
    ], function(err, value) {
        if (err) {
            mLogger.error('Failed to send Email or mobile, ' + err.msg);
            fn(err);
        }else {
            mLogger.debug('Success to send Email or mobile');
            fn(null, value);
        }
    });
}

var SMS_TEMPLATE_PARAM_TABLE = [
    {code: 1001, sms_template_code: 'SMS_29935108', mobile: '', sms_param: {ad_name:'', reason:''}},  // ADCONSTANTS.MESSAGESUBCATEGORIES.CHECKADFAIL
    {code: 2001, sms_template_code: 'SMS_30080145', mobile: '', sms_param: {daily_limit:''}},       // ADCONSTANTS.MESSAGESUBCATEGORIES.ACCOUNTOVERDAYLIMIT
    {code: 2002, sms_template_code: 'SMS_30090114', mobile: '', sms_param: {ad_plan_name:'',daily_limit:''}},   // ADCONSTANTS.MESSAGESUBCATEGORIES.ACCOUNTADPLANOVERDAYLIMIT: 
    {code: 2003, sms_template_code: 'SMS_29980096', mobile: '', sms_param: {idea_name:''}},     // ADCONSTANTS.MESSAGESUBCATEGORIES.ACCOUNTADIDEADONE: 
    {code: 2005, sms_template_code: 'SMS_29930139', mobile: '', sms_param: {ad_name:'',deadline_date:''}},  // ADCONSTANTS.MESSAGESUBCATEGORIES.ACCOUNTADEXPIRE: 
    {code: 3001, sms_template_code: 'SMS_30000151', mobile: '', sms_param: {user_name:'',user_id:''}},  // ADCONSTANTS.MESSAGESUBCATEGORIES.FINANCIALNOBALANCE: 
    {code: 3002, sms_template_code: 'SMS_30100054', mobile: '', sms_param: {user_name:'',user_id:''}},  // ADCONSTANTS.MESSAGESUBCATEGORIES.FINANCIALBALANCE500: 
    {code: 3003, sms_template_code: 'SMS_29990165', mobile: '', sms_param: {user_name:'',user_id:''}},  // ADCONSTANTS.MESSAGESUBCATEGORIES.FINANCIALBALANCE3DAY: 
    {code: 3004, sms_template_code: 'SMS_30065100', mobile: '', sms_param: {user_name:'',user_id:'',record_account:'',account:''}}, // ADCONSTANTS.MESSAGESUBCATEGORIES.FINANCIALRECHARGEDONE: 
];


function validateSmsParam(param){
    var validate = false;
    var logmsg;
    var param_index;
    // check subcategories
    if(typeof param.subcategories === 'number'){
        for(var k in SMS_TEMPLATE_PARAM_TABLE){
            if(SMS_TEMPLATE_PARAM_TABLE[k].code === param.subcategories){
                param_index = Number(k);
                validate = true;
                break;
            }
        }
    }else{
        validate = false;
    }
    // check mobile
    if(validate && (typeof param.receiver === 'string') && (typeof param.sms_param === 'object') ){
        validate = true;
    }else{
        validate = false;
    }
    // check sms_param
    if(validate) {
        var sms_param = param.sms_param;
        var ref_sms_param = SMS_TEMPLATE_PARAM_TABLE[param_index].sms_param;
        for(var k in ref_sms_param){
            if(!(k in sms_param)){
                logmsg = 'no fields, ' + k;
                mLogger.error(logmsg);
                validate = false;
                break;
            }
            if(typeof sms_param[k] != typeof ref_sms_param[k]){
                logmsg = 'type not matched, ' + sms_param[k];
                mLogger.error(logmsg);
                validate = false;
                break;
            }
        }
    }

    param.sms_template_code = SMS_TEMPLATE_PARAM_TABLE[param_index].sms_template_code;
    return validate;
}

function processEmailTask(user_param, param, fn){
    var validate = false;
    if( (typeof param.receiver === 'string') && (typeof param.content === 'string') ){
        if( param.title &&  (typeof param.title != 'string') ){
            validate = false;
        }else{
            validate = true;
        }
    }

    if(!validate){
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});
    }

    var logmsg = ' to send email for user: ' + param.receiver;
    mLogger.debug('Try '+logmsg);

    mAsync.waterfall([
        // [1] send email
        function(next){
            var receiver = param.receiver;
            var title = param.title ? param.title: '【AdClick DSP广告系统】 消息通知';
            var content = param.content;
            var params = {
                receiver: receiver,
                title: title,
                content: content,
            }

            mMailHelper.sendMessageByMail(params, function(err) {
                if (err) {
                    mLogger.error('Failed to send email to ' + param.receiver);
                    next(err);
                }else {
                    mLogger.debug('Success to send email to ' + param.receiver);
                    next(null, {});
                }
            });
        },
        // [2] if success, write into msg_log
        function(data, next){
            var id = mDataHelper.createId(MODULENAME);
            var user_id = user_param.user_id;
            var msg_id = user_param.msg_id;
            var receiver = param.receiver;                
            var value = {
                id: id,
                user_id: user_id,
                msg_id: msg_id,
                receiver: receiver,
                type: ADCONSTANTS.RECEIVERTYPE.EMAIL.code,
                notify_status: 1
            };
            var query = {
                fields: value,
                values: [value],
            };

            mMsgNotifyLogModel.create(query, function(err, rows) {
                if (err) {
                    mLogger.error('Failed to record Email into msg_log');
                    next(err);
                }else {
                    mLogger.debug('Success to record Email into msg_log');
                    next(null, value);
                }
            });
        },
    ], function(err, value){
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            fn(null, value);
        }
    });
}

function processSmsTask(user_param, param, fn){
    if(!validateSmsParam(param)){
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});
    }

    var logmsg = ' to send sms for user: ' + param.receiver;
    mLogger.debug('Try '+logmsg);

    mAsync.waterfall([
        // [1] send msg
        function(next) {
            var params = {
                mobile: param.receiver,
                sms_template_code : param.sms_template_code,
                sms_param: param.sms_param,
            };

            mUtils.sendMessageBySms( params, function(err){
                if (err) {
                    mLogger.error('Failed to send sms to ' + param.receiver);
                    next(err);
                }else {
                    mLogger.debug('Success to send sms to ' + param.receiver);
                    next(null, {});
                }
            });
        },
        // [2] if success, write in the result
        function(data, next) {
            var id = mDataHelper.createId(MODULENAME);
            var user_id = user_param.user_id;
            var msg_id = user_param.msg_id;
            var receiver = param.receiver;                
            var value = {
                id: id,
                user_id: user_id,
                msg_id: msg_id,
                receiver: receiver,
                type: ADCONSTANTS.RECEIVERTYPE.SMS.code,
                notify_status: 1
            };
            var query = {
                fields: value,
                values: [value],
            };

            mMsgNotifyLogModel.create(query, function(err, rows) {
                if (err) {
                    mLogger.error('Failed to record sms into msg_log');
                    next(err);
                }else {
                    mLogger.debug('Success to record sms into msg_log');
                    next(null, value);
                }
            });
        },
    ], function(err, value){
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            fn(null, value);
        }
    });    
}

function processInternalMessageTask(msg_id, param, fn){
    var validate = false;
    if( (typeof param.user_id === 'number') &&
        ( (typeof param.categories === 'number') && (
            param.categories === ADCONSTANTS.MESSAGECATEGORIES.SYSTEM.code ||
            param.categories === ADCONSTANTS.MESSAGECATEGORIES.CHECK.code ||
            param.categories === ADCONSTANTS.MESSAGECATEGORIES.ACCOUNT.code ||
            param.categories === ADCONSTANTS.MESSAGECATEGORIES.FINANCIAL.code) ) &&
        (typeof param.subcategories === 'number') &&
      //  (typeof param.title === 'string') &&
        (typeof param.content === 'string')
    ){
        if( param.title && (typeof param.title != 'string') ) {
            validate = false;
        } else {
            validate = true;
        }
    }

    if(!validate){
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});
    }

    var user_id = param.user_id;
    var categories = param.categories;
    var subcategories = param.subcategories;
    var content = param.content;
    
    var logmsg = ' to add message for user: ' + param.user_id;
    mLogger.debug('Try '+logmsg);

    var msg_id_cp = msg_id;

    mAsync.waterfall([
        //[1] find out matched user_id
        function(next) {
            var match = {
                user_id: user_id,
            };
            var select = {
                user_id: 1,
            };
            var query = {
                select: select,
                match: match,
            };
            mAdUser.lookup(query, function(err, rows){
                if(err){
                    return next(err, {});
                }else{
                    if(rows.length === 0){            
                        var msg = 'Not found the userid';
                        mLogger.error(msg);
                        return next({code: ERRCODE.PARAM_INVALID, msg: msg});
                    }
                }

                next(null, {});
            });
        },
        //[2] insert message into msglist
        function(data, next) {
            var user_id = param.user_id;
            var categories = param.categories;
            var title = (param.title ? param.title : '【AdClick】');
            var content = param.content;
            var value = {
                msg_id: msg_id,
                user_id: user_id,
                categories: categories,
                subcategories: subcategories,
                title: title,
                content: content,
            };
            var query = {
                fields: value,
                values: [value],
            };

            mMsgListModel.create(query, function(err, rows){
                if(err){
                    next(err);
                }else{
                    next(null, value);
                }
            });
        },
        //[3] lookup operator-ids from aduser_operators
        function(data, next) {
            var match = {
                user_id: user_id,
            };

            var select = {
                oper_id: '1',
            };

            var query = {
                select: select,
                match: match,
            };

            mAdUserOperatorsModel.lookup(query, function(err, rows){
                if(err){
                    next(err);
                }else{
                    next(null, rows);
                }
            });
        },
        //[4] insert record into msg_notify_log
        function(operators, next) {
            for(var x in operators){
                var id = mDataHelper.createId(MODULENAME);
                var user_id = param.user_id;
                var msg_id = msg_id_cp;
                var oper_id = operators[x].oper_id;                
                var value = {
                    id: id,
                    user_id: user_id,
                    msg_id: msg_id,
                    receiver: oper_id,
                    type: ADCONSTANTS.RECEIVERTYPE.OPERATOR.code,
                    notify_status: 1
                };
                var query = {
                    fields: value,
                    values: [value],
                };

                mMsgNotifyLogModel.create(query, function(err, rows) {
                    if (err) {
                        next(err);
                    }else {                    
                        fn(null, value);
                    }
                })
            }
        },
    ], function(err, value) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            fn(null, value);
        }
    });
}

module.exports.notifyMessage = notifyMessage;
