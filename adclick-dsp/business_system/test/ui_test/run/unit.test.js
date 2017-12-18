/*
 * @file unit.test.js
 * @description batch of testing cases of unit module
 * @copyright dmtec.cn reserved, 2017
 * @author tahitian
 * @date 2017.1.12
 * @version 0.0.1 
 */
'use strict';

// config
var webdriverio = require('webdriverio');
var expect = require('chai').expect;
var mAsync = require('async');
var adclick_url = require('../common/constants').ADLCIK_URL;
var options = { desiredCapabilities: { browserName: 'chrome' } };

// constants 
var testConstants = require('../common/constants');

// cases
var correct_add = require('../modules/unit/unit_add.test').correct_add;
var add_with_empty_name = require('../modules/unit/unit_add.test').empty_name;
var add_with_duplicated_name = require('../modules/unit/unit_add.test').dul_name;
var add_with_same_name_under_different_plans = require('../modules/unit/unit_add.test').same_name;
var add_with_empty_plan_name = require('../modules/unit/unit_add.test').empty_plan_name;
var add_with_empty_bid = require('../modules/unit/unit_add.test').empty_bid;
var add_with_zero_bid = require('../modules/unit/unit_add.test').zero_bid;
var add_with_type_wrong_bid = require('../modules/unit/unit_add.test').type_wrong_bid;
var add_with_zero_control = require('../modules/unit/unit_add.test').zero_control;
var add_with_overflow_control = require('../modules/unit/unit_add.test').overflow_control;
var add_with_type_err_control = require('../modules/unit/unit_add.test').type_err_control;

var correct_edit = require('../modules/unit/unit_edit.test').correct_edit;
var edit_with_empty_bid = require('../modules/unit/unit_edit.test').empty_bid;
var edit_with_zero_bid = require('../modules/unit/unit_edit.test').zero_bid;
var edit_with_type_wrong_bid = require('../modules/unit/unit_edit.test').type_wrong_bid;
var edit_with_zero_control = require('../modules/unit/unit_edit.test').zero_control;
var edit_with_overflow_control = require('../modules/unit/unit_edit.test').overflow_control;
var edit_with_type_err_control = require('../modules/unit/unit_edit.test').type_err_control;


// functions
var plan_add = require('../modules/functions/plan_func').add_plan;
var plan_del = require('../modules/functions/plan_func').del_plan;
var unit_add = require('../modules/functions/unit_func').add_unit;
var unit_del = require('../modules/functions/unit_func').del_unit;

var user_id = testConstants.USER_ID;

mAsync.series([
    function(go_next){
        describe('unit module', function(){
            this.timeout(60000);
            var plan_name = 'plan_'+Math.random().toString(36).substr(2, 4);

            before(function(done){
                plan_add({ name : plan_name }, done);
            });

            mAsync.series([
                function(next){
                    correct_add.test(plan_name, next);
                },
                function(next){
                    add_with_empty_name.test(plan_name, next);
                },
                function(next){
                    add_with_duplicated_name.test(plan_name, next);
                },
                function(next){
                    add_with_same_name_under_different_plans.test(plan_name, next);
                },
                function(next){
                    add_with_empty_plan_name.test(plan_name, next);
                },
                function(next){
                    add_with_empty_bid.test(plan_name, next);
                },
                function(next){
                    add_with_zero_bid.test(plan_name, next);
                },
                function(next){
                    add_with_type_wrong_bid.test(plan_name, next);
                },
                function(next){ 
                    add_with_zero_control.test(plan_name, next);
                },
                function(next){ 
                    add_with_overflow_control.test(plan_name, next);
                },
                function(next){ 
                    add_with_type_err_control.test(plan_name, next);
                },
                function(next){
                    describe('', function(){
                        this.timeout(60000);
                        it('', function(done){
                            plan_del(plan_name, function(err){
                                done(err);
                                next();
                            });
                        });
                    });
                }
            ], function(err, data){
                if(err) console.error(err);
                go_next();
            });
        });
    },
    function(go_next){
        describe('unit module', function(){
            this.timeout(60000);
            var plan_name = 'plan_'+Math.random().toString(36).substr(2, 4);
            var unit_name = 'unit_'+Math.random().toString(36).substr(2, 4);

            before(function(done){
                plan_add({ name : plan_name }, function(err){
                    if(err) done(err);
                    else {
                        var param = {
                            unit_name : unit_name,
                            plan_name : plan_name,
                        };
                        unit_add(param, done);
                    }
                });
            });

            mAsync.series([
                function(next){ 
                    correct_edit.test({ plan_name : plan_name, unit_name : unit_name }, next);
                },
                function(next){
                    edit_with_empty_bid.test({ plan_name : plan_name, unit_name : unit_name }, next);
                },
                function(next){
                    edit_with_zero_bid.test({ plan_name : plan_name, unit_name : unit_name }, next);
                },
                function(next){
                    edit_with_type_wrong_bid.test({ plan_name : plan_name, unit_name : unit_name }, next);
                },
                function(next){ 
                    edit_with_zero_control.test({ plan_name : plan_name, unit_name : unit_name }, next);
                },
                function(next){ 
                    edit_with_overflow_control.test({ plan_name : plan_name, unit_name : unit_name }, next);
                },
                function(next){ 
                    edit_with_type_err_control.test({ plan_name : plan_name, unit_name : unit_name }, next);
                },
                function(next){
                    describe('', function(){
                        this.timeout(60000);
                        it('', function(done){
                            plan_del(plan_name, function(err){
                                done(err);
                                next();
                            });
                        });
                    });
                }
            ], function(err, data){
                if(err) console.error(err);
                go_next();
            });
        });
    },
], function(err, data){
    if(err) console.error(err);
});