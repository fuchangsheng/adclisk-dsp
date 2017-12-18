/*
 * @file  summary_list_options.js
 * @obtain user's balance API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author yangshiyu
 * @date 2017.11.30
 * @version 0.0.1 
 */

'use strict';
var MODULENAME = 'summary_user_balance.logic';
var URLPATH = '/v3/ads/summary/balance';

var mDebug = require("debug")(MODULENAME);
var mExpress = require("express");
var mRouter = mExpress.Router();
var mAsync = require("async");
var mIs = require("is_js");
var mMoment = require("moment");

var LogicApi = require("../../logic_api");

//models
var mADBalanceModel = require("../../../model/dsp_aduser").create();

//utils
var mLogger = require("../../../../utils/logger")(MODULENAME)

var mDataHelper = require("../../../../utils/data_helper");
var mUtils = require("../../../../utils/utils");

//common constants
var ERRCODE = require("../../../../common/errCode");
var ADCONSTANTS = require("../../../../common/adConstants");

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function (data) {
            return mUtils.isValidUserId(data);
        },
    },
};

var mLogicHelper = new LogicApi({
    debug: mDebug,
    moduleName: MODULENAME,
    refModel: mRefModel,
});

function validate(param) {
    if (!param) {
        return false;
    }
    return mLogicHelper.validate({
        inputModel: param,
    });
}


function packageResponseData(data) {
    if (!data) {
        return {};
    }
    var balance = data.vbalance + data.rbalance;
    var resData = {
        balance: data.balance,
        rbalance: data.rbalance,
        vbalance: data.vbalance,
    };
    return resData;
}

function getQuerySql(param) {
    var sqlstr = 'SELECT rbalance,vbalance FROM ' + mADBalanceModel.tableName;
    sqlstr += ' WHERE user_id = ' + param.user_id + ';';
    return sqlstr;
}

function processRequest(param, fn) {
    if (!validate(param)) {
        var msg = 'Options Invalid data';
        mLogger.error(msg);

        return fn({
            code: ERRCODE.PARAM_INVALID,
            msg: msg
        });
    }

    var sqlstr = getQuerySql(param);
    var logmsg = " to list all info about user:" + param.user_id;
    mLogger.debug("Try " + logmsg);

    mAsync.waterfall([
        function (next) {
            mLogger.debug("sqlstr:" + sqlstr);
            var query = {
                sqlstr: sqlstr,
            };

            mADBalanceModel.query(query, function (err, rows) {
                if (err) {
                    next(err);
                } else {
                    if (!rows || rows.length == 0) {
                        //Todo: test it 
                        return next(null, {
                            vbalance: 0,
                            rbalance: 0,
                            balance: 0,
                        });
                    } else {
                        console.log("rows.length:" + rows.length);
                        next(null, {
                            vbalance: rows[0].vbalance,
                            rbalance: rows[0].vbalance,
                            balance: rows[0].vbalance + rows[0].rbalance,
                        });
                    }
                }
            });
        }
    ], function (err, data) {
        if (err) {
            mLogger.error("Failed" + logmsg);
            fn(err);
        } else {
            mLogger.debug("Success" + logmsg);
            var resData = packageResponseData(data);
            fn(null, resData);
        }
    });
}


mRouter.post(URLPATH, function (req, res, next) {
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