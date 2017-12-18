/*
 * @file  dashboard2.test.js
 * @description dashboard2 basic information to test API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.28
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'dashboard2.test';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);

// constants
var testConstants = require('../common/constants');

//model
var plan_summary = require('../model/dashboard2/dashboard_plan_summary.test').create();
var plan_view = require('../model/dashboard2/dashboard_plan_view.test').create();
var plan_download = require('../model/dashboard2/dashboard_plan_download.test').create();
var unit_summary = require('../model/dashboard2/dashboard_unit_summary.test').create();
var unit_view = require('../model/dashboard2/dashboard_unit_view.test').create();
var unit_download = require('../model/dashboard2/dashboard_unit_download.test').create();
var idea_summary = require('../model/dashboard2/dashboard_idea_summary.test').create();
var idea_view = require('../model/dashboard2/dashboard_idea_view.test').create();
var idea_download = require('../model/dashboard2/dashboard_idea_download.test').create();
var overview = require('../model/dashboard2/dashboard_overview.test').create();
var overview_download = require('../model/dashboard2/dashboard_overview_download.test').create();
var summary = require('../model/dashboard2/dashboard_summary.test').create();
var top_plans = require('../model/dashboard2/dashboard_top_plans.test').create();
var top_units = require('../model/dashboard2/dashboard_top_units.test').create();
var top_ideas = require('../model/dashboard2/dashboard_top_ideas.test').create();

// functions
var dashboard_gen = require('../functions/dashboard2_func').dashboard_gen;
var dashboard_del = require('../functions/dashboard2_func').dashboard_del;
var config = require('../functions/dashboard2_func').config;

var msg;
msg = 'to test interfaces of dashboard2 modules.';
mLogger.debug('try '+msg);

var user_id = testConstants.USER_ID;

describe('dashboard2 module', function(){
    var id;
    var param = {
        start_time : '2017-1-1 00:00:00',
        end_time : '2017-1-2 00:00:00',
        unit : '小时',
        data_type : '展现,点击,点击率',
        view : [{
            date_time : '',
            imp : 0,
            click : 0,
            ctr : 0
        },],
        summary : {
            imp : 0,
            click : 0,
            click_rate : 0
        }
    };

    before(function(done){
        var conf = {
            user_id : user_id,
            start_time : param.start_time,
            end_time : param.end_time,
        }
        dashboard_gen(conf, function(err, data){
            id = data;
            param.id = data;
            done(err);
        });
    });

    after(function(done){
        if(id) dashboard_del(id, done);
        else done();
    });

    describe('plan part', function(){
        it(plan_summary.description, function(done){
            config(plan_summary, param, 'summary');
            plan_summary.test({}, function(data){
                done();
            });
        });

        it(plan_view.description, function(done){
            config(plan_view, param, 'view');
            plan_view.test({}, function(data){
                done();
            });
        });

        it(plan_download.description, function(done){
            config(plan_download, param);
            plan_download.test({}, function(data){
                done();
            });
        });
    });

    describe('unit part', function(){
        it(unit_summary.description, function(done){
            config(unit_summary, param, 'summary');
            unit_summary.test({}, function(data){
                done();
            });
        });

        it(unit_view.description, function(done){
            config(unit_view, param, 'view');
            unit_view.test({}, function(data){
                done();
            });
        });

        it(unit_download.description, function(done){
            config(unit_download, param);
            unit_download.test({}, function(data){
                done();
            });
        });
    });

    describe('idea part', function(){
        it(idea_summary.description, function(done){
            config(idea_summary, param, 'summary');
            idea_summary.test({}, function(data){
                done();
            });
        });

        it(idea_view.description, function(done){
            config(idea_view, param, 'view');
            idea_view.test({}, function(data){
                done();
            });
        });

        it(idea_download.description, function(done){
            config(idea_download, param);
            idea_download.test({}, function(data){
                done();
            });
        });
    });

    describe('overview part', function(){
        it(summary.description, function(done){
            config(summary, param, 'summary');
            summary.test({}, function(data){
                done();
            });
        });

        it(overview.description, function(done){
            config(overview, param, 'view');
            overview.test({}, function(data){
                done();
            });
        });

        it(overview_download.description, function(done){
            config(overview_download, param);
            overview_download.test({}, function(data){
                done();
            });
        });
    });

    describe('top part', function(){
        it(top_plans.description, function(done){
            config(top_plans, param);
            top_plans.test({}, function(data){
                done();
            });
        });

        it(top_units.description, function(done){
            config(top_units, param);
            top_units.test({}, function(data){
                done();
            });
        });

        it(top_ideas.description, function(done){
            config(top_ideas, param);
            top_ideas.test({}, function(data){
                done();
            });
        });
    });
});