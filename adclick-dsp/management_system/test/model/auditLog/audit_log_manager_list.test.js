/*
 * @file audit_log_manager_list.test.js
 * @description test interface of audit_log_manager_list
 * @copyright dmtec.cn reserved, 2017
 * @author tahitian
 * @date 2017.1.17
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'audit_log_manager_list.test';
var PATH = '/v1/auditlog/manager/list';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    index : 0,
    count : 10,
    start_time : '2016-1-1 00:00:00',
    end_time : '2017-12-30 00:00:00',
    sort : '创建时间增序'
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        total : 0,
        size : 0,
        list : [
            {
                id : '',
                mgr_id : '',
                // mgr_name : '',
                role : '',
                content : '',
                create_time : '',
            }
        ]
    },
 };

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should show the manager list. ' + PATH;
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