 /*
 * @file  adlib_uints.js
 * @description dsp adlib unit info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'adlib_units.model';
var TABLENAME = 'units';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    unit_id: 1,
    plan_id: 1,
    user_id: 1,
    unit_name: '',
    bid: 1,//uint fen,
    bid_type: 1,//(0 - cpm，1 - cpc，2 - cpd，3 - cpt)
    unit_status: 0,
    create_time: new Date(), //
    update_time: new Date(), //
};

var gDBModel = new DBModel({
    modelName: MODELNAME,
    tableName: TABLENAME,
    refModel: mRefModel,
    debug: mDebug,
    db: mDBPool.adlibAdsDB,
});

module.exports.create = function(){
   /*
    return new DBModel({
        modelName: modelName,
        tableName: tableName,
        refModel: refModel,
        debug: debug,
        db: adlibDB,
    });
    */
    return gDBModel;
}