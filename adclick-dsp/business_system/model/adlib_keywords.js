 /*
 * @file  adlib_keywords.js
 * @description dsp adlib keywords info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.30
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'adlib_keywords.model';
var TABLENAME = 'keywords';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    keyword_id: 1,
    unit_id: 1,
    plan_id: 1,
    user_id: 1,
    keyword: '',
    match_type: 1, //0-full match, 1-shortword match
    bid: 1,
    landing_page: '',
    status: 1,
    imp_monitor_urls: '',
    click_monitor_urls: '',
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
    return gDBModel;
}