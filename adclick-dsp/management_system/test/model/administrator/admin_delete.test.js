/*
 * @file admin_delete.test.js
 * @description test interface of admin_delete
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.17
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'admin_delete.test';
var PATH = '/v1/admin/delete';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    target_mgr_id : '',
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should delete the administrator account. ' + PATH;
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