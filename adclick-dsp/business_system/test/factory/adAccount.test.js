/*
 * @file  adAccount.test.js
 * @description ad account basic information to test API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.08
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'adAccount.fac.test';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);

// dataModel
var mAdInvoiceModel = require('../../model/aduser_invoice_account').create();
var mAdOperatorsModel = require('../../model/aduser_operators').create();

//model
var invoice_add = require('../model/adAccount/ad_account_invoice_add.test').create();
var invoice_del = require('../model/adAccount/ad_account_invoice_del.test').create();
var invoice_edit = require('../model/adAccount/ad_account_invoice_edit.test').create();
var invoice_list = require('../model/adAccount/ad_account_invoice_list.test').create();

var oper_add = require('../model/adAccount/ad_account_operator_add.test').create();
var oper_del = require('../model/adAccount/ad_account_operator_del.test').create();
var oper_edit = require('../model/adAccount/ad_account_operator_edit.test').create();
var oper_list = require('../model/adAccount/ad_account_operator_list.test').create();
var oper_verify = require('../model/adAccount/ad_account_operator_verify.test').create();
var oper_view = require('../model/adAccount/ad_account_operator_view.test').create();

var user_info = require('../model/adAccount/ad_account_user_info.test').create();
var contact_info = require('../model/adAccount/ad_account_contact_info_view.test').create();
var info_edit = require('../model/adAccount/ad_account_info_edit.test').create();
var info_view = require('../model/adAccount/ad_account_info_view.test').create();
var qua_edit = require('../model/adAccount/ad_account_qualification_edit.test').create();
var qua_view = require('../model/adAccount/ad_account_qualification_view.test').create();

var msg;
msg = 'to test adAccount.';
mLogger.debug('try '+msg);

describe('account part', function(){
    it(user_info.description, function(done){
        user_info.test({}, function(data){ done(); });
    });

    it(contact_info.description, function(done){
        contact_info.test({}, function(data){ done(); });
    });

    it(info_edit.description, function(done){
        info_edit.test({}, function(data){ done(); });
    });

    it(info_view.description, function(done){
        info_view.test({}, function(data){ done(); });
    });

    it(qua_edit.description, function(done){
        qua_edit.test({}, function(data){ done(); });
    });

    it(qua_view.description, function(done){
        qua_view.test({}, function(data){ done(); });
    });
});

describe.skip('operator part', function(){
    it(oper_add.description, function(done){
        var oper_add = require('../model/adAccount/ad_account_operator_add.test').create();

        oper_add.test({}, function(data){
            mAdOperatorsModel.remove({ match : { oper_id : data.data.oper_id } }, done);
        });
    });

    it(oper_del.description, function(done){
        var oper_add = require('../model/adAccount/ad_account_operator_add.test').create();
        var oper_del = require('../model/adAccount/ad_account_operator_del.test').create();

        var oper_id;
        mAsync.waterfall([
            function(next){
                oper_del.test({}, [
                    function(cb){
                        oper_add.test({}, function(data){
                            oper_del.param.target_oper_id = data.data.oper_id;
                            oper_id = data.data.oper_id;
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
                if(oper_id) mAdOperatorsModel.remove({ match : { oper_id : oper_id } }, function(){ throw err; });
                else throw err;
            }
            else {
                if(oper_id) mAdOperatorsModel.remove({ match : { oper_id : oper_id } }, done);
                else done();
            }
        });
    });

    it(oper_edit.description, function(done){
        var oper_add = require('../model/adAccount/ad_account_operator_add.test').create();
        var oper_edit = require('../model/adAccount/ad_account_operator_edit.test').create();

        var oper_id;
        mAsync.waterfall([
            function(next){
                oper_edit.test({}, [
                    function(cb){
                        oper_add.test({}, function(data){
                            oper_edit.param.target_oper_id = data.data.oper_id;
                            oper_id = data.data.oper_id;
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
                if(oper_id) mAdOperatorsModel.remove({ match : { oper_id : oper_id } }, function(){ throw err; });
                else throw err;
            }
            else {
                if(oper_id) mAdOperatorsModel.remove({ match : { oper_id : oper_id } }, done);
                else done();
            }
        });
    });

    it(oper_list.description, function(done){
        oper_list.test({}, function(data){ done(); });
    });

    it(oper_verify.description, function(done){
        var oper_add = require('../model/adAccount/ad_account_operator_add.test').create();
        var oper_verify = require('../model/adAccount/ad_account_operator_verify.test').create();

        var oper_id;
        mAsync.waterfall([
            function(next){
                oper_verify.test({}, [
                    function(cb){
                        oper_add.test({}, function(data){
                            oper_verify.param.target_oper_id = data.data.oper_id;
                            oper_id = data.data.oper_id;
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
                if(oper_id) mAdOperatorsModel.remove({ match : { oper_id : oper_id } }, function(){ throw err; });
                else throw err;
            }
            else {
                if(oper_id) mAdOperatorsModel.remove({ match : { oper_id : oper_id } }, done);
                else done();
            }
        });
    });

    it(oper_view.description, function(done){
        var oper_add = require('../model/adAccount/ad_account_operator_add.test').create();
        var oper_view = require('../model/adAccount/ad_account_operator_view.test').create();

        var oper_id;
        mAsync.waterfall([
            function(next){
                oper_view.test({}, [
                    function(cb){
                        oper_add.test({}, function(data){
                            oper_view.param.target_oper_id = data.data.oper_id;
                            oper_id =  oper_id = data.data.oper_id;
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
                if(oper_id) mAdOperatorsModel.remove({ match : { oper_id : oper_id } }, function(){ throw err; });
                else throw err;
            }
            else {
                if(oper_id) mAdOperatorsModel.remove({ match : { oper_id : oper_id } }, done);
                else done();
            }
        });
    });
});

describe('invoice part', function(){
    it(invoice_add.description, function(done){
        var invoice_add = require('../model/adAccount/ad_account_invoice_add.test').create();

        invoice_add.test({}, function(data){
            mAdInvoiceModel.remove({ match : { id : data.data.id } }, done);
        });
    });

    it(invoice_del.description, function(done){
        var invoice_add = require('../model/adAccount/ad_account_invoice_add.test').create();
        var invoice_del = require('../model/adAccount/ad_account_invoice_del.test').create();

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
        var invoice_add = require('../model/adAccount/ad_account_invoice_add.test').create();
        var invoice_edit = require('../model/adAccount/ad_account_invoice_edit.test').create();
        
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