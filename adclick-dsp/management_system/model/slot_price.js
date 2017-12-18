 /*
 * @file  dsp_aduser.js
 * @description dsp user account recharge info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
'use strict';
var MODELNAME = 'slot_price.model';
var TABLENAME = 'tb_slot_price';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');
// Model operation

// reference model
var mRefModel = {
    id: 1, 
    user_id: 1,
    adx_id: 1,
    slot_id: 1,
    bottom_price: 1,
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
    return gDBModel;
};
