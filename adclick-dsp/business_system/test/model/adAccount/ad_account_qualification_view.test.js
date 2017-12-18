/*
 * @file  ad_account_qualification_view.test.js
 * @description ad account operator view API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.07
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ad_account_qualification_view.test';
var PATH = '/v1/user/qualification/view';

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
        categories: 0,
        subcategories : 0,
        qualification : '',
        audit_status : '',
        site_name : '',
        site_url : '',
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;
var description = 'should show ad account qualification info on' + PATH;
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