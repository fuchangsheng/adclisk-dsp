/*
 * @file  finance_management.test.js
 * @description test the interfaces of finance_management model
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.16
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'finance_management.test';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);

// constants
var testConstants = require('../common/constants');

//model
var balance_view = require('../model/finance_management/fAccount_balance_view.test').create();
var invoice_available = require('../model/finance_management/fAccount_invoice_available.test').create();
var invoice_records = require('../model/finance_management/fAccount_invoice_records.test').create();
var invoice_request_audit = require('../model/finance_management/fAccount_invoice_request_audit.test').create();
var invoice_delivery = require('../model/finance_management/fAccount_invoice_request_delivery.test').create();
var invoice_finish = require('../model/finance_management/fAccount_invoice_request_finish.test').create();
var invoice_process = require('../model/finance_management/fAccount_invoice_request_process.test').create();
var oper_records = require('../model/finance_management/fAccount_op_records.test').create();
var recharge_update = require('../model/finance_management/fAccount_recharge_update.test').create();
var vrecharge = require('../model/finance_management/fAccount_vrecharge.test').create();

// functions
var invoice_add = require('../functions/finance_management_func').invoice_add;
var invoice_del = require('../functions/finance_management_func').invoice_del;
var recharge_add = require('../functions/finance_management_func').recharge_add;
var recharge_del = require('../functions/finance_management_func').recharge_del;

var msg;

msg = 'to test interfaces of finance_management module.';
mLogger.debug('try '+msg);

var user_id = testConstants.USER_ID;
var oper_id = testConstants.OPER_ID;

describe('finance_management module', function(){
    var invoice_id, recharge_id, ticket_no;
    before(function(done){
        invoice_add({ user_id : user_id, oper_id : oper_id }, function(err, id){
            if (err) done(err);
            else {
                invoice_id = id;
                recharge_add({ user_id : user_id, oper_id : oper_id }, function(err, data){
                    done(err);
                    recharge_id = data.id;
                    ticket_no = data.ticket_no;
                });
            }
        });
    });

    after(function(done){
        if(invoice_id) invoice_del(invoice_id, function(err1){
            if(recharge_id) recharge_del({ recharge_id : recharge_id, ticket_no : ticket_no }, function(err2){
                done(err1 || err2);
            });
            else done();
        });
        else done();
    });

    it(balance_view.description, function(done){
        balance_view.param.user_id = user_id;
        balance_view.test({}, function(data){
            done();
        });
    });

    it(invoice_available.description, function(done){
        invoice_available.param.user_id = user_id;
        invoice_available.test({}, function(data){
            done();
        });
    });

    it(invoice_records.description, function(done){
        invoice_records.param.user_id = user_id;
        invoice_records.test({}, function(data){
            done();
        });
    });

    it(invoice_request_audit.description, function(done){
        invoice_request_audit.param.ticket_id = [invoice_id,];
        invoice_request_audit.test({}, function(data){
            done();
        });
    });

    it(invoice_process.description, function(done){
        invoice_process.param.ticket_id = invoice_id;
        invoice_process.test({}, function(data){
            done();
        });
    });

    it(invoice_delivery.description, function(done){
        invoice_delivery.param.ticket_id = invoice_id;
        invoice_delivery.test({}, function(data){
            done();
        });
    });

    it(invoice_finish.description, function(done){
        invoice_finish.param.ticket_id = [invoice_id,];
        invoice_finish.test({}, function(data){
            done();
        });
    });

    it(oper_records.description, function(done){
        oper_records.param.user_id = user_id;
        oper_records.test({}, function(data){
            done();
        });
    });

    it(vrecharge.description, function(done){
        vrecharge.param.user_id = user_id;
        vrecharge.test({}, function(data){
            done();
        });
    });

    it(recharge_update.description, function(done){
        recharge_update.param.user_id = user_id;
        recharge_update.param.charge_id = recharge_id;
        recharge_update.param.ticket_no = ticket_no;
        recharge_update.test({}, function(data){
            done();
        });
    });
});