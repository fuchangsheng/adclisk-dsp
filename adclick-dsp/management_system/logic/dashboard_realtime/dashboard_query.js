 /*
 * @file  dashboard_query.js
 * @description dashboard query API
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.30
 * @version 0.0.1 
 */

'use strict';
var MODULENAME = 'dashboard_query.logic';
var URLPATH = '/v1/dashboard/query';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');
var http = require('http');

var LogicApi = require("../logic_api");

//models
var mAdxAuditIdeaModel = require('../../model/adlib_audit_ideas').create();
var mAdIdeaModel = require('../../model/adlib_ideas').create();
var mAdxModel = require('../../model/adlib_adx').create();
var mAdxPlanModel = require('../../model/adlib_plans').create();
var mBiddersModel = require('../../model/bidders').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    prefix: {
        data: 'cloud_dsp',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
    },
    name:{
        data: 'bid_per_second',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
    },
    id: {
        data: 1,
        rangeCheck: function(data) {
            return true;
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

function sumServersStruct(last, cur) {
    if(typeof last == 'function') {
        return cur;
    }

    try {
        var lastObj = JSON.parse(last);
        var curObj = JSON.parse(cur);
        var lastData = lastObj.data;
        var curData = curObj.data;

        for(var i in curData) {
            curData[i][1] += lastData[i][1];
        }

        return JSON.stringify(curObj);
    } catch(e) {
        mLogger.error(e);
        return cur;
    }
}

var creatFnt = function(url) {
    mLogger.debug('Requeset url : '+url);
    return function(lastData, cb) {
        if(typeof lastData == 'function') {
            cb = lastData;
        }
        http.get(url, function(res) {
            if(res.statusCode != 200) {
                var msg = 'incorrent status : ' + res.statusCode;
                return cb({code: ERRCODE.DATA_INVALID, msg: msg});
            }
            res.setEncoding('utf8');
            var recvData = '';
            res.on('data', function (chunk) {
                recvData += chunk;
            });
            res.on('end', function () {
                recvData = sumServersStruct(lastData, recvData);
                cb(null, recvData);
            });
        }).on('error', function(e) {
            cb({code: ERRCODE.DATA_INVALID, msg: e.message});
        });
    }
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var logmsg = ' to get the dashboard query data.';
    mLogger.debug('Try '+logmsg);

    mAsync.waterfall([
        // look up ids
        function(next) {
            var sqlstr = 'select * from ' + mBiddersModel.tableName;
            if(mUtils.isExist(param.id)) {
                sqlstr += ' where id='+param.id;
            }

            mBiddersModel.query({sqlstr: sqlstr}, function(err, rows) {
                if(err) {
                    next(err);
                } else {
                    if( (rows.length==0) && (mUtils.isExist(param.id)) ) {
                        var msg = 'Cannot find out the server data for id : ' + param.id;
                        mLogger.error(msg);
                        next({code: ERRCODE.PARAM_INVALID, msg: msg});
                    } else {
                        next(null, rows);
                    }
                }
            });
        },
        function(bidder_rows, next) {
            var list = [];
            for(var i in bidder_rows) {
                var host = bidder_rows[i].host;
                var port = bidder_rows[i].port;
                var url = 'http://' + host + ':' + port + '/var/'+param.prefix+'_'+param.name+'?series';  
                list.push(creatFnt(url));
            }
            mAsync.waterfall(list, next);
        }
    ], function(err, data) {
        if(err) {
            fn(err);
        } else {
            fn(null, data);
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