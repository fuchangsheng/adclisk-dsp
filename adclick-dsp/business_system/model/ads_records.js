var MODELNAME = 'ads_records.model';
var TABLENAME = 'tb_ads_records';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');


// reference model
var mRefModel = {
    id: '', 
    user_id: 1,
    oper_id: '1', //
    plan_id:1,
    unit_id:1,
    idea_id:1,
    action:'',//操作
    result:'',//操作结果
    obj:'',//活动对象
    origin:'',//发起人
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