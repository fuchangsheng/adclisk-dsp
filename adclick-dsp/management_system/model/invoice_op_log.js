 /*
 * @file  invoice_op_log.js
 * @description dsp invoice operation info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
'use strict';
var MODELNAME = 'invoice_op_log.model';
var TABLENAME = 'tb_invoice_op_log';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    id:'1', 
    user_id: 1,
    title: '',
    invoice_id: '',//发票id
    oper_id: '1',//操作人员id
    type: 1,//0-增值税普票，1-增值税专票
    item_name: '',//广告费，服务费
    amount: 1, //对应金额
    tax_info_ticket: '1', //公司发票信息id
    invoice_status: 1, //0-完成，1-提交中，2-处理中，
    post_name:'', //快递公司
    post_id: '', //快递号
    message:'',//拒绝理由
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