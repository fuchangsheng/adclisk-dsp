/*
 * @file msg_receiver_add.test.js
 * @description test interface of msg_receiver_add
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.18
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'msg_receiver_add.test';
var PATH = '/v1/message/receivers/add';

//common constants
var TESTCONSTANTS = require('../../common/constants');

var TestModel = require('../TestModel');
var mUtils = require('../../common/utils');

var param;

var wantedModel = {
    code : 0,
    message : '',
    data : {
        id : '',
        status : '',
    },
};

var method = TESTCONSTANTS.HTTP_REQUEST_METHOD.POST;

var description = 'should add the message receiver. ' + PATH;
if(method === TESTCONSTANTS.HTTP_REQUEST_METHOD.GET) {
    description += ' GET';
} else if(method === TESTCONSTANTS.HTTP_REQUEST_METHOD.POST) {
    description += ' POST';
} else {
    description += ' UNUSED';
}

module.exports.create = function(){
    return new TestModel({
        modelName : MODULENAME,
        path : PATH,
        wantedModel : wantedModel,
        method : method,
        param : param || {
            type : '邮件',
            receiver : mUtils.createRandomEmail(),
        },
        description : description,
    });
}