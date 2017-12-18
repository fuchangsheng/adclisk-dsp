/*
 * @file  ad_account_invoice_list.test.js
 * @description ad account invoice basic information view API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.11.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ad_account_invoice_list.test';
var PATH = '/v3/settings/finance/invoice-info/list';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');

var param = {    
    index : 0,
    count : 10
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        size : 0,
        list : [
            {
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
                type : '',
                audit_status : 0,
                create_time : '',
                update_time : '',
            },
        ],
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;
var description = 'should show ad account contant info list on' + PATH;
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