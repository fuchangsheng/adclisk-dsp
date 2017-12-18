/*
 * @file  register_utils.js
 * @description dsp user register info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2017.01.01
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'register_utils.logic';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');
var mIs = require('is_js');

//models
var mAdLibUserModel = require('../../model/adlib_user').create();
var mAdUserModel = require('../../model/dsp_aduser').create();
var mAdOperModel = require('../../model/aduser_operators').create();
var mAdxAuditUserModel = require('../../model/adlib_audit_users').create();
var mAccountRoleModel = require('../../model/role').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');
var mRoleHelper = require('../settings/system/ad_account_role_create');

//constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

//local
var mRoleCfg = null;

function LoadCfg() {
    if (mRoleCfg) {
        return mRoleCfg;
    }
    mRoleCfg = mUtils.loadJson(ADCONSTANTS.ROLEPERMISSIONPATHNAME);
    return mRoleCfg;
}

function createAuditTransanction(param, fn){
    mLogger.debug('calling createAuditTransanction!');

    var values = [];
    var adxlist = ADCONSTANTS.ADXLIST.datas;
    for(var i in adxlist) {
        var value = {
            user_id: param.user_id,
            adx_id: adxlist[i].code,
            audit_status: ADCONSTANTS.AUDIT.UNSUBMIT.code,
        };

        values.push(value);
    }

    var query = {
        fields: values[0],
        values: values,
    }

    //transaction model
    query.connection = param.connection;
    mAdxAuditUserModel.create(query, function(err, rows){
        if(err){
            fn(err);
        }else {
            if (!rows || rows.length==0) {
                var msg = 'Failed to create the user!';
                mLogger.error(msg);
                fn({
                    code: ERRCODE.DB_ERROR,
                    msg:msg,
                });
            }else{
                fn(null);
            }
        }
    });
}

function createAdLibTransanction(param, fn){
    mLogger.debug('calling createAdLibTransanction!');

    var value = {
        user_name: param.user_name,
        user_id: param.user_id,
        user_status: ADCONSTANTS.AUDIT.UNCHECK.code,
    };

    var query = {
        fields: value,
        values: [value],
    };

    //transaction model
    query.connection = param.connection;
    mAdLibUserModel.create(query, function(err, rows){
        if(err){
            fn(err);
        }else {
            if (!rows || rows.length==0) {
                var msg = 'Failed to create the user!';
                mLogger.error(msg);
                fn({
                    code: ERRCODE.DB_ERROR,
                    msg:msg,
                });
            }else{
                fn(null);
            }
        }
    });
}

function createAdOper(param, fn){
    mLogger.debug('calling createAdOper!');

    var id = mDataHelper.createId(param.name);
    var value = {
        oper_id: id,
        name: param.name,
        password: mDataHelper.createPasswordSha1Data(param.name + param.password),
        mobile: param.mobile,
        user_id: param.user_id,
        role: param.role_id,
        audit_status: ADCONSTANTS.AUDIT.PASS.code,
        status: ADCONSTANTS.STATUS.VALID.code,
    };

    var query = {
        fields: value,
        values: [value],
    };

    //transaction model
    query.connection = param.connection;
    mAdOperModel.create(query, function(err, rows){
        if(err){
            fn(err);
        }else {
            if (!rows || rows.length==0) {
                var msg = 'Failed to create the user!';
                mLogger.error(msg);
                fn({
                    code: ERRCODE.DB_ERROR,
                    msg:msg,
                });
            }else{
                fn(null);
            }
        }
    });
}

function createAdUser(param, fn){
    mLogger.debug('calling createAdUser!');

    var value = {
        company_name: param.company_name,
        user_name: param.user_name,
        user_audit_status: ADCONSTANTS.AUDIT.UNSUBMIT.code,
        user_id: param.user_id,
        categories_audit_status: ADCONSTANTS.AUDIT.UNSUBMIT.code
    };

    var query = {
        fields: value,
        values: [value],
    };

    //transaction model
    query.connection = param.connection;
    mAdUserModel.create(query, function(err, rows){
        if(err){
            fn(err);
        }else {
            if (!rows || rows.length==0) {
                var msg = 'Failed to create the user!';
                mLogger.error(msg);
                fn({
                    code: ERRCODE.DB_ERROR,
                    msg:msg,
                });
            }else{
                fn(null);
            }
        }
    });
}

function getCreatorRoleId(param, fn) {
    mLogger.debug('calling getCreatorRoleId!');

    var match = {
        user_id: param.user_id,
        role_name: ADCONSTANTS.ROLE.CREATOR.name,
    }
    var select = {
        id: 1
    }

    var query = {
        match: match,
        select: select,
    }

    mAccountRoleModel.lookup(query, function(err, rows) {
        if (err) {
            fn(err);
        } else {
            if (rows.length == 0) {
                var msg = "No matched creator role data!";
                fn({code: ERRCODE.DB_ERROR, msg: msg});
            } else {
                param.role_id = rows[0].id;
                fn(null);
            }
        }
    });
}

function createAdRole(param, fn) {
    mLogger.debug('calling createAdRole!');

    mRoleCfg = LoadCfg();
    if (!mRoleCfg) {
        var msg = 'Role-permission error!'
        return fn({code: ERRCODE.DATA_INVALID, msg: msg});
    }

    var createFnt = function(role_name, list) {
        return function(cb) {
            var role_param = {
                role_name: role_name,
                list: list,
                user_id: param.user_id
            }
            return mRoleHelper.createRole(role_param, cb);
        }
    }

    var fntlist = [];
    for (var i in mRoleCfg) {
        var permission_info = mRoleCfg[i];
        var role_name = permission_info.role;
        var categories = permission_info.categories;
        var list = [];
        for (var j in categories) {
            var category = categories[i];
            var category_name = category.name;
            var subcategories = category.subcategories;
            for (var k in subcategories) {
                var subcategory = subcategories[k];
                var writable = subcategory.writable;
                var readable = subcategory.readable;
                var subcategory_name = subcategory.name;
                var channel = ADCONSTANTS.ROLECHANNEL.NONE.name;
                if (writable && readable) {
                    channel = ADCONSTANTS.ROLECHANNEL.READWRITABLE.name;
                } else if (writable && !readable) {
                    channel = ADCONSTANTS.ROLECHANNEL.WRITABLE.name;
                } else if (!writable && readable) {
                    channel = ADCONSTANTS.ROLECHANNEL.READABLLE.name;
                }
                var item = {};
                item.category = category_name;
                item.subcategory = subcategory_name;
                item.channel = channel;
                list.push(item);
            }
        }
        fntlist.push(createFnt(role_name, list));
    }
    if (fntlist.length == 0) {
        var msg = 'Role-permission error!'
        fn({code: ERRCODE.DATA_INVALID, msg: msg});
    }
    mAsync.series(fntlist, fn);
}

function createAdUserTransanction(param, fn){
    mLogger.debug('calling createAdUserTransanction');

    mAsync.series([
        function(next) {
            createAdRole(param, next);
        },
        function(next) {
            getCreatorRoleId(param, next);
        },
        function(next){
            createAdUser(param, next);
        },
        function(next){
            createAdOper(param, next);
        },
    ], fn);
}

function regeisterTransanctionBatch(param, fn) {
    mLogger.debug('calling transanctionBatch!');

    var transactions = [];

    //1.do the business database
    var data = {
        user_id: param.user_id,
        user_name: param.user_name,
        company_name: param.company_name,
        name: param.name,
        password: param.password,
        mobile: param.mobile,
        transactionFun: createAdUserTransanction,
    };
    transactions.push({data: data, model: mAdUserModel});

    //2.do the adlib database
    data = {
        user_id: param.user_id,
        user_name: param.user_name,
        company_name: param.company_name,
        transactionFun: createAdLibTransanction,
    };
    transactions.push({data: data, model: mAdLibUserModel});

    //3.do the audit database
    data = {
        user_id: param.user_id,
        transactionFun: createAuditTransanction,
    };
    transactions.push({data: data, model: mAdxAuditUserModel});

    var options = {
        transactions: transactions,
    };

    mUtils.transactionBatch(options, fn);
}

module.exports.regeisterTransanctionBatch = regeisterTransanctionBatch;