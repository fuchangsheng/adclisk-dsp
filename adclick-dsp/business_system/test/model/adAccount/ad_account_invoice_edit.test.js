/*
 * @file  ad_account_invoice_edit.test.js
 * @description ad account invoice to edit API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ad_account_invoice_edit.test';
var PATH = '/v1/user/invoice/edit';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');

var param = {
    id : '',
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
    type : '增值税普票',
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        user_id : 0,
        id : ''
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;
var description = 'should update ad account invoice info on' + PATH;
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