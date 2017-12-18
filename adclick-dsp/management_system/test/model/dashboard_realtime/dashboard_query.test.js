/*
 * @file dashboard_query.test.js
 * @description test interface of dashboard_query
 * @copyright dmtec.cn reserved, 2017
 * @author tahitian
 * @date 2017.1.18
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'dashboard_query.test';
var PATH = '/v1/dashboard/query';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    prefix : 'cloud_dsp',
    name : 'click'
};

var wantedModel = {
    code : 0,
    message : '',
    data : '',
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should query for the dashboard information. ' + PATH;
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