 /*
 * @file  task.js
 * @description task data model and API
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.02.20
 * @version 1.1.0 
 */
 
'use strict';
var MODELNAME = 'task.model';
var TABLENAME = 'task';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');

var mDBPool = require('../../common/db_pool');
// Model operation

// reference model
var mRefModel = {
    id: 1, //task id
    task_type: '',//task name
    process_time: new Date(), //process time
    status: '',
    job_id: '',
    retry_times: 1,
    create_time: new Date(),
    update_time: new Date(),
};

var gDBModel = new DBModel({
    modelName: MODELNAME,
    tableName: TABLENAME,
    refModel: mRefModel,
    debug: mDebug,
    db: mDBPool.taskDB,
});

module.exports.create = function(){
    return gDBModel;
}