/*
 * @file  fAccount.test.js
 * @description fAccount basic information to test API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.10
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'fAccount.test';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);

// dadaModel
var mAdInvoiceModel = require('../../model/aduser_invoice_account').create();

//model
var invoice_add = require('../model/fAccount/ad_account_invoice_add.test').create();
var invoice_del = require('../model/fAccount/ad_account_invoice_del.test').create();
var invoice_edit = require('../model/fAccount/ad_account_invoice_edit.test').create();
var invoice_list = require('../model/fAccount/ad_account_invoice_list.test').create();

var balance_view = require('../model/fAccount/faccount_balance_view.test').create();
var invoice_available = require('../model/fAccount/faccount_invoice_avaiable.test').create();
var invoice_records = require('../model/fAccount/faccount_invoice_records.test').create();
var invoice_request = require('../model/fAccount/faccount_invoice_request.test').create();
var faccount_records = require('../model/fAccount/faccount_op_records.test').create();

var invoice_request_model = require('../model/fAccount/faccount_invoice_request.test');

var msg;

msg = 'to test interfaces of fAccount module.';
mLogger.debug('try '+msg);

describe('invoice part1', function(){
    it(invoice_add.description, function(done){
        invoice_add.test({}, function(data){
            mAdInvoiceModel.remove({ match : { id : data.data.id } }, done);
        });
    });

    it(invoice_del.description, function(done){
        var id;
        mAsync.waterfall([
            function(next){
                invoice_del.test({}, [
                    function(cb){
                        invoice_add.test({}, function(data){
                            invoice_del.param.id = data.data.id;
                            id = data.data.id;
                            cb();
                        });
                    }, 
                    function(data){
                        next(null);
                    }
                ]);
            }
        ], function(err, data){
            if(err){
                if(id) mAdInvoiceModel.remove({ match : { id : id } }, function(){ throw err; });
                else throw err;
            }
            else {
                if(id) mAdInvoiceModel.remove({ match : { id : id } }, done);
                else done();
            }
        });
    });

    it(invoice_edit.description, function(done){
        var id;
        mAsync.waterfall([
            function(next){
                invoice_edit.test({}, [
                    function(cb){
                        invoice_add.test({}, function(data){
                            invoice_edit.param.id = data.data.id;
                            id = data.data.id;
                            cb();
                        })
                    },
                    function(data){
                        next(null);
                    }
                ]);
            }
        ], function(err, data){
            if(err){
                if(id) mAdInvoiceModel.remove({ match : { id : id } }, function(){ throw err; });
                else throw err;
            }
            else {
                if(id) mAdInvoiceModel.remove({ match : { id : id } }, done);
                else done();
            }
        });
    });

    it(invoice_list.description, function(done){
        invoice_list.test({}, function(data){ done(); });
    });
});

describe('invoice part', function(){
    it(invoice_available.description, function(done){
        invoice_available.test({}, function(data){
            done();
        });
    });
    it(invoice_records.description, function(done){
        invoice_records.test({}, function(data){
            done();
        });
    });
    it(invoice_request.description, function(done){
        var invoice_id;
        mAsync.waterfall([
            function(next){
                invoice_request.test({}, [
                    function(cb){
                        invoice_add.test({}, function(data){
                            invoice_request.param.invoice_id = data.data.id;
                            invoice_id = data.data.id;
                            var query = {
                                match : {
                                    id : data.data.id
                                },
                                update : {
                                    audit_status : 0
                                }
                            };
                            mAdInvoiceModel.update(query, function(err, rows) {
                                cb();
                            }); 
                        });
                    },
                    function(data){
                        next(null, null);
                    }
                ]);
            }
        ], function(err, data){
            if(invoice_id){
                mAdInvoiceModel.remove({ match : { id : invoice_id } }, function(){
                    if(err) throw err;
                    done();
                });
            }
            else {
                if(err) throw err;
                done();
            }
        });
    });
    var invoice_request_no_matched_data = invoice_request_model.createNoMatchedCase();
    it(invoice_request_no_matched_data.description, function(done) {
        invoice_request_no_matched_data.test({}, function(resData) {
            done();
        });
    });
    var invoice_request_not_verify = invoice_request_model.createInvoiceNotVerify();
    it(invoice_request_not_verify.description, function(done) {
        invoice_request_not_verify.test({}, [
            function(cb) {
                invoice_add.test({}, function(data) {
                    invoice_del.param.id = data.data.id;
                    invoice_request_not_verify.param.invoice_id = data.data.id;
                    cb();
                });
            },
            function(resData) {
                invoice_del.test({}, function(data) {
                    done();
                });
            },
        ]);
    });
    var invoice_over = invoice_request_model.createInvoiceOver();
    it(invoice_over.description, function(done) {
        invoice_over.test({}, [
            function(cb) {
                invoice_add.test({}, function(data) {
                    invoice_del.param.id = data.data.id;
                    invoice_over.param.invoice_id = data.data.id;
                    var query = {
                        match : {
                            id : data.data.id
                        },
                        update : {
                            audit_status : 0
                        }
                    };
                    mAdInvoiceModel.update(query, function(err, rows) {
                        cb();
                    });
                });
            },
            function(resData) {
                invoice_del.test({}, function(data) {
                    done();
                });
            },
        ]);
    });
});

describe('fAccount part', function(){
    it(balance_view.description, function(done){
        balance_view.test({}, function(data){
            done();
        });
    });
    it(faccount_records.description, function(done){
        faccount_records.test({}, function(data){
            done();
        });
    });
});
