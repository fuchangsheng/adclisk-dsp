/*
 * @file dashboard_overview_all_download.test.js
 * @description test interface of dashboard_overview_all_download
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.18
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'dashboard_overview_all_download.test';
var PATH = '/v1/dashboard/overview/all/download';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param = {
    start_time : '',
    end_time : '',
    unit : '',
    data_type : '',
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        filename : '',
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should download all the dashboard information. ' + PATH;
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