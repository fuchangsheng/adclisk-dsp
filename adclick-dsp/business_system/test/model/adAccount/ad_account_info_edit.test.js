/*
 * @file  ad_account_info_edit.test.js
 * @description ad account basic information edit API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ad_account_info_edit.test';
var PATH = '/v1/user/edit';

//common constants
var TESTCONSTANTS = require('../../common/constants');

// utils
var mUtils = require('../../common/utils');

var TestModel = require('../TestModel');

var param = {
    user_name : 'yellow',
    company_name : 'submarine',
    address : 'landon',
    telephone : '02168580710',
    contacts_name : 'trump',
    contacts_mobile : '13000000000',
    contacts_email : 'a@a.com',
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        user_id : 0
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;
var description = 'should update ad account info on' + PATH;
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