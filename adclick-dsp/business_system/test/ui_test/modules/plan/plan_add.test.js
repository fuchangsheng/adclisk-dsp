/*
 * @file plan_add.test.js
 * @description: testing cases about adding plan
 * @copyright dmtec.cn reserved, 2018
 * @author tahitian
 * @date 2018.1.12
 * @version 0.0.1 
 */
'use strict';

var webdriverio = require('webdriverio');
var expect = require('chai').expect;
var mAsync = require('async');
var ADCLICK_URL = require('../../common/constants').ADCLICK_URL;
var options = { desiredCapabilities: { browserName: 'chrome' } };

var add_plan = require('../functions/plan_func').add_plan;
var del_plan = require('../functions/plan_func').del_plan;
var err_add = require('../functions/plan_func').err_add;

var correct_add = function(param, cb){
    describe('', function(){
        this.timeout(60000);
        it('create a new plan', function(done){
            var plan_name = Math.random().toString(36).substr(2, 6);
            add_plan({name : plan_name}, function(err){
                if(err) {
                    done(err);
                    cb();
                }
                else del_plan(plan_name, function(err){
                    done(err);
                    cb(); 
                });
            });
        });
    });
}; 

var empty_name = function(param, cb){
    describe('', function(){
        this.timeout(60000);
        it('create a new plan with empty name', function(done){
            var param = {
                name : '',
                err_input : true
            }
            add_plan(param, function(err){
                if(!err) console.log('Creating a plan with empty name is denied as expected!');
                done(err);
                cb();
            });
        });
    });
};

var dul_name = function(param, cb){
    describe('', function(){
        this.timeout(60000);
        it('create a new plan with duplicated name', function(done){
            var plan_name = Math.random().toString(36).substr(2, 6);
            add_plan({name : plan_name}, function(err){
                if(err) {
                    done(err);
                    cb();
                }
                else {
                    var param = {
                        name : plan_name,
                        err_input : true,
                        dul : true
                    };
                    add_plan(param, function(err1){
                        del_plan(plan_name, function(err2){
                            if(!err1) console.log('Creating a plan with duplicated name is denied as expected!');
                            done(err1 || err2);
                            cb();
                        });
                    });
                }
            });
        });
    });
};

var empty_period = function(param, cb){
    describe('', function(){
        this.timeout(60000);
        it('create a new plan without setting period', function(done){
            var param = {
                name : Math.random().toString(36).substr(2, 6),
                period : 'empty',
                err_input : true
            }
            add_plan(param, function(err){
                if(!err) console.log('Creating a plan with empty period is denied as expected!');
                done(err);
                cb();
            });
        });
    });
};

var wrong_period = function(param, cb){
    describe('', function(){
        this.timeout(60000);
        it('create a new plan with wrong start and end time', function(done){
            var param = {
                name : Math.random().toString(36).substr(2, 6),
                period : 'wrong',
                err_input : true
            }
            add_plan(param, function(err){
                if(!err) console.log('Creating a plan with wrong start and end time is denied as expected!');
                done();
                cb();
            })
        });
    });
};

var empty_budget = function(param, cb){
    describe('', function(){
        this.timeout(60000);
        it('create a new plan with empty budget', function(done){
            var param = {
                name : Math.random().toString(36).substr(2, 6),
                budget : '',
                err_input : true
            }
            add_plan(param, function(err){
                if(!err) console.log('Creating a plan with empty budget is denied as expected!');
                done();
                cb();
            })
        });
    });
};

var zero_budget = function(param, cb){
    describe('', function(){
        this.timeout(60000);
        it('create a new plan with zero budget', function(done){
            var param = {
                name : Math.random().toString(36).substr(2, 6),
                budget : 0,
                err_input : true
            }
            add_plan(param, function(err){
                if(!err) console.log('Creating a plan with zero budget is denied as expected!');
                done();
                cb();
            })
        });
    });
};

var type_err_budget = function(param, cb){
    describe('', function(){
        this.timeout(60000);
        it('create a new plan with type_err budget', function(done){
            var param = {
                name : Math.random().toString(36).substr(2, 6),
                budget : 'ads',
                err_input : true
            }
            add_plan(param, function(err){
                if(!err) console.log('Creating a plan with type_err budget is denied as expected!');
                done();
                cb();
            })
        });
    });
};

module.exports.correct_add = { test : correct_add };
module.exports.empty_name = { test : empty_name };
module.exports.dul_name = { test : dul_name };
module.exports.empty_period = { test : empty_period };
module.exports.wrong_period = { test : wrong_period };
module.exports.empty_budget = { test : empty_budget };
module.exports.zero_budget = { test : zero_budget };
module.exports.type_err_budget = { test : type_err_budget };