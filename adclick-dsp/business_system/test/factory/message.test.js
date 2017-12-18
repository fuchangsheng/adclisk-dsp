/*
 * @file message.test.js
 * @description message basic information to test API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.28
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'message.test';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mUtils = require('../common/utils');
var mDataHelper = require('../../../utils/data_helper');

// dataModels
var mMsgListModel = require('../../model/msg_list').create();
var mMsgNotifyLogModel = require('../../model/msg_notify_log').create();

// constants
var testConstants = require('../common/constants');

//model
var receiver_add = require('../model/message/msg_receiver_add.test').create();
var receiver_del = require('../model/message/msg_receiver_del.test').create();
var receivers_list = require('../model/message/msg_receivers_list.test').create();

var setting_edit = require('../model/message/msg_setting_edit.test').create();
var setting_view = require('../model/message/msg_setting_view.test').create();
var msg_list = require('../model/message/internal_message_list.test').create();
var mark_read = require('../model/message/mark_read.test').create();
var unread_num = require('../model/message/msg_unread_num.test').create();

var insertIntoMsgList = require('../ui_test/scripts/internal_msg_test_data.script');

var msg;
msg = 'to test interfaces of message module.';
mLogger.debug('try '+msg);

var add_msg = require('../functions/message_func').add_msg;
var del_msg = require('../functions/message_func').del_msg;

var user_id = testConstants.USER_ID;
var oper_id = testConstants.OPER_ID;

describe('message module', function(){
    describe('receiver part', function(){
        it(receiver_add.description, function(done){
            var receiver_add = require('../model/message/msg_receiver_add.test').create();
            var receiver_del = require('../model/message/msg_receiver_del.test').create();
            this.timeout(5000);

            receiver_add.test({}, function(data){
                receiver_del.param.id = data.data.id;
                receiver_del.test({}, function(data){
                    done();
                });
            });
        });

        it(receiver_del.description, function(done){
            var receiver_add = require('../model/message/msg_receiver_add.test').create();
            var receiver_del = require('../model/message/msg_receiver_del.test').create();
            this.timeout(5000);
            
            receiver_del.test({}, [
                function(cb){
                    receiver_add.test({}, function(data){
                        receiver_del.param.id = data.data.id;
                        cb();
                    });
                }, 
                function(data){
                    done();
                }
            ]);
        });

        it(receivers_list.description, function(done){
            receivers_list.test({}, function(data){
                done();
            });
        });
    });

    describe('message part', function(){
        var msg_id, notify_id;

        before(function(done){
            add_msg({ user_id : user_id, oper_id : oper_id }, function(err, param){
                if(err) done(err);
                else {
                    msg_id = param.msg_id;
                    notify_id = param.notify_id;
                    done(err);
                }
            });
        });

        after(function(done){
            del_msg({ msg_id : msg_id, notify_id : notify_id }, function(err){
                done(err);
            });
        });

        it(setting_edit.description, function(done){
            setting_edit.test({}, function(data){
                done();
            });
        });

        it(setting_view.description, function(done){
            setting_view.test({}, function(data){
                done();
            });
        });

        it(unread_num.description, function(done){
            unread_num.test({}, function(data){
                done();
            });
        });

        it(msg_list.description, function(done){
            msg_list.test({}, function(data){
                done();
            });
        });

        it(mark_read.description, function(done){
            mark_read.param.msg_id = msg_id;
            mark_read.test({}, function(data){
                done();
            });
        });
    });
});

