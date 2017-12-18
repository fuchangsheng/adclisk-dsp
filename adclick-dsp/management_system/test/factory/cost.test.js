/*
 * @file cost.test.js
 * @description test the interfaces of cost model
 * @copyright dmtec.cn reserved, 2017
 * @author tahitian
 * @date 2017/1/17
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'cost.test';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');

// dataModels

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mUtils = require('../common/utils');

//model
var cost_detail = require('../model/cost/cost_detail_adx.test').create();
var cost_overview = require('../model/cost/cost_overview_adx.test').create();

var msg;

msg = 'to test interfaces of cost module.';
mLogger.debug('try '+msg);

var adx_id = 1;

describe('cost module', function(){
    it(cost_detail.description, function(done){
        cost_detail.param.adx_id = adx_id;
        cost_detail.test({}, function(data){
            done();
        });
    });

    it(cost_overview.description, function(done){
        cost_overview.param.adx_id = adx_id;
        cost_overview.test({}, function(data){
            done();
        });
    });
});
