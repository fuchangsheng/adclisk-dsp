/*
 * @file plan.test.js
 * @description batch of testing cases of plan module
 * @copyright dmtec.cn reserved, 2017
 * @author tahitian
 * @date 2017.1.12
 * @version 0.0.1 
 */
'use strict';

var webdriverio = require('webdriverio');
var expect = require('chai').expect;
var mAsync = require('async');
var adclick_url = require('../common/constants').adclick_url;
var options = { desiredCapabilities: { browserName: 'chrome' } };

var correct_add = require('../modules/plan/plan_add.test').correct_add;
var add_with_empty_name = require('../modules/plan/plan_add.test').empty_name;
var add_with_duplicated_name = require('../modules/plan/plan_add.test').dul_name;
var add_with_empty_period = require('../modules/plan/plan_add.test').empty_period;
var add_with_wrong_period = require('../modules/plan/plan_add.test').wrong_period;
var add_with_empty_budget = require('../modules/plan/plan_add.test').empty_budget;
var add_with_zero_budget = require('../modules/plan/plan_add.test').zero_budget;
var add_with_err_type_budget = require('../modules/plan/plan_add.test').type_err_budget;

var change_status = require('../modules/plan/plan_edit.test').change_status;
var correct_edit = require('../modules/plan/plan_edit.test').correct_edit;
var edit_with_empty_name = require('../modules/plan/plan_edit.test').empty_name;
var edit_with_duplicated_name = require('../modules/plan/plan_edit.test').dup_name;
var edit_with_empty_period = require('../modules/plan/plan_edit.test').empty_period;
var edit_with_error_period = require('../modules/plan/plan_edit.test').err_period;
var edit_with_empty_budget = require('../modules/plan/plan_edit.test').empty_budget;
var edit_with_zero_budget = require('../modules/plan/plan_edit.test').zero_budget;
var edit_with_error_type_budget = require('../modules/plan/plan_edit.test').type_err_budget;

var delete_plan = require('../modules/plan/plan_del.test').plan_del;

describe('plan module', function(){
    this.timeout(60000);

    mAsync.series([
        function(next){
            correct_add.test(null, next);
        },
        function(next){
            add_with_empty_name.test(null, next);
        },
        function(next){
            add_with_duplicated_name.test(null, next);
        },
        function(next){
            add_with_empty_period.test(null, next);
        },
        function(next){
            add_with_wrong_period.test(null, next);
        },
        function(next){
            add_with_empty_budget.test(null, next);
        },
        function(next){
            add_with_zero_budget.test(null, next);
        },
        function(next){
            add_with_err_type_budget.test(null, next);
        },
        function(next){
            change_status.test(null, next);
        },
        function(next){
            correct_edit.test(null, next);
        },
        function(next){
            edit_with_empty_name.test(null, next);
        },
        function(next){
            edit_with_duplicated_name.test(null, next);
        },
        function(next){
            edit_with_empty_period.test(null, next);
        },
        function(next){
            edit_with_error_period.test(null, next);
        },
        function(next){
            edit_with_empty_budget.test(null, next);
        },
        function(next){
            edit_with_zero_budget.test(null, next);
        },
        function(next){
            edit_with_error_type_budget.test(null, next);
        },
        function(next){
            delete_plan.test(null, next);
        },
    ], function(err, info){
        if(err) console.error(err);
    });
});