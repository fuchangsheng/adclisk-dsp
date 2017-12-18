 /*
 * @file  report_limit.js
 * @description dsp report limit info data model and API
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.12.09
 * @version 3.0.1 
 */
 
var MODELNAME = 'report_limit.model';
var TABLENAME = 'tb_report_limit';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');


// reference model
var mRefModel = {
    report_id: 1, 
    user_id: 1,
    limit_name: '1', //
    op: 1,
    value1:1,
    value2:1,
    create_time: new Date(), 
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