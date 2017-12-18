/*
 * @file  faccount_invoice_request.test.js
 * @description ad financial invoice request info to test API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'faccount_invoice_request.test';
var PATH = '/v3/settings/finance/invoice/add';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var ERRCODE = require('../../common/errCode');

var param = {
    title : 'optional',
    invoice_id : 0,
    invoice_type : '增值税普票',
    item_type : '广告费',
    amount: 0.11,
    oper_id : '11111',
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        id : '',
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should show ad financial invoice request info on' + PATH;
if(method === TESTCONSTANTS.HTTP_REQUEST_METHOD.GET) {
    description += ' GET';
} else if(method === TESTCONSTANTS.HTTP_REQUEST_METHOD.POST) {
    description += ' POST';
} else {
    description += ' UNUSED';
}

var testModel = new TestModel({
    modelName : MODULENAME,
    path : PATH,
    wantedModel : wantedModel,
    method : method,
    param : param,
    description : description,
});

module.exports.create = function(){
    return testModel;
}

module.exports.createNoMatchedCase = function() {
    return new TestModel({
        modelName : MODULENAME,
        path : PATH,
        wantedModel : {
            code : ERRCODE.DB_NO_MATCH_DATA,
            message : '',
            data : {},
        },
        method : method,
        param : {
            title : 'optional',
            invoice_id : 'abcdefg',
            invoice_type : '增值税专票',
            item_type : '广告费',
            amount: 0.11,
        },
        description : 'should show no matched invoice information.',
    });
}

module.exports.createInvoiceNotVerify = function() {
    return new TestModel({
        modelName : MODULENAME,
        path : PATH,
        wantedModel : {
            code : ERRCODE.DATA_INVALID,
            message : '',
            data : {},
        },
        method : method,
        param : {
            title : 'optional',
            invoice_id : 0,
            invoice_type : '增值税专票',
            item_type : '广告费',
            amount: 0.11,
        },
        description : 'should show invoice information not verified.',
    });
}

module.exports.createInvoiceOver = function() {
    return new TestModel({
        modelName : MODULENAME,
        path : PATH,
        wantedModel : {
            code : ERRCODE.INVOICE_REQUIRE_AMOUNT_TOOLARGE,
            message : '',
            data : {},
        },
        method : method,
        param : {
            title : 'optional',
            invoice_id : 0,
            invoice_type : '增值税普票',
            item_type : '广告费',
            amount: 9999999999,
        },
        description : 'should show invoice too large.',
    });
}

