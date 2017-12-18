/*
 * @file  captha_request.js
 * @description dsp user account recharge info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'captha_request.logic';
var URLPATH = '/v1/mgr/captha/request';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mRsync = require('async');
var mIs = require('is_js');


var LogicApi = require("../logic_api");

//models
var mCodeModel = require('../../model/verify_code').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');

//common
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');


var mRefModel = {
    token:{
        data: 'data',
        rangeCheck:null,
        optional: true,
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
        token: data,
    };
    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }


    mLogger.debug('Try to create the verify code');
    var code_name = '';

    mRsync.series([
        //1. try to remove old code name
        function(next) {
            //1.1 do nothing if is empty!
            if (!param.token) {
                return next(null);
            }

            var match = {
                code_name: param.token,
            };
            var query = {
                match : match,
            };
            mCodeModel.remove(query, next);
        },
        //2. create the verify code
        function(next){
            //2.1 create the name
            code_name = mDataHelper.createId(MODULENAME);
            var value = {
                code_name: code_name,
                status: ADCONSTANTS.VERIFYCODESTATUS.CREATE.code,
            };
            var query = {
                fields: value,
                values: [value],
            };

            //2.2save to the database
            mCodeModel.create(query, function(err, rows){
                if (err) {
                    next(err);
                }else{

                    next(null)
                }
            });
        },
    ], 
    function(err){
        if (err) {
            mLogger.error('Failed to create the verify code!');
            fn(err);
        }else{
            mLogger.info('Success to create the verify code:'+code_name);
            var resData = packageResponseData(code_name);
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
