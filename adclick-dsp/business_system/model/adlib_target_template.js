 /*
 * @file  adlib_target_template.js
 * @description dsp adlib target template info data model and API
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.02.21
 * @version 1.1.0 
 */
 
'use strict';
var MODELNAME = 'adlib_target_template.model';
var TABLENAME = 'targeting_templates';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');

var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    template_id: 1,
    template_name: '',
    user_id: 1,
    tag: '',
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
    return gDBModel;
}