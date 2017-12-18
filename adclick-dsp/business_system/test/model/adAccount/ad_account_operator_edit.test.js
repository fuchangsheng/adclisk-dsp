/*
 * @file  ad_account_operator_edit.test.js
 * @description ad account operator to edit API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ad_account_operator_edit.test';
var PATH = '/v1/user/operator/edit';

// utils
var mUtils = require('../../common/utils');

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');

var param = {
    target_oper_id : '',
    email : 'a@a.com',
    mobile : '13000000000',
    edit_role : '操作员',
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        oper_id: '',
        audit_status : ''
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;
var description = 'should edit ad account operator info on' + PATH;
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