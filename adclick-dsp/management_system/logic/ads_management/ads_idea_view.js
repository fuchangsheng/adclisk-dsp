/*
 * @file  ads_idea_view.js
 * @description get the ad user's ad idea detail API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.09
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_idea_view.logic';
var URLPATH = '/v1/aduser/ads/idea/view';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mADPlanModel = require('../../model/adlib_plans').create();
var mADUnitModel = require('../../model/adlib_units').create();
var mADIdeaModel = require('../../model/adlib_ideas').create();
//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidUserId(data);
        },
    },
    idea_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidIdeaId(data);
        }
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

    var slots = data.idea_slots.split(',');
    var idea_slots = [];
    for (var i = 0; i < slots.length; i++) {
        idea_slots.push ({type: ADCONSTANTS.IDEASLOTTYPE.format(slots[i])});
    }

    var plan_name = data.plan_name || '';
    var unit_name = data.unit_name || '';

    var resData = {
        plan_id: data.plan_id,
        unit_id: data.unit_id,
        idea_id: data.idea_id,
        plan_name: plan_name,
        unit_name: unit_name,
        idea_name: data.idea_name,
        idea_slots: idea_slots,
        idea_type: ADCONSTANTS.IDEATYPE.format(data.idea_type),
        landing_page: data.landing_page,
        adview_type: ADCONSTANTS.ADVIEWTYPE.format(data.adview_type),
        idea_trade: data.idea_trade,
        idea_status: ADCONSTANTS.ADSTATUS.format(data.idea_status),
        imp_monitor_urls: data.imp_monitor_urls.split(' '),
        click_monitor_urls: data.click_monitor_urls.split(' '),
        assets: JSON.parse(data.assets),
    };

    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id;

    var logmsg = ' to get ad plan idea detail for user:' + user_id;
    mLogger.debug('Try '+logmsg);

    mAsync.waterfall([
        //1. check total number of ad plans in the system
        function(next) {
            var match = {
                user_id: user_id,
                idea_id: param.idea_id,
            };
            var select = mADIdeaModel.refModel;

            var query = {
                select: select,
                match: match,
            };
            mADIdeaModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    if (!rows || rows.length==0) {
                        var msg = 'The idea is empty!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_NO_MATCH_DATA, msg:msg});
                    }
                    next(null, rows[0]);
                }
            });
        },
        //2. get the unit info
        function(data, next){
            var match = {
                unit_id: data.unit_id,
            };
            var select = {
                unit_name: '',
            };

            var query = {
                select: select,
                match: match,
            };

            mADUnitModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    if (rows && rows.length>0) {
                        data.unit_name = rows[0].unit_name;
                    }
                    next(null, data);
                }
            });
        },
        //3. get the plan info
        function(data, next){
            var match = {
                plan_id: data.plan_id,
            };
            var select = {
                plan_name: '',
            };

            var query = {
                select: select,
                match: match,
            };

            mADPlanModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    if (rows && rows.length>0) {
                        data.plan_name = rows[0].plan_name;
                    }
                    next(null, data);
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

