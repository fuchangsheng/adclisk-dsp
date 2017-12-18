/*
 * @file plan_del.test.js
 * @description: testing cases about deleting plan
 * @copyright dmtec.cn reserved, 2017
 * @author tahitian
 * @date 2017.1.13
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

var plan_del = function(param, cb){
	describe('', function(){
        this.timeout(60000);
		var plan_name = Math.random().toString(36).substr(2, 6);
		it('delete a plan with name: '+plan_name, function(done){
			add_plan({name : plan_name}, function(err){
				if(err) {
					done(err);
					cb();
				} else {
					del_plan(plan_name, function(err){
						done(err);
						cb();
					});
				}
			});
		});
	});
}

module.exports.plan_del = { test : plan_del };