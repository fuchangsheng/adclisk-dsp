 /*
 * @file  adlib_dashboard_aduser.js
 * @description dsp adlib advertisers overview runtime data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.11
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'adlib_adx.model';
var TABLENAME = 'adx_configs';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');

var mDBPool = require('../../common/db_pool');
// Model operation

// reference model
var mRefModel = {
    id: 1, //adx id
    name: '',//adx name
    status: 1, //adx status
    create_time: new Date(),
    update_time: new Date(),
};

var gDBModel = new DBModel({
    modelName: MODELNAME,
    tableName: TABLENAME,
    refModel: mRefModel,
    debug: mDebug,
    db: mDBPool.adlibAdxDB,
});

module.exports.create = function(){
    return gDBModel;
}