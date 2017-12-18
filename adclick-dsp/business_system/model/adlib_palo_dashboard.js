 /*
 * @file  adlib_palo_dashboard.js
 * @description dsp adclick_dsp_realtime overview runtime data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.11
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'adlib_palo_dashboard.model';
var TABLENAME = 'dsp_daily_info';

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
    creative_type: 1,
    prov: '',
    city: '',
    adview_type: 1,
    site: '',
    request: 1,
    bid: 1,
    imp: 1,
    click:1,
    cost: 1,
    download: 1,
    revenue: 1,
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