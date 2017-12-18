 /*
 * @file  adlib_palo_charge.js
 * @description dsp adlib charge data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.12.22
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'adlib_palo_charge.model';
var TABLENAME = 'dsp_daily_info';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    date : new Date(),
    user_id:1,// BIGINT,
    plan_id:1,// BIGINT,
    unit_id:1,// BIGINT,
    idea_id:1,// BIGINT,
    ad_bid_type:1,// INT,
    adx:1,// INT,
    creative_type:1,// INT,
    prov: '',// VARCHAR(32),
    city: '', //VARCHAR(32),
    adview_type: 1, //INT,
    site: '', //VARCHAR(128),
    request: 1, //BIGINT,
    bid: 1, //BIGINT SUM,
    imp: 1, //BIGINT SUM,
    click: 1, //BIGINT SUM,
    download: 1, //BIGINT SUM,
    cost: 1, //BIGINT SUM,
    revenue: 1, //BIGINT SUM
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