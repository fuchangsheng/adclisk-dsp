/*
 * @file  faccount_invoice_request.js
 * @description ad financial invoice request API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2017.11.28
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'faccount_invoice_request.logic';
var URLPATH = '/v3/settings/finance/invoice/add';

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
var mInvoiceOpLogModel = require('../../../model/invoice_op_log').create();
var mInvoiceInfoModel = require('../../../model/aduser_invoice_account').create();


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
    oper_id: {
        data: '',
        rangeCheck: function(data){
            return !mUtils.isEmpty(data);
        }
    },
    invoice_id: {
        data: '',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
        optional: true,
    },
    title: {
        data: '',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
        optional: true,
    },
    invoice_type: {
        data: '',
        rangeCheck: function(data) {
            var type = ADCONSTANTS.INVOICETYPE.find(data);
            return type ? true: false;
        },
    },
    item_type: {
        data: '1',
        rangeCheck: function(data) {
            var type = ADCONSTANTS.INVOICEITEM.find(data);
            return type ? true: false;
        },
    },
    amount: {
        data: 1,
        rangeCheck: function(data) {
            return data > 0;
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
    var records = data.records;

    var resData = {
        id: data.id
    };

    return resData;
}

function preprocess(param) {
    if (param.invoice_type) {
        param.invoice_type = ADCONSTANTS.INVOICETYPE.find(param.invoice_type);
    }
    if (param.amount) {
        //to fen unit
        param.amount = mUtils.yuanToFen(param.amount);
    }
}

function createInvoiceTicket(param, fn) {
    mLogger.debug('calling createInvoiceTicket');

    var value = {
        id: param.id,
        user_id: param.user_id,
        oper_id: param.oper_id, 
        amount: param.amount,
        invoice_status: ADCONSTANTS.INVOICESTATUS.SUBMIT.code,
        item_name: param.item_type,
    };

    //1.1 create the general invoice ticket
    if (param.invoice_type.name === ADCONSTANTS.INVOICETYPE.GENERAL.name) {
        value.type= ADCONSTANTS.INVOICETYPE.GENERAL.code;
        value.title=param.title;
    } else {
    //1.2 create the speical invoice ticket
        value.type = ADCONSTANTS.INVOICETYPE.SPECIAL.code;
        value.title= param.title;
        value.invoice_id = param.invoice_id;
    }

    var query = {
        fields: value,
        values: [value],
    };
    query.connection = param.connection;
    mInvoiceOpLogModel.create(query, fn);
}

function updateDspInvocieAccount(param, fn) {
    mLogger.debug('calling updateDspInvocieAccount!');

    var account = param.account;
    var update = {
        invoiced_amount: account.invoiced_amount + param.amount,
        uninvoice_amount: account.uninvoice_amount - param.amount,
    };
    var match = {
        user_id: param.user_id,
    };
    var query = {
        update : update,
        match: match,
    };
    query.connection = param.connection;
    mDspAduserModel.update(query, fn);
}

function transactionCallback(param, fn) {
    mLogger.debug('calling transactionCallback!');
    var user_id = param.user_id;

    var id = mDataHelper.createId(user_id+'invoice');
    param.id = id;
    mAsync.series([
        function(next) {
            createInvoiceTicket(param, next);
        }, 
        function(next) {
            updateDspInvocieAccount(param, next);
        }
    ], function(err) {
        if (err) {
            fn(err);
        }else {
            fn(null, {id: id});
        }
    });
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});
    }
    
    var user_id = param.user_id;
    var logmsg = ' to request invoice for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    preprocess(param);

    mAsync.waterfall([
        //1. check the invoice information
        function(next) {
            if (param.invoice_type.code == ADCONSTANTS.INVOICETYPE.GENERAL.code) {
                if (!param.title) {
                    var msg = 'The general invoice need title!';
                    mLogger.error(msg);
                    return next({code: ERRCODE.PARAM_INVALID, msg: msg});
                }
                return next(null, {});
            }

            var match = {
                user_id: user_id,
                id: param.invoice_id,
                status: ADCONSTANTS.DATASTATUS.VALID.code,
            };
            var select = mInvoiceInfoModel.refModel;

            var query = {
                select: select,
                match: match,
            };
            mInvoiceInfoModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                } else {
                    if (rows.length == 0) {
                        var msg = 'No matched invoice information!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_NO_MATCH_DATA, msg:msg});
                    }

                    var invoice = rows[0];
                    if (invoice.audit_status!=ADCONSTANTS.AUDIT.PASS.code) {
                        var msg = 'Invoice is not verified!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DATA_INVALID, msg: msg});
                    }

                    return next(null, invoice);
                }
            });
        },
        //2 check amount
        function(invoice, next) {
            var select = {
                invoiced_amount : 1,
                uninvoice_amount: 1,
            };
            var match = {
                user_id: user_id,
            };
            var query = {
                select: select,
                match: match,
            };
            mDspAduserModel.lookup(query, function(err, rows){
                if (err) {
                    next(err);
                } else {
                    if (rows.length == 0) {
                        var msg = 'There is no such ad user!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    }
                    var account = rows[0];
                    if (account.uninvoice_amount < param.amount) {
                        var msg = 'The invoice amount is too large, uninvoice_amount='
                        +account.uninvoice_amount+', require amount='+param.amount;
                        mLogger.error(msg);
                        return next({code: ERRCODE.INVOICE_REQUIRE_AMOUNT_TOOLARGE, msg: msg});
                    }

                    next(null, {invoice: invoice, account: account});
                }
            });
        },
        //3. create the invoice ticket records
        function(data, next) {
            param.invoice = data.invoice;
            param.account = data.account;
            param.transactionFun = transactionCallback;
            mDspAduserModel.doTransaction(param, next);
        },
    ], function(err, datas){
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(datas);
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

