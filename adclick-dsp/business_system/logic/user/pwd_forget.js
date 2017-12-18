/*
 * @file  pwd_forget.js
 * @description dsp user account recharge info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.03
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'pwd_forget.logic';
var URLPATH = '/v3/password/forget';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mAdOperModel = require('../../model/aduser_operators').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

var mSmsVerifier = require('./sms_verify');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    name: {
        data:'name',
        rangeCheck: function (data) {
            return !mUtils.isEmpty(data);
        }
    },
    password: { 
        data: 'password',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
    },
    mobile: {
        data: 'password',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
    },
    smscode: {
        data: 'smscode',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
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
        mobile: data,
    };
    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }

    var name = param.name;
    var mobile = param.mobile;

    mLogger.debug('Try to reset password for forgotten user :' + name);
    
    mAsync.series([
        //1. verify the sms code
        function(next) {
            mSmsVerifier.verifySmsCode(param, next);
        },
        //2. update the user password
        function(next) {
            var match = {
                name: name,
                mobile: mobile,
            };
            var update = {
                password: mDataHelper.createPasswordSha1Data(name + param.password),
            };
            var query = {
                update: update,
                match: match,
            };
            mAdOperModel.update(query, function(err, data) {
                if(err) {
                    next(err);
                } else {
                    if(data.affectedRows == 0) {
                        var msg = 'Name does not match with mobie';
                        mLogger.error(msg);
                        next({code: ERRCODE.DATA_INVALID, msg: msg});
                    } else {
                        next(null);
                    }
                }
            });
        }
    ], 
    function(err){
        if (err) {
            mLogger.error('Failed to reset password for forgotten ' + name);
            fn(err);    
        }else{
            mLogger.info('Success to reset password for forgotten ' +  name);

            var resData = packageResponseData(name);
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
