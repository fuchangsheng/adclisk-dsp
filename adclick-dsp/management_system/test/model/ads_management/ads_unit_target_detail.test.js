/*
 * @file ads_unit_target_detail.test.js
 * @description test interface of ads_unit_target_detail
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.16
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_unit_target_detail.test';
var PATH = '/v1/aduser/ads/unit/target/details';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    user_id : TESTCONSTANTS.USER_ID,
    unit_id : 0,
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        size : 0,
        list : [{
            unit_id : 0,
            type : '',
            content : '',
            status : '',
        },],
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should show the unit target detail. ' + PATH;
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