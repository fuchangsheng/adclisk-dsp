/*
/*
 * @file  aduit_record.js
 * @description dsp aduit to record info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.11.23
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'aduit_record.logic';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');

//models
var mAuditLogModel = require('../../model/audit_log').create();
var mAdManagerModel = require('../../model/management_admin').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mUtils = require('../../../utils/utils');
var mDataHelper = require('../../../utils/data_helper');

//constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

function record(module_name, param, err, data){
    if(err &&(('code' in err) && (err['code'] === ERRCODE.PARAM_INVALID))){
        return;
    }

    preProcess(module_name, param, err, data);

    var info = getLevelAndType(module_name, err);
    if(info.type === ADCONSTANTS.AUDITMANAGERTYPE.UNDEFINE.code){
        return;
    }

    try{
        var logmsg = ' to add audit record for manager:' + param.mgr_id;
        mLogger.debug('Try '+logmsg);

        mAsync.waterfall([
            function(next){
                formatContent(module_name, param, err, data, next);
            }, function(content, next) {
                actualInsertIntoRecord(param, info, content, next);
            },
        ], function(err, data) {
            if(err) {
                mLogger.error('Failed' + logmsg);
            } else {
                mLogger.debug('Success' + logmsg);
            }
        });
    }catch(e){
        mLogger.error('Failed to record audit:' + e);
    }
}

function actualInsertIntoRecord(param, info, content, fn) {
    var mgr_id = param.mgr_id + '';
    var id = mDataHelper.createId('audit_log'+mgr_id);
    var level = info.level;
    var type = info.type;
    var value = {
        id : id,
        mgr_id: mgr_id,
        level: level,
        type: type,
        content: content,
    };
    var query = {
        fields: value,
        values: [value],
    };

    //2.2 create it in the database
    mAuditLogModel.create(query, function(err, rows){
        if (err) {
            fn(err);
        }else {
            fn(null, {});
        }
    });
}

function preProcess(module_name, param, err, data) {
    if(err) {
        return;
    }

    switch(module_name) {
    case 'login.logic' :
        param.mgr_id = data.auth.mgr_id;
        break;
    default:
        break;
    }
}

function getManagerInfo(mgr_id, mgr_name) {
    return mgr_name ? '管理员账号['+mgr_name+']' : '管理员ID['+mgr_id+']';
}

function formatContent(module_name, param, err, data, fn){
    var msg = 'to format content';
    mLogger.debug('Try ' + msg);

    var res = data;
    var req = param;
    var errCode;
    var errMsg;

    if(err) {
        errCode = err.code || 1;
        errMsg = err.msg || err;
    }

    var mgr_id;
    var added_mgr_name;
    switch(module_name) {
    case 'admin_add.logic':
        added_mgr_name = req.name;
        break;
    case 'admin_delete.logic':
        mgr_id = req.target_mgr_id;
        break;
    case 'admin_update.logic':
        mgr_id = req.target_mgr_id;
        break;
    default:
        break;
    }

    mAsync.waterfall([
        function(next) {
            if(!mgr_id){
                return next(null, {});
            }

            var match = {
                id: mgr_id,
            };
            var select = {
                role: 1,
                id: mgr_id,
                name: ''
            };

            var query = {
                select: select,
                match: match,
            };

            mAdManagerModel.lookup(query, function(err, rows) {
                if (err) {
                    mLogger.debug();
                    next(null, {});
                }else {
                    next(null, rows);
                }
            });
        },
        function(rows, next) {
            var operTarget = ADCONSTANTS.ADUITMANAGERID.UNDEFINE;
            var mgr_name = rows[0] ? rows[0].name : '';
            if(added_mgr_name) {
                mgr_name = added_mgr_name;
            }
            var content = '';

            switch(module_name) {
            case 'admin_add.logic':
                operTarget = ADCONSTANTS.ADUITMANAGERID.ADDMANAGER;
                if(err) {
                    content = operTarget.name + ' ' + getManagerInfo(mgr_id, mgr_name) + ' 操作失败 失败code['+errCode+']'+' 失败消息['+errMsg+']';
                } else {
                    content = operTarget.name + ' ' + getManagerInfo(mgr_id, mgr_name);
                }
                break;
            case 'admin_delete.logic':
                operTarget = ADCONSTANTS.ADUITMANAGERID.DELMANAGER;
                if(err) {
                    content = operTarget.name + ' ' + getManagerInfo(mgr_id, mgr_name) + ' 操作失败 失败code['+errCode+']'+' 失败消息['+errMsg+']';
                } else {
                    content = operTarget.name + ' ' + getManagerInfo(mgr_id, mgr_name);
                }
                break;
            case 'admin_update.logic':   //update
                operTarget = ADCONSTANTS.ADUITMANAGERID.VERIFYMANAGER;
                if(err) {
                    content = operTarget.name + ' '+getManagerInfo(mgr_id, mgr_name) + ' 操作失败 失败code['+errCode+']'+' 失败消息['+errMsg+']';
                } else {
                    content = operTarget.name + ' '+getManagerInfo(mgr_id, mgr_name);
                }
                break;
            case 'faccount_vrecharge.logic':
                operTarget = ADCONSTANTS.ADUITMANAGERID.VERCHARGE;
                if(err) {
                    content = operTarget.name + '  用户ID['+req.user_id+'] 金额['+mUtils.fenToYuan(req.amount)+'元]' + ' 操作失败 失败code['+errCode+']'+' 失败消息['+errMsg+']';
                } else {
                    content = operTarget.name + '  用户ID['+req.user_id+'] 金额['+mUtils.fenToYuan(req.amount)+'元]';
                }
                break;
            case 'faccount_recharge_update.logic':
                operTarget = ADCONSTANTS.ADUITMANAGERID.VERCHARGEUPDATE;
                if(err) {
                    content = operTarget.name + '  用户ID['+req.user_id+'] 流水号['+req.ticket_no+'] 充值号['+req.charge_id+']' + ' 操作失败 失败code['+errCode+']'+' 失败消息['+errMsg+']';
                } else {
                    content = operTarget.name + '  用户ID['+req.user_id+'] 流水号['+req.ticket_no+'] 充值号['+req.charge_id+']';
                }
                break;
            case 'faccount_invoice_request_process.logic':
                operTarget = ADCONSTANTS.ADUITMANAGERID.INVOICEREQUEST;
                if(err) {
                    content = operTarget.name + ' 发票号['+req.ticket_id +']'+ '  失败code['+errCode+']'+' 失败消息['+errMsg+']';
                } else {
                    content = operTarget.name + ' 发票号['+req.ticket_id+']';
                }
                break;
            case 'faccount_invoice_request_delivery.logic':
                operTarget = ADCONSTANTS.ADUITMANAGERID.INVOICERDELIVERY;
                if(err) {
                    content = operTarget.name + ' 发票号['+req.ticket_id+']' + ' 快递号['+req.post_id+']' + '  失败code['+errCode+']'+' 失败消息['+errMsg+']';
                } else {
                    content = operTarget.name + ' 发票号['+req.ticket_id+']' + ' 快递号['+req.post_id+']';
                }
                break;
            default:
                operTarget = ADCONSTANTS.ADUITMANAGERID.UNDEFINE;
                break;
            }

            if(operTarget == ADCONSTANTS.ADUITMANAGERID.UNDEFINE) {
                var res = err ? err : data;
                var content = {
                    module_name: module_name,
                    res: res,
                };
                content = JSON.stringify(content);
                content = content.replace(/"/g,"\\\"");
            }

            next(null, content);
        },
    ], function(err, data){
        if(err){
            mLogger.error('Failed'  + msg);
            fn(err);
        }else{
            mLogger.debug('Success ' + msg);
            fn(null, data);
        }
    });
}

function getLevelAndType(module_name, err){
    var level = 4;
    var type = ADCONSTANTS.AUDITMANAGERTYPE.UNDEFINE.code;

    switch(module_name){
    // admin
    case 'admin_add.logic':
    case 'admin_delete.logic':
    case 'admin_update.logic':
        level = 2;
        //type = ADCONSTANTS.AUDITMANAGERTYPE.MANAGER.code;
        type = ADCONSTANTS.AUDITMANAGERTYPE.OPERATOR.code;
        break;
    // ads
    case 'ads_idea_audit.logic':
    case 'ads_idea_op.logic':
    case 'ads_plan_op':   //update
        level = 3;
        type = ADCONSTANTS.AUDITMANAGERTYPE.ADS.code;
        break;
    // aduser
    case 'aduser_user_audit.logic':
    case 'aduser_user_invoice_audit.logic':
    case 'aduser_user_qulification_audit.logic':
        level = 3;
        type = ADCONSTANTS.AUDITMANAGERTYPE.ADUSER.code;
        break;
    // finance
    case 'faccount_invoice_request_audit.logic':
        level = 2;
        type = ADCONSTANTS.AUDITMANAGERTYPE.FINANCE.code;
        break;
    case 'faccount_invoice_request_delivery.logic':
    case 'faccount_invoice_request_process.logic':
        level = 4;
        type = ADCONSTANTS.AUDITMANAGERTYPE.OPERATOR.code;
        break;
    case 'faccount_invoice_request_finish.logic':
        level = 4;
        type = ADCONSTANTS.AUDITMANAGERTYPE.FINANCE.code;
        break;
    case 'faccount_recharge_update.logic':
    case 'faccount_vrecharge.logic':
        level = 2;
        //type = ADCONSTANTS.AUDITMANAGERTYPE.FINANCE.code;
        type = ADCONSTANTS.AUDITMANAGERTYPE.OPERATOR.code;
        break;
    // user
    case 'login.logic':
        if(!err) {
            level = 3;
            type = ADCONSTANTS.AUDITMANAGERTYPE.USER.code;
        }
        break;
    case 'logout.logic':
        level = 3;
        type = ADCONSTANTS.AUDITMANAGERTYPE.USER.code;
        break;
    case 'pwd_forget.logic':
    case 'pwd_reset.logic':
        level = 2;
        type = ADCONSTANTS.AUDITMANAGERTYPE.USER.code;
        break;
    case 'register.logic':
        level = 2;
        type = ADCONSTANTS.AUDITMANAGERTYPE.OPERATOR.code;
        break;
    case 'sms_request.logic':
    case 'sms_verify.logic':
        type = ADCONSTANTS.AUDITMANAGERTYPE.MESSAGE.code;
        level = 4;
        break;

    default:
        break;
    }


    return {level: level, type: type};
}

module.exports.record = record;
