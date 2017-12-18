/*
 * @file  ads_target_template_view.test.js
 * @description add ads_target_template_view basic information API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.03.01
 * @version 1.2.0 
 */
'use strict';
var MODULENAME = 'ads_target_template_view.test';
var PATH = '/v1/ad/target/template/view';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');
var ERRCODE = require('../../common/errCode');

var param = {
    template_id : 0,
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        size : 0,
        list : [{
            type : '',
            content : '',
            status : '',
        }],
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should del ads target template on' + PATH;
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
            template_id : {},
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
            template_id : 0,
        },
        description : 'should show db no match data error.',
    });
}