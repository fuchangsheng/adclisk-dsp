 /*
 * @file  aduser_operators.js
 * @description dsp user operators info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
'use strict';
var MODELNAME = 'aduser_operators.model';
var TABLENAME = 'tb_aduser_operators';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    oper_id: '0',
    user_id: 0, //广告主
    name: 'name',
    email: '',
    role: 0, //0-主账号，1-管理员，2-操作员，3-观察员，4-财务人员
    audit_status: 0, //0-审核通过，1-未审核，2-审核中，3-审核未通过
    audit_message: '',//审核失败原因
    mobile: '',
    password: '', //SHA1
    portrait: '', //头像
    status: 0, //0-有效，其它无效
    create_time: new Date(), //
    update_time: new Date(), //
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