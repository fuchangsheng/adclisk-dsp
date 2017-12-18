/*
 * @file aduser_func.js
 * @description functions for testing of aduser module
 * @copyright dmtec.cn reserved, 2017
 * @author tahitian
 * @date 2017.1.17
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'aduser_func';

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

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');
var mDataModelHelper = require('../../local_utils/data_model_helper');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var invoice_add = function(user_id, fn){
    var param = {
        user_id : user_id,
        title : 'abcd',
        tax_no : 'abcd',
        address : 'abcd',
        phone : '02168580110',
        bank : 'abcd',
        bank_account_no : 'abcd',
        receiver_name : 'abcd',
        receiver_address : 'abcd',
        receiver_email : 'cabd@sf.com',
        receiver_mobile : '13568412548',
        qualification : 'string',
        type : '增值税普票',
    };

    if (param.type) {
        param.type = ADCONSTANTS.INVOICETYPE.parse(param.type);
    }

    mAsync.waterfall([
        //1. check whether the user exist in the system
        function(next) {
            mDataModelHelper.makeSureAdUserExist(param, next);
        },
        //2. create one invoice data
        function(data, next) {
            var seed = param.user_id+'invoice';
            var id = mDataHelper.createId(seed);
            var value = {
                id: id,
                user_id: user_id,
                audit_status: ADCONSTANTS.AUDIT.UNCHECK.code,
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
        fn(err, invoice);
    });
}

var invoice_del = function(param, cb){
    mAdInvoiceModel.remove({ match : { id : param.invoice_id } }, function(err){
        cb(err);
    });
}

module.exports.invoice_add = invoice_add;
module.exports.invoice_del = invoice_del;
