/*
 * @file dashboard_realtime_all.test.js
 * @description test interface of dashboard_realtime_all
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.18
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'dashboard_realtime_all.test';
var PATH = '/v1/dashboard/realtime/all';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    index : 0,
    count : 10,
    start_time : '',
    end_time : '',
    unit : '小时',
    data_type : '展现,点击',
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        total : 0,
        size : 0,
        list : [{
            date_time : '',
            imp : 0,
            click : 0
        },],
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should show all the realtime dashboard information. ' + PATH;
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