/*
 * @file  ads_del_utils.js
 * @description del the ad user's ad idea | unit | plan API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.29
 * @version 0.0.1 
 */

'use strict';
var MODULENAME = 'ads_del_utils.logic';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require("express");
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mADPlanModel = require("../../model/adlib_plans").create();
var mADUnitModel = require("../../model/adlib_units").create();
var mADUnitTargetModel = require("../../model/adlib_unit_target").create();
var mADIdeaModel = require("../../model/adlib_ideas").create();
var mAuditIdeaModel = require("../../model/adclick_audit_ideas").create();
var mAdxAuditIdeaModel = require("../../model/adlib_audit_ideas").create();

//utils
var mLogger = require("../../../utils/logger")(MODULENAME);
var mDataHelper = require("../../../utils/data_helper");
var mUtils = require("../../../utils/utils");

//common contants 
var ERRCODE = require("../../../common/errCode");
var ADCONSTANTS = require("../../../common/adConstants");

var WATERFALL_BOTTOM = {
    Idea: 0,
    Unit: 1,
    Plan: 2,
};


function waterfallAssign(param, bottom, target) {
    var waterfall = [{
            idea_id: param.idea_id
        },
        {
            unit_id: param.unit_id
        },
        {
            plan_id: param.plan_id
        },
    ];

    var cur_floor = WATERFALL_BOTTOM.Plan;
    var floorAssign = function (floor) {
        //返回floor的keys第一个元素，键值对存入target
        var key = Object.keys(floor)[0];
        var value = floor[key];
        if (mUtils.isExist(value)) {
            target[key] = value;
            return true;
        }
        return false;
    }

    //找出当前最高层
    for (var i = waterfall.length - 1; i >= 0; i--) {
        var floor = waterfall[i];
        // plan层次高于unit，idea，删除plan包含删除unit，idea,由最高层判断到bottom
        //若有对应的id，则返回其在waterfall中的索引位置
        if (i < bottom) {
            break;
        }
        if (floorAssign(floor)) {
            cur_floor = i;
        }
    }
    return cur_floor;
}

function removeAdxAuditTransaction(param,fn){
    mLogger.debug("Calling removeAdxAuditTransaction!");
    var match = {
        user_id:param.user_id,
    };
    waterfallAssign(param,WATERFALL_BOTTOM.Idea,match);
    if(Object.keys(match).length != 2){
        return fn(null);
    }
    var query = {
        match : match,
    };
    query.connection = param.connection;
    mAdxAuditIdeaModel.remove(query,fn);
}

function removeAuditTransanction(param, fn) {
    mLogger.debug("Calling removeAuditTransanction!");
    var match = {
        user_id: param.user_id,
    };

    waterfallAssign(param, WATERFALL_BOTTOM.Idea, match);
    if (Object.keys(match).length != 2) {
        return fn(null);
    }
    var query = {
        match: match,
    };
    query.connection = param.connection;
    mAuditIdeaModel.remove(query, fn);
}

function removeIdeas(param, fn) {
    mLogger.debug("Calling removeIdeas!");
    //remove user_id's matched ideas through user_idea and idea_id
    var match = {
        user_id: param.user_id,
    };
    waterfallAssign(param,WATERFALL_BOTTOM.Idea, match);
    if (Object.keys(match).length != 2) {
        return fn(null);
    }
    var query = {
        match: match,
    };

    //???param是什么，为什么要传connection
    query.connection = param.connection;
    mADIdeaModel.remove(query, fn);
}

function removeUnits(param, fn) {
    mLogger.debug("Calling removeUnits!");

    var match = {
        user_id: param.user_id,
    };
    waterfallAssign(param,WATERFALL_BOTTOM.Unit, match);
    if (Object.keys(match).length != 2) {
        return fn(null);
    }
    var query = {
        match: match,
    };
    query.connection = param.connection;
    mADUnitModel.remove(query, fn);
}

function removeUnitTargets(param, fn) {
    mLogger.debug("Calling removeUnitTargets!");
    var match = {
        user_id: param.user_id,
    };
    waterfallAssign(param, WATERFALL_BOTTOM.Unit, match);
    if (Object.keys(match).length != 2) {
        return fn(null);
    }

    var query = {
        match: match,
    };

    query.connection = param.connection;
    mADUnitTargetModel.remove(query, fn);
}

function removePlan(param, fn) {
    mLogger.debug("Calling removePlan.");
    var match = {
        user_id: param.user_id,
    };
    waterfallAssign(param, WATERFALL_BOTTOM.Plan, match);
    if (Object.keys(match).length != 2) {
        return fn(null);
    }
    var query = {
        match: match,
    };
    query.connection = param.connection;
    mADPlanModel.remove(query, fn);
}

function removeAdLibTransanction(param, fn) {
    mLogger.debug("Calling removeAdlibTransanction!");
    mAsync.series([
        function (next) {
            removeIdeas(param, next);
        },
        function (next) {
            removeUnits(param, next);
        },
        function (next) {
            removeUnitTargets(param, next);
        },
        function (next) {
            removePlan(param, next);
        },
    ], function (err) {
        if (err) {
            fn(err);
        } else {
            fn(null, {});
        }
    });
}


function adsDelTransanctionBatch(param, fn) {
    mLogger.debug("Calling adsDelTransanctionBatch!");
    var transactions = [];
    var data = {};

    waterfallAssign(param, WATERFALL_BOTTOM.Idea, data);
    if (Object.keys(data).length != 1) {
        var msg = "Condition to remove is error, data = " + JSON.stringify(data);
        mLogger.debug(msg);
        return fn({
            code: ERRCODE.DATA_INVALID,
            msg: msg
        });
    }

    //1.do the dsp business database
    data = {
        user_id: param.user_id,
        transactionFun: removeAdLibTransanction,
    };
    waterfallAssign(param, WATERFALL_BOTTOM.Idea, data);
    transactions.push({
        data: data,
        model: mADIdeaModel
    });

    //2.do the dsp management database
    data = {
        user_id: param.user_id,
        transactionFun: removeAuditTransanction,
    };
    waterfallAssign(param, WATERFALL_BOTTOM.Idea, data);
    transactions.push({
        data: data,
        model: mAuditIdeaModel
    });

    //3.do the dsp adx database
    data = {
        user_id: param.user_id,
        transactionFun: removeAdxAuditTransaction,
    };
    waterfallAssign(param, WATERFALL_BOTTOM.Idea, data);
    transactions.push({
        data: data,
        model: mAdxAuditIdeaModel
    });

    var options = {
        transactions: transactions,
    };
    mUtils.transactionBatch(options,fn);
}


module.exports.adsDelTransanctionBatch = adsDelTransanctionBatch;