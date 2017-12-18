 /*
 * @file  adx_dsp_config.js
 * @description dsps in adx configureation info model and API
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.15
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'adx_dsp_config.model';
var TABLENAME = 'adx_dsp_configs';

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
    db: mDBPool.adxConfig,
});

module.exports.create = function(){
    return gDBModel;
}