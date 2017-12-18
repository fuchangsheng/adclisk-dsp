/*
 * @file  ads_plan_create.test.js
 * @description ads plan to add basic information view API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_plan_create.test';
var PATH = '/v1/ad/plan/create';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');
var ERRCODE = require('../../common/errCode');

var wantedModel = {
    code : 0,
    message : '',
    data : {
        plan_id: 0,
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should add ads plan info on' + PATH;
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
            plan_name : mUtils.createRandomTestName(),
            start_time : '2016-12-1 00:00:00',
            end_time : '2016-12-6 00:00:00',
            budget : 1000,
            plan_cycle : 'abc',
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
            plan_name : mUtils.createRandomTestName(),
            start_time : '2016-12-1 00:00:00',
            end_time : '2016-12-6 00:00:00',
            budget : 1000,
            plan_cycle : 123456,
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
            plan_name : mUtils.createRandomTestName(),
            start_time : '2016-12-1 00:00:00',
            end_time : '2016-12-6 00:00:00',
            budget : 1000,
            plan_cycle : 'abc',
        },
        description : 'should show db duplicated error.',
    });
}