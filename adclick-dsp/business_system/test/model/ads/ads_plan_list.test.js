/*
 * @file  ads_plan_list.test.js
 * @description ads plan to add basic information list API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_plan_list.test';
var PATH = '/v1/ad/plan/list';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var ERRCODE = require('../../common/errCode');

var param = {
    index : 0,
    count : 100,
    sort : '创建时间增序',
};

var wantedModel = {
    code : 0,
    message : '',
    data :     {
        total : 0,
        size : 0,
        list : [
            {
                plan_id : 0,
                plan_name : '',
                start_time : '',
                end_time : '',
                budget : '',
                plan_status : '',
                plan_cycle : '',
                update_time : '',
            },
        ],
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should show ads plan info list on' + PATH;
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
            index : 0,
            count : 100,
            sort : '创建时序',
        },
        description : 'should show param invalid error.',
    });
}