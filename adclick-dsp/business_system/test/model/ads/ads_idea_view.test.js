/*
 * @file  ads_idea_view.test.js
 * @description ad idea basic information view API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_idea_view.test';
var PATH = '/v1/ad/idea/view';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var ERRCODE = require('../../common/errCode');

var param = {
    idea_id : 0,
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        plan_id : 0,
        plan_name : '',
        unit_id : 0,
        unit_name : '',
        idea_id : 0,
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
        imp_monitor_urls : [
            '',
        ],
        click_monitor_urls : [
            '',
        ],
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should show ads idea view on' + PATH;
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
           idea_id:'错误类型',
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
           idea_id:1,
        },
        description : 'should show param db no match data error.',
    });
    
}