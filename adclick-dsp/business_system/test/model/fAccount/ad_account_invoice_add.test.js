/*
 * @file  ad_account_invoice_add.test.js
 * @description ad account invoice to add basic information view API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ad_account_invoice_add.test';
var PATH = '/v3/settings/finance/invoice-info/add';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
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

var wantedModel = {
    code : 0,
    message : '',
    data : {
        user_id : 0,
        id: '',
        audit_status : 0
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;
var description = 'should add ad account invoice info on' + PATH;
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