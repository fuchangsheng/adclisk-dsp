/*
 * @file wechat_pay_query.test.js
 * @description test interface of wechat_pay_query
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.28
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'wechat_pay_query.test';
var PATH = '/v1/pay/wechat/query';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    id : ''
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        id : '',
        account_type : 0,
        oper_id : '',
        amount : '',
        charge_type : 0,
        charge_status : 0,
        redirect : false,
        // html : ''
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should query the status of wechat pay. ' + PATH;
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