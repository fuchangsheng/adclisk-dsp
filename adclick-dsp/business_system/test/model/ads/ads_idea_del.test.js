/*
 * @file  ads_idea_del.test.js
 * @description del ads_idea basic information API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_idea_del.test';
var PATH = '/v1/ad/idea/del';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');

var param = {
    idea_id : 0,
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        idea_id : 0,
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should delete ads idea on' + PATH;
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