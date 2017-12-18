 /*
 * @file  verify_code.js
 * @description dsp verify code info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.03
 * @version 0.0.1 
 */
 
'use strict';
var MODELNAME = 'verify_code.model';
var TABLENAME = 'tb_verify_code_log';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    code_name: '',
    code_value:'', //sms code,
    status: 0,//0-验证通过，1-创建，2-已生成，3-验证失败
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
        tableName: tableName,
        table_name: table_name,
        refModel: refModel,
        debug: debug,
    });
    */
    return gDBModel;
}