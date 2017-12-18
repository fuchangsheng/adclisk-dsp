/*
 * @file  account_recharge_log.js
 * @description dsp user account recharge info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'register.logic';
var URLPATH = '/v3/user/regist';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');

var LogicApi = require('../logic_api');
var RegisterUtils = require('./register_utils');

//models
var mAdUserModel = require('../../model/dsp_aduser').create();
var mAdOperModel = require('../../model/aduser_operators').create();
var mAdxAuditUserModel = require('../../model/adlib_audit_users').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mSMSVerifier = require('./sms_verify');


var mRefModel = {
    name:{
        data:'name address',
        rangeCheck: function (data) {
            return true;
        }
    },
    company_name:{
        data: 'company name',
        rangeCheck: function(data){
            return true;
        }
    },
    password:{
        data:'password',
        rangeCheck: function(data){
            return !mUtils.isEmpty(data);
        }
    },
    mobile:{
        data:'mobile',
        rangeCheck: null,
    },
    smscode: {
        data: 'smscode',
        rangeCheck: null,
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
        user_id: data.user_id,
    };
    return resData;
}

function verifyUserName(param, fn){
    mLogger.debug('calling verifyUserName');

    var match = {
        name: param.name,
    };

    var select = mAdOperModel.refModel;

    var query = {
        match: match,
        select: select,
    };

    mAdOperModel.lookup(query, function(err, rows){
        if (err) {
            fn(err);
        }else {
            if (rows && rows.length >0) {
                var msg = 'Duplicated name';
                mLogger.error(msg);

                fn({
                    code: ERRCODE.DB_DATADUPLICATED,
                    msg: msg,
                });
            }else{
                fn(null);
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

    var userName = param.name;
    param.user_id = mDataHelper.createNumberId(param.name);
    param.user_name = param.company_name;
    mLogger.debug('Try to register the user:'+userName);

    mAsync.series([
        //0.verify the sms code
        function(next) {
            return next(null);
            mSMSVerifier.verifySmsCode(param, function(err){
                if (err) {
                    next(err);
                }else {
                    next(null);
                }
            });
        },
        //1. verify the username
        function(next){
            verifyUserName(param, next);
        },
        //
        function(next) {
            var match = {
                user_name: param.user_name,
            };
            mAdUserModel.count({match: match}, function(err, total) {
                if(err) {
                    next(err);
                } else {
                    if(total > 0) {
                        param.user_name = param.company_name + '_' +
                            mDataHelper.createId(param.company_name).substr(0, 8);
                    }
                    next(null);
                }
            });
        },
        //2. create the user in the system
        function(next){
            RegisterUtils.regeisterTransanctionBatch(param, next);
        },
    ], 
    function(err){
        if (err) {
            mLogger.error('Failed to insert new user:'+userName);
            fn(err);    
        }else{
            mLogger.info('Success to create the new user:'+userName);

            var resData = packageResponseData(param);
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
