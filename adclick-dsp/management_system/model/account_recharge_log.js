/*
 * @file  account_recharge_log.js
 * @description dsp user account recharge info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
'use strict';
var MODELNAME = 'account_recharge_log.model';
var TABLENAME = 'tb_account_recharge_log';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    id: 'id', 
    user_id: 1,
    account_type: 1, //充值账户类型，1-实际账户，2-虚拟账户
    oper_id:'1', // 操作人员id
    amount: 1, //充值金额
    ticket_no: '', //充值流水号
    charge_type: 1,//0-网银，1-支付宝，2-微信, 3-虚拟账户人工
    charge_status: 1,//0-充值完成，1-充值中，2- 审核中, 3-充值失败
    create_time: new Date(), //
    update_time: new Date(), //
};

module.exports.create = function(){
    return new DBModel({
        modelName: MODELNAME,
        tableName: TABLENAME,
        refModel: mRefModel,
        debug: mDebug,
        db: mDBPool.adclickDspDB,
    });
}