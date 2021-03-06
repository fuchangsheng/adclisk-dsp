 /*
 * @file  role.js
 * @description dsp role info data model and API
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.12.04
 * @version 3.0.1 
 */
 
'use strict';
var MODELNAME = 'role.model';
var TABLENAME = 'tb_roles';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');

var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    id: 1,
    role_name: '',
    user_id: 1,
    status: 1,
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
    return gDBModel;
}