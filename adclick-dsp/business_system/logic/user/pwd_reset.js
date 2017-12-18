/*
 * @file  pwd_reset.js
 * @description dsp user account recharge info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.03
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'pwd_reset.logic';
var URLPATH = '/v3/password/reset';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mAdOperModel = require('../../model/aduser_operators').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    oper_id: { 
        data: 'oper',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
    },
    password: { 
        data: 'password',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
    },
    oldpassword: {
        data: 'password',
        rangeCheck: function(data) {
            return  !mUtils.isEmpty(data);
        }
    }
};

var mLogicHelper = new LogicApi({
    debug: mDebug,
    moduleName: MODULENAME,
    refModel: mRefModel,
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
        name: data,
    };
    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }

    var oper_id = param.oper_id;
    var name = '';

    mLogger.debug('Try to reset password for oper :' + oper_id);
    
    mAsync.series([
        //1. verify the user password
        function(next) {
            var match = {
                oper_id: oper_id,
                //password: param.oldpassword,
            };
            var select = {
                password: 'password',
                name : 'name',
            }
            var query = {
                select: select,
                match: match,
            };

            mAdOperModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    name = rows[0].name;
                    var passwordSha1 = mDataHelper.createPasswordSha1Data(name + param.oldpassword);
                    if(passwordSha1 != rows[0].password) {
                        var msg = 'Invalid user or password!';
                        mLogger.error(msg);
                        next({code: ERRCODE.INVALID_USER_PASSWD, msg: msg});
                    } else {
                        next(null);
                    }
                }
            });
        },
        //2. update the user password
        function(next) {
            var match = {
                oper_id: oper_id,
            };
            var update = {
                password: mDataHelper.createPasswordSha1Data(name + param.password),
            };
            var query = {
                update: update,
                match: match,
            };
            mAdOperModel.update(query, next);
        }
    ], 
    function(err){
        if (err) {
            mLogger.error('Failed to reset password for ' + name);
            fn(err);    
        }else{
            mLogger.info('Success to reset password for ' +  name);

            var resData = packageResponseData(name);
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
