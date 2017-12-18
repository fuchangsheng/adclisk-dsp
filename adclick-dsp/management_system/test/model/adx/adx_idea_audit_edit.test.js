/*
 * @file  adx_idea_audit_edit.test.js
 * @description test interface of adx_idea_audit_edit
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.03.01
 * @version 1.2.0 
 */
'use strict';
var MODULENAME = 'adx_idea_audit_edit.test';
var PATH = '/v1/adx/idea/audit/edit';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    id : 1,
    adx_idea_id : 'abcd',
    audit_status : '审核失败',
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        id : 1,
    },
 };

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should edit adx the audit_status. ' + PATH;
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