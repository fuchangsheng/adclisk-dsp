 /*
 * @file  adlib_ad_tags.js
 * @description dsp adlib ad tags info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2017.05.29
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'adlib_ad_tags.model';
var TABLENAME = 'ad_tags';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');

var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    id: 1,
    categories: '1',
    sub_categories: '1',
    code: 1,
    sub_code: 2,
    create_time: new Date(), //
    update_time: new Date(), //
    status: 0,
};

var gDBModel = new DBModel({
    modelName: MODELNAME,
    tableName: TABLENAME,
    refModel: mRefModel,
    debug: mDebug,
    db: mDBPool.adlibTags,
});

module.exports.create = function(){
    return gDBModel;
}
