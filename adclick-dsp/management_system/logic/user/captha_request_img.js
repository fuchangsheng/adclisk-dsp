/*
 * @file  captha_request_img.js
 * @description dsp user account recharge info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'captha_request_img.logic';
var URLPATH = '/v1/mgr/captha/request/img';

//system modules
var mFs = require('fs');
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mCcap = require('ccap');//close it for building issue in the centos 6.5
//svar mCcap = null;


var LogicApi = require("../logic_api");

//models
var mCodeModel = require('../../model/verify_code').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');

//common
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRoot = __dirname +'/../../download/';

var mRefModel = {
    token:{
        data:'',
        rangeCheck:null,
    },
    width:{
        data: 0,
        rangeCheck: function(data) {
            return (data > 0 ) && (data < 1024);
        },
        optional: true,
    },
    height:{
        data: 0,
        rangeCheck: function(data) {
            return (data > 0) && (data < 1024);
        },
        optional: true,
    },
    fontsize:{
        data: 0,
        rangeCheck: function(data) {
            return data > 0 && data < 100;
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
        file: data,
    };
    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }

    mLogger.debug('Try to request the verify code image');
    var code_name = param.token;

    mAsync.waterfall([
        //1. verify the code name is valid
        function(next) {
            var match = {
                code_name: code_name,
                status: ADCONSTANTS.VERIFYCODESTATUS.CREATE.code,
            };
            var select = match;
            var query = {
                select: select,
                match: match,
            };
            mCodeModel.lookup(query, function(err, rows){
                if (err) {
                    next(err);
                }else{
                    if (!rows || rows.length==0) {
                        var msg = 'No this code name';
                        mLogger.error(msg);
                        err = {
                            code: ERRCODE.DB_NO_MATCH_DATA,
                            msg: msg,
                        };
                        next(err);
                    }else{
                        next(null, rows[0]);
                    }
                }
            });                                                       
        },
        //2. generate the code image
        function(data, next) {
            var ccap = mCcap({
                width: param.width || ADCONSTANTS.VERIFYCODEIMAGE.WIDTH,
                height: param.height || ADCONSTANTS.VERIFYCODEIMAGE.HEIGHT,
                offset: ADCONSTANTS.VERIFYCODEIMAGE.OFFSET,
                quality: ADCONSTANTS.VERIFYCODEIMAGE.QUALITY,
                FONTSIZE: param.fontsize || ADCONSTANTS.VERIFYCODEIMAGE.FONTSIZE,
                generate:function(){
                    //Custom the function to generate captcha text
                    //generate captcha text here
                    var array = '0123456789abcdefghijkmnpqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ';
                    var size = ADCONSTANTS.VERIFYCODEIMAGE.CHARCOUNT;
                    var text = '';
                    while(size--) {
                        var sindex = Math.floor(Math.random()*(array.length-1));
                        text += array[sindex];
                    }

                    return text;//return the captcha text
                }
            });

            //2.1 get the code image buffer and text
            var datas = ccap.get();
            var code_value = datas[0];
            var update = {              
                status: ADCONSTANTS.VERIFYCODESTATUS.GENERATE.code,
                code_value: code_value,
            };
            var match = {
                code_name: code_name,
            };
            var query = {
                update: update,
                match: match,
            };

            //2.2 save the code text in the data base
            mCodeModel.update(query, function(err, rows){
                if (err) {
                    var msg = err.msg || 'Failed to update the code data';
                    mLogger.error(msg);
                    ne(err);
                }else{
                    //2.3 return the code image buffer 
                    next(null, datas[1]);
                }
            });
        },
        function(data, next) {
            var file = 'captha/'+code_name+'.png';
            mFs.writeFile(mRoot+file, data, {flag: 'w'}, function(err) {
                if (err) {
                    next(err);
                }else {
                    next(null, file);
                }
            });
        }
    ],
    function(err, file){
        //3.1 process the error
        if (err) {
            mLogger.error('Failed to generate the verify code image!');
            fn(err);
        }else {
            //3.2 response the data
            var resData = packageResponseData(file);
            fn(null, resData);
        }
    });
}

/*
* export the get interface
*/
mRouter.get(URLPATH, function(req, res, next){
    var param = req.query;

    //we reponse the raw data
    mLogicHelper.responseHttp({
        res: res,
        req: req,
        next: next,
        processRequest: processRequest,
        param: param,       
    });
});

module.exports.router = mRouter;
