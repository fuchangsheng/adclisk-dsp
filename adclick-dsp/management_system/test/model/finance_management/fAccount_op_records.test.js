/*
 * @file fAccount_op_records.test.js
 * @description test interface of fAccount_op_records
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.16
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'fAccount_op_records.test';
var PATH = '/v1/aduser/faccount/oprecords';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    user_id : 2,
    type : '现金账户',
    index : 0,
    count : 10,
    sort : '创建时间增序',
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        total : 0,
        size : 0,
        list : [{
            date : '',
            account_type : 0,
            type : 0,
            amount : '',
            charge_type : 0,
            charge_id : '',
            charge_status : 0,
            notes : '',
        },],
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should show the finalcial records of user. ' + PATH;
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