/*
 * @file  ads_unit_edit.test.js
 * @description ads unit to add basic information edit API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_unit_edit.test';
var PATH = '/v1/ad/unit/edit';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');
var ERRCODE = require('../../common/errCode');

var param = {
    unit_id : 0,
    unit_name : mUtils.createRandomTestName(),
    bid : 1,
    bid_type : 'CPM',
    imp : 1,
    click : 1,
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        unit_id : 0
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should edit ads unit info on' + PATH;
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
            plan_id : 0,
            unit_name : mUtils.createRandomTestName(),
            bid : 1,
            bid_type : '错误类型',
            imp : 1,
            click : 1,
        },
        description : 'should show param invalid error.',
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
            plan_id : 0,
            unit_id : 0,
            unit_name : mUtils.createRandomTestName(),
            bid : 1,
            bid_type : 'CPM',
            imp : 1,
            click : 1,
        },
        description : 'should show db no match data error.',
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
            unit_name : mUtils.createRandomTestName(),
            bid : 1,
            bid_type : 'CPM',
            imp : 1,
            click : 1,
        },
        description : 'should show db db dataduplicated error.',
    });
}