/*
 * @file  ad_account_user_info.test.js
 * @description ad account info API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ad_account_user_info.test';
var PATH = '/v1/user/info';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');

var param = {
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        user_id : 0,
        user_name: '0',
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;
var description = 'should show ad account user info list on' + PATH;
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