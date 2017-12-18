 /*
 * @file  msg_notify_status.js
 * @description dsp user msg notify status info data model and API
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.03.09
 * @version 1.2.0 
 */
 
'use strict';
var MODELNAME = 'msg_notify_status.model';
var TABLENAME = 'tb_message_notify_status';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    user_id: 1,
    categories: 1, //0-系统消息，1-审核消息，2-账户消息，3-财务消息
    subcategories: 1,
    status: 1, //0-已发送， 1-未发送
    create_time: new Date(), //
    update_time: new Date(),
};

var gDBModel = new DBModel({
    modelName: MODELNAME,
    tableName: TABLENAME,
    refModel: mRefModel,
    debug: mDebug,
    db: mDBPool.adclickDspDB,
});

module.exports.create = function(){
    return gDBModel;
}