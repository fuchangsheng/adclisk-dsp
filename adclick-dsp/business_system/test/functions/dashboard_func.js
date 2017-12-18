/*
 * @file dashboard_func.js
 * @description functions for testing of dashboard module
 * @copyright dmtec.cn reserved, 2017
 * @author tahitian
 * @date 2017.1.17
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'dashboard_func';

//system
var readline = require('readline');
var mMoment = require('moment');

//model
var mAdDashboardAdUserModel = require('../../model/adlib_dashboard_aduser').create();
var mAdDashboardPlanModel = require('../../model/adlib_dashboard_plan').create();
var mAdDashboardUnitModel = require('../../model/adlib_dashboard_unit').create();
var mAdDashboardIdeaModel = require('../../model/adlib_dashboard_idea').create();

//util
var mDataHelper = require('../../../utils/data_helper');
var mLogger = require('../../../utils/logger')(MODULENAME);

// functions
var ads_add = require('./ads_func').ads_add;
var ads_del = require('./ads_func').ads_del;

var expect = require('chai').expect;

function random(max) {
    var maxValue = max; 
    if(typeof maxValue != 'number' || maxValue < 0){
        maxValue = 10;
    }

    return Math.ceil(Math.random()*maxValue);
}

function dashboard_insert(param, database, cb){
    var date = param.start_date;
    date = mMoment(date);
    var end_date = param.end_date;
    end_date = mMoment(end_date);
    var values = [];

    while(date.isBefore(end_date)) { 
        var value = {
            date: new Date(date),
            id: param.user_id,
            request: random(1000),
            bid: random(1000),
            imp: random(1000),
            click:random(1000),
            cost: random(1000),
            download: random(100),
            revenue: random(100),
            unit: param.unit,
        };

        if(database === 1) value.plan_id = param.id.plan_id;
        else if(database === 2) value.unit_id = param.id.unit_id;
        else if(database === 3) value.idea_id = param.id.idea_id;

        date.add(1, 'h');

        mLogger.debug(JSON.stringify(value));

        values.push(value);
    }

    var query = {
        fields: values[0],
        values: values,
    };

    if(database === 1) mAdDashboardPlanModel.create(query, function(err, rows){
        cb(err);
    });
    else if(database === 2) mAdDashboardUnitModel.create(query, function(err, rows){
        cb(err);
    });
    else if(database === 3) mAdDashboardIdeaModel.create(query, function(err, rows){
        cb(err);
    });
    else  mAdDashboardAdUserModel.create(query, function(err, rows){
        cb(err);
    });
}

var dashboard_remove = function(param, database, cb){
    if(database === 1) mAdDashboardPlanModel.remove({ match : { plan_id : param.plan_id } }, function(err){
        cb(err);
    });
    else if(database === 2) mAdDashboardUnitModel.remove({ match : { unit_id : param.unit_id } }, function(err){
        cb(err);
    });
    else if(database === 3) mAdDashboardIdeaModel.remove({ match : { idea_id : param.idea_id } }, function(err){
        cb(err);
    });
    else mAdDashboardAdUserModel.remove({ match : { id : param.user_id } }, function(err){
        cb(err);
    });
}

var dashboard_gen = function(data, cb){
    var user_id = data.user_id;
    ads_add(user_id, function(err, id){
        if(err) cb(err, id);
        else {
            var param = {};
            param.user_id = user_id;
            param.start_date = data.start_time || '2017-1-1 00:00:00';
            param.end_date = data.end_time || '2017-1-2 00:00:00';
            param.id = id;
            if(data.unit === '小时') param.unit = 3;
            else if(data.unit === '天') param.unit = 4;
            else {
                cb('unit必须是小时或者天');
                return;
            }

            dashboard_insert(param, 0, function(err){
                if(err) cb(err);
                else {
                    dashboard_insert(param, 1, function(err){
                        if(err) cb(err);
                        else {
                            dashboard_insert(param, 2, function(err){
                                if(err) cb(err);
                                else {
                                    dashboard_insert(param, 3, function(err){
                                        cb(err, id);
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

var dashboard_del = function(id, cb){
    ads_del(id, function(err){
        dashboard_remove(id, 0, function(err2){
            dashboard_remove(id, 1, function(err3){
                dashboard_remove(id, 2, function(err4){
                    dashboard_remove(id, 3, function(err5){
                        cb(err || err2 || err3 || err4 || err5);
                        console.log('Dashboard data is cleaned up!');
                    });
                });
            });
        });
    });
}

var config = function(test_case, param, type){
    test_case.param.plan_id = param.id.plan_id;
    test_case.param.unit_id = param.id.unit_id;
    test_case.param.idea_id = param.id.idea_id;
    test_case.param.start_time = param.start_time;
    test_case.param.end_time = param.end_time;
    test_case.param.unit = param.unit;
    test_case.param.data_type = param.data_type;
    if(type === 'view') test_case.wantedModel.data.list = param.view;
    else if(type === 'summary') test_case.wantedModel.data = param.summary;
}

module.exports.dashboard_gen = dashboard_gen;
module.exports.dashboard_del = dashboard_del;
module.exports.config = config;