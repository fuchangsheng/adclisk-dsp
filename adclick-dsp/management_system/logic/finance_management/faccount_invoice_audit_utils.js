/*
 * @file  faccount_invoice_audit_utils.js
 * @description dsp user invoice audit model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2017.01.01
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'faccount_invoice_audit_utils.logic';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');
var mIs = require('is_js');

//models
var mInvoiceOpLogModel = require('../../model/invoice_op_log').create();
var mDspAduserModel = require('../../model/dsp_aduser').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

function updateInvoiceStatusTransanction(param, fn){
    mLogger.debug('calling updateInvoiceStatusTransanction!');

    var sqlstr = 'update '+mInvoiceOpLogModel.tableName;
    sqlstr +=' set invoice_status='+param.invoice_status;
    sqlstr +=', message="'+param.message+'"';
    sqlstr +=' where id = "'+ param.id+'"';
    sqlstr +=';';
    
    var query = {
        sqlstr: sqlstr,
    };

    query.connection = param.connection;
    mInvoiceOpLogModel.query(query, function(err, rows){
        if (err) {
            fn(err);
        }else {
            fn(null);
        }
    });
}

function setAdUserInvoiceAmountBackTransanction(param, fn){
    mLogger.debug('calling setAdUserInvoiceAmountBackTransanction');

    if(param.audit==ADCONSTANTS.AUDIT.PASS.code) {
        return fn(null);
    }

    mAsync.waterfall([
        function(next) {
            var select = {
                invoiced_amount : 1,
                uninvoice_amount: 1,
            };
            var match = {
                user_id: param.user_id,
            };
            var query = {
                select: select,
                match: match,
            };

            query.connection = param.connection;
            mDspAduserModel.lookup(query, function(err, rows){
                if (err) {
                    next(err);
                }else {
                    if (!rows || rows.length!=1) {
                        var msg = 'There is no such ad user!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    }
                    var account = rows[0];
                    next(null, account);
                }
            });
        },
        function(account, next) {
            var update = {
                invoiced_amount: account.invoiced_amount - param.amount,
                uninvoice_amount: account.uninvoice_amount + param.amount,
            };
            var match = {
                user_id: param.user_id,
            };
            var query = {
                update : update,
                match: match,
            };

            query.connection = param.connection;
            mDspAduserModel.update(query, function(err, rows){
                if (err) {
                    next(err);
                }else {
                    next(null, account);
                }
            });
        }
    ],function(err, account){
        if (err) {
            fn(err);
        }else{
            fn(null);
        }
    });
}

function auditTransanctionBatch(param, fn) {
    mLogger.debug('calling transanctionBatch!');

    var transactions = [];

    //1.do the business database
    var data = {
        user_id: param.user_id,
        amount: param.amount,
        audit: param.audit,
        transactionFun: setAdUserInvoiceAmountBackTransanction,
    };
    transactions.push({data: data, model: mDspAduserModel});

    //2.do the business database
    data = {
        id: param.id,
        invoice_status: param.invoice_status,
        message: param.message,
        transactionFun: updateInvoiceStatusTransanction,
    };
    transactions.push({data: data, model: mInvoiceOpLogModel});

    var options = {
        transactions: transactions,
    };

    mUtils.transactionBatch(options, fn);
}

module.exports.auditTransanctionBatch = auditTransanctionBatch;