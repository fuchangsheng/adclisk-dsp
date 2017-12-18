 /*
 * @file  message_query_view.js
 * @description dsp message query view info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.30
 * @version 0.0.1 
 */
'use strict';
var MODELNAME = 'message_query_view.view';
var TABLENAME = 'v_msg_query';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    msg_id: '',
    categories: 1,
    subcategories: 1,
    title: '',
    content:'',
    receiver: '',
    notify_status: 1,
    create_time: new Date(), //
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