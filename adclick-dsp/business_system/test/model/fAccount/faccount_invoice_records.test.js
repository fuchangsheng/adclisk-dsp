/*
 * @file  faccount_invoice_records.test.js
 * @description ad financial invoice records to test API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.08
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'faccount_invoice_records.test';
var PATH = '/v3/settings/finance/invoice-info/list';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');

var param = {
    index : 0,
    count : 10,
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        size : 0,
        list : [
            {
                date : '',
                title : '',
                amount : '',
                item : '',
                status : '',
                notes : '',
                operator : '',
            },
        ],
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should show ad financial invoice records info on' + PATH;
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