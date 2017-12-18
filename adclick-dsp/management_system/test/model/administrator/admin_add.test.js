/*
 * @file admin_add.test.js
 * @description test interface of admin_add
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.17
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'admin_add.test';
var PATH = '/v1/admin/add';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var wantedModel = {
    code : 0,
    message : '',
    data : {
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should add administrator. ' + PATH;
if(method === TESTCONSTANTS.HTTP_REQUEST_METHOD.GET) {
    description += ' GET';
} else if(method === TESTCONSTANTS.HTTP_REQUEST_METHOD.POST) {
    description += ' POST';
} else {
    description += ' UNUSED';
}

module.exports.create = function(){
    return new TestModel({
        modelName : MODULENAME,
        path : PATH,
        wantedModel : wantedModel,
        method : method,
        param : {
        name : mUtils.createRandomTestName(null, 8),
            // name : '5b3913c2',
            password : 'AD#'+mUtils.createRandomTestName(null, 8),
            phone : mUtils.createRandomPhoneNum(),
            email : mUtils.createRandomEmail(),
            role : 1,
        },
        description : description,
    });
}