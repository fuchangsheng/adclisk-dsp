/*
 * @file  aduser_management.test.js
 * @description test the interfaces of aduser_management model
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.15
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'aduser_management.test';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);

// constants
var testConstants = require('../common/constants');

//model
var user_list = require('../model/aduser_management/aduser_user_list.test').create();
var user_info = require('../model/aduser_management/aduser_account_info_view.test').create();
var user_name = require('../model/aduser_management/aduser_account_user_name.test').create();
var contact_info = require('../model/aduser_management/aduser_account_contact_info_view.test').create();
var user_audit = require('../model/aduser_management/aduser_user_audit.test').create();

var qualification_view = require('../model/aduser_management/aduser_account_qualification_view.test').create();
var qualification_audit = require('../model/aduser_management/aduser_user_qualification_audit.test').create();

var oper_list = require('../model/aduser_management/aduser_account_operator_list.test').create();
var oper_view = require('../model/aduser_management/aduser_account_operator_view.test').create();

var invoice_list = require('../model/aduser_management/aduser_account_invoice_list.test').create();
var invoice_audit = require('../model/aduser_management/aduser_user_invoice_audit.test').create();
var balance_view = require('../model/aduser_management/aduser_account_balance_view.test').create();

// functions
var invoice_add = require('../functions/aduser_func').invoice_add;
var invoice_del = require('../functions/aduser_func').invoice_del;

var msg;

msg = 'to test interfaces of aduser_management module.';
mLogger.debug('try '+msg);

var user_id = testConstants.USER_ID;
var oper_id = testConstants.OPER_ID;

describe('aduser_management module', function(){
    describe('user part', function(){
        it(user_list.description, function(done){
            user_list.test({}, function(data){
                done();
            });
        });

        it(user_info.description, function(done){
            user_info.param.user_id = user_id;
            user_info.test({}, function(data){
                done();
            });
        });

        it(user_name.description, function(done){
            user_name.param.user_id = user_id;
            user_name.test({}, function(data){
                done();
            });
        });

        it(contact_info.description, function(done){
            contact_info.param.user_id = user_id;
            contact_info.test({}, function(data){
                done();
            });
        });

        it(user_audit.description, function(done){
            user_audit.param.user_id = user_id;
            user_audit.test({}, function(data){
                done();
            });
        });
    });

    describe('qualification part', function(){
        it(qualification_view.description, function(done){
            qualification_view.param.user_id = user_id;
            qualification_view.test({}, function(data){
                done();
            });
        });

        it(qualification_audit.description, function(done){
            qualification_audit.param.user_id = user_id;
            qualification_audit.test({}, function(data){
                done();
            });
        });
    });

    describe('operator part', function(){
        it(oper_list.description, function(done){
            oper_list.param.user_id = user_id;
            oper_list.test({}, function(data){
                done();
            });
        });

        it(oper_view.description, function(done){
            oper_view.param.user_id = user_id;
            oper_view.param.oper_id = oper_id;
            oper_view.test({}, function(data){
                done();
            });
        });
    });

    describe('finance part', function(){
        var invoice_id;

        before(function(done){
            invoice_add(user_id, function(err, invoice){
                if(!err) invoice_id = invoice.id;
                done(err);
            });
        });

        after(function(done){
            if(invoice_id) invoice_del({ invoice_id : invoice_id }, done);
        });

        it(invoice_list.description, function(done){
            invoice_list.param.user_id = user_id;
            invoice_list.test({}, function(data){
                done();
            });
        });

        it(invoice_audit.description, function(done){
            invoice_audit.param.user_id = user_id;
            invoice_audit.param.invoice_id = invoice_id;
            invoice_audit.test({}, function(data){
                done();
            });
        });

        it(balance_view.description, function(done){
            balance_view.param.user_id = user_id;
            balance_view.test({}, function(data){
                done();
            });
        });
    });
});
