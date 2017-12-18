 /*
 * @file  adx_palo_dsp_daily_report.js
 * @description dsp runtime data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2017.11.15
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'dsp_daily_report.model';
var TABLENAME = 'dsp_daily_report';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');

var mDBPool = require('../../common/db_pool');
// Model operation

// reference model
var mRefModel = {
    date: new Date(), //create date
    part: new Date(),
    dsp_id: 1,
    requset: 1,
    bid: 1,
    win: 1,
    imp: 1,
    click: 1,
    download: 1,
    cost: 1,
    revernue: 1,
};

var gDBModel = new DBModel({
    modelName: MODELNAME,
    tableName: TABLENAME,
    refModel: mRefModel,
    debug: mDebug,
    db: mDBPool.adxPalo,
});

module.exports.create = function(){
    return gDBModel;
}