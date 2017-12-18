/*
 * @file  message.test.js
 * @description test the interfaces of message model
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.18
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

// constants
var testConstants = require('../common/constants');

//model
var msg_list = require('../model/message/internal_message_list.test').create();
var unread_num = require('../model/message/msg_unread_num.test').create();
var mark_read = require('../model/message/mark_read.test').create();

var receiver_add = require('../model/message/msg_receiver_add.test').create();
var receiver_del = require('../model/message/msg_receiver_del.test').create();
var receiver_list = require('../model/message/msg_receivers_list.test').create();
// var email_verify = require('../model/message/email_receiver_verify.test').create();
var sms_receiver_verify = require('../model/message/sms_receiver_verify.test').create();
var sms_request = require('../model/message/sms_request.test').create();
var sms_verify = require('../model/message/sms_verify.test').create();

// functions 
var msg_add = require('../functions/message_func').msg_add;
var msg_del = require('../functions/message_func').msg_del;
var get_smscode = require('../functions/message_func').get_smscode;

var msg;

msg = 'to test interfaces of message module.';
mLogger.debug('try '+msg);

var mgr_id = testConstants.MGR_ID;

describe('message module', function(){
    describe('receiver part', function(){
        this.timeout(5000);

        var email_receiver = {
            type : '邮件',
            receiver : mUtils.createRandomEmail(),
        };

        var phone_receiver = {
            type : '手机短信',
            receiver : mUtils.createRandomPhoneNum(),
        };

        it(receiver_list.description, function(done){
            receiver_list.test({}, function(data){
                done();
            });
        });

        it(receiver_add.description, function(done){
            var receiver_add = require('../model/message/msg_receiver_add.test').create();
            var receiver_del = require('../model/message/msg_receiver_del.test').create();
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

        it(sms_receiver_verify.description, function(done){
            var receiver_add = require('../model/message/msg_receiver_add.test').create();
            var receiver_del = require('../model/message/msg_receiver_del.test').create();
            receiver_add.param = phone_receiver;
            sms_receiver_verify.test({}, [
                function(cb){
                    receiver_add.test({}, function(data){
                        receiver_del.param.id = data.data.id;
                        sms_receiver_verify.param.id = data.data.id;
                        get_smscode(phone_receiver.receiver, function(err, smscode){
                            if(err) done(err);
                            else {
                                sms_receiver_verify.param.smscode = smscode;
                                cb();
                            }
                        });
                    });
                },
                function(data){
                    receiver_del.test({}, function(data){
                        done();
                    });
                }
            ]);
        });

        // the two interfaces followed are not routed

        it(sms_request.description, function(done){
            sms_request.param.mobile = mUtils.createRandomPhoneNum();
            sms_request.test({}, function(data){
                done();
            });
        });

        it(sms_verify.description, function(done){
            var mobile = mUtils.createRandomPhoneNum();
            sms_verify.test({}, [
                function(cb){
                    sms_request.param.mobile = mobile;
                    sms_request.test({}, function(data){
                        get_smscode(mobile, function(err, smscode){
                            if(err) done(err);
                            else{
                                sms_verify.mobile = mobile;
                                sms_verify.smscode = smscode;
                                cb();
                            }
                        });
                    });
                },
                function(data){
                    done();
                }
            ]);
        });
    });

    describe('message part', function(){
        var msg_id, notify_id;

        before(function(done){
            msg_add({ mgr_id : 11111 }, function(err, param){
                done(err);
                msg_id = param.msg_id;
                notify_id = param.notify_id;
            });
        });

        after(function(done){
            msg_del({ msg_id : msg_id, notify_id : notify_id }, done);
        });

        it(msg_list.description, function(done){
            msg_list.test({}, function(data){
                done();
            });
        });

        it(unread_num.description, function(done){
            unread_num.test({}, function(data){
                done();
            });
        });

        it(mark_read.description, function(done){
            mark_read.msg_id = msg_id;
            mark_read.test({}, function(data){
                done();
            });
        });
    });
});
