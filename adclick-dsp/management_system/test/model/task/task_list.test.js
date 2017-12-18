/*
 * @file  task_list.test.js
 * @description test interface of task list
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.03.02
 * @version 1.2.0 
 */
'use strict';
var MODULENAME = 'task_list.test';
var PATH = '/v1/task/list';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    start_time : '2016-01-02 14:00:00', 
    end_time : '2017-03-02 14:00:00',
    status : '失败',
    index : 0,
    count : 20,
    sort : 'job_id',
    order : '逆序',
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        total : 0,
        size : 0,
        list : [{
            id : 0,
            task_type : '',
            process_time : '',
            status : '',
            job_id : '',
            retry_times : 1,
            create_time : '',
            update_time : '', 
        },],
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should show the adx idea list. ' + PATH;
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