/*
 * @file ads_idea_list.test.js
 * @description test interface of ads_idea_list
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.16
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_idea_list.test';
var PATH = '/v1/aduser/ads/idea/list';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    user_id : TESTCONSTANTS.USER_ID,
    plan_id : 0,
    unit_id : 0,
    index : 0,
    count : 10,
    sort : '创建时间增序',
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        total : 0,
        size : 0,
        list : [{
            plan_id : 0,
            unit_id : 0,
            // total : 0,
            idea_id : 0,
            idea_name : '',
            // bid : 0,
            idea_slots : [{
                type : '',
            }],
            idea_type : '',
            landing_page : '',
            assets : {},
            adview_type : '',
            idea_trade : '',
            idea_status : '',
            audit_status : '',
            failure_message : '',
            // imp_monitor_urls : [''],
            // click_monitor_urls : [''],
            update_time : '',
        }],
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should show the idea list. ' + PATH;
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