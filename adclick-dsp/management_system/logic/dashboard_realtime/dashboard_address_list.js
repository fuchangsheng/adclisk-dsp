/*
 * @file  dashboard_address_list.js
 * @description dashboard address list to query API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.03.09
 * @version 1.2.0 
 */
'use strict';
var MODULENAME = 'dashboard_address_list.logic';
var URLPATH = '/v1/dashboard/address/list';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mBiddersModel = require('../../model/bidders').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {

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
        total: data.length,
        list: data,
    };

    return resData;
}

function preprocess(param) {

}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var logmsg = ' to query address';
    mLogger.debug('Try'+logmsg);

    preprocess(param);

    mAsync.waterfall([
        function(next) {
            var sqlstr = 'select id from ' + mBiddersModel.tableName;
            mBiddersModel.query({sqlstr: sqlstr}, next);
        }        
    ], function(err, data) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(data);
            fn(null, resData);
        }
    });    
}

/*
* export the post interface
*/
mRouter.get(URLPATH, function(req, res, next){
    var param = req.query;

    mLogicHelper.responseHttp({
        res: res,
        req: req,
        next: next,
        processRequest: processRequest,
        param: param,       
    });
});

module.exports.router = mRouter;