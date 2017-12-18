/*
 * @file admin_info.test.js
 * @description test interface of admin_info
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.17
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'admin_info.test';
var PATH = '/v1/admin/info';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    mgr_id : mUtils.createRandomPhoneNum(),
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        name : '',
        role : 0,
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should show the administrator information. ' + PATH;
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