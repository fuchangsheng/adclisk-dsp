/*
 * @file aduser_account_contact_info_view.test.js
 * @description test interface of aduser_account_contact_info_view
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.15
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'aduser_account_contact_info_view.test';
var PATH = '/v1/aduser/contact/view';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    user_id : 0,
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        contacts_name : '',
        contacts_mobile : '',
        contacts_email : '',
    },
 };

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should show the user contact information. ' + PATH;
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