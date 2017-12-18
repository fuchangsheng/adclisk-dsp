 /*
 * @file  adlib_audit_users.js
 * @description dsp adlib adx based user audit data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.12.17
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'adlib_audit_users.model';
var TABLENAME = 'audit_users';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    id: 1,
    user_id: 1,
    adx_id: 1,
    signature: '',
    audit_status: 1,
    failure_message: '',
    create_time: new Date(),
    update_time: new Date(),
};

var gDBModel = new DBModel({
    modelName: MODELNAME,
    tableName: TABLENAME,
    refModel: mRefModel,
    debug: mDebug,
    db: mDBPool.adlibAuditDB,
});

module.exports.create = function(){
    return gDBModel;
}