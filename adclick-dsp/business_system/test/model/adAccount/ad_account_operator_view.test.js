/*
 * @file  ad_account_operator_view.test.js
 * @description ad account operator to del API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ad_account_operator_view.test';
var PATH = '/v1/user/operator/view';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');

var param = {
    target_oper_id : '',
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        oper_id : '',
        user_id : 1,
        name : '',
        email : '',
        mobile : '',
        role : '',
        audit_status : '',
        portrait : ''
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;
var description = 'should show ad account contant info view on' + PATH;
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