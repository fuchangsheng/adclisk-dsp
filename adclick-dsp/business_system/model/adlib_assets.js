 /*
 * @file  adlib_assets.js
 * @description dsp adlib assets data model and API
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.07.07
 * @version 0.1.1 
 */
 
'use strict';
var MODELNAME = 'adlib_assets.model';
var TABLENAME = 'assets';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    asset_id: 1,
    user_id: 1,
    asset_name: '',
    url: '',
    thumbnail: '',
    width: 1,
    height: 1,
    duration: 1,
    ratio: '',
    asset_type: 1,
    asset_tag: '',
    create_time: new Date(),
    update_time: new Date(),
};

var gDBModel = new DBModel({
    modelName: MODELNAME,
    tableName: TABLENAME,
    refModel: mRefModel,
    debug: mDebug,
    db: mDBPool.adlibAdsDB,
});


module.exports.create = function(){
    return gDBModel;
}