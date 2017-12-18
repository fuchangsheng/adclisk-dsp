/*
 * @file  faccount_invoice_sign.js
 * @description ad financial invoice sign API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.28
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'faccount_invoice_sign.logic';
var URLPATH = '/v3/settings/finance/invoice/sign';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../logic_api");

//models
var mInvoiceOpLogModel = require('../../../model/invoice_op_log').create();


//utils
var mLogger = require('../../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../../utils/data_helper');
var mUtils = require('../../../../utils/utils');

//common constants
var ERRCODE = require('../../../../common/errCode');
var ADCONSTANTS = require('../../../../common/adConstants');

var mRefModel = {
    id: {
        data: '',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
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

    var resData = {};
    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});
    }
    
    var logmsg = ' to sign for invoice for id:' + param.id ;
    mLogger.debug('Try '+logmsg);

    var update = {
        invoice_status: ADCONSTANTS.INVOICESTATUS.RECEIVED.code
    };
    var match = {
        id: param.id
    };
    var query = {
        update: update,
        match: match
    };
    mInvoiceOpLogModel.update(query, function(err, rows) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        } else {
            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData();
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

