 /*
 * @file  aduser_invoice_account.js
 * @description dsp user invoice account info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
'use strict';
var MODELNAME = 'aduser_invoice_account.model';
var TABLENAME = 'tb_aduser_invoice_account';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');

// Model operation

// reference model
var mRefModel = {
    id:'1', 
    user_id: 1,
    title: '', //发票抬头
    type: 1,
    tax_no: '', //税号
    address: '',//单位地址
    phone:'', //电话号码
    bank:'',//开户银行
    bank_account_no: '', //银行账号
    receiver_name: '', //收件人姓名
    receiver_address: '', //收件人地址
    receiver_email: '', //收件人邮件
    receiver_mobile: '',//收件人电话
    audit_status: 1,
    audit_message: '',//审核失败原因
    qualification: '',
    status: 0,//信息是否有效，0-有效，1-无效，此条记录不允许删除，
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