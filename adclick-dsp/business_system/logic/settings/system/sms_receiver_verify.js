/*
 * @file  sms_receiver_verify.js
 * @description del the receiver API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.30
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'sms_receiver_verify.logic';
var URLPATH = '/v3/settings/system/msg-receiver/sms-verify';

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

//utils
var mLogger = require('../../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../../utils/data_helper');
var mUtils = require('../../../../utils/utils');

var mSMSVerifier = require('../../user/sms_verify');

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
    id: {
        data: '',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
    },
    smscode: {
        data: 'code',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        }
    }
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
        receiver: data.receiver,
        audit_status: ADCONSTANTS.AUDIT.format(data.audit_status),
    };

    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }

    var user_id = param.user_id;
    var id = param.id || '';

    var logmsg = 'to verify sms receiver from user:' + user_id+', receiver:'+id;
    mLogger.debug('Try '+logmsg);
    
    mAsync.waterfall([
        //1. check whether this is also in the system
        function(next) {
            var match = {
                user_id: user_id,
                id: id,
            };

            var select = {
                id: '',
                receiver: '1',
            };

            var query = {
                select: select,
                match: match,
            };

            mMsgReceiversModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    var find = false;
                    if (!rows || rows.length == 0) {
                        var msg = 'The receiver is not in the system!';
                        mLogger.error(msg);
                        next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    }else {
                        next(null, rows[0]);
                    }
                }
            });
        },
        //2. verify reciver 
        function(reciver, next) {
            var data = {
                mobile: reciver.receiver,
                smscode: param.smscode,
            };
            mSMSVerifier.verifySmsCode(data, function(err){
                if (err) {
                    mLogger.debug('SMS verify failded, '+err.msg);
                    reciver.audit_status = ADCONSTANTS.AUDIT.FAILED.code;
                }else {
                    reciver.audit_status = ADCONSTANTS.AUDIT.PASS.code; 
                }
                next(null, reciver);
            });
        },
        //3. update the result
        function(reciver, next) {
            var update = {
                audit_status: reciver.audit_status,
            };
            var match = {
                user_id: user_id,
                id: id,
            };

            var query = {
                update: update,
                match: match,
            };

            mMsgReceiversModel.update(query, function(err) {
                if (err) {
                    next(err);
                }else {
                    next(null, reciver);
                }
            });
        }
    ], 
    function(err, reciver){
        if (err) {
            mLogger.error('Failed '+logmsg);
            fn(err);    
        }else{
            mLogger.info('Success '+logmsg);
            var resData = packageResponseData(reciver);
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
