/*
 * @file  admin_add.js
 * @description dsp management administrator add logic
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.3
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'admin_add.logic';
var URLPATH = '/v1/admin/add';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');


var LogicApi = require("../logic_api");

//models
var mAdminModel = require('../../model/management_admin').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    name: {
        data: 'name address',
        rangeCheck: function(data) {
            return true;
        }
    },
    password: {
        data: 'password',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        }
    },
    phone: {
        data: '1243454',
        rangeCheck: function(data) {
            return mUtils.isMobile(data);
        }
    },
    email: {
        data: '123@123.com',
        rangeCheck: function(data) {
            return mUtils.isEmail(data);
        }
    },
    role: {
        data: 0,
        rangeCheck: function(data) {
            return mIs.inArray(data, [1, 2]);
        }
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

    return data;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});
    }

    var name = param.name;
    var logmsg = ' to add mgr: ' + name;
    mLogger.debug('Try' + logmsg);

    mAsync.series({
        checkName: function(next) {
            var match = {
                name: param.name
            };
            var select = {
                id: 1
            };
            var query = {
                select: select,
                match: match
            };
            mAdminModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                } else {
                    if (rows && rows.length !== 0) {
                        var msg = 'Duplicated name';
                        mLogger.error(msg);
                        
                        next({
                            code: ERRCODE.PARAM_INVALID,
                            msg: msg,
                        });
                    } else {
                        next(null);
                    }
                }
            });
        },
        addUser: function(next) {
            var value = {
                id: mDataHelper.createNumberId(new Date()),
                name: name,
                password: mDataHelper.createPasswordSha1Data(name + param.password),
                phone: param.phone,
                email: param.email,
                role: param.role,
                status: 0,
                create_time: new Date()
            };
            var query = {
                fields: value,
                values: [value]
            };
            mAdminModel.create(query, function(err) {
                if(err) {
                    mLogger.error('Failed' + logmsg);
                    next(err);
                } else {
                    mLogger.debug('Success' + logmsg);
                    next(null);
                }
            });
        }
    }, function(err) {
        if (err) {
            fn(err);
        } else {
            fn(null);
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
