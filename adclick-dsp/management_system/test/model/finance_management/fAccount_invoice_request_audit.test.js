/*
 * @file fAccount_invoice_request_audit.test.js
 * @description test interface of fAccount_invoice_request_audit
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.16
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'fAccount_invoice_request_audit.test';
var PATH = '/v1/aduser/faccount/invoice/audit';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    ticket_id : [''],
    audit : '审核通过',
    // message : 'too young, too simple, sometimes naive!',
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        updateIds : [{
            id : '',
            invoice_status : 0,
            user_id : 0,
            amount : 0
        }],
        status : '',
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should audit the invoice request. ' + PATH;
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