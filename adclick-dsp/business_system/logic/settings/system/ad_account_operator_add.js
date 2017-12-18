/*
 * @file  ad_account_operator_add.js
 * @description add ad operator list API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.12.01
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'ad_account_operator_add.logic';
var URLPATH = '/v3/settings/system/operator/add';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../logic_api");

//models
var mDspAduserModel = require('../../../model/dsp_aduser').create();
var mAdOperatorsModel = require('../../../model/aduser_operators').create();
var mAccountRoleModel = require('../../../model/role').create();

//utils
var mLogger = require('../../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../../utils/data_helper');
var mUtils = require('../../../../utils/utils');

//common constants
var ERRCODE = require('../../../../common/errCode');
var ADCONSTANTS = require('../../../../common/adConstants');

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidUserId(data);
        },
    },
    role: {
        data: 1,
        rangeCheck: function(data) {
            return !mUtils.isEmpty(ADCONSTANTS.ROLE.format(data));
        },
    },
    name: {
        data: '0',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
    },
    password: {
        data: 'password',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        }
    },
    edit_role: {
        data: '',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
    },
    email: {
        data: '',
        rangeCheck: function(data) {
            return mUtils.isEmail(data);
        },
        optional: true,
    },
    mobile: {
        data: '',
        rangeCheck: function(data) {
            return mUtils.isMobile(data);
        },
        optional: true,
    }
};

var mLogicHelper = new LogicApi({
    debug: mDebug,
    moduleName: MODULENAME,
    refModel: mRefModel
});

function validate(data){
    if(!data){
        return false;
    }

    return mLogicHelper.validate({
        inputModel: data,
    });
}

function packageResponseData(data){
    if (!data) {
        return {};
    }

    var resData = {
        oper_id: data.oper_id,
        audit_status: ADCONSTANTS.AUDIT.format(data.audit_status),
    };

    return resData;
}

function preprocess(param) {

}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id;
    var name = param.name;

    var logmsg = ' to add the operator "'+name+'" for user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    preprocess(param);

    mAsync.waterfall([
        //0. permission check
        function(next) {
            if (param.edit_role == ADCONSTANTS.ROLE.CREATOR.name) {
                var msg = 'Operator is beyond permission';
                mLogger.error(msg);
                return next({code: ERRCODE.PERMISSIONS_LIMITED, msg: msg});
            }

            var match = {
                role_name : param.edit_role,
                user_id : param.user_id,
            }
            var select = {
                id : 1,
            }
            var query = {
                match : match,
                select : select,
            }

            mAccountRoleModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                } else {
                    if (rows.length == 0) {
                        var msg = 'Cannot find role named ' + param.edit_role;
                        mLogger.error(msg);
                        next({code: ERRCODE.PARAM_INVALID, msg: msg});
                    } else {
                        next(null, rows[0].id);
                    }
                }
            });
        },
        //1. verify the password
        function(role_id, next) {
            var isvalid = true;
            if (!isvalid) {
                var msg = 'The password is too simple';
                mLogger.error(msg);
                return next({code: ERRCODE.PASSWORD_TOO_SIMPLE, msg: msg});
            }
            next(null, role_id);
        },
        //2.check whether the operator name duplicated in the system
        function(role_id, next) {
            var match = {
                name: name,
            };
            var query = {
                match: match,
            };
            mAdOperatorsModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    if (total!=0) {
                        var msg = 'The name is duplicated!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_DATADUPLICATED, msg: msg});
                    }

                    return next(null, role_id);
                }
            });
        },
        //3. insert the operator to the system
        function(role_id, next) {
            var oper_id = mDataHelper.createId(name);
            var value = {
                oper_id: oper_id,
                user_id: user_id,
                name: name,
                role: role_id,
                audit_status: ADCONSTANTS.AUDIT.VERIFYING.code,
                password: mDataHelper.createPasswordSha1Data(name + param.password),
                status: ADCONSTANTS.DATASTATUS.VALID.code,
            };
            if (param.email) {
                value.email = param.email.trim();
            }
            if (param.mobile) {
                value.mobile = param.mobile.trim();
            }
            var query = {
                fields: value,
                values: [value],
            };

            //2.2 create it in the database
            mAdOperatorsModel.create(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    
                    next(null, value);
                }
            });
        },
        //4. send the notify message
        function(operator, next) {
            //TODO
            //send the sms or email to notify the target user
            next(null, operator);
        },
    ], function(err, operator) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(operator);
            fn(null, resData);
        }
    });
    
}

/*
* export the post interface
*/
mRouter.post(URLPATH, function(req, res, next){
    var param = req.body;

    mLogicHelper.responseHttp({
        res: res,
        req: req,
        next: next,
        processRequest: processRequest,
        param: param,       
    });
});

module.exports.router = mRouter;

