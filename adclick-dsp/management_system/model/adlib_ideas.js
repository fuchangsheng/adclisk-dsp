 /*
 * @file  adlib_ideas.js
 * @description dsp adlib ad ideas info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'adlib_ideas.model';
var TABLENAME = 'ideas';

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
    idea_name: '',
    idea_slots: '',
    idea_type: 1,
    landing_page: '',
    assets: '',
    adview_type: 1,
    idea_trade: '',
    idea_status: 1,
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