/*
 * @file user.test.js
 * @description test the interfaces of user model
 * @copyright dmtec.cn reserved, 2017
 * @author tahitian
 * @date 2017.1.18
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'user.test';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mUtils = require('../common/utils');

// constants
var testConstants = require('../common/constants');

//model
var captcha_request = require('../model/user/captcha_request.test').create();
var captcha_img = require('../model/user/captcha_request_img.test').create();
var captcha_verify = require('../model/user/captcha_verify.test').create();
var login = require('../model/user/login.test').create();
var logout = require('../model/user/logout.test').create();

// functions 
var get_capcode = require('../functions/user_func').get_capcode;
var admin_add = require('../functions/user_func').admin_add;
var admin_del = require('../functions/user_func').admin_del;

var msg;

msg = 'to test interfaces of user module.';
mLogger.debug('try '+msg);

// var mgr_id = testConstants.MGR_ID;

var get_img = function(cb1){
    var token;
    captcha_img.test({}, [
        function(cb2){
            captcha_request.test({}, function(data){
                captcha_img.param.token = data.data.token;
                token = data.data.token;
                cb2();
            });
        },
        function(data){
            cb1(token);
        }
    ]);
};

var do_login = function(param, cb){
    var captcha_request = require('../model/user/captcha_request.test').create();
    var captcha_img = require('../model/user/captcha_request_img.test').create();
    var captcha_verify = require('../model/user/captcha_verify.test').create();
    var login = require('../model/user/login.test').create();
    var name = Math.random(36).toString().substr(2, 6);
    var password = 'AD#'+Math.random(36).toString().substr(2, 6);
    var mgr_id;
    login.param.name = name;
    login.param.password = password;
    login.test({}, [
        function(cb2){
            admin_add({ name : name, password : password }, function(err, id){
                if(err) cb(err);
                else {
                    mgr_id = id;
                    get_img(function(token){
                        login.param.token = token;
                        get_capcode(token, function(err, code){
                            if(err) cb(err);
                            else {
                                login.param.code = code;
                                cb2();
                            } 
                        });
                    });
                }
            });
        },
        function(data){
            cb(null, mgr_id);
        }
    ]);
}

describe('user module', function(){
    it(captcha_request.description, function(done){
        var captcha_request = require('../model/user/captcha_request.test').create();
        captcha_request.test({}, function(data){
            done();
        });
    });

    it(captcha_img.description, function(done){
        var captcha_request = require('../model/user/captcha_request.test').create();
        var captcha_img = require('../model/user/captcha_request_img.test').create();
        captcha_img.test({}, [
            function(cb){
                captcha_request.test({}, function(data){
                    captcha_img.param.token = data.data.token;
                    cb();
                });
            },
            function(data){
                done();
            }
        ]);
    });

    it(captcha_verify.description, function(done){
        var captcha_request = require('../model/user/captcha_request.test').create();
        var captcha_img = require('../model/user/captcha_request_img.test').create();
        var captcha_verify = require('../model/user/captcha_verify.test').create();
        captcha_verify.test({}, [
            function(cb){
                get_img(function(token){
                    captcha_verify.param.token = token;
                    get_capcode(token, function(err, code){
                        if(err) done(err);
                        else {
                            captcha_verify.param.code = code;
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

    it(login.description, function(done){
        do_login({}, function(err, mgr_id){
            if(err) done(err);
            else{
                admin_del(mgr_id, done);
            }
        });
    });

    it(logout.description, function(done){
        logout.test({}, function(data){
            done();
        });
    });
});