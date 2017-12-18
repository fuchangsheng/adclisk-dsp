/*
 * @file  sms_request.js
 * @description dsp sms request API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.03
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'sms_request.logic';
var URLPATH = '/v3/sms/request';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
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
    mobile:{
        data:'name address',
        rangeCheck: function (data) {
            mLogger.debug('mobile:'+data);
            data = data.trim();
            var status = mUtils.isMobile(data);
            mLogger.debug(status);
            return true;
        }
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
        mobile: data,
    };
    return resData;
}

function requestSMSCode(param, fn) {
    var mobile = param.mobile.trim();

    mAsync.waterfall([
        //1. verify the frequence of this mobile
        function(next) {
            var select = {
                status: ADCONSTANTS.SMSSTATUS.CREATE.code,
                update_time: new Date(),
            };
            var match = {
                mobile: mobile,
            };
            var query = {
                select: select,
                match: match,
            };

            mSmsModel.lookup(query, function(err, rows) {
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
                            var msg ='Too many sms request from mobile:' + mobile;
                            mLogger.error(msg);
                            next({ code: ERRCODE.SMSCODE_TOOMANY, msg: msg });
                        }else {
                            next(null, false);
                        }
                    }
                }
            });
        },
        //2. get the sms code and send out
        function(isnew, next) {
            var smscode = mDataHelper.createSMSCode();
            mUtils.sendsms( { mobile: mobile, smscode: smscode,}, 
                function(err) {
                    if (err) {
                        next(err);
                    }else {
                        next(null, {isnew: isnew, smscode:smscode})
                    }
                }
            );
        },
        //3. update it to the database
        function(data, next) {
            if (data.isnew) {
                var value = {
                    mobile: mobile,
                    smscode: data.smscode,
                    status: ADCONSTANTS.SMSSTATUS.CREATE.code,
                };
                var query = {
                    fields: value,
                    values: [value],
                };
                mSmsModel.create(query, next);
            }else {
                var match = {
                    mobile: mobile,
                };
                var update = {
                    smscode: data.smscode,
                    status: ADCONSTANTS.SMSSTATUS.CREATE.code,
                };
                var query = {
                    match: match,
                    update: update,
                };
                mSmsModel.update(query, next);
            }
        },
    ], 
    function(err, data){
        if (err) {
            mLogger.error('Failed to request smscode for ' + mobile);
            fn(err);    
        }else{
            mLogger.info('Success to request smscode for ' +  mobile);

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

    var mobile = param.mobile.trim();

    mLogger.debug('Try request sms for mobile :' + mobile);
    
    requestSMSCode(param, function(err, data) {
        if (err) {
            mLogger.error('Failed to request smscode for ' + mobile);
            fn(err);    
        }else{
            mLogger.info('Success to request smscode for ' +  mobile);

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
module.exports.requestSMSCode= requestSMSCode;