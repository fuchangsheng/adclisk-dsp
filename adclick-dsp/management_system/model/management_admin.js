 /*
 * @file  management_admin.js
 * @description dsp management administrator data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.10.30
 * @version 0.0.1 
 */
'use strict';
var MODELNAME = 'management_admin.model';
var TABLENAME = 'tb_administrator';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    id: 1,
    name: '',
    password: '',
    role: 0,
    phone: '',
    email: '',
    status: 1,
    create_time: new Date(), //
    update_time: new Date(), //
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