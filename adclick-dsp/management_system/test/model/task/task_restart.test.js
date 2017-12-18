/*
 * @file  task_restart.test.js
 * @description test interface of task restart
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.03.02
 * @version 1.2.0 
 */
'use strict';
var MODULENAME = 'task_restart.test';
var PATH = '/v1/task/restart';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    id : 1,
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        id : 2,
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

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