/*
 * @file  adx_config.js
 * @description adx config update logic
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.17
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'adx_config.logic';
var URLPATH = '/v1/adx/config';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');


var LogicApi = require("../logic_api");

//models
var mAdxModel = require('../../model/adlib_adx').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mUtils = require('../../../utils/utils');

//constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    adx_id: {
        data: 1,
        rangeCheck: function(data) {
            return mIs.positive(data);
        }
    },
    dsp_id: {
        data: 'dsp_id',
        rangeCheck: function(data) {
            return true;
        }
    },
    token: {
        data: 'token',
        rangeCheck: function(data) {
            return true;
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
        return fn({code:ERRCODE.PARAM_INVALID, msg: msg});        
    }

    var adx_id = param.adx_id;
    var logmsg = ' to update config for adx : ' + adx_id;
    mLogger.debug('Try' + logmsg);

    var conf = '{\\"config\\":{\\"dsp_id\\":\\"' + param.dsp_id;
    conf += '\\",\\"token\\":\\"' + param.token;
    conf += '\\"}}';
    var sqlStr = 'UPDATE ' + mAdxModel.tableName;
    sqlStr += ' SET config = "' + conf;
    sqlStr += '" WHERE id =' + adx_id;
    sqlStr += ';';
    var query = {
        sqlstr: sqlStr
    };
    mAdxModel.query(query, function(err) {
        if(err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        } else {
            mLogger.debug('Success' + logmsg);
            fn(null, {});
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
