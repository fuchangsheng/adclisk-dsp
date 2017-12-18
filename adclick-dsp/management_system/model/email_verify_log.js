 /*
 * @file  email_verify_log.js
 * @description dsp email verify log data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.03
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'email_verify_log.model';
var TABLENAME = 'tb_email_verify_log';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    id: '',
    email: '',
    token: '',
    user_id: 1,
    type: 1,
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