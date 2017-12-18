/*
 * @file  ads_idea_edit.test.js
 * @description ad account contactor basic information view API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_idea_edit.test';
var PATH = '/v1/ad/idea/edit';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');
var ERRCODE = require('../../common/errCode');

var param = {
    idea_id : 0,
    idea_name : mUtils.createRandomTestName(),
    idea_slots : [],
    idea_type : '文字',
    landing_page : 'www.dmtec.cn',
    assets : {},
    adview_type : 'WEB',
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should update ads idea on' + PATH;
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
            idea_id : 0,
            idea_name : mUtils.createRandomTestName(),
            idea_slots : [],
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
            idea_id : 0,
            idea_name : mUtils.createRandomTestName(),
            idea_slots : [],
            idea_type : '文字',
            landing_page : 'http://www.google.cn/',
            adview_type : 'WEB',
            assets : {},
        },
        description : 'should show param duplicated error.',
    });
}

module.exports.createDbNoMatchData = function(){
    return new TestModel({
        modelName : MODULENAME,
        path : PATH,
        wantedModel : {
            code : ERRCODE.DB_NO_MATCH_DATA,
            message : '',
            data : {},
        },
        method : method,
        param : {
            idea_id : 1,
            idea_name : mUtils.createRandomTestName(),
            idea_slots : [],
            idea_type : '文字',
            landing_page : 'http://www.google.cn/',
            adview_type : 'WEB',
            assets : {},
        },
        description : 'should show param no_match_data error.',
    });
}