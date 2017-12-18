 /*
 * @file  bidders.js
 * @description bidders data model and API
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.03.09
 * @version 1.2.0 
 */
 
'use strict';
var MODELNAME = 'bidders.model';
var TABLENAME = 'bidders';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');

var mDBPool = require('../../common/db_pool');
// Model operation

// reference model
var mRefModel = {
    id: 1, //id
    host: '',//task name
    port: 1, //process time
    user: '',
    password: '',
    work_dir: '',
    failure_message: '',
    bidder_status: 1,
    create_time: new Date(),
    update_time: new Date(),
};

var gDBModel = new DBModel({
    modelName: MODELNAME,
    tableName: TABLENAME,
    refModel: mRefModel,
    debug: mDebug,
    db: mDBPool.controllerDB,
});

module.exports.create = function(){
    return gDBModel;
}