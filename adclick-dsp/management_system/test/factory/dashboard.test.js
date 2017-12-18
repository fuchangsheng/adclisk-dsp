/*
 * @file dashboard.test.js
 * @description test the interfaces of dashboard model
 * @copyright dmtec.cn reserved, 2016
 * @author tahitian
 * @date 2016.12.18
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'dashboard.test';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');

// constants
var testConstants = require('../common/constants');

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);

// functions
var dashboard_gen = require('../functions/dashboard_func').dashboard_gen;
var dashboard_del = require('../functions/dashboard_func').dashboard_del;

//model
var overview_all = require('../model/dashboard/dashboard_overview_all.test').create();
var download_all = require('../model/dashboard/dashboard_overview_all_download.test').create();
var overview_user = require('../model/dashboard/dashboard_overview_user.test').create();
var download_user = require('../model/dashboard/dashboard_overview_user_download.test').create();
var overview_adx = require('../model/dashboard/dashboard_overview_adx.test').create();
var download_adx = require('../model/dashboard/dashboard_overview_adx_download.test').create();

var msg;

msg = 'to test interfaces of dashboard module.';
mLogger.debug('try '+msg);

var user_id = testConstants.USER_ID;
var adx_id = 8;

var config = function(test_case, param, list){
    test_case.param.start_time = param.start_time;
    test_case.param.end_time = param.end_time;
    test_case.param.unit = param.unit;
    test_case.param.data_type = param.data_type;
    if(list) test_case.wantedModel.data.list = param.list;
}

describe('', function(){
    var id;
    var param = {
        start_time : '2017-1-1 00:00:00',
        end_time : '2017-1-2 00:00:00',
        unit : '小时',
        data_type : '展现,点击',
        list : [{
            date_time : '',
            imp : 0,
            click : 0
        },]
    };

    before(function(done){
        var conf = {
            user_id : user_id,
            start_time : param.start_time,
            end_time : param.end_time,
            realtime : false
        }
        dashboard_gen(conf, function(err, data){
            id = data;
            done(err);
        });
    });

    after(function(done){
        if(id) {
            id.realtime = false;
            dashboard_del(id, done);
        }
        else done();
    });

    it(overview_all.description, function(done){
        config(overview_all, param, true);
        overview_all.test({}, function(data){
            done();
        });
    });

    it(download_all.description, function(done){
        config(download_all, param, false);
        download_all.test({}, function(data){
            done();
        });
    });

    it(overview_adx.description, function(done){
        config(overview_adx, param, true);
        overview_adx.param.adx_id = adx_id;
        overview_adx.test({}, function(data){
            done();
        });
    });

    it(download_adx.description, function(done){
        config(download_adx, param, false);
        download_adx.param.adx_id = adx_id;
        download_adx.test({}, function(data){
            done();
        });
    });

    it(overview_user.description, function(done){
        config(overview_user, param, true);
        overview_user.param.user_id = user_id;
        overview_user.test({}, function(data){
            done();
        });
    });

    it(download_user.description, function(done){
        config(download_user, param, false);
        download_user.param.user_id = user_id;
        download_user.test({}, function(data){
            done();
        });
    });
});
