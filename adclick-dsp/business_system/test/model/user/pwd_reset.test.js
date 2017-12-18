/*
 * @file pwd_reset.test.js
 * @description test interface of pwd_reset
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.29
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'pwd_reset.test';
var PATH = '/v1/user/password/reset';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    name : '',
    password : '',
    oldpassword : ''
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        name : ''
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should reset the password. ' + PATH;
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