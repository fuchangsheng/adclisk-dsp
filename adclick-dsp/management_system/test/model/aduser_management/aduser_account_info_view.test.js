/*
 * @file aduser_account_info_view.test.js
 * @description test interface of aduser_account_info_view
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.15
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'aduser_account_info_view.test';
var PATH = '/v1/aduser/view';

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
        user_name : '',
        company_name : '',
        company_license : '',
        telephone : '',
        address : '',
        contacts_name : '',
        contacts_mobile : '',
        contacts_email : '',
        rbalance : 0,
        vbalance : 0,
        user_audit_status : '',
        categories : 0,
        subcategories : 0,
        qualification : '',
        categories_audit_status : '',
    },
 };

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should show the user information. ' + PATH;
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