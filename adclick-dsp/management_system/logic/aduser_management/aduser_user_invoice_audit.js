/*
 * @file  aduser_user_invoice_audit.js
 * @description ad user audit view API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.12.10
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'aduser_user_invoice_audit.logic';
var URLPATH = '/v1/aduser/invoice/audit';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mAdUserInvoiceModel = require('../../model/aduser_invoice_account').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidUserId(data);
        },
    },
    invoice_id: {
        data: '',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        }
    },
    audit: {
        data: '',
        rangeCheck: function(data) {
            var type = ADCONSTANTS.AUDIT.find(data);
            return type? true: false;
        },
    },
    message: {
        data: '',
        rangeCheck: function(data){
            return true;
        },
        optional: true,
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
    
    var resData = {
        user_id: data.user_id,
        invoice_id: data.invoice_id,
        audit_status: ADCONSTANTS.AUDIT.format(data.audit),
    };

    return resData;
}

function preprocess(param) {
    if (param.audit) {
        param.audit = ADCONSTANTS.AUDIT.parse(param.audit);
    }

     param.message = param.message ||'';
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id;
    var logmsg = ' to update invoice audit status for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    preprocess(param);

    var update = {
        audit_status: param.audit,
        audit_message: param.message,
    };
    var match = {
        user_id: param.user_id,
        id: param.invoice_id,
    };
    var query = {
        update: update,
        match: match,
    };
    mAdUserInvoiceModel.update(query, function(err, rows){
        if (err) {
            mLogger.error('Failed'+logmsg);
        }else {
            mLogger.debug('Success'+logmsg);
            var resData = packageResponseData(param);
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

