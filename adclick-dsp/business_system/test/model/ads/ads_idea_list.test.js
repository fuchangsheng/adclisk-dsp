/*
 * @file  ads_idea_list.test.js
 * @description ad idea basic information list API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_idea_list.test';
var PATH = '/v1/ad/idea/list';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var ERRCODE = require('../../common/errCode');

var param = {
    index : 0,
    count : 10,
    sort : '创建时间增序'
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        size : 0,
        list : [
            {
                plan_id : 0,
                unit_id : 0,
                // total : 0,
                idea_id : 0,
                plan_name : '',
                unit_name : '',
                idea_name : '',
                idea_slots : [
                    {
                        type : '',
                    },
                ],
                idea_type : '',
                landing_page : '',
                assets : {},
                adview_type : '',
                idea_trade : '',
                idea_status : '',
                update_time : '',
            },
        ],
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should show ads idea list on' + PATH;
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

module.exports.createParamInvaild = function(){
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
            count : 10,
            sort : '错误类型'
        },
        description : 'should show param invalid error.',
    });
}