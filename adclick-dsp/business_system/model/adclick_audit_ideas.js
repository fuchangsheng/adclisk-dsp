 /*
 * @file  adclick_audit_ideas.js
 * @description dsp adclick idea aduits data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.12.10
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'adclick_audit_ideas.model';
var TABLENAME = 'tb_audit_ideas';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');

var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    id: 1,
    idea_id: 1,
    unit_id: 1,
    plan_id: 1,
    user_id: 1,
    mgr_id: 1,
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
    db: mDBPool.adclickMgrDB,
});


module.exports.create = function(){
    return gDBModel;
}