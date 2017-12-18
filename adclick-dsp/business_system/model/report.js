 /*
 * @file  report.js
 * @description dsp report data model and API
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.12.09
 * @version 3.0.1 
 */
 
var MODELNAME = 'report.model';
var TABLENAME = 'tb_reports';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');


// reference model
var mRefModel = {
    id: 1, 
    name: '1',
    user_id: 1, //
    type: 1,
    targets: '',
    elems: '1',
    detail_type: 1,
    delivery_status: '',
    start_time: new Date(),
    end_time: new Date(),
    create_time: new Date(), 
    update_time: new Date(), 
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