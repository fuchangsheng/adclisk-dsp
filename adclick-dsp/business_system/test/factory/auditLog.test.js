/*
 * @file auditLog.test.js
 * @description auditLog basic information to test API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.27
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'auditLog.test';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);

//model
var operator_list = require('../model/auditLog/audit_log_operator_list.test').create();

var msg;

msg = 'to test interfaces of auditLog module.';
mLogger.debug('try '+msg);

describe('audiLog', function(){
    it(operator_list.description, function(done){
        operator_list.test({}, function(data){
            done();
        });
    });
});
