/*
 * @file  ad_account_operator_edit.js
 * @description delete ad operator list API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.12.01
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'ad_account_operator_edit.logic';
var URLPATH = '/v3/settings/system/operator/edit';

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
    oper_id: {
        data: '0',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
    },
    role: {
        data: 1,
        rangeCheck: function(data) {
            return !mUtils.isEmpty(ADCONSTANTS.ROLE.format(data));
        },
    },
    target_oper_id: {
        data: '0',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
    },
    mobile: {
        data: '123434',
        rangeCheck: function(data) {
            return mUtils.isMobile(data);
        },
        optional: true,
    },
    email: {
        data: 'email',
        rangeCheck: function(data) {
            return mUtils.isEmail(data);
        },
        optional: true,
    },
    edit_role: {
        data: '',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
        optional: true,
    },
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
    var target_oper_id = param.target_oper_id || oper_id;

    var logmsg = ' to edit the operators "'+target_oper_id+'" from user:' + user_id ;
    mLogger.debug('Try '+logmsg);

    preprocess(param);

    mAsync.waterfall([
        function(next) {
            if (param.edit_role == ADCONSTANTS.ROLE.CREATOR.name) {
                var msg = 'Operator is beyond permission';
                mLogger.error(msg);
                return next({code: ERRCODE.PERMISSIONS_LIMITED, msg: msg});
            }

            if (!mUtils.isExist(param.edit_role)) {
                return next(null);
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
        //1.check whether the operator in the system
        function(role_id, next) {
            // check role
            var select = mAdOperatorsModel.refModel;
            var match = {
                user_id: user_id,
                oper_id: target_oper_id,
                status : ADCONSTANTS.DATASTATUS.VALID.code,
            };
            var query = {
                select: select,
                match: match,
            };
            mAdOperatorsModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    if (!rows || rows.length==0) {
                        var msg = 'There is no this operator in the system!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    }

                    next(null, role_id);
                }
            });
        },
        //2. update the operator from the system
        function(role_id, next) {
            var update = {};
            var toUpdate = false;
            if (param.mobile) {
                update.mobile = param.mobile;
                toUpdate = true;
            }
            if (param.email) {
                update.email = param.email;
                toUpdate = true;
            }
            if (mUtils.isExist(param.edit_role)) {
                update.role = role_id;
                toUpdate = true;
                update.audit_status = ADCONSTANTS.AUDIT.VERIFYING.code;
            }
            if (!toUpdate) {
                return next(null, operator);
            }
            var match = {
                user_id: user_id,
                oper_id: target_oper_id,
            };
            
            var query = {
                update: update,
                match: match,
            };

            //2.2 query the database
            mAdOperatorsModel.update(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    operator.audit_status = update.audit_status;
                    next(null, operator);
                }
            });
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

