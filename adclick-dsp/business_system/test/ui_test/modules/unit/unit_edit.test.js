/*
 * @file unit_edit.test.js
 * @description: testing cases about editing unit
 * @copyright dmtec.cn reserved, 2018
 * @author tahitian
 * @date 2018.1.25
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
var edit_unit = require('../functions/unit_func').edit_unit;

var plan_add = require('../functions/plan_func').add_plan;
var plan_del = require('../functions/plan_func').del_plan;

var correct_edit = function(name, cb){
    describe('', function(){
        this.timeout(60000);
        it('edit a unit', function(done){
            var unit_name = name.unit_name;
            var plan_name = name.plan_name;
            var param = {
                unit_name : unit_name,
                plan_name : plan_name,
                bid_type : 'CPC',
                control : {
                    imp : 3,
                    click : 3
                }
            };
            edit_unit(param, function(err){
                done(err);
                cb();
            });
        });
    });
};

var empty_bid = function(name, cb){
    describe('', function(){
        this.timeout(60000);
        it('create unit to empty bid', function(done){
            var unit_name = name.unit_name;
            var plan_name = name.plan_name;
            var param = {
                unit_name : unit_name,
                plan_name : plan_name,
                bid : '',
                err_input : true
            };
            edit_unit(param, function(err){
                done(err);
                if(!err) console.log('edit an unit to empty bid is denied as expected!');
                cb();
            });
        });
    });
}

var zero_bid = function(name, cb){
    describe('', function(){
        this.timeout(60000);
        it('edit unit to empty bid', function(done){
            var unit_name = name.unit_name;
            var plan_name = name.plan_name;
            var param = {
                unit_name : unit_name,
                plan_name : plan_name,
                bid : 0,
                err_input : true
            };
            edit_unit(param, function(err){
                done(err);
                if(!err) console.log('edit an unit to zero bid is denied as expected!');
                cb();
            });
        });
    });
}

var type_wrong_bid = function(name, cb){
    describe('', function(){
        this.timeout(60000);
        it('edit unit to bid of wrong type', function(done){
            var unit_name = name.unit_name;
            var plan_name = name.plan_name;
            var param = {
                unit_name : unit_name,
                plan_name : plan_name,
                bid : 'ads',
                err_input : true
            };
            edit_unit(param, function(err){
                done(err);
                if(!err) console.log('edit an unit to bid of wrong type is denied as expected!');
                cb();
            });
        });
    });
}

var zero_control = function(name, cb){
    describe('', function(){
        this.timeout(60000);
        it('edit unit to zero imp and click control', function(done){
            var unit_name = name.unit_name;
            var plan_name = name.plan_name;
            var param = {
                unit_name : unit_name,
                plan_name : plan_name,
                control : {
                    imp : 0,
                    click : 0
                },
                err_input : true
            };
            edit_unit(param, function(err){
                done(err);
                if(!err) console.log('edit a unit to zero imp and click control is denied as expected!');
                cb();
            });
        });
    });
}

var overflow_control = function(name, cb){
    describe('', function(){
        this.timeout(60000);
        it('edit unit with imp and click control out of range', function(done){
            var unit_name = name.unit_name;
            var plan_name = name.plan_name;
            var param = {
                unit_name : unit_name,
                plan_name : plan_name,
                control : {
                    imp : 3,
                    click : 4
                },
                err_input : true
            };
            edit_unit(param, function(err){
                done(err);
                if(!err) console.log('edit a unit with imp and click control out of range is denied as expected!');
                cb();
            });
        });
    });
}

var type_err_control = function(name, cb){
    describe('', function(){
        this.timeout(60000);
        it('edit unit with type error imp and click control', function(done){
            var unit_name = name.unit_name;
            var plan_name = name.plan_name;
            var param = {
                unit_name : unit_name,
                plan_name : plan_name,
                control : {
                    imp : 3,
                    click : 'ads'
                },
                err_input : true
            };
            edit_unit(param, function(err){
                done(err);
                if(!err) console.log('edit a unit with type error imp and click control is denied as expected!');
                cb();
            });
        });
    });
}

module.exports.correct_edit = { test : correct_edit };
module.exports.empty_bid = { test : empty_bid };
module.exports.zero_bid = { test : zero_bid };
module.exports.type_wrong_bid = { test : type_wrong_bid };
module.exports.zero_control = { test : zero_control };
module.exports.overflow_control = { test : overflow_control };
module.exports.type_err_control = { test : type_err_control };