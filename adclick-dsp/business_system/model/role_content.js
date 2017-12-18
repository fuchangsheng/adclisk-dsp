 /*
 * @file  role_content.js
 * @description dsp role content data model and API
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.12.04
 * @version 3.0.1 
 */
 
'use strict';
var MODELNAME = 'role_content.model';
var TABLENAME = 'tb_role_contents';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');

var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    id: 1,
    user_id: 1,
    role_id: 1,
    category: 1,
    subcategory: 1,
    channel: 1,
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