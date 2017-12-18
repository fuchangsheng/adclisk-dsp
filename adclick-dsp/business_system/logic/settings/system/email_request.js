/*
 * @file  email_requeset.js
 * @description add the receiver API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.30
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'email_requeset.logic';
var URLPATH = '/v1/message/email/requset';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../logic_api");

//models
var mMsgReceiversModel = require('../../../model/msg_notify_receivers').create();
var mEmailVerifyLogModel = require('../../../model/email_verify_log').create();

//utils
var mLogger = require('../../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../../utils/data_helper');
var mUtils = require('../../../../utils/utils');
var mMailerHelper = require('../../../../utils/mail_helper');
var mSMSHelper = require('../../user/sms_request');

//common constants
var ERRCODE = require('../../../../common/errCode');
var ADCONSTANTS = require('../../../../common/adConstants');

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidUserId(data);
        },
    },
    receiver: {
        data: '',
        rangeCheck: function(data) {
            return mUtils.isEmail(data);
        },
    },
};

var mLogicHelper = new LogicApi({
    debug: mDebug,
    moduleName: MODULENAME,
    refModel: mRefModel
});

function validate(data){
    if(!data){
        return false;
    }

    return mLogicHelper.validate({
        inputModel: data,
    });
}

function packageResponseData(data){
    if (!data) {
        return {};
    }
    
    var resData = {
        id: data.id,
        status: ADCONSTANTS.AUDIT.format(data.audit_status),
    };

    return resData;
}

function sendVerifyCodeByEmail(param, fn) {
    var id = mDataHelper.createId(param.receiver);
    var token = mDataHelper.createEmailToken(param.receiver);

    mLogger.debug('Calling sendVerifyCodeByEmail, token='+token);

    mAsync.series([
        //1. send the mail
        function(next) {
            mMailerHelper.sendMailVerify(
                {receiver: param.receiver, token: token}, next);
        }, 
        function(next) {
            var value = {
                id: id,
                email: param.receiver,
                token: token,
                user_id: param.user_id,
                type: ADCONSTANTS.EMAILVERIFYTYPE.ADDRECEIVER.code,
                status: ADCONSTANTS.TOKENSTATUS.SEND.code,
            };
            var query = {
                fields: value,
                values: [value],
            };
            mEmailVerifyLogModel.create(query, next)
        }
    ], function(err) {
        if (err) {
            fn(err);
        }else {
            fn(null, param);
        }
    });
}

function preprocess(param) {

}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }

    var user_id = param.user_id;
    var receiver = param.receiver || '';
    
    receiver = receiver.trim();

    var logmsg = 'to add receiver for user:' + user_id+', receiver:'+receiver;
    mLogger.debug('Try '+logmsg);
    
    preprocess(param);

    mAsync.waterfall([
        //1. verify the frequence of this email
        function(next) {
            var select = {
                update_time: new Date(),
            };
            var match = {
                type: ADCONSTANTS.EMAILVERIFYTYPE.ADDRECEIVER.code,
                status: ADCONSTANTS.TOKENSTATUS.SEND.code,
                email: param.receiver,
                user_id: param.user_id,
            };
            var query = {
                select: select,
                match: match,
            };

            mEmailVerifyLogModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    if(!rows || rows.length==0){
                        next(null, true);
                    }else {
                        var data = rows[0];
                        var now = mMoment();
                        var updateTime = mMoment(data.update_time);
                        updateTime.add(1, 'm');

                        if (updateTime.isAfter(now)) {
                            var msg ='Too many sms request from email:' + receiver;
                            mLogger.error(msg);
                            next({ code: ERRCODE.SMSCODE_TOOMANY, msg: msg });
                        }else {
                            next(null, false);
                        }
                    }
                }
            });
        },
        //2. send the verify code by email
        function(data, next) {
            sendVerifyCodeByEmail(param, function(err) {
                if (err) {
                    next(err);
                }else {
                    next(null, data);
                }
            });
        },
    ], 
    function(err, data){
        if (err) {
            mLogger.error('Failed '+logmsg);
            fn(err);    
        }else{
            mLogger.info('Success '+logmsg);

            var resData = packageResponseData(data);
            fn(null, resData);
        }
    });
}

/*
* export the post interface
*/
mRouter.post(URLPATH, function(req, res, next){
    var param = req.body;

    mLogicHelper.responseHttp({
        res: res,
        req: req,
        next: next,
        processRequest: processRequest,
        param: param,       
    });
});

module.exports.router = mRouter;
