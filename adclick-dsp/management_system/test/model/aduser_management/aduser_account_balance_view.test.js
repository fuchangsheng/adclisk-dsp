/*
 * @file  ad_account_balance_view.test.js
 * @description to test the interface of ad_account_balance_view.js
 * @copyright dmtec.cn reserved, 2017
 * @author tahitian
 * @date 2017.1.17
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ad_account_balance_view.test';
var PATH = '/v1/faccount/balance';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    user_id : 0
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        user_id : 0,
        balance : ''
    },
 };

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should show the balance. ' + PATH;
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