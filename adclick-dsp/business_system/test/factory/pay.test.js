/*
 * @file pay.test.js
 * @description pay basic information to test API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.28
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'pay.test';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);

//model
var alipay = require('../model/pay/alipay.test').create();
// var alipay_notify = require('../model/pay/alipay_notify.test').create();
// var alipay_return = require('../model/pay/alipay_return.test').create();
var wechat_pay = require('../model/pay/wechat_pay.test').create();
var wechat_query = require('../model/pay/wechat_pay_query.test').create();

var msg;

msg = 'to test interfaces of pay module.';
mLogger.debug('try '+msg);

describe('pay module', function(){
    it(alipay.description, function(done){
        alipay.test({}, function(data){
            done();
        });
    });

    it(wechat_pay.description, function(done){
        wechat_pay.test({}, function(data){
            done();
        });
    });

    it(wechat_query.description, function(done){
        wechat_query.test({}, [
            function(cb){
                wechat_pay.test({}, function(data){
                    wechat_query.param.id = data.data.id;
                    cb();
                });
            },
            function(data){
                done();
            }
        ]);
    });
});
