/*
 * @file  ads_adselect_ad_list.js
 * @description demo usage of bes adselect
 * @copyright dmtec.cn reserved, 2017
 * @author Andy.zhou
 * @date 2017.05.19
 * @version 0.1.1 
 */
'use strict';
var MODULENAME = 'list_ad.logic';
var URLPATH = '/v1/aduser/tag/user_sum';

//system modules
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");
var AdOptClient = require('../../../utils/adSelect/ad_opt_http_client');
var mAdOptClient = new AdOptClient({});

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mUtils = require('../../../utils/utils');


//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');


var mRefModel = {
};

var mLogicHelper = new LogicApi({
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
    if(!data) {
        return {};
    }
    data = JSON.parse(data);
    return data;
}

function  processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }

    var logmsg = ' to query the adSelect';
    mLogger.debug('Try'+logmsg);
    
    var data = {
        tag: param.tag,
        min_weight: parseFloat(param.min_weight)
    };
    mAdOptClient.queryTagUserSum({data: data}, function(err, data){
        if(err) {
            mLogger.error('Failed ' + logmsg);
            fn(err);
        }else{
            mLogger.debug('Success ' + logmsg);
            var resData = packageResponseData(data);
            fn(null, resData);
        }
    });
    
}


/*
* export the get interface
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