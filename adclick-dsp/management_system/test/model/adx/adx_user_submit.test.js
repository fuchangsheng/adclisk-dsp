/*
 * @file adx_user_submit.test.js
 * @description test interface of adx_user_submit
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.18
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'adx_user_submit.test';
var PATH = '/v1/adx/user/submit';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    id : 0,
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should submit user to adx.' + PATH;
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