/*
 * @file  email_receiver_verify.js
 * @description email receiver verify API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'email_receiver_verify.logic';
var URLPATH = '/v1/message/email/verify';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mMsgReceiversModel = require('../../model/msg_notify_receivers').create();


//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    email: {
        data: 'email',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
    },
    isvalid: {
        data: 1,
        rangeCheck: function(data) {
            return mIs.inArray(data, [0,1]);
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
        audit_status: data.audit_status,
    };

    return resData;
}

function verifyEmailReceiver(param, fn) {
    var email = param.email;

    var logmsg = ' to verify the email '+email;
    mLogger.debug('Try'+logmsg);
    
    mAsync.waterfall([
        //1. find the token log
        function(next) {
            var match = {
                receiver: email,
            };

            var select = {
                id: '',
                audit_status: 1,
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
        //2. update reciver status in the system
        function(data, next) {
            if (data.audit_status != ADCONSTANTS.AUDIT.VERIFYING.code) {
                var msg = 'The token is also out of date!';
                mLogger.error(msg);
                return next({code: ERRCODE.TOKEN_OUTOFDATE, msg: msg});
            }
            
            var update = {
                audit_status: 0,
            };
            if (param.isvalid) {
                update.audit_status = ADCONSTANTS.AUDIT.PASS.code;
            }else {
                update.audit_status = ADCONSTANTS.AUDIT.FAILED.code;
            }
            var match = {
                id: data.id
            };
            var query = {
                update: update,
                match: match,
            };

            mMsgReceiversModel.update(query, function(err, row) {
                if (err) {
                    next (err);
                }else {
                    data.audit_status = update.audit_status;
                    next(null, data);
                }
            });
        }
    ], 
    function(err, data){
        if (err) {
            fn(err);
        }else {
            fn(null, data);
        }
    });
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    verifyEmailReceiver(param, function(err, data) {
        if (err) {
            mLogger.error('Failed'+logmsg);
            fn(err);    
        }else{
            mLogger.info('Success'+logmsg);

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
module.exports.verifyEmailReceiver = verifyEmailReceiver;
