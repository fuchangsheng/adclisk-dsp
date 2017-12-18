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
var mPaloDashboard = require('../../model/adlib_palo_dashboard').create();
var mRealtimeDashboard = require('../../model/adclick_dsp_realtime').create();
var mPlanModel = require('../../model/adlib_plans').create();
var mUnitModel = require('../../model/adlib_units').create();
var mIdeaModel = require('../../model/adlib_ideas').create();

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

function dashboard_insert(param, cb){
    expect(param.user_id).to.exist;
    expect(param.plan_id).to.exist;
    expect(param.unit_id).to.exist;
    expect(param.idea_id).to.exist;
    expect(param.start_date).to.exist;
    expect(param.end_date).to.exist;

    var date = param.start_date;
    var values = [];

    while(date.isBefore(param.end_date)) { 
        var value = {
            date: new Date(date),
            user_id: param.user_id,
            plan_id: param.plan_id,
            unit_id: param.unit_id,
            idea_id: param.idea_id,
            adx: random(8),
            creative_type: random(10),
            prov: '',
            city: '',
            adview_type: random(1000),
            site: 'www.dmtec.cn',
            request: random(1000),
            bid: random(1000),
            imp: random(1000),
            click:random(1000),
            cost: random(1000),
            download: random(100),
            revenue: random(100),
        };
        date.add(1, 'h');

        mLogger.debug(JSON.stringify(value));

        values.push(value);
    }

    var query = {
        fields: values[0],
        values: values,
    };

    if(param.realtime) mRealtimeDashboard.create(query, function(err, rows){
        cb(err, rows);
    });    

    else mPaloDashboard.create(query, function(err, rows){
        cb(err, rows);
    });    
}

var dashboard_remove = function(param, cb){
    if(param.realtime) mRealtimeDashboard.remove({match : { plan_id : param.plan_id } }, function(err){
        cb(err);
    });

    else mPaloDashboard.remove({match : { plan_id : param.plan_id } }, function(err){
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
            param.plan_id = id.plan_id;
            param.unit_id = id.unit_id;
            param.idea_id = id.idea_id;
            param.start_date = mMoment(data.start_time || '2017-1-1 00:00:00');
            param.end_date = mMoment(data.end_time || '2017-1-2 00:00:00');
            param.realtime = data.realtime;

            dashboard_insert(param, function(err){
                cb(err, id);
            });
        }
    });
}

var dashboard_del = function(id, cb){
    ads_del(id, function(err){
        dashboard_remove(id, function(err2){
            cb(err || err2);
            console.log('Dashboard data is cleaned up!');
        });
    });
}

module.exports.dashboard_gen = dashboard_gen;
module.exports.dashboard_del = dashboard_del;