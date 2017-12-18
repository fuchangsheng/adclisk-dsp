 /*
 * @file  msg_notify_log.js
 * @description dsp messages notifiy data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.06
 * @version 0.0.1 
 */
'use strict';
var MODELNAME = 'msg_notify_log.model';
var TABLENAME = 'tb_notify_log';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    id: '',
    msg_id: '',
    receiver: '',
    type: 1,
    notify_status: 1,
    create_time: new Date(), //
    update_time: new Date(),
};

var gDBModel = new DBModel({
    modelName: MODELNAME,
    tableName: TABLENAME,
    refModel: mRefModel,
    debug: mDebug,
    db: mDBPool.adclickMgrDB,
});

module.exports.create = function(){
   /*
    return new DBModel({
        modelName: modelName,
        tableName: tableName,
        refModel: refModel,
        debug: debug,
    });
    */
    return gDBModel;
}