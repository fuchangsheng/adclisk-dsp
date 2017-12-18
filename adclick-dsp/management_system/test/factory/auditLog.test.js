/*
 * @file auditLog.test.js
 * @description test the interfaces of auditLog model
 * @copyright dmtec.cn reserved, 2017
 * @author tahitian
 * @date 2017/1/17
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'auditLog.test';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');

// dataModels

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mUtils = require('../common/utils');

//model
var manager_list = require('../model/auditLog/audit_log_manager_list.test').create();

var msg;

msg = 'to test interfaces of auditLog module.';
mLogger.debug('try '+msg);

describe('auditLog module', function(){
    it(manager_list.description, function(done){
        manager_list.test({}, function(data){
            done();
        });
    });
});
