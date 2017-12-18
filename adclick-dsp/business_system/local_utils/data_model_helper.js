/*
 * @file  data_model_helper.js
 * @description data model utils helper api
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'sms_request.utils';

//data model
var mDspAduserModel = require('../model/dsp_aduser').create();
var mAdOperatorsModel = require('../model/aduser_operators').create();
//third-party modules

//helper
var mLogger = require('../../utils/logger')(MODULENAME);

//common constants
var ADCONSTANTS = require('../../common/adConstants');
var ERRCODE = require('../../common/errCode');


function makeSureAdUserExist(param, fn) {
    var select = mDspAduserModel.refModel;
    var user_id = param.user_id || param ;
    var match = {
        user_id: user_id,
    };
    var query = {
        select: select,
        match: match,
    };

    mDspAduserModel.lookup(query, function(err, rows) {
        if (err) {
            fn(err);
        }else { 
            if (!rows || rows.length==0) {
                var msg = 'There is no this Ad user!';
                mLogger.error(msg);
                return fn({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});          
            }
            fn(null, rows[0]);
        }
    });
}

function checkAdOperatorExit(param, fn) {
    var match = {
        user_id: param.user_id,
        status: ADCONSTANTS.DATASTATUS.VALID.code,
    };
    if (param.oper_id) {
        match.oper_id = param.oper_id;
    }
    if (param.name) {
        match.name = param.name;
    }
    var query = {
        match: match,
    };
    mAdOperatorsModel.count(query, function(err, total) {
        if (err) {
            fn(err);
        }else {
            var isExist = total===0? false: true;
            fn(null, isExist);
        }
    });
}

module.exports.makeSureAdUserExist = makeSureAdUserExist;
module.exports.checkAdOperatorExit = checkAdOperatorExit;