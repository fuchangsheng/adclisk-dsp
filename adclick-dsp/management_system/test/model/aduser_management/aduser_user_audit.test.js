/*
 * @file aduser_user_audit.test.js
 * @description test interface of aduser_user_audit
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.15
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'aduser_user_audit.test';
var PATH = '/v1/aduser/audit';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    user_id : 0,
    audit : '审核通过',
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        audit_status : '',
    },
 };

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should audit the user. ' + PATH;
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