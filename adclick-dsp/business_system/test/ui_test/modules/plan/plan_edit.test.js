/*
 * @file plan_edit.test.js
 * @description: testing cases about editing a plan
 * @copyright dmtec.cn reserved, 2017
 * @author tahitian
 * @date 2017.1.12
 * @version 0.0.1 
 */
'use strict';

var webdriverio = require('webdriverio');
var expect = require('chai').expect;
var mAsync = require('async');
var ADCLICK_URL = require('../../common/constants').ADCLICK_URL;
var ADS_STATUS = require('../../common/constants').ADS_STATUS;
var options = { desiredCapabilities: { browserName: 'chrome' } };

var add_plan = require('../functions/plan_func').add_plan;
var del_plan = require('../functions/plan_func').del_plan;
var edit_plan = require('../functions/plan_func').edit_plan;
var change_status = require('../functions/plan_func').change_status;

var correct_edit = function(param, cb){
    describe('', function(){
        this.timeout(60000);
        var plan_name = Math.random().toString(36).substr(2, 6);
        var edit_name = Math.random().toString(36).substr(2, 6);
        it('edit a plan with name: '+plan_name, function(done){
            add_plan({ name : plan_name }, function(err){
                if(err) {
                    done(err);
                    cb();
                }
                else {
                    var param = {
                        name_p : plan_name,
                        name_e : edit_name,
                        period : 'correct',
                        budget : 2
                    };
                    edit_plan(param, function(err){
                        if(err) {
                            del_plan(plan_name, function(err2){
                                done(err || err2);
                                cb();
                            });
                        } else {
                            del_plan(edit_name, function(err2){
                                done(err || err2);
                                cb();
                            });
                        }
                    });
                }
            });
        });
    });
};

var empty_name = function(param, cb){
    describe('', function(){
        this.timeout(60000);
        it('edit a plan to empty name', function(done){
            var plan_name = Math.random().toString(36).substr(2, 6);
            var edit_plan_name = '';
            add_plan({name : plan_name}, function(err){
                if(err) {
                    done(err);
                    cb();
                }
                else {
                    var param = {
                        name_p : plan_name,
                        name_e : edit_plan_name,
                        err_input : true
                    };
                    edit_plan(param, function(err){
                        if(!err) console.log('Edit a plan to empty name is denied as expected!');

                        del_plan(plan_name, function(err2){ 
                            done(err || err2);
                            cb();
                        });
                    });
                }
            });
        });
    });
};

var dup_name = function(param, cb){
    describe('', function(){
        this.timeout(60000);
        it('edit a plan to a duplicated name', function(done){
            var dup_name = Math.random().toString(36).substr(2, 6);
            var plan_name = Math.random().toString(36).substr(2, 6);
            var edit_plan_name = dup_name;
            add_plan({name : dup_name}, function(err){
                if(err) {
                    done(err);
                    cb();
                }
                else {
                    add_plan({name : plan_name}, function(err){
                        if(err) {
                            done(err);
                            cb();
                        }
                        else {
                            var param = {
                                name_p : plan_name,
                                name_e : edit_plan_name,
                                err_input : true
                            };
                            edit_plan(param, function(err){
                                if(!err) console.log('Edit a plan to duplicated name is denied as expected!');

                                del_plan(plan_name, function(err1){
                                    del_plan(dup_name, function(err2){
                                        done(err1 || err2);
                                        cb();
                                    });
                                });
                            });
                        }
                    });
                }
            });
        });
    });
};

var empty_period = function(param, cb){
    describe('', function(){
        this.timeout(60000);
        it('edit a plan to empty period', function(done){
            var plan_name = Math.random().toString(36).substr(2, 6);
            var edit_plan_name = Math.random().toString(36).substr(2, 6);
            add_plan({name : plan_name}, function(err){
                if(err) {
                    done(err);
                    cb();
                }
                else {
                    var param = {
                        name_p : plan_name,
                        name_e : edit_plan_name,
                        period : 'empty',
                        err_input : true
                    };
                    edit_plan(param, function(err){
                        if(!err) console.log('Edit a plan to empty period is denied as expected!');

                        del_plan(plan_name, function(err2){ 
                            done(err || err2);
                            cb();
                        });
                    });
                }
            });
        });
    });
};

var err_period = function(param, cb){
    describe('', function(){
        this.timeout(60000);
        it('edit a plan to empty period', function(done){
            var plan_name = Math.random().toString(36).substr(2, 6);
            var edit_plan_name = Math.random().toString(36).substr(2, 6);
            add_plan({name : plan_name}, function(err){
                if(err) {
                    done(err);
                    cb();
                }
                else {
                    var param = {
                        name_p : plan_name,
                        name_e : edit_plan_name,
                        period : 'wrong',
                        err_input : true
                    };
                    edit_plan(param, function(err){
                        if(!err) console.log('Edit a plan to wrong period is denied as expected!');

                        del_plan(plan_name, function(err2){ 
                            done(err || err2);
                            cb();
                        });
                    });
                }
            });
        });
    });
};

var empty_budget = function(param, cb){
    describe('', function(){
        this.timeout(60000);
        it('edit a plan to empty budget', function(done){
            var plan_name = Math.random().toString(36).substr(2, 6);
            var edit_plan_name = Math.random().toString(36).substr(2, 6);
            add_plan({name : plan_name}, function(err){
                if(err) {
                    done(err);
                    cb();
                }
                else {
                    var param = {
                        name_p : plan_name,
                        name_e : edit_plan_name,
                        budget : '',
                        err_input : true
                    };
                    edit_plan(param, function(err){
                        if(!err) console.log('Edit a plan to empty budget is denied as expected!');

                        del_plan(plan_name, function(err2){ 
                            done(err || err2);
                            cb();
                        });
                    });
                }
            });
        });
    });
};

var zero_budget = function(param, cb){
    describe('', function(){
        this.timeout(60000);
        it('edit a plan to zero budget', function(done){
            var plan_name = Math.random().toString(36).substr(2, 6);
            var edit_plan_name = Math.random().toString(36).substr(2, 6);
            add_plan({name : plan_name}, function(err){
                if(err) {
                    done(err);
                    cb();
                }
                else {
                    var param = {
                        name_p : plan_name,
                        name_e : edit_plan_name,
                        budget : 0,
                        err_input : true
                    };
                    edit_plan(param, function(err){
                        if(!err) console.log('Edit a plan to zero period is denied as expected!');

                        del_plan(plan_name, function(err2){ 
                            done(err || err2);
                            cb();
                        });
                    });
                }
            });
        });
    });
};

var type_err_budget = function(param, cb){
    describe('', function(){
        this.timeout(60000);
        it('edit a plan to error type budget', function(done){
            var plan_name = Math.random().toString(36).substr(2, 6);
            var edit_plan_name = Math.random().toString(36).substr(2, 6);
            add_plan({name : plan_name}, function(err){
                if(err) {
                    done(err);
                    cb();
                }
                else {
                    var param = {
                        name_p : plan_name,
                        name_e : edit_plan_name,
                        budget : 'ads',
                        err_input : true
                    };
                    edit_plan(param, function(err){
                        if(!err) console.log('Edit a plan to type_wrong period is denied as expected!');

                        del_plan(plan_name, function(err2){ 
                            done(err || err2);
                            cb();
                        });
                    });
                }
            });
        });
    });
};

module.exports.change_status = { test : change_status };
module.exports.correct_edit = { test : correct_edit };
module.exports.empty_name = { test : empty_name };
module.exports.dup_name = { test : dup_name };
module.exports.empty_period = { test : empty_period };
module.exports.err_period = { test : err_period };
module.exports.empty_budget = { test : empty_budget };
module.exports.zero_budget = { test : zero_budget };
module.exports.type_err_budget = { test : type_err_budget };