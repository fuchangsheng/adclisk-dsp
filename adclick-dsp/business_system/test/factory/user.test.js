/*
 * @file user.test.js
 * @description user basic information to test API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.28
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
var mDataHelper = require('../../../utils/data_helper');

//dataModels
var mCodeModel = require('../../model/verify_code').create();
var mSmsModel = require('../../model/sms_log').create();
var mAdOperModel = require('../../model/aduser_operators').create();
var mAdUserModel = require('../../model/dsp_aduser').create();
var mAdlibUserModel = require('../../model/adlib_user').create();
var mAdxUserModel = require('../../model/adlib_audit_users').create();

//model
var captcha_request = require('../model/user/captcha_request.test').create();
var captcha_img = require('../model/user/captcha_request_img.test').create();
var captcha_verify = require('../model/user/captcha_verify.test').create();
var sms_request = require('../model/user/sms_request.test').create();
var sms_verify = require('../model/user/sms_verify.test').create();
var register = require('../model/user/register.test').create();
var login = require('../model/user/login.test').create();
var logout = require('../model/user/logout.test').create();
var pwd_forget = require('../model/user/pwd_forget.test').create();
var pwd_reset = require('../model/user/pwd_reset.test').create();

var msg;

msg = 'to test interfaces of user module.';
mLogger.debug('try '+msg);

var getSmsCode = function(mobile, cb){
    var select = {
        smscode: '',
    };
    var match = {
        mobile: mobile,
    };
    var query = {
        select: select,
        match: match,
    };

    mSmsModel.lookup(query, function(err, rows) {
        if (err) throw err;
        if(!rows || rows.length==0) throw 'no record of the mobile number!';
        cb(rows[0].smscode);
    });
};

var getCapCode = function(token, cb){
    var match = {
        code_name: token,
    };
    var select = {
        code_value : 0,
    };
    var query = {
        select: select,
        match: match,
    };
    mCodeModel.lookup(query, function(err, rows){
        if (err) {
            throw err;
        }else{
            if (!rows || rows.length==0) {
                throw 'no such token!';
            }else{
                cb(rows[0].code_value);
            }
        }
    });   
};

var get_img = function(cb1){
    var captcha_request = require('../model/user/captcha_request.test').create();
    var captcha_img = require('../model/user/captcha_request_img.test').create();
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

var get_sms = function(mobile, cb){
    var sms_request = require('../model/user/sms_request.test').create();
    sms_request.param.mobile = mobile;
    sms_request.test({}, function(){
        getSmsCode(mobile, function(data){
            cb(data);
        });
    });
};

var do_remove = function(dataModel, query, cb){
    dataModel.remove(query, function(err, rows){
        if (err) throw err;
        cb();
    });
};

var account_remove = function(user_id, cb){
    var match = {
        user_id : user_id,
    };
    var query = {
        match: match,
    };

    do_remove(mAdxUserModel, query, function(){ 
        do_remove(mAdOperModel, query, function(){ 
            do_remove(mAdUserModel, query, function(){ 
                do_remove(mAdlibUserModel, query, cb);
            });
        });
    });
};

var do_register = function(param, cb1){
    var register = require('../model/user/register.test').create();
    register.param.mobile = param.mobile;
    register.param.name = param.name;
    register.param.password = param.password;
    register.test({}, [
        function(cb2){
            get_sms(param.mobile, function(sms_code){
                register.param.smscode = sms_code;
                cb2();
            });
        },
        cb1
    ]);
};

var do_login = function(cb){
    var login = require('../model/user/login.test').create();
    var token, code, user_id;
    var name  = mUtils.createRandomTestName(null, 4);
    var password = 'AD#123'+mUtils.createRandomTestName(null, 4);
    var mobile = mUtils.createRandomPhoneNum();
    mAsync.waterfall([
        function(next){
            login.test({}, [
                function(cb1){
                    var info = {};
                    info.name = name;
                    info.password = password;
                    info.mobile = mobile;
                    do_register(info, function(data){
                        user_id = data.data.user_id;
                        get_img(function(data2){
                            token = data2;
                            getCapCode(token, function(data3){
                                code = data3;

                                login.param.name = name;
                                login.param.password = password;
                                login.param.token = token;
                                login.param.code = code;
                                cb1();
                            });
                        });
                    });
                },
                function(data){
                    next(null, data);
                }
            ]);
        }
    ], function(err, data){
        if(err){
            if(user_id) account_remove(user_id, function(){ throw err; });
            else throw err;
        }
        else cb(data);
    });
    
};

describe('captcha part', function(){
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
        var token;

        captcha_verify.test({}, [
            function(cb1){
                captcha_img.test({}, [
                    function(cb2){
                        captcha_request.test({}, function(data){
                            captcha_img.param.token = data.data.token;
                            captcha_verify.param.token = data.data.token;
                            token = data.data.token;
                            cb2();
                        });
                    },
                    function(data){
                        getCapCode(token, function(data){
                            captcha_verify.param.code = data;
                            cb1();
                        });
                    }
                ]);
            },
            function(data){
                done();
            }
        ]);
    });
});

describe('sms part', function(){
    it(sms_request.description, function(done){
        var sms_request = require('../model/user/sms_request.test').create();
        var mobile = mUtils.createRandomPhoneNum();
        sms_request.param.mobile = mobile;
        sms_request.test({}, function(data){
            done();
        });
    });

    it(sms_verify.description, function(done){
        var sms_verify = require('../model/user/sms_verify.test').create();
        var mobile = mUtils.createRandomPhoneNum();
        sms_verify.param.mobile = mobile;

        sms_verify.test({}, [
            function(cb){
                get_sms(mobile, function(sms_code){
                    sms_verify.param.smscode = sms_code;
                    cb();
                });
            },
            function(data){
                done();
            }
        ]);
    });
});

describe('login part', function(){
    it(register.description, function(done){
        var name = mUtils.createRandomTestName(null, 4);
        var password = 'AD#123'+mUtils.createRandomTestName(null, 4);
        var mobile = mUtils.createRandomPhoneNum();
        var info = {};
        info.name = name;
        info.password = password;
        info.mobile = mobile;
        do_register(info, function(data){
            account_remove(data.data.user_id, done);
        });
    });

    it(login.description, function(done){
        do_login(function(data){
            account_remove(data.data.auth.user_id, done);
        });
    });

    it(logout.description, function(done){
        var logout = require('../model/user/logout.test').create();
        var user_id;
        mAsync.waterfall([
            function(next){
                logout.test({}, [
                    function(cb){
                        do_login(function(data){
                            user_id = data.data.auth.user_id;
                            logout.oper_id = data.data.auth.oper_id;
                            cb();
                        });
                    },
                    function(data){
                        next(null, data);
                    }
                ]);
            }
        ], function(err, data){
            if(user_id) account_remove(user_id, function(){
                if(err) throw err;
                done();
            });
            else {
                if(err) throw err;
                done();
            }
        });
    });

    // pwd_reset测试用例中的用户配置需要和acl文件中设置的用户配置一致
    
    it(pwd_reset.description, function(done){
        pwd_reset.param.name = 'jiangtu';
        pwd_reset.param.oldpassword = 'ADclick123';
        pwd_reset.param.password = 'ADclick123';

        pwd_reset.test({}, function(data){ done(); });
    });

    it(pwd_forget.description, function(done){
        var user_id;
        var name = mUtils.createRandomTestName(null, 4);
        var password = 'AD#123'+mUtils.createRandomTestName(null, 4);
        var mobile = mUtils.createRandomPhoneNum();
        var info = {};
        info.name = name;
        info.password = password;
        info.mobile = mobile;

        this.timeout(70000);

        mAsync.waterfall([
            function(next){
                pwd_forget.test({}, [
                    function(cb){
                        do_register(info, function(data){
                            user_id = data.data.user_id;
                            console.log('Wait 60 seconds for the sms record to be wapped out.');
                            setTimeout(function(){
                                get_sms(mobile, function(sms_code){
                                    pwd_forget.param.smscode = sms_code;
                                    pwd_forget.param.name = name;
                                    pwd_forget.param.mobile = mobile;
                                    pwd_forget.param.password = 'AD#123'+mUtils.createRandomTestName(null, 4);
                                    cb();
                                });
                            }, 61000);
                        });
                    },
                    function(data){
                        next(null, null);
                    }
                ]);
            }
        ], function(err, data){
            if(user_id) account_remove(user_id, function(){
                if(err) throw err;
                done();
            });
            else {
                if(err) throw err;
                done();
            }
        });
    });
});

