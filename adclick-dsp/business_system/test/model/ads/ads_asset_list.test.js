/*
 * @file  ads_asset_list.test.js
 * @description ad asset basic information list API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.03.01
 * @version 1.2.0 
 */
'use strict';
var MODULENAME = 'ads_asset_list.test';
var PATH = '/v1/ad/asset/list';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');

var param = {
    asset_type : '图片',
    width : 300,
    height : 250,
    index : 0,
    count : 10,
    sort : '更新时间减序'
};

var wantedModel = {
    code : 0,
    message : '',
    data : {
        total : 1,
        size : 2,
        list : [
            {
                asset_id : 3,
                asset_name : '',
                url : '',
                thumbnail : '',
                width : 4,
                height : 5,
                update_time : '',
            },
        ],
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.GET;

var description = 'should show ads idea list on' + PATH;
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