 /*
 * @file  adlib_idea_price.js
 * @description dsp adlib ad ideas info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'adlib_idea_price.model';
var TABLENAME = 'idea_price';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    idea_id: 1,
    type: 1,
    price: 1,
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