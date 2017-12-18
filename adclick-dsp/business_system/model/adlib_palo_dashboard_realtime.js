 /*
 * @file  adlib_palo_dashboard.js
 * @description dsp adclick_dsp_realtime overview runtime data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.11
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'adlib_palo_dashboard_realtime.model';
var TABLENAME = 'dsp_charge';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');

var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    date: new Date(),
    user_id: 1,
    plan_id: 1,
    unit_id: 1,
    idea_id: 1,
    adx: 1,
    imp: 1,
    click:1,
    cost: 1,
    dsp_cost: 1,
};

var gDBModel = new DBModel({
    modelName: MODELNAME,
    tableName: TABLENAME,
    refModel: mRefModel,
    debug: mDebug,
    db: mDBPool.adlibPaloDB,
});


module.exports.create = function(){
    return gDBModel;
}