 /*
 * @file  account_recharge_log.js
 * @description dsp user account recharge log info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'message_notify_set.model';
var TABLENAME = 'tb_message_notify_set';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    id: '1', 
    user_id: 1,
    categories: 1, //0-系统消息，1-审核消息，2-账户消息，3-财务消息
    subcategories: 1,
    channel: 1, //0b001-站内信，0b010邮箱， 0b100手机短信
    create_time: new Date(), //
};

var gDBModel = new DBModel({
    modelName: MODELNAME,
    tableName: TABLENAME,
    refModel: mRefModel,
    debug: mDebug,
    db: mDBPool.adclickDspDB,
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