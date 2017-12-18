/*
 * @file  dashboard_idea_summary.test.js
 * @description dashboard summary for top view to test API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.08
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'dashboard_top_plans.test';
var PATH = '/v1/dashboard/plan/top';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');

var param = {
    start_time : '',
    end_time : '',
    data_type : '展现,点击,点击率',
    top : 5,
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        imp : [
            {
                plan_name : '',
                plan_id : 0,
                imp_total : 0,
            },
        ],
        click : [
            {
                plan_name : '',
                plan_id : 0,
                click_total : 0,
            },
        ],
        click_rate : [
            {
                plan_name : '',
                plan_id : 0,
                click_rate : 0,
            },
        ],
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should show dashboard summary for top on' + PATH;
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