/*
 * @file adx_config.test.js
 * @description test interface of adx_config
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.18
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'adx_config.test';
var PATH = '/v1/adx/config';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    adx_id : 1,
    dsp_id : '111',
    token : '111',
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should configure the adx information. ' + PATH;
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