/*
 * @file captcha_request.test.js
 * @description test interface of captcha_request
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.28
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'captcha_request.test';
var PATH = '/v1/captha/request';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        token : ''
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should request for captcha. ' + PATH;
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