/*
 * @file  ads_idea_create.test.js
 * @description add ads_idea basic information API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_idea_create.test';
var PATH = '/v1/ad/idea/create';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');
var ERRCODE = require('../../common/errCode');

var wantedModel = {
    code : 0,
    message : '',
    data : {
        idea_id : 0,
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should create ads idea on' + PATH;
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
            idea_name : mUtils.createRandomTestName(),
            idea_slots : [],
            idea_type : '文字',
            landing_page : 'http://www.google.cn/',
            adview_type : 'WEB',
            assets : {},
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
            unit_id : 0,
            idea_name : mUtils.createRandomTestName(),
            idea_slots : [{type : '忽略',},],
            idea_type : '错误类型',
            landing_page : 'http://www.google.cn/',
            adview_type : 'WEB',
            assets : {},
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
            unit_id : 0,
            idea_name : mUtils.createRandomTestName(),
            idea_slots : [],
            idea_type : '文字',
            landing_page : 'http://www.google.cn/',
            adview_type : 'WEB',
            assets : {},
        },
        description : 'should show db duplicated error.',
    });
}