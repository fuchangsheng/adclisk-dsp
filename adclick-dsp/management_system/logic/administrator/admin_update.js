/*
 * @file  admin_update.js
 * @description dsp management administrator role update logic
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.3
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'admin_update.logic';
var URLPATH = '/v1/admin/update';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');


var LogicApi = require("../logic_api");

//models
var adminModel = require('../../model/management_admin').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mUtils = require('../../../utils/utils');

//constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    target_mgr_id: {
        data: 1,
        rangeCheck: function(data) {
            return mIs.positive(data);
        }
    },
    role: {
        data: 0,
        rangeCheck: function(data) {
            return mIs.inArray(data, [1, 2]);
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
    return data;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code:errorCode.PARAM_INVALID, msg: msg});
    }

    var target_mgr_id = param.target_mgr_id;
    var logmsg = ' to update role of mgr: ' + target_mgr_id;
    mLogger.debug('Try' + logmsg);
    var match = {
        id: target_mgr_id
    };
    var update = {
        role: param.role
    };
    var query = {
        match: match,
        update: update
    };
    adminModel.update(query, function(err) {
        if(err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        } else {
            mLogger.debug('Success' + logmsg);
            fn(null, {});
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
