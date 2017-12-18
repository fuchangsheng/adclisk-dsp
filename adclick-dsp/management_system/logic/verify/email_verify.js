/*
 * @file  email_verify.js
 * @description email_verify API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.26
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'email_verify.logic';
var URLPATH = '/emailverify';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mEmailVerifyLogModel = require('../../model/email_verify_log').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mMsgEmailVerifier = require('../message/email_receiver_verify');

var mRefModel = {
    token:{
        data: '',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
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
    var resData = {};
    if (data.isvalid) {
        resData.html =  ADCONSTANTS.EMAILVERIFYDONEHTML + '?status=0';
    }else {
        resData.html = ADCONSTANTS.EMAILVERIFYDONEHTML + '?status=1';
    }
    
    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var token = param.token;
    var logmsg = ' to verify email token:' + token ;
    mLogger.debug('Try '+logmsg);

    mAsync.waterfall([
        //1.try to verify the email token
        function(next) {
           var select = {
                email: '',
                type: 1,
           };
           var match = {
                token: token,
                status: ADCONSTANTS.TOKENSTATUS.SEND.code,
           };
           var query = {
                select: select,
                match: match,
           };
           mEmailVerifyLogModel.lookup(query, function(err, rows){
                if (err) {
                    next(err);
                }else {
                    if (!rows||rows.length==0) {
                        var msg = 'There is no match data or status invalid!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_NO_MATCH_DATA, msg:msg});
                    }
                    next(null, rows[0]);
                }
           })
        },
        //2. verify the code
        function(data, next) {
            if (data.type!=ADCONSTANTS.EMAILVERIFYTYPE.ADDRECEIVER.code) {
                return next(null, data);
            }
            data.isvalid = true;
            mMsgEmailVerifier.verifyEmailReceiver(data, function (err, receiver) {
                if (err) {
                    next(err);
                }else{
                    if (receiver.charge_status==ADCONSTANTS.AUDIT.PASS.code) {
                        data.isvalid = true;
                    }else {
                        data.isvalid = false;
                    }
                    next(null, data);
                }
            });
        },
        //update the token
        function(data, next) {
            var update = {};
            if (data.isvalid) {
                update.status = ADCONSTANTS.TOKENSTATUS.PASS.code;
            }else {
                update.status = ADCONSTANTS.TOKENSTATUS.FAILED.code;
            }
            var match = {
                token: token,
            };
            var query = {
                update: update,
                match: match,
            };
            mEmailVerifyLogModel.update(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    next(null, data);
                }
            })
        },
    ],function(err, data) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            data = {};
            data.isvalid = false;
        }else {
            mLogger.debug('Success' + logmsg);
        }
        var resData = packageResponseData(data);
        fn(null, resData);
    });
}


/*
* export the get interface
*/
mRouter.get(URLPATH, function(req, res, next){
    var param = req.query;

    mDebug( ' get req.headers:%j', req.headers);
    mDebug( ' get req.cookies:%j', req.cookies);
    mDebug( ' get req.session:%j', req.session);
    mDebug( ' get req.param:%j', param);

    //FIXME
    mLogicHelper.responseRedirect({
        res: res,
        req: req,
        next: next,
        processRequest: processRequest,
        param: param,       
    });
});

module.exports.router = mRouter;

