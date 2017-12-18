/*
 * @file  adx_list.js
 * @description adx information list API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.13
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'adx_list.logic';
var URLPATH = '/v1/adx/list';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mAdxModel = require('../../model/adlib_adx').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    index: {
        data: 1,
        rangeCheck: function(data) {
            return data>=0;
        },
        optional: true,
    },
    count: {
        data: 1,
        rangeCheck: function(data) {
            return data>=0 && data<=ADCONSTANTS.PAGEMAXCOUNT;
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

    var adxes = data.adxes;
    var size = adxes.length;

    var resData = {
        total: data.total - 1,
        list: []
    };

    for (var i = 0; i < adxes.length; i++) {
        var adx = {
            id: adxes[i].id,
            name: adxes[i].name,
            status: adxes[i].status
        };
        if (adx.name !== 'ADX_CNT') {
            resData.list.push(adx);
        } else {
            size = size - 1;
        }
    }
    resData.size = size;
    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});
    }


    var logmsg = ' to get the adx list in the system' ;
    mLogger.debug('Try '+logmsg);

     mAsync.waterfall([
        //1. check total number of adx in the system
        function(next) {
            var match = {};
            var query = {
                match: match,
            };
            mAdxModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    next(null, total);
                }
            });
        },
        //2. get the adx list
        function(total, next) {
            if (total === 0) {
                return next(null, {total: 0, adxes: []});
            }
            var index = param.index || 0;
            var count = param.count || ADCONSTANTS.DEFAULTCOUNT;
            var offset = index * count;
            if (offset>=total) {
                mLogger.info(
                    'There is no more adx in the system');
                return next(null, {total: total, adxes: []});
            }

            //2.1 create the sql statment
            var sqlstr = 'select * ' ;
            sqlstr += ' from ' + mAdxModel.tableName;
            sqlstr += ' ORDER BY create_time DESC ';
            sqlstr +=' limit '+count+' offset '+offset;
            sqlstr +=';';

            //2.2 query the database
            var query = {
                sqlstr: sqlstr,
            };

            mAdxModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {     
                    next(null, {total: total, adxes: rows});
                }
            });
        },
    ], function(err, data) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(data);
            fn(null, resData);
        }
    });
}

/*
* export the get interface
*/
mRouter.get(URLPATH, function(req, res, next){
    var param = req.query;

    mLogicHelper.responseHttp({
        res: res,
        req: req,
        next: next,
        processRequest: processRequest,
        param: param,
    });
});

module.exports.router = mRouter;

