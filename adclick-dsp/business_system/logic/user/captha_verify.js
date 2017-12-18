/*
 * @file  captha_verify.js
 * @description verifycode veriy API 
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'captha_verify.logic';
var URLPATH = '/v3/captha/verify';

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
var mUtils = require('../../../utils/utils');

//common constant
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');


var mRefModel = {
    token:{
        data: 'data',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
    },
    code:{
        data: 'data',
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
    };
    return resData;
}

function verifyToken(param, fn) {
    mLogger.debug('Try to verify the code!');

    var code_name = param.token || '';
    var code_value = param.code || '';

    var match = {
        code_name: code_name,
        status: ADCONSTANTS.VERIFYCODESTATUS.GENERATE.code,
        code_value: code_value,
    };
    
    var query = {
        select: match,
        match: match,
    };

    //1.check the code 
    mCodeModel.lookup(query, function(chkErr, rows) {
        //2. remove the old code
        var match = {
            code_name: code_name,
        };
        var query = {
            match: match,
        };

        //2.1 we remove it from database anyway
        //mCodeModel.remove(query, function(err) {
            // check the result, which will call later
            //if (err) {
            //  mLogger.error('Failed to remove the old code_name:' + code_name);
            //};
            
            //3 return the code verify status to web front
            if (chkErr) {
                //3.1 return err if error when query the database
                mLogger.error('Failed to verify the code:' + code_name);
                chkErr.code = ERRCODE.INVALID_VERIFYCODE,
                fn(chkErr);
            }else {
                //3.2 no matched code found
                if (!rows || rows.length==0) {
                    var msg = 'Invalid verify code!';
                    mLogger.error(msg);
                    fn({code: ERRCODE.INVALID_VERIFYCODE, msg: msg });
                }else {
                    //3.3 success to verify the code
                   fn(null);
                }
            }
        //});
    });
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }

    var logmsg = ' to verify the code:'+param.token;
    mLogger.debug('Try'+logmsg);
    verifyToken(param, function(err) {
        if (err) {
            mLogger.error('Failed'+logmsg);
            fn(err);
        }else {
            mLogger.info('Success'+logmsg);
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
module.exports.verifyToken = verifyToken;
