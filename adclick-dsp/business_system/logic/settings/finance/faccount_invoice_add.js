/*
 * @file  faccount_invoice_add.js
 * @description invoice information add API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.28
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'ad_account_invoice_add.logic';
var URLPATH = '/v3/settings/finance/invoice-info/add';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../logic_api");

//models
var mDspAduserModel = require('../../../model/dsp_aduser').create();
var mAdInvoiceModel = require('../../../model/aduser_invoice_account').create();

//utils
var mLogger = require('../../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../../utils/data_helper');
var mUtils = require('../../../../utils/utils');

//common constants
var ERRCODE = require('../../../../common/errCode');
var ADCONSTANTS = require('../../../../common/adConstants');

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidUserId(data);
        },
    },
    type: {
        data: 'type',
        rangeCheck: function(data) {
            var type = ADCONSTANTS.INVOICETYPE.find(data);
            return type ? true: false;
        },
    },
    title: {
        data: 'title',
        rangeCheck: mUtils.notEmpty,
    },
    tax_no: {
        data: 'tax_no',
        rangeCheck: mUtils.notEmpty,
        optional: true,
    },
    address: {
        data: 'address',
        rangeCheck: mUtils.notEmpty,
        optional: true,
    },
    phone: {
        data:' phone',
        rangeCheck: mUtils.isPhone,
        optional: true,
    },
    bank: {
        data: 'bank',
        rangeCheck: mUtils.notEmpty,
        optional: true,
    },
    bank_account_no: {
        data: 'no',
        rangeCheck: mUtils.notEmpty,
        optional: true,
    },
    receiver_name: {
        data: 'name',
        rangeCheck: mUtils.notEmpty,
    },
    receiver_address: {
        data: 'address',
        rangeCheck: mUtils.notEmpty,
    },
    receiver_email: {
        data: 'email',
        rangeCheck: mUtils.notEmpty,
    },
    receiver_mobile: {
        data: 'mobile',
        rangeCheck: mUtils.isMobile,
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
        id: data.id,
        audit_status: data.audit_status,
    };

    return resData;
}

function preprocess(param) {
    if (param.type) {
        param.type = ADCONSTANTS.INVOICETYPE.parse(param.type);
    }
}
function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id;
    var logmsg = ' to add the invoice for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    preprocess(param);

    mAsync.waterfall([
        //1. check whether the user exist in the system
        function(next) {
            var match = {
                user_id: param.user_id,
            };
            var query = {
                match: match,
            }
            mDspAduserModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                } else {
                    if (total > 0) {
                        next(null, total);
                    } else {
                        var msg = 'There is no this Ad user!';
                        mLogger.error(msg);
                        next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg}); 
                    }
                }
            });
        },
        //2. create one invoice
        function(total, next) {
            var seed = param.user_id+'invoice';
            var id = mDataHelper.createId(seed);
            var value = {
                id: id,
                user_id: user_id,
                audit_status: ADCONSTANTS.AUDIT.VERIFYING.code,
                status: ADCONSTANTS.DATASTATUS.VALID.code,
                title: param.title || '',
                tax_no: param.tax_no || '',
                address: param.address || '',
                phone: param.phone||'',
                bank: param.bank ||'',
                bank_account_no: param.bank_account_no||'',
                receiver_name: param.receiver_name ||'',
                receiver_address: param.receiver_address ||'',
                receiver_email: param.receiver_email || '',
                receiver_mobile: param.receiver_mobile ||'',
                qualification: param.qualification ||'',
                type: param.type,
            };
            var query = {
                fields: value,
                values: [value], 
            };
            mAdInvoiceModel.create(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    next(null, value);
                }
            });
        },
        
    ], function(err, invoice) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(invoice);
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

