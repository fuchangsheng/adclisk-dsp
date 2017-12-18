/*
 * @fusheng
 * @2017.1.11
 */
 
'use strict';
var MODELNAME = 'adclick_dsp_realtime.model';
var TABLENAME = 'adclick_dsp_realtime';

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
    db: mDBPool.realTimeDB,
});


module.exports.create = function(){
    return gDBModel;
}