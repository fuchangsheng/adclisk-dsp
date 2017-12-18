 /*
 * @file  mgtv_mobike_user.js
 * @description dsp user account recharge info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Jiangtu
 * @date 2017.10.03
 * @version 0.0.1 
 */
'use strict';
var MODELNAME = 'mgtv_mobike_user.model';
var TABLENAME = 'tb_mgtv_mobike_user';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');
// Model operation

// reference model
var mRefModel = {
    mobile: '',
    mobike: '',
    mgtv: '',
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
    return gDBModel;
}
