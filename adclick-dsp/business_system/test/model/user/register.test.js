/*
 * @file register.test.js
 * @description test interface of register
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.28
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'register.test';
var PATH = '/v1/user/register';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    name : mUtils.createRandomTestName(null, 4),
    company_name : mUtils.createRandomTestName(null, 4),
    password : 'AD#123'+mUtils.createRandomTestName(null, 4),
    mobile : '',
    smscode : ''
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        user_id : 0
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should register. ' + PATH;
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