/*
 * @file unit_add.test.js
 * @description: testing cases about adding unit
 * @copyright dmtec.cn reserved, 2017
 * @author tahitian
 * @date 2017.1.23
 * @version 0.0.1 
 */
'use strict';

var webdriverio = require('webdriverio');
var expect = require('chai').expect;
var mAsync = require('async');
var adclick_url = require('../../../common/constants').ADCLICK_URL;
var options = { desiredCapabilities: { browserName: 'chrome' } };

// functions
var add_unit = require('../functions/unit_func').add_unit;
var del_unit = require('../functions/unit_func').del_unit;
var plan_add = require('../functions/plan_func').add_plan;
var plan_del = require('../functions/plan_func').del_plan;

var correct_add = function(plan_name, cb){
    describe('', function(){
        this.timeout(60000);
        it('create a new unit', function(done){
            var unit_name = 'unit_'+Math.random().toString(36).substr(2, 4);
            var param = {
                unit_name : unit_name,
                plan_name : plan_name,
                bid_type : 'CPC',
                control : {
                    imp : 3,
                    click : 3
                }
            };
            add_unit(param, function(err){
                if(err) {
                    done(err);
                    cb();
                }
                else {
                    del_unit({ unit_name : unit_name }, function(err){
                        done(err);
                        cb();
                    });
                }
            });
        });
    });
}; 

var empty_name = function(plan_name, cb){
    describe('', function(){
        this.timeout(60000);
        it('create a new unit without unit_name', function(done){
            var param = {
                unit_name : '',
                plan_name : plan_name,
                err_input : true
            };
            add_unit(param, function(err){
                done(err);
                if(!err) console.log('create an unit with empty unit name is denied as expected!');
                cb();
            });
        });
    });
}

var dul_name = function(plan_name, cb){
    describe('', function(){
        this.timeout(60000);
        it('create a new unit with duplicated name', function(done){
            var unit_name = 'unit_'+Math.random().toString(36).substr(2, 4);
            var param = {
                unit_name : unit_name,
                plan_name : plan_name,
                err_input : false
            };
            add_unit(param, function(err){
                if(err) {
                    done(err);
                    cb();
                }
                else {
                    param.err_input = true;
                    add_unit(param, function(err){
                        if(err) {
                            done(err);
                            cb();
                        }
                        else {
                            del_unit({ unit_name : unit_name }, function(err){
                                done(err);
                                if(!err) console.log('create an unit with duplicated unit name is denied as expected!');
                                cb();
                            });
                        }
                    });
                }
            });
        });
    });
}

var same_name = function(plan_name, cb){
    describe('', function(){
        this.timeout(60000);
        it('create a new unit with same name belonging to different plans', function(done){
            var unit_name = 'unit_'+Math.random().toString(36).substr(2, 4);
            var plan_name2 = 'unit_'+Math.random().toString(36).substr(2, 4);
            var param = {
                unit_name : unit_name,
                plan_name : plan_name,
                err_input : false
            };
            add_unit(param, function(err){
                if(err) {
                    done(err);
                    cb();
                }
                else {
                    plan_add({ name : plan_name2 }, function(err){
                        if(err) {
                            done(err);
                            cb();
                        }
                        else {
                            param.plan_name = plan_name2;
                            add_unit(param, function(err){
                                if(err) {
                                    done(err);
                                    cb();
                                }
                                else {
                                    del_unit({ unit_name : unit_name, dul : true }, function(err1){
                                        del_unit({ unit_name : unit_name }, function(err2){
                                            plan_del(plan_name2, function(err3){
                                                done(err1 || err2 || err3);
                                                if(!err) console.log('success to create an unit with same unit name under different plans!');
                                                cb();
                                            });
                                        });
                                    });
                                }
                            });
                        }
                    })
                }
            });
        });
    });
}

var empty_plan_name = function(plan_name, cb){
    describe('', function(){
        this.timeout(60000);
        it('create a new unit without plan_name', function(done){
            var unit_name = 'unit_'+Math.random().toString(36).substr(2, 4);
            var param = {
                unit_name : unit_name,
                err_input : true
            };
            add_unit(param, function(err){
                done(err);
                if(!err) console.log('create an unit with empty plan name is denied as expected!');
                cb();
            });
        });
    });
}

var empty_bid = function(plan_name, cb){
    describe('', function(){
        this.timeout(60000);
        it('create a new unit with empty bid', function(done){
            var unit_name = 'unit_'+Math.random().toString(36).substr(2, 4);
            var param = {
                unit_name : unit_name,
                plan_name : plan_name,
                bid : '',
                err_input : true
            };
            add_unit(param, function(err){
                done(err);
                if(!err) console.log('create an unit with empty bid is denied as expected!');
                cb();
            });
        });
    });
}

var zero_bid = function(plan_name, cb){
    describe('', function(){
        this.timeout(60000);
        it('create a new unit with empty bid', function(done){
            var unit_name = 'unit_'+Math.random().toString(36).substr(2, 4);
            var param = {
                unit_name : unit_name,
                plan_name : plan_name,
                bid : 0,
                err_input : true
            };
            add_unit(param, function(err){
                done(err);
                if(!err) console.log('create an unit with zero bid is denied as expected!');
                cb();
            });
        });
    });
}

var type_wrong_bid = function(plan_name, cb){
    describe('', function(){
        this.timeout(60000);
        it('create a new unit with bid of wrong type', function(done){
            var unit_name = 'unit_'+Math.random().toString(36).substr(2, 4);
            var param = {
                unit_name : unit_name,
                plan_name : plan_name,
                bid : 'ads',
                err_input : true
            };
            add_unit(param, function(err){
                done(err);
                if(!err) console.log('create an unit with bid of wrong type is denied as expected!');
                cb();
            });
        });
    });
}

var zero_control = function(plan_name, cb){
    describe('', function(){
        this.timeout(60000);
        it('create a new unit with zero imp and click control', function(done){
            var unit_name = 'unit_'+Math.random().toString(36).substr(2, 4);
            var param = {
                unit_name : unit_name,
                plan_name : plan_name,
                control : {
                    imp : 0,
                    click : 0
                },
                err_input : true
            };
            add_unit(param, function(err){
                done(err);
                if(!err) console.log('create a unit with zero imp and click control is denied as expected!');
                cb();
            });
        });
    });
}

var overflow_control = function(plan_name, cb){
    describe('', function(){
        this.timeout(60000);
        it('create a new unit with imp and click control out of range', function(done){
            var unit_name = 'unit_'+Math.random().toString(36).substr(2, 4);
            var param = {
                unit_name : unit_name,
                plan_name : plan_name,
                control : {
                    imp : 3,
                    click : 4
                },
                err_input : true
            };
            add_unit(param, function(err){
                done(err);
                if(!err) console.log('create a unit with imp and click control out of range is denied as expected!');
                cb();
            });
        });
    });
}

var type_err_control = function(plan_name, cb){
    describe('', function(){
        this.timeout(60000);
        it('create a new unit with ytpe error imp and click control', function(done){
            var unit_name = 'unit_'+Math.random().toString(36).substr(2, 4);
            var param = {
                unit_name : unit_name,
                plan_name : plan_name,
                control : {
                    imp : 3,
                    click : 'ads'
                },
                err_input : true
            };
            add_unit(param, function(err){
                done(err);
                if(!err) console.log('create a unit with type error imp and click control is denied as expected!');
                cb();
            });
        });
    });
}

module.exports.correct_add = { test : correct_add };
module.exports.empty_name = { test : empty_name };
module.exports.dul_name = { test : dul_name };
module.exports.same_name = { test : same_name };
module.exports.empty_plan_name = { test : empty_plan_name };
module.exports.empty_bid = { test : empty_bid };
module.exports.zero_bid = { test : zero_bid };
module.exports.type_wrong_bid = { test : type_wrong_bid };
module.exports.zero_control = { test : zero_control };
module.exports.overflow_control = { test : overflow_control };
module.exports.type_err_control = { test : type_err_control };