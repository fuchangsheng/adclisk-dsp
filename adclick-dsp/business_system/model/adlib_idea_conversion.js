 /*
 * @file  adlib_ideas.js
 * @description dsp adlib ad ideas info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'adlib_idea_conversion.model';
var TABLENAME = 'idea_conversion';

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
    date: new Date(),
    conversion: 1,
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