 /*
 * @file  adlib_dashboard_aduser.js
 * @description dsp adlib advertisers overview runtime data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.11
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'adlib_dashboard_aduser.model';
var TABLENAME = 'advertisers';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');
// Model operation

// reference model
var mRefModel = {
    date: new Date(),
    id: 1,
    request: 1,
    bid: 1,
    imp: 1,
    click:1,
    cost: 1,
    download: 1,
    revenue: 1,
    unit: 1,
};

var gDBModel = new DBModel({
    modelName: MODELNAME,
    tableName: TABLENAME,
    refModel: mRefModel,
    debug: mDebug,
    db: mDBPool.adclickDashBoardDB,
});


module.exports.create = function(){
    return gDBModel;
}