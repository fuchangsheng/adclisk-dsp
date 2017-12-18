/*
 * @file  sms_verify.js
 * @description dsp sms verify API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.03
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'sms_verify.logic';
var URLPATH = '/v1/sms/verify';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mRsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mSmsModel = require('../../model/sms_log').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    mobile: {
        data: 'mobile',
        rangeCheck: function (data) {
            return true;
        }
    },
    smscode: {
        data: 'data',
        rangeCheck: function(data) {
            return true;
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
        mobile: data,
    };
    return resData;
}

function verifySmsCode(param, fn) {
    var mobile = param.mobile;
    var smscode = param.smscode;

    mLogger.debug('Try to verify sms for mobile :' + mobile);

    var select = {
        status: ADCONSTANTS.SMSSTATUS.CREATE.code,
        update_time: new Date(),
        smscode: '',
    };
    var match = {
        mobile: mobile,
    };
    var query = {
        select: select,
        match: match,
    };

    //1. find the sms code by mobile
    mSmsModel.lookup(query, function(err, rows) {
        //1.0 err happen when query database
        if (err) {
            fn(err);
        }else {
            //1.1 no this mobile
            if(!rows || rows.length==0){
                var msg ='Invalid mobile:' + mobile;
                mLogger.error(msg);
                return fn({ code: ERRCODE.SMSCODE_INVALID, msg: msg });
            }
            
            var data = rows[0];
            var now = mMoment();
            var updateTime = mMoment(data.update_time);
            
            mLogger.debug('smscode time:'+updateTime);
            mLogger.debug('now:'+now);

            updateTime.add(ADCONSTANTS.SMSCODEPERIODTIME, 'm');
            mLogger.debug('sms time after:'+updateTime);

            //1.2 sms code is out of date
            if (updateTime.isBefore(now)) {
                var msg ='The sms code is out of date for :' + mobile;
                mLogger.error(msg);
                return fn({ code : ERRCODE.SMSCODE_OUTOFDATE, msg : msg });
            }else {
                var update = { status: 0 };

                var err = null;
                //1.3 sms code has been used
                if (data.status != ADCONSTANTS.SMSSTATUS.CREATE.code) {
                    var msg = 'The sms code has been used for mobile:' + mobile;
                    mLogger.error(msg);
                    return fn({ code: ERRCODE.SMSCODE_INVALID, msg: msg });
                }

                //1.4 verify the sms code
                if (data.smscode == smscode ) {
                    update.status = ADCONSTANTS.SMSSTATUS.PASS.code;
                }else {
                    update.status = ADCONSTANTS.SMSSTATUS.FAILED.code;
                }

                //2. update the data 
                query = {
                    match: match,
                    update: update,
                };
                
                //2.1 update the sms code status
                mSmsModel.update(query, function(err, rows) {
                    if (err) {
                        mLogger.error('Failed to verify smscode for ' + mobile);
                        fn(err);    
                    }else{
                        if (update.status != ADCONSTANTS.SMSSTATUS.PASS.code) {
                            var err = {};
                            err.code = ERRCODE.SMSCODE_INVALID;
                            err.msg = 'Invalid sms code from mobile:' + mobile;
                            mLogger.error(msg);
                            fn(err);
                        }else {
                            fn(null);       
                        }
                    }
                });
            }
        }
    });
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }

    var mobile = param.mobile;

    verifySmsCode(param, function(err){
        if (err) {
            mLogger.error('Failed to verify smscode for ' + mobile);
            fn(err);    
        }else{
            mLogger.info('Success to verify smscode for ' +  mobile);
            var resData = packageResponseData(mobile);
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
module.exports.verifySmsCode = verifySmsCode;
