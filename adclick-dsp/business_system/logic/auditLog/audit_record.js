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
var mAduitLogModel = require('../../model/audit_log').create();
var mAdsRecordsModel = require('../../model/ads_records').create();
var mAdOperatorsModel = require('../../model/aduser_operators').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mUtils = require('../../../utils/utils');
var mDataHelper = require('../../../utils/data_helper');
var adUtils = require('../utils/ads_utils');

//constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var MODULENAMES = {
    REGISTER: 'register.logic',
    RESETPASSWORD1: 'pwd_forget.logic',
    RESETPASSWORD2: 'pwd_reset.logic',
    EDITACCOUNTINFO: 'ad_account_info_edit.logic',
    EDITACCOUNTQULIFICATION: 'ad_account_qualification_edit.logic',
    ADDROLE: 'ad_account_role_create.logic',
    EDITROLE: 'ads_account_role_edit.logic',
    DELROLE: 'ad_account_role_del.logic',
    ADDOPERATOR: 'ad_account_operator_add.logic',
    EDITOPERATOR: 'ad_account_operator_edit.logic',
    DELOPERATOR: 'ad_account_operator_del.logic',
    CREATEADSPLAN:  '',
    EDITADSPLAN: '',
    TRASHADSPLAN: '',
    COPYADSPLAN: '',
    CHANGEADSPLANSTATUS: '',
    DELADSPLAN: '',
    SAVEPLANREPORTS: '',
    CREATEADSUNIT: '',
    EDITADSUNIT: '',
    TRASHADSUNIT: '',
    DELADSUNIT: '',
    EDITTARGETSETTING: '',
    CHANGEADSUNITSTATUS: '',
    COPYADSUNIT: '',
    LOWESTCOSTSETTING: '',
    SAVEUNITREPORTS: '',
    CREATEADSIDEA: '',
    EDITADSIDEA: '',
    TRASHADSIDEA: '',
    DELADSIDEA: '',
    COPYADSIDEA: '',
    CHANGEADSIDEASTATUS: '',
    CREATERULE: '',
    EDITRULE: '',
    DELRULE: '',
    CHANGERULESTATUS: '',
    CREATETARGETTEMPLATE: 'ads_target_template_create.logic',
    EDITTARGETTEMPLATE: 'ads_target_template_edit.logic',
    DELTARGETTEMPLATE: 'ads_target_template_del.logic',
    CREATEASSET: 'assets_add.logic',
    EDITASSET: 'assets_edit.logic',
    DELASSET: 'assets_del.logic',
    DELREPORTS: '',
    CREATECUSTOMAUDIENCE: '',
    DELCUSTOMAUDIENCE: '',
    WECHATPAY: 'wechat_pay.logic',
    ALIPAY: 'alipay.logic',
    CREATEINVOICEINFO: 'ad_account_invoice_add.logic',
    EDITINVOICEINFO: 'ad_account_invoice_edit.logic',
    DELINVOICEINFO: 'ad_account_invoice_del.logic',
    INVOICE: 'faccount_invoice_request.logic',
    INVOICESIGN: 'faccount_invoice_sign.logic',
    ADDMESSAGERECEIVER: 'msg_receiver_add.logic',
    DELMESSAGERECEIVER: 'msg_receiver_del.logic',
    EDITMESSAGESETTING: 'msg_receiver_edit.logic',
    LOGIN: 'login.logic'    
};

function record(module_name, param, err, data){
    mLogger.debug(module_name);
    if(err &&(('code' in err) && (err['code'] === ERRCODE.PARAM_INVALID))){
        return;
    }


    //Only successful action should be recorded.
    if(err){return;}

    preProcess(module_name, param, err, data);

    var info = getLevelAndType(module_name, err);
    if(info.type === ADCONSTANTS.AUDITTYPE.UNDEFINE.code){
        return;
    }

    try{
        var user_id = param.user_id;
        if(module_name == MODULENAMES.LOGIN) {
            user_id = data.auth ? data.auth.user_id : 0;
        }
        param.user_id = user_id;
        var logmsg = ' to add aduit record for user:' + user_id;
        mLogger.debug('Try '+logmsg);

        mAsync.waterfall([
            function(next){
                formatContent(module_name, param, err, data, next);
            }, function(content, next) {
                actualInsertIntoRecord(param, info, content, next);
            }, function(content, next){
                insetIntoAdsRecords(param, content, next);
            }
        ], function(err, data) {
            if(err) {
                mLogger.error('Failed' + logmsg);
            } else {
                mLogger.debug('Success' + logmsg);
            }
        });
    }catch(e){
        mLogger.error('Failed to record aduit:' + e);
    }
}

function actualInsertIntoRecord(param, info, content, fn) {
    var user_id = param.user_id || 0;
    var oper_id = param.oper_id || '';
    mLogger.debug(oper_id);
    var id = mDataHelper.createId('aduit_log'+user_id+oper_id);
    var level = info.level;
    var type = info.type;
    var value = {
        id : id,
        user_id: user_id,
        oper_id: oper_id,
        level: level,
        type: type,
        content: JSON.stringify(content).replace(/"/g,"\\\""),
        origin:content.oper_name
    };
    var query = {
        fields: value,
        values: [value],
    };

    //2.2 create it in the database
    mAduitLogModel.create(query, function(err, rows){
        if (err) {
            fn(err);
        }else {
            fn(null, content);
        }
    });

}

function insetIntoAdsRecords(param, content, next){
    if(content.isAdsRecord){
        mLogger.debug();
        var id = mDataHelper.createId('ads_records' + content.user_id + content.oper_id);
        var value = {
            id:id,
            user_id:content.user_id || -1,
            oper_id:param.oper_id || '',
            plan_id:content.plan_id || -1,
            unit_id:content.unit_id || -1,
            idea_id:content.idea_id || -1,
            action:content.action + '',
            result:content.result + '',
            obj:content.obj + '',
            origin:content.oper_name + ''
        };
        var query = {
            fields:value,
            values:[value]
        };
        mAdsRecordsModel.create(query, function(err, rows){
            if(err){next(err);}
            else{next(null,{});}
        });
    }else{
        next(null,{});
    }
}

function preProcess(module_name, param, err, data) {
    if(err) {
        return;
    }

    switch(module_name) {
    case MODULENAMES.LOGIN :
        param.mgr_id = data.auth.user_id;
        break;
    default:
        break;
    }
}

function getOperatorInfo(oper_id, oper_name) {
    return oper_name ? '协助者账号['+oper_name+']' : '协助者ID['+oper_id+']';
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

    mAsync.waterfall([
        function(next) {
            var oper_id = param.oper_id || '';
            switch(module_name) {
            case MODULENAMES.DELOPERATOR:
                oper_id = req.target_oper_id;
                break;
            default:
                break;
            }

            if(!oper_id){
                return next(null, {});
            }

            var match = {
                oper_id: oper_id,
            };
            var select = {
                oper_id: oper_id,
                name: ''
            };

            var query = {
                select: select,
                match: match,
            };

            mAdOperatorsModel.lookup(query, function(err, rows) {
                if (err) {
                    next(null, {});
                }else {
                    next(null, rows);
                }
            });
        },
        //planinfo
        function(operatorInfo,next){
            var plan_id = req.plan_id || res.plan_id;
            if(plan_id){
                adUtils.getPlanInfoById(plan_id,function(err,info){
                    if(!err){req.planInfo = info;}
                    else{req.planInfo = {plan_name:plan_id};}
                    next(null,operatorInfo);
                });
            }else{
                next(null,operatorInfo);
            }
        },
        //unitinfo
        function(operatorInfo,next){
            var unit_id = req.unit_id || res.unit_id;
            if(unit_id){
                adUtils.getUnitInfoById(unit_id,function(err,info){
                    if(!err){req.unitInfo = info;}
                    else{req.unitInfo = {unit_name:unit_id};}
                    next(null,operatorInfo);
                });
            }else{
                next(null,operatorInfo);
            }
        },
        //ideainfo
        function(operatorInfo,next){
            var idea_id = req.idea_id || res.idea_id;
            if(idea_id){
                adUtils.getIdeaInfoById(idea_id,function(err,info){
                    if(!err){req.ideaInfo = info;}
                    else{req.ideaInfo = {idea_name:idea_id};}
                    next(null,operatorInfo);
                });
            }else{
                next(null,operatorInfo);
            }
        },
        //targetoperatorinfo
        function(operatorInfo,next){
            var target_oper_id = req.target_oper_id || res.target_oper_id;
            if(target_oper_id){
                adUtils.getOperatorInfoById(target_oper_id,function(err,info){
                    if(!err){req.targetOperatorInfo = info;}
                    else{req.targetOperatorInfo = {name:target_oper_id};}
                    next(null,operatorInfo);
                });
            }else{
                next(null,operatorInfo);
            }
        },
        //targettemplateinfo
        function(operatorInfo,next){
            var template_id = req.template_id || res.template_id;
            if(template_id){
                adUtils.getTemplateInfoById(template_id,function(err,info){
                    if(!err){req.templateInfo = info;}
                    else{req.templateInfo = {template_name:template_id};}
                    next(null,operatorInfo);
                });
            }else{
                next(null,operatorInfo);
            }
        },
        //assetinfo
        function(operatorInfo,next){
            var asset_id = req.asset_id || res.asset_id;
            if(asset_id){
                adUtils.getAssetInfoById(asset_id,function(err,info){
                    if(!err){req.assetInfo = info;}
                    else{req.assetInfo = {asset_name:asset_id};}
                    next(null,operatorInfo);
                });
            }else{
                next(null,operatorInfo);
            }
        },
        //roleInfo
        function(operatorInfo,next){
            var role_id = req.role_id || res.role_id;
            if(role_id){
                adUtils.getRoleInfoById(role_id,function(err,info){
                    if(!err){req.roleInfo = info;}
                    else{req.roleInfo = {name:role_id};}
                    next(null,operatorInfo);
                });
            }else{
                next(null,operatorInfo);
            }
        },
        function(operatorInfo, next) {
            var operTarget = ADCONSTANTS.ADUITOPERATEID.UNDEFINE;
            var oper_id = operatorInfo[0] ? operatorInfo[0].oper_id : '';
            var oper_name = operatorInfo[0] ? operatorInfo[0].name : '';
            var content = {
                oper_name:oper_name || '',
                user_id:req.user_id || res.user_id || -1,
                plan_id:req.plan_id || res.plan_id || -1,
                unit_id:req.unit_id || res.unit_id || -1,
                idea_id:req.idea_id || res.idea_id || -1,
                isAdsRecord:false
            };
            var resultSuffix = err ? ('失败' + '[' + (err.code || 1)  +  ']') : '成功';
            switch(module_name) {
                case MODULENAMES.REGISTER:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.REGISTER;
                    content.action = operTarget.name;
                    content.result = operTarget.name + ':' + req.name + ' ' + resultSuffix;
                    content.obj = '广告主账户';
                    break;
                case MODULENAMES.RESETPASSWORD1:
                case MODULENAMES.RESETPASSWORD2:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.RESETPASSWORD;
                    content.action = operTarget.name;
                    content.result = operTarget.name + resultSuffix;
                    content.obj = '广告主账户';
                    break;
                case MODULENAMES.EDITACCOUNTINFO:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.EDITACCOUNTINFO;
                    content.action = operTarget.name;
                    content.result = operTarget.name + resultSuffix;
                    content.obj = '广告主账户';
                    break;
                case MODULENAMES.EDITACCOUNTQULIFICATION:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.EDITACCOUNTQULIFICATION;
                    content.action = operTarget.name;
                    content.result = operTarget.name + resultSuffix;
                    content.obj = '广告主账户';
                    break;
                case MODULENAMES.ADDROLE:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.ADDROLE;
                    content.action = operTarget.name;
                    content.result = operTarget.name + (req.roleInfo.role_name)  +  resultSuffix;
                    content.obj = req.roleInfo.role_name;
                    break;
                case MODULENAMES.EDITROLE:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.EDITROLE;
                    content.action = operTarget.name;
                    content.result = operTarget.name + (req.roleInfo.role_name) + resultSuffix;
                    content.obj = req.roleInfo.role_name;
                    break;
                case MODULENAMES.DELROLE:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.DELROLE;
                    content.action = operTarget.name;
                    content.result = operTarget.name + (res.role_name || req.roleInfo.role_name)+  resultSuffix;
                    content.obj = (res.role_name || req.roleInfo.role_name);
                    break;
                case MODULENAMES.ADDOPERATOR:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.ADDOPERATOR;
                    content.action = operTarget.name;
                    content.result = operTarget.name + ':' + req.name + ' ' + resultSuffix;
                    content.obj = req.name;
                    break;
                case MODULENAMES.EDITOPERATOR:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.EDITOPERATOR;
                    content.action = operTarget.name;
                    content.result = operTarget.name + ':' + req.targetOperatorInfo.name + ' ' + resultSuffix;
                    content.obj = req.targetOperatorInfo.name;
                    break;
                case MODULENAMES.DELOPERATOR:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.DELOPERATOR;
                    content.action = operTarget.name;
                    content.result = operTarget.name + ':' + (res.name || req.targetOperatorInfo.name) + ' ' + resultSuffix;
                    content.obj = res.name || req.targetOperatorInfo.name;
                    break;
                case MODULENAMES.CREATEADSPLAN:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.CREATEADSPLAN;
                    content.action = operTarget.name;
                    content.result = operTarget.name +':' + req.plan_name + ' ' +  resultSuffix;
                    content.obj = req.plan_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.EDITADSPLAN:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.EDITADSPLAN;
                    content.action = operTarget.name;
                    content.result = operTarget.name +':' + req.planInfo.plan_name + ' ' +  resultSuffix;
                    content.obj = req.planInfo.plan_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.TRASHADSPLAN:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.TRASHADSPLAN;
                    content.action = operTarget.name;
                    content.result = operTarget.name +':' + (res.plan_name || req.planInfo.plan_name) + ' ' +  resultSuffix;
                    content.obj = res.plan_name || req.planInfo.plan_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.COPYADSPLAN:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.COPYADSPLAN;
                    content.action = operTarget.name;
                    content.result = operTarget.name +':' + (res.plan_name || req.planInfo.plan_name) + ' ' +  resultSuffix;
                    content.obj = req.planInfo.plan_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.DELADSPLAN:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.DELADSPLAN;
                    content.action = operTarget.name;
                    content.result = operTarget.name +':' + (res.plan_name || req.planInfo.plan_name) + ' ' +  resultSuffix;
                    content.obj = res.plan_name || req.planInfo.plan_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.CHANGEADSPLANSTATUS:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.CHANGEADSPLANSTATUS;
                    content.action = req.action + '广告计划';
                    content.result = content.action +':' + req.planInfo.plan_name + ' ' +  resultSuffix;
                    content.obj = req.planInfo.plan_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.SAVEPLANREPORTS:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.SAVEPLANREPORTS;
                    content.action = operTarget.name;
                    content.result = operTarget.name + ':' + req.report_name + ' ' + resultSuffix;
                    content.obj = req.report_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.CREATEADSUNIT:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.CREATEADSUNIT;
                    content.action  = operTarget.name;
                    content.result = operTarget.name + ':' + req.unit_name + ' ' + resultSuffix;
                    content.obj = req.unit_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.EDITADSUNIT:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.EDITADSUNIT;
                    content.action  = operTarget.name;
                    content.result = operTarget.name + ':' + req.unitInfo.unit_name + ' ' + resultSuffix;
                    content.obj = req.unitInfo.unit_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.TRASHADSUNIT:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.TRASHADSUNIT;
                    content.action  = operTarget.name;
                    content.result = operTarget.name + ':' + (res.unit_name || req.unitInfo.unit_name) + ' ' + resultSuffix;
                    content.obj = res.unit_name || req.unitInfo.unit_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.DELADSUNIT:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.DELADSUNIT;
                    content.action  = operTarget.name;
                    content.result = operTarget.name + ':' + (res.unit_name || req.unitInfo.unit_name) + ' ' + resultSuffix;
                    content.obj = res.unit_name || req.unitInfo.unit_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.COPYADSUNIT:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.COPYADSUNIT;
                    content.action  = operTarget.name;
                    content.result = operTarget.name + ':' + req.unitInfo.unit_name + ' ' + resultSuffix;
                    content.obj = req.unitInfo.unit_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.CHANGEADSUNITSTATUS:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.CHANGEADSUNITSTATUS;
                    content.action  = req.action + '广告单元';
                    content.result = content.action + ':' + req.unitInfo.unit_name + ' ' + resultSuffix;
                    content.obj = req.unitInfo.unit_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.EDITTARGETSETTING:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.EDITTARTGETSETTING;
                    content.action  = operTarget.name;
                    content.result = operTarget.name + ':' + req.unitInfo.unit_name + ' ' + resultSuffix;
                    content.obj = req.unitInfo.unit_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.SAVEUNITREPORTS:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.SAVEUNITREPORTS;
                    content.action  = operTarget.name;
                    content.result = operTarget.name + ':' + req.report_name + ' ' + resultSuffix;
                    content.obj = req.report_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.CREATEADSIDEA:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.CREATEADSIDEA;
                    content.action = operTarget.name;
                    content.result = operTarget.name  + ':' + req.idea_name + '' + resultSuffix;
                    content.obj = req.idea_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.EDITADSIDEA:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.EDITADSIDEA;
                    content.action = operTarget.name;
                    content.result = operTarget.name  + ':' + req.ideaInfo.idea_name + '' + resultSuffix;
                    content.obj = req.ideaInfo.idea_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.TRASHADSIDEA:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.TRASHADSIDEA;
                    content.action = operTarget.name;
                    content.result = operTarget.name  + ':' + (res.idea_name || req.ideaInfo.idea_name) + '' + resultSuffix;
                    content.obj = res.idea_name || req.ideaInfo.idea_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.DELADSIDEA:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.DELADSIDEA;
                    content.action = operTarget.name;
                    content.result = operTarget.name  + ':' + (res._idea_name || req.ideaInfo.idea_name) + '' + resultSuffix;
                    content.obj = res.idea_name || req.ideaInfo.idea_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.COPYADSIDEA:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.COPYADSIDEA;
                    content.action = operTarget.name;
                    content.result = operTarget.name  + ':' + req.ideaInfo.idea_name + '' + resultSuffix;
                    content.obj = req.ideaInfo.idea_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.CHANGEADSIDEASTATUS:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.CHANGEADSIDEASTATUS;
                    content.action  = req.action + '广告创意';
                    content.result = content.action + ':' + req.ideaInfo.idea_name + ' ' + resultSuffix;
                    content.obj = req.ideaInfo.idea_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.SAVEIDEAREPORTS:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.SAVEIDEAREPORTS;
                    content.action  = operTarget.name;
                    content.result = content.action + ':' + req.report_name + ' ' + resultSuffix;
                    content.obj = req.report_name;
                    content.isAdsRecord = true;
                    break;
                case MODULENAMES.DELREPORTS:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.DELREPORTS;
                    content.action  = operTarget.name;
                    content.result = content.action + ':' + (res.report_name || req.reportInfo.report_name) + resultSuffix;
                    content.obj = res.report_name || req.reportInfo.report_name;
                    break;
                case MODULENAMES.CREATERULE:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.CREATERULE;
                    content.action  = operTarget.name;
                    content.result = content.action + ':' + req.rule_name + ' ' + resultSuffix;
                    content.obj = req.rule_name;
                    break;
                case MODULENAMES.EDITRULE:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.EDITRULE;
                    content.action  = operTarget.name;
                    content.result = content.action + ':' + req.ruleInfo.rule_name + ' ' + resultSuffix;
                    content.obj = req.ruleInfo.rule_name;
                    break;
                case MODULENAMES.CHANGERULESTATUS:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.CHANGERULESTATUS;
                    content.action  = req.action + '自动规则';
                    content.result = content.action + ':' + req.ruleInfo.rule_name + ' ' + resultSuffix;
                    content.obj = req.ruleInfo.rule_name;
                    break;
                case MODULENAMES.DELRULE:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.DELRULE;
                    content.action  = operTarget.name;
                    content.result = content.action + ':' + (res.rule_name || req.ruleInfo.rule_name) + ' ' + resultSuffix;
                    content.obj = res.rule_name || req.ruleInfo.rule_name;
                    break;
                case MODULENAMES.CREATETARGETTEMPLATE:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.CREATETARGETTEMPLATE;
                    content.action = operTarget.name;
                    content.result = operTarget.name + ':' + req.template_name + ' ' + resultSuffix;
                    content.obj = req.template_name;
                    break;
                case MODULENAMES.EDITTARGETTEMPLATE:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.EDITTARGETTEMPLATE;
                    content.action = operTarget.name;
                    content.result = operTarget.name + ':' + req.templateInfo.template_name + ' ' + resultSuffix;
                    content.obj = req.templateInfo.template_name;
                    break;
                case MODULENAMES.DELTARGETTEMPLATE:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.DELTARGETTEMPLATE;
                    content.action = operTarget.name;
                    content.result = operTarget.name + ':' + (res.template_name || req.templateInfo.template_name) + ' ' + resultSuffix;
                    content.obj = res.template_name || req.templateInfo.template_name;
                    break;
                case MODULENAMES.CREATEASSET:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.CREATEASSET;
                    content.action = operTarget.name;
                    content.result = operTarget.name + ':' + req.asset_name + ' ' + resultSuffix;
                    content.obj = req.asset_name;
                    break;
                case MODULENAMES.EDITASSET:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.EDITASSET;
                    content.action = operTarget.name;
                    content.result = operTarget.name + ':' + req.assetInfo.asset_name + ' ' + resultSuffix;
                    content.obj = req.assetInfo.asset_name;
                    break;
                case MODULENAMES.DELASSET:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.DELASSET;
                    content.action = operTarget.name;
                    content.result = operTarget.name + ':' + (res.asset_name || req.assetInfo.asset_name) + ' ' + resultSuffix;
                    content.obj = res.asset_name || req.assetInfo.asset_name;
                    break;
                case MODULENAMES.CREATECUSTOMAUDIENCE:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.CREATECUSTOMAUDIENCE;
                    content.action = operTarget.name;
                    content.result = operTarget.name + ':' + req.audience_name + ' ' + resultSuffix;
                    content.obj = req.audience_name;
                    break;
                case MODULENAMES.DELCUSTOMAUDIENCE:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.DELCUSTOMAUDIENCE;
                    content.action = operTarget.name;
                    content.result = operTarget.name + ':' + (res.audience_name || req.audienceInfo.audience_name) + ' ' + resultSuffix;
                    content.obj = res.audience_name || req.audienceInfo.audience_name;
                    break;
                case MODULENAMES.WECHATPAY:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.WECHATPAY;
                    content.action =  operTarget.name;
                    content.result = operTarget.name;
                    content.obj = '广告主账户';
                    break;
                case MODULENAMES.ALIPAY:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.ALIPAY;
                    content.action =  operTarget.name;
                    content.result = operTarget.name;
                    content.obj = '广告主账户';
                    break;
                case MODULENAMES.CREATEINVOICEINFO:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.CREATEINVOICEINFO;
                    content.action = operTarget.name;
                    content.result = operTarget.name + resultSuffix;
                    content.obj = '发票信息';
                    break;
                case MODULENAMES.DELINVOICEINFO:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.DELINVOICEINFO;
                    content.action = operTarget.name;
                    content.result = operTarget.name + resultSuffix;
                    content.obj = '发票信息';
                    break;
                case MODULENAMES.INVOICE:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.INVOICE;
                    content.action = operTarget.name;
                    content.result = operTarget.name + resultSuffix;
                    content.obj = '发票';
                    break;
                case MODULENAMES.INVOICESIGN:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.INVOICESIGN;
                    content.action = operTarget.name;
                    content.result = operTarget.name + resultSuffix;
                    content.obj = '发票';
                    break;
                case MODULENAMES.ADDMESSAGERECEIVER:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.ADDMESSAGERECEIVER;
                    content.action = operTarget.name;
                    content.result = operTarget.name + resultSuffix;
                    content.obj = '消息接受人';
                    break;
                case MODULENAMES.DELMESSAGERECEIVER:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.DELMESSAGERECEIVER;
                    content.action = operTarget.name;
                    content.result = operTarget.name + resultSuffix;
                    content.obj = '消息接受人';
                    break;
                case MODULENAMES.EDITMESSAGESETTING:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.EDITMESSAGESETTING;
                    content.action = operTarget.name;
                    content.result = operTarget.name + resultSuffix;
                    content.obj = '消息接受设置';
                    break;
                default:
                    operTarget = ADCONSTANTS.ADUITOPERATEID.UNDEFINE;
                    break;
            }

            if(operTarget == ADCONSTANTS.ADUITOPERATEID.UNDEFINE) {
                var resp = err ? err : data;
                content = {
                    module_name: module_name,
                    oper_name:oper_name
                };
            }
            mLogger.debug(content);
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


//level: 
//      1 account_records
function getLevelAndType(module_name, err){
    var level = 4;
    var type = ADCONSTANTS.AUDITTYPE.UNDEFINE.code;

    switch(module_name){
        case MODULENAMES.REGISTER:
        case MODULENAMES.RESETPASSWORD1:
        case MODULENAMES.RESETPASSWORD2:
            level = 2;
            type = ADCONSTANTS.AUDITTYPE.ACCOUNT.code;
            break;
        case MODULENAMES.EDITACCOUNTINFO:
        case MODULENAMES.EDITACCOUNTQULIFICATION:
        case MODULENAMES.ADDROLE:
        case MODULENAMES.EDITROLE:
        case MODULENAMES.DELROLE:
        case MODULENAMES.ADDOPERATOR:
        case MODULENAMES.EDITOPERATOR:
        case MODULENAMES.DELOPERATOR:
            level = 1;
            type = ADCONSTANTS.AUDITTYPE.ACCOUNT.code;
            break;
        case MODULENAMES.CREATEADSPLAN:
        case MODULENAMES.EDITADSPLAN:
        case MODULENAMES.TRASHADSPLAN:
        case MODULENAMES.DELADSPLAN:
        case MODULENAMES.COPYADSPLAN:
        case MODULENAMES.CHANGEADSPLANSTATUS:
        case MODULENAMES.SAVEPLANREPORTS:
            level = 1;
            type = ADCONSTANTS.AUDITTYPE.ADSPLAN.code;
            break;
        case MODULENAMES.CREATEADSUNIT:
        case MODULENAMES.EDITADSUNIT:
        case MODULENAMES.TRASHADSUNIT:
        case MODULENAMES.DELADSUNIT:
        case MODULENAMES.EDITTARGETSETTING:
        case MODULENAMES.CHANGEADSUNITSTATUS:
        case MODULENAMES.COPYADSUNIT:
        case MODULENAMES.SAVEUNITREPORTS:
            level = 1;
            type = ADCONSTANTS.AUDITTYPE.ADSUNIT.code;
            break;
        case MODULENAMES.CREATEADSIDEA:
        case MODULENAMES.EDITADSIDEA:
        case MODULENAMES.TRASHADSIDEA:
        case MODULENAMES.DELADSIDEA:
        case MODULENAMES.COPYADSIDEA:
        case MODULENAMES.CHANGEADSIDEASTATUS:
        case MODULENAMES.SAVEIDEAREPORTS:
            level = 1;
            type = ADCONSTANTS.AUDITTYPE.ADSIDEA.code;
            break;
        case MODULENAMES.CREATERULE:
        case MODULENAMES.EDITRULE:
        case MODULENAMES.DELRULE:
        case MODULENAMES.CHANGERULESTATUS:
            level = 2;
            type = ADCONSTANTS.AUDITTYPE.RULE.code;
            break;
        case MODULENAMES.CREATETARGETTEMPLATE:
        case MODULENAMES.EDITTARGETTEMPLATE:
        case MODULENAMES.DELTARGETTEMPLATE:
            level = 2;
            type = ADCONSTANTS.AUDITTYPE.TARGETTEMPLATE.code;
            break;
        case MODULENAMES.CREATEASSET:
        case MODULENAMES.EDITASSET:
        case MODULENAMES.DELASSET:
            level = 2;
            type = ADCONSTANTS.AUDITTYPE.ASSET.code;
            break;
        case MODULENAMES.DELREPORTS:
            level = 2;
            type = ADCONSTANTS.AUDITTYPE.REPORT.code;
            break;
        case MODULENAMES.CREATECUSTOMAUDIENCE:
        case MODULENAMES.DELCUSTOMAUDIENCE:
            level = 2;
            type = ADCONSTANTS.AUDITTYPE.CREATECUSTOMAUDIENCE.code;
            break;
        case MODULENAMES.WECHATPAY:
        case MODULENAMES.ALIPAY:
        case MODULENAMES.INVOICE:
        case MODULENAMES.INVOICESIGN:
            level = 1;
            type = ADCONSTANTS.AUDITTYPE.FINANCE.code;
            break;
        case MODULENAMES.CREATEINVOICEINFO:
        case MODULENAMES.EDITINVOICEINFO:
        case MODULENAMES.DELINVOICEINFO:
            level = 2;
            type = ADCONSTANTS.AUDITTYPE.FINANCE.code;
            break;
        case MODULENAMES.ADDMESSAGERECEIVER:
        case MODULENAMES.DELMESSAGERECEIVER:
        case MODULENAMES.EDITMESSAGERECEIVER:
            level = 2;
            type = ADCONSTANTS.AUDITTYPE.MESSAGE.code;
            break;
        default:
            break;
    }

    return {level: level, type: type};
}

module.exports.record = record;
