/*
 * @file  ads_target_template_create.test.js
 * @description add ads_target_template_create basic information API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.03.01
 * @version 1.2.0 
 */
'use strict';
var MODULENAME = 'ads_target_template_create.test';
var PATH = '/v1/ad/target/template/create';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');
var ERRCODE = require('../../common/errCode');

var wantedModel = {
    code : 0,
    message : '',
    data : {
        template_id : 0,
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should create ads target template on' + PATH;
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
            unit_id : 0,
            template_name : mUtils.createRandomTestName(),
            targets : [
                {
                    type : 'adx',
                    content : 'BES',
                    status : '启用',
                },
            ],
            tag : mUtils.createRandomTestName(),
        },
        description : description,
    });
}

module.exports.createParamInvalid = function(){
    return new TestModel({
        modelName : MODULENAME,
        path : PATH,
        wantedModel : {
            code : ERRCODE.PARAM_INVALID,
            message : '',
            data : {},
        },
        method : method,
        param : {
            template_name : mUtils.createRandomTestName(),
            targets : [
                {
                    type : 'adx',
                    content : 'BES',
                    status : '启用',
                },
            ],
            tag : {},
        },
        description : 'should show param invalid error.',
    });
}

module.exports.createDataDuplicated = function(){
    return new TestModel({
        modelName : MODULENAME,
        path : PATH,
        wantedModel : {
            code : ERRCODE.DB_DATADUPLICATED,
            message : '',
            data : {},
        },
        method : method,
        param : {
            template_name : mUtils.createRandomTestName(),
            targets : [
                {
                    type : 'adx',
                    content : 'BES',
                    status : '启用',
                },
            ],
            tag : mUtils.createRandomTestName(),
        },
        description : 'should show db db dataduplicated error.',
    });
}