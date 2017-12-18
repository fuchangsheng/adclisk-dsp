/*
 * @file  ad_account_operator_add.test.js
 * @description ad account operator to add API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ad_account_operator_add.test';
var PATH = '/v1/user/operator/add';

//common constants
var TESTCONSTANTS = require('../../common/constants');
//common
var mUtils = require('../../common/utils');

var TestModel = require('../TestModel');

var wantedModel = {
    code : 0,
    message : '',
    data : {
        oper_id: '',
        audit_status : ''
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;
var description = 'should show ad account contant info list on' + PATH;
if(method === TESTCONSTANTS.HTTP_REQUEST_METHOD.GET) {
    description += ' GET';
} else if(method === TESTCONSTANTS.HTTP_REQUEST_METHOD.POST) {
    description += ' POST';
} else {
    description += ' UNUSED';
}

module.exports.create = function(){
    return new TestModel({
        modelName : MODULENAME,
        path : PATH,
        wantedModel : wantedModel,
        method : method,
        param : {
            name : mUtils.createRandomTestName(),
            password : 'AD#click123',
            email : 'a@a.com',
            mobile : '13000000000',
            edit_role : '管理员',
        },
        description : description,
    });
}