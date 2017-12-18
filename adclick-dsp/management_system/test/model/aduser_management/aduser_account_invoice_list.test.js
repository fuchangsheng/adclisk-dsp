/*
 * @file aduser_account_invoice_list.test.js
 * @description test interface of aduser_account_invoice_list
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.15
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'aduser_account_invoice_list.test';
var PATH = '/v1/aduser/invoice/list';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    user_id : 0,
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        total : 0,
        size : 0,
        list : [{
            id : '',
            title : '',
            tax_no : '',
            address : '',
            phone : '',
            bank : '',
            bank_account_no : '',
            receiver_name : '',
            receiver_address : '',
            receiver_email : '',
            receiver_mobile : '',
            qualification : '',
            audit_status : 0,
            type : '',
        },]
    },
 };

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should show the invoice list of user. ' + PATH;
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