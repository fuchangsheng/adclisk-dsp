/*
 * @file  ad_account_info_view.test.js
 * @description ad account basic information view API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ad_account_info_view.test';
var PATH = '/v1/user/view';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');

var param = {

};

var wantedModel = {
    code: 0,
    message: '',
    data:{
        user_id : 0,
        user_name : '',
        company_name : '',
        company_license : '',
        telephone : '',
        address : '',
        contacts_name : '',
        contacts_mobile : '',
        contacts_email : '',
        rbalance : 1,
        vbalance : 1,
        user_audit_status : '',
        categories : 1,
        subcategories : 1,
        qualification : '',
        categories_audit_status : '',
        site_name : '',
        site_url : '',
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;
var description = 'should show ad account info on' + PATH;
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