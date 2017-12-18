/*
 * @file  ads_management.test.js
 * @description test the interfaces of ads_management model
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.16
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_management.test';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');
var mMoment = require('moment');

// constants
var ADCONSTANTS = require('../../../common/adConstants');
var testConstants = require('../common/constants');

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

// dataModels
var mAdminModel = require('../../model/management_admin').create();
var mADPlanModel = require('../../model/adlib_plans').create();
var mADUnitModel = require('../../model/adlib_units').create();
var mADUnitTargetModel = require('../../model/adlib_unit_target').create();


//model
var idea_audit = require('../model/ads_management/ads_idea_audit.test').create();
var idea_list = require('../model/ads_management/ads_idea_list.test').create();
var idea_op = require('../model/ads_management/ads_idea_op.test').create();
var idea_view = require('../model/ads_management/ads_idea_view.test').create();
var plan_list = require('../model/ads_management/ads_plan_list.test').create();
var plan_op = require('../model/ads_management/ads_plan_op.test').create();
var plan_view = require('../model/ads_management/ads_plan_view.test').create();
var unit_list = require('../model/ads_management/ads_unit_list.test').create();
var unit_op = require('../model/ads_management/ads_unit_op.test').create();
var unit_view = require('../model/ads_management/ads_unit_view.test').create();
var unit_target = require('../model/ads_management/ads_unit_target_detail.test').create();

var add_plan = require('../functions/ads_func').add_plan;
var del_plan = require('../functions/ads_func').del_plan;
var add_unit = require('../functions/ads_func').add_unit;
var del_unit = require('../functions/ads_func').del_unit;
var add_idea = require('../functions/ads_func').add_idea;
var del_idea = require('../functions/ads_func').del_idea;
var ads_add = require('../functions/ads_func').ads_add;
var ads_del = require('../functions/ads_func').ads_del;

var msg;

msg = 'to test interfaces of ads_management module.';
mLogger.debug('try '+msg);

var user_id = testConstants.USER_ID;

describe('', function(){
    var id, plan_id, unit_id, idea_id;

    before(function(done){
        ads_add(user_id, function(err, data){
            id = data;
            plan_id = data.plan_id;
            unit_id = data.unit_id;
            idea_id = data.idea_id;
            done(err);
        });
    });

    after(function(done){
        if(!id) done();
        else {
            id.user_id = user_id;
            ads_del(id, done);
        }
    });

    describe('plan part', function(){
        it(plan_list.description, function(done){
            plan_list.test({}, function(data){
                done();
            });
        });

        it(plan_op.description, function(done){
            plan_op.param.plan_id = plan_id;
            plan_op.test({}, function(data){
                done();
            });
        });

        it(plan_view.description, function(done){
            plan_view.param.plan_id = plan_id;
            plan_view.test({}, function(data){
                done();
            });
        });
    });

    describe('unit part', function(){
        it(unit_list.description, function(done){
            unit_list.test({}, function(data){
                done();
            });
        });

        it(unit_op.description, function(done){
            unit_op.param.unit_id = unit_id;
            unit_op.test({}, function(data){
                done();
            });
        });

        it(unit_view.description, function(done){
            unit_view.param.unit_id = unit_id;
            unit_view.test({}, function(data){
                done();
            });
        });

        it(unit_target.description, function(done){
            unit_target.param.unit_id = unit_id;
            unit_target.test({}, function(data){
                done();
            });
        });
    });

    describe('idea part', function(){
        it(idea_list.description, function(done){
            idea_list.test({}, function(data){
                done();
            });
        });

        it(idea_op.description, function(done){
            idea_op.param.idea_id = idea_id;
            idea_op.test({}, function(data){
                done();
            });
        });

        it(idea_view.description, function(done){
            idea_view.param.idea_id = idea_id;
            idea_view.test({}, function(data){
                done();
            });
        });

        it(idea_audit.description, function(done){
            idea_audit.param.idea_id = idea_id;
            idea_audit.test({}, function(data){
                done();
            });
        });
    });
});