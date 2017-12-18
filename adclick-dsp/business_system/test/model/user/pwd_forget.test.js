/*
 * @file pwd_forget.test.js
 * @description test interface of pwd_forget
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.29
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'pwd_forget.test';
var PATH = '/v1/user/password/forget';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    name : '',
    password : '',
    mobile : '',
    smscode : '',
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        mobile : ''
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should deal with password forgetted. ' + PATH;
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