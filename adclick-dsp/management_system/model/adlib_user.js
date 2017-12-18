 /*
 * @file  adlib_user.js
 * @description dsp adlib user info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
'use strict';
var MODELNAME = 'adlib_user.model';
var TABLENAME = 'users';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    user_id: 1,
    user_name: '',
    balance: 2,
    qualification_name: '',
    site_name: '',
    site_url: '',
    user_status: 2,
    create_time: new Date(), //
    update_time: new Date(), //
};

var gDBModel = new DBModel({
    modelName: MODELNAME,
    tableName: TABLENAME,
    refModel: mRefModel,
    debug: mDebug,
    db: mDBPool.adlibAdsDB,
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