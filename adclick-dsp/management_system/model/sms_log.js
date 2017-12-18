 /*
 * @file  sms_log.js
 * @description dsp sms log info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.03
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'sms_log.model';
var TABLENAME = 'tb_sms_log';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    mobile: '',
    smscode:'' ,//sms code,
    status: 1,
    create_time: new Date(),//
    update_time:new Date(),
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