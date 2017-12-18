/*
 * @file  ads_unit_view.test.js
 * @description ads unit to show basic information view API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_unit_view.test';
var PATH = '/v1/ad/unit/view';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var ERRCODE = require('../../common/errCode');

var param = {
    unit_id : 0,
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        plan_id : 0,
        plan_name : '',
        unit_id : 0,
        unit_name : '',
        bid : '',
        bid_type : '',
        unit_status : '',
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should show ads unit info view on' + PATH;
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
            unit_id : {},
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
            unit_id : 0,
        },
        description : 'should show db no match data error.',
    });
}