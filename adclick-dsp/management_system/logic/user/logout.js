/*
 * @file  logout.js
 * @description mgr logout data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.22
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'logout.logic';
var URLPATH = '/v1/mgr/logout';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');


var LogicApi = require("../logic_api");

//models
var mAdUserModel = require('../../model/dsp_aduser').create();
var mAdOperModel = require('../../model/aduser_operators').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    mgr_id:{
        data: 1,
        rangeCheck: function (data) {
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
    };
    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code:errorCode.PARAM_INVALID, msg: msg});        
    }

    var mgr_id = param.mgr_id;

    mLogger.debug('Try to logout from system from user:'+ mgr_id);
    var resData = packageResponseData(param);
    fn(null, resData);
}

/*
* export the post interface
*/
mRouter.post(URLPATH, function(req, res, next){
    var param = req.body;

    mLogicHelper.processSesstion({
        res: res,
        req: req,
        next: next,
        processRequest: processRequest,
        param: param,       
    });
});

module.exports.router = mRouter;
