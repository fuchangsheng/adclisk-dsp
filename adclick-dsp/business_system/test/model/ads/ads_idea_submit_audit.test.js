/*
 * @file  ads_idea_submit_audit.test.js
 * @description ads_idea_submit_audit basic information API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2017.1.4
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_idea_submit_audit.test';
var PATH = '/v1/ad/idea/submit/audit';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    ideas : [{
        idea_id : 0,
        unit_id : 0,
        plan_id : 0,
    }]
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        audit_status : '',
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should submit the idea to be auditted.' + PATH;
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