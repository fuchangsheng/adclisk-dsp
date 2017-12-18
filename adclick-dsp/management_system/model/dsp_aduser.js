 /*
 * @file  dsp_aduser.js
 * @description dsp user account recharge info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
'use strict';
var MODELNAME = 'dsp_aduser.model';
var TABLENAME = 'tb_dsp_aduser';

var mDebug = require('debug')(MODELNAME);
var DBModel = require('./DBModel');
var mDBPool = require('../../common/db_pool');
// Model operation

// reference model
var mRefModel = {
    user_id: 1, //广告主id
    user_name:'', //广告主名
    company_name:'',
    company_license:'', //保存路径地址
    license_number: '', //营业执照编号
    license_valid_date_begin: new Date(),
    license_valid_date_end: new Date(),
    address:'',
    telephone:'',
    contacts_name:'',
    contacts_mobile:'',
    contacts_email:'',
    rbalance: 1,
    vbalance: 1,
    user_audit_status:1, //0-审核通过，1-未审核，2-审核未通过
    user_audit_message: '',//审核失败原因
    categories :1, //行业编号
    subcategories :1, //行业子类编号
    qualification:'', //资质保存路径
    qualification_number: '', //资质编号
    qualification_type: 1, //资质类型
    valid_date_begin: new Date(), //有效起始时间
    valid_date_end: new Date(), //有效截止时间
    categories_audit_status:1, //0-审核通过，1-未审核，2-审核未通过
    categories_audit_message: '',//审核失败原因
    invoiced_amount:1, //已开票金额，单位分
    uninvoice_amount:1,//未开票金额，单位分
    qualification_name: '',
    site_name: '',
    site_url:'',
    user_type: 1, //0-普通用户，1-vip用户

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
    return gDBModel;
}
