 /*
 * @file  adlib_summary_daily.js
 * @description dsp ad user info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author yangshiyu
 * @date 2017.11.28
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'adlib_summary_daily.model';
var TABLENAME = 'dsp_daily_info';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    idea_id: 1,
    unit_id: 1,
    plan_id: 1,
    user_id: 1,
    adx: 1,
    ad_bid_type: 1,
    creative_type: 1,
    prov: "",
    city: "",
    adview_type: 1,
    site: "",
    part: new Date(),
    os: 1,
    carrier: 1,
    device: 1,
    request: 1,
    date: new Date(),
    bid: 1,
    imp: 1,
    click: 1,
    download: 1,
    cost: 1,
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