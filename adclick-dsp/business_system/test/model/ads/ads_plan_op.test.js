/*
 * @file  ads_plan_op.test.js
 * @description ads plan to switch basic information view API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_plan_op.test';
var PATH = '/v1/ad/plan/op';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var ERRCODE = require('../../common/errCode');

var param = {
    plan_id : 0,
    action : '启动',
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        plan_id: 0,
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should swtich ads plan info on' + PATH;
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
            action : '启动中',
        },
        description : 'should show param invalid error.',
    });
}

module.exports.createBudgetOver = function(){
    return new TestModel({
        modelName : MODULENAME,
        path : PATH,
        wantedModel : {
            code : ERRCODE.BUDGET_OVERFLOW,
            message : '',
            data : {},
        },
        method : method,
        param : {
            plan_id : 0,
            action : '启动',
        },
        description : 'should show budget is more than balance error.',
    });
}