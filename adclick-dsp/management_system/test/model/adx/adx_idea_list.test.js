/*
 * @file  adx_idea_list.test.js
 * @description test interface of adx_idea_list
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.14
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'adx_idea_list.test';
var PATH = '/v1/adx/idea/list';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    adx_id : 1,
    index : 0, 
    count : 10
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        total : 0,
        size : 0,
        list : [{
            id : 0,
            idea_name : '',
            unit_name : '',
            plan_name : '',
            user_name : '',
            adx_idea_id : '',
            signature : '',
            audit_status : '',
            failure_message : '',
        },],
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should show the adx idea list. ' + PATH;
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