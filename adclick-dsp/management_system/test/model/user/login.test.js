/*
 * @file login.test.js
 * @description test interface of login
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.29
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'login.test';
var PATH = '/v1/mgr/login';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    name : '',
    password : '',
    token : '',
    code : ''
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        auth : {
            mgr_id: 0,
            mgr_name: '',
            role: 0,
        }
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should login. ' + PATH;
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