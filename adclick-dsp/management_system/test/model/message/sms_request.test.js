/*
 * @file sms_request.test.js
 * @description test interface of sms_request
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.28
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'sms_request.test';
var PATH = '/v1/sms/request';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    mobile : '',
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        mobile : '',
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should request the sms code.' + PATH;
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