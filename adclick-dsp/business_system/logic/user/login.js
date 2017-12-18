/*
 * @file  login.js
 * @description dsp user account recharge info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'login.logic';
var URLPATH = '/v3/user/login';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');


var LogicApi = require("../logic_api");

//models
var mAdUserModel = require('../../model/dsp_aduser').create();
var mAdOperModel = require('../../model/aduser_operators').create();
var mAccountRoleContentModel = require('../../model/role_content').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mUtils = require('../../../utils/utils');
var mDataHelper = require('../../../utils/data_helper');

//constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mCaptha = require('./captha_verify');

var mRefModel = {
    name:{
        data:'name address',
        rangeCheck: function (data) {
            return true;
        }
    },
    password:{
        data:'password',
        rangeCheck: function(data){
            return !mUtils.isEmpty(data);
        }
    },
    token:{
        data: 'data',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
    },
    code:{
        data: 'data',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
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
        auth:{
            user_id: data.user_id,
            oper_id: data.oper_id,
            user_name: data.user_name,
            role: data.role,
            permissions: data.permissions,
            audit_status: data.audit_status,
        },
    };
    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code:ERRCODE.PARAM_INVALID, msg: msg});
    }

    var name = param.name.replace(/\'|\"/ig, '');

    mLogger.debug('Try to login into system from user:'+name);
    
    mAsync.waterfall([
        //0. verify the captha
        function(next) {
            mCaptha.verifyToken(param, function(err){
                if (err) {
                    next(err);
                }else{
                    next(null, {});
                }
            });
        },
        //1.check operator name and password
        function(data, next){
            var match = {
                name: name,
                password: mDataHelper.createPasswordSha1Data(param.name + param.password),
                status: ADCONSTANTS.DATASTATUS.VALID.code,
                audit_status: ADCONSTANTS.AUDIT.PASS.code,
            };
            var select = {
                user_id: 1,
                oper_id: '',
                role: 1,
                audit_status: 1,
            };
            var query = {
                select: select,
                match: match,
            };
            mAdOperModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    if (!rows || rows.length==0) {
                        var msg = 'Invalid user name or password!';
                        mLogger.error(msg);
                        next({code: ERRCODE.INVALID_USER_PASSWD, msg: msg});
                    }else {
                        next(null, rows[0]);
                    }
                }
            });
        },
        //2. get the user name information
        function(data, next){
            var select = {
                user_name:'',
            };
            var match = {
                user_id: data.user_id,
            };
            var query = {
                select: select,
                match: match,
            };
            mAdUserModel.lookup(query, function(err, rows){
                if (err) {
                    next(err);
                }else {
                    if (!rows || rows.length==0) {
                        var msg = 'There is no match user';
                        mLogger.error(msg);
                        next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    }else {
                        data.user_name = rows[0].user_name;
                        next(null, data);
                    }
                }
            });
        },
        //get role content
        function(data, next) {
            var match = {
                user_id: data.user_id,
                role_id: data.role,
            }
            var select = {
                id: 1,
                category: 1, 
                subcategory: 1,
                channel: 1,
            }
            mAccountRoleContentModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                } else {
                    if (rows.length == 0) {
                        var msg = 'There is no role for user: ' + param.name;
                        mLogger.error(msg);
                        next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    } else {
                        data.permissions = rows;
                        next(data);
                    }
                }
            });
        },
    ], 
    function(err, data){
        if (err) {
            mLogger.error('Failed to login from  user:' + name);
            fn(err);    
        }else{
            mLogger.info('Success to login from user:' + name);

            var resData = packageResponseData(data);
            fn(null, resData);
        }
    });

}

/*
* export the post interface
*/
mRouter.post(URLPATH, function(req, res, next){
    var param = req.body;

    mLogicHelper.processSesstion({
        res: res,
        req: req,
        next: next,
        processRequest: processRequest,
        param: param,       
    });
});

module.exports.router = mRouter;
