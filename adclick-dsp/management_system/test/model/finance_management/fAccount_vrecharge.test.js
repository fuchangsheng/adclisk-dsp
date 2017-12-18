/*
 * @file fAccount_vrecharge.test.js
 * @description test interface of fAccount_vrecharge
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.16
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'fAccount_vrecharge.test';
var PATH = '/v1/aduser/faccount/vrecharge';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    user_id : 2,
    amount : 1,
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        charge_status : '',
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should recharge to the virtual account. ' + PATH;
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