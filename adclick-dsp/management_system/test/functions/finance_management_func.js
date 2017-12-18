/*
 * @file finance_management_func.js
 * @description functions for testing of finance_management module
 * @copyright dmtec.cn reserved, 2017
 * @author tahitian
 * @date 2017.1.17
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'finance_management_func';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

//models
var mDspAduserModel = require('../../model/dsp_aduser').create();
var mAdInvoiceModel = require('../../model/aduser_invoice_account').create();
var mInvoiceOpLogModel = require('../../model/invoice_op_log').create();
var mAdRechargeModel = require('../../model/account_recharge_log').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');
var mDataModelHelper = require('../../local_utils/data_model_helper');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var invoice_add = function(param, fn){
    var value = {
        id: mDataHelper.createId(param.user_id+'invoice'),
        user_id: param.user_id,
        oper_id: param.oper_id,         
        title : 'test',
        type : ADCONSTANTS.INVOICETYPE.GENERAL.code,
        amount: 1,
        invoice_status:  ADCONSTANTS.INVOICESTATUS.SUBMIT.code,
        item_name: '广告费',
    };
    var query = {
        fields: value,
        values: [value],
    };
    // query.connection = param.connection;
    mInvoiceOpLogModel.create(query, function(err){
        fn(err, value.id);
    });
};

var invoice_del = function(id, cb){
    mInvoiceOpLogModel.remove({ match : { id : id } }, function(err){
        if(!err) console.log('Invoice data is cleaned up!');
        cb(err);
    });
};

var recharge_add = function(param, cb){
    var value = {
        // id: mDataHelper.createId(param.user_id),
        id : '11111',
        // ticket_no : mDataHelper.createId(param.user_id),
        ticket_no : '11111',
        user_id: param.user_id,
        oper_id: param.oper_id || '',
        account_type: ADCONSTANTS.FINANCIALACCOUNT.REAL.code,
        amount: 1,
        charge_type: ADCONSTANTS.FINANCIALRECHARGE.ALIPAY.code,
        charge_status: ADCONSTANTS.REACHAGESTATUS.CREATE.code,
    };
    var query = {
        fields: value,
        values: [value],
    };
    mAdRechargeModel.create(query, function(err, rows) {
        cb(err, { id : value.id, ticket_no : value.ticket_no });
    });
}

var recharge_del = function(param, cb){
    mAdRechargeModel.remove({ match : { id : param.recharge_id } }, function(err){
        if(!err) console.log('Recharge log is cleaned up!');
        cb(err);
    });
};

module.exports.invoice_add = invoice_add;
module.exports.invoice_del = invoice_del;
module.exports.recharge_add = recharge_add;
module.exports.recharge_del = recharge_del;
