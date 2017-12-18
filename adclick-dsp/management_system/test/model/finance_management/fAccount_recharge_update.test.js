/*
 * @file fAccount_recharge_update.test.js
 * @description test interface of fAccount_recharge_update
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.16
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'fAccount_recharge_update.test';
var PATH = '/v1/aduser/faccount/recharge/update';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    user_id : 2,
    charge_id : '',
    ticket_no : '',
    status : '充值成功',
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        charge_status : '',
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should update the charge status. ' + PATH;
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