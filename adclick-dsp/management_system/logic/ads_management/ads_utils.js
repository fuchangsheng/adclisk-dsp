/*
 * @file  ads_utils.js
 * @description create the ad utils API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.12.08
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_utils.logic';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mADPlanModel = require('../../model/adlib_plans').create()
var mADUnitModel = require('../../model/adlib_units').create();
var mADIdeaModel = require('../../model/adlib_ideas').create();
var mADUserModel = require('../../model/adlib_user').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

function checkIdeaAssert(type, asset) {
    return true;
}

function formatWidthHeight(param) {
    param.w = Number(param.w);
    param.h = Number(param.h);
}

function formatDuration(param) {
    param.duration = Number(param.duration);
}

function formatIdeaAsset(type, asset) {
    if(type==ADCONSTANTS.IDEATYPE.IMAGE.code) {
        if (asset.main_img) {
            formatWidthHeight(asset.main_img);
        }
    }else if (type==ADCONSTANTS.IDEATYPE.FLASH.code) {
        if (asset.flash) {
            formatWidthHeight(asset.flash);
        }
    }else if (type==ADCONSTANTS.IDEATYPE.VIDEO.code) {
        if (asset.video) {
            formatWidthHeight(asset.video);
            formatDuration(asset.video);
        }
    }else if (type==ADCONSTANTS.IDEATYPE.NATIVE.code) {
        if (asset.icon_img) {
            formatWidthHeight(asset.icon_img);
        }
        if (asset.logo_img) {
            formatWidthHeight(asset.logo_img);
        }
        if (asset.main_img) {
            formatWidthHeight(asset.main_img);
        }
    }else if (type==ADCONSTANTS.IDEATYPE.IMAGETEXT.code) {
        if (asset.main_img) {
            formatWidthHeight(asset.main_img);
        }
    }
}

function getAdxInfo(unit_ids, unit_target_rows) {
    var adxInfo = {};

    // get all adx list
    var defaultAdxs = [];
    for(var i in ADCONSTANTS.ADXLIST.datas) {
        defaultAdxs.push(ADCONSTANTS.ADXLIST.datas[i].code);
    }

    // get unit info
    for(var i in unit_ids) {
        var unit_id = unit_ids[i];
        var adx_info = {};
        adx_info[unit_id] = [];
        // get target info
        for(var i in unit_target_rows) {
            var target_unit_id = unit_target_rows[i].unit_id;
            var target_content = unit_target_rows[i].content;
            var targets = [];
            try{
                targets = target_content.split(',');
            }
            catch(e) {
                targets = [];
            }

            // find out the equal unit
            if(unit_id == target_unit_id) {
                // parse targets
                for(var m in targets) {
                    var adxCode = parseInt(targets[m]);
                    if(!isNaN(adxCode)) {
                        adx_info[unit_id].push(adxCode);
                    }
                }
            }
        }

        // if adx list is empty, to set all adx list
        if(adx_info[unit_id].length == 0) {
            adx_info[unit_id] = defaultAdxs;
        }

        adxInfo = adx_info;
    }

    return adxInfo;
}

function totalBudgetByPlanId(plan_info) {
    // get days
    var end_time = plan_info.end_time;
    var start_time = plan_info.start_time;
    var cycle = plan_info.plan_cycle;
    var duration_days = 0;

    duration_days = mUtils.getDurationDays(start_time, end_time, cycle);
    // sum
    var total = plan_info.budget * duration_days;

    return total;
}

function getPlanInfosByUserId(user_id, cb) {
    var now = mMoment().format(ADCONSTANTS.DATATIMEFORMAT);

    var sqlstr = 'select * from ' + mADPlanModel.tableName;
    sqlstr += ' where plan_status=0';
    sqlstr += ' and plan_cycle!="000000000000000000000000000000000000000000"';
    sqlstr += ' and end_time > "'+now+'"';
    sqlstr += ' and user_id = '+user_id;

    var query = {
        sqlstr : sqlstr,
    }
    mADPlanModel.query(query, function(err, rows) {
        if(err) {
            cb(err);
        } else {
            cb(null, rows);
        }
    });
}

function getBalanceByUserId(user_id, cb) {
    var select = {
        balance: 1,
        user_id: user_id,
    };
    var match = {
        user_id: user_id,
    };

    var query = {
        match: match,
        select: select,
    };
    mADUserModel.lookup(query, function(err, rows) {
        if(err) {
            cb(err);
        } else {
            if(rows.length == 0) {
                var msg = 'Cannot find user_id ' + user_id;
                mLogger.error(msg);
                cb({code: ERRCODE.DATA_INVALID, msg: msg});
            } else {
                var balance = rows[0].balance/1000;
                cb(null, balance);
            }
        }
    });
}

function getPlanInfoById(plan_id, cb) {
    var refModel = mADPlanModel.refModel;
    var match = {
        plan_id: plan_id,
    };

    var query = {
        match: match,
        select: refModel,
    };
    mADPlanModel.lookup(query, function(err, rows) {
        if(err) {
            next(err);
        } else {
            if(rows.length == 0) {
                var msg = 'Cannot find plan_id ' + plan_id;
                mLogger.error(msg);
                cb({code: ERRCODE.DATA_INVALID, msg: msg});
            } else {
                var plan_info = rows[0];
                cb(null, plan_info);
            }
        }
    });
}

function adsPlanBalanceInfo(param, fn) {
    var user_id = param.user_id;
    var plan_id = param.plan_id;
    var resData = {
        balance : 0,
        total_budget : 0,
    };

    if(!user_id && !plan_id) {
        return fn(null, resData);
    }

    if(!user_id) {
        //1.find out balance of user_id by plan_id
        mAsync.waterfall([
            function(next) {
                getPlanInfoById(plan_id, next);
            },
            function(plan_info, next) {
                var user_id = plan_info.user_id;
                resData.total_budget = totalBudgetByPlanId(plan_info);
                getBalanceByUserId(user_id, next);
            },
        ], function(err, balance) {
            if(err) {
                return fn(err);
            } else {
                resData.balance = balance;
                return fn(null, resData);
            }
        });
    }

    if(!plan_id) {
        mAsync.waterfall([
            function(next) {
                getBalanceByUserId(user_id, next);
            },
            function(balance, next) {
                resData.balance = balance;
                getPlanInfosByUserId(user_id, next);
            },
            function(plan_infos, next) {
                var totalBudget = 0;
                for(var i in plan_infos) {
                    totalBudget += totalBudgetByPlanId(plan_infos[i]);
                }
                resData.total_budget = totalBudget;
                next(null);
            },
        ], function(err) {
            if(err) {
                return fn(err);
            } else {
                return fn(null, resData);
            }
        });
    }
}

function parserUnitTarget(target) {
    var type = target.type;
    var content = target.content;

    switch(type) {
    case ADCONSTANTS.ADTARGETTYPE.ADX.code:
        var adxNames = content.split(',');
        var adxs = [];
        for(var i in adxNames) {
            var adx = ADCONSTANTS.ADXLIST.parse(adxNames[i]);
            if(adx != -1) {
                adxs.push(adx);
            }
        }
        content = adxs.join(',');

        break;
    case ADCONSTANTS.ADTARGETTYPE.ADVIEWTYPE.code:
        switch(content) {
        case 'web':
            content = 0;
            break;
        case 'wap':
            content = 1;
            break;
        case 'app':
            content = 2;
            break;
        default:
            content = 0;
            break;
        }
        content += '';

        break;
    case ADCONSTANTS.ADTARGETTYPE.OS.code:
        var osNames = content.split(',');
        var oss = [];
        for(var i in osNames) {
            var os = ADCONSTANTS.OS.parse(osNames[i]);
            if(os != -1) {
                oss.push(os);
            }
        }
        content = oss.join(',');

        break;
    case ADCONSTANTS.ADTARGETTYPE.CARRIER.code:
        var carrierNames = content.split(',');
        var carriers = [];
        for(var i in carrierNames) {
            var carrier = ADCONSTANTS.CARRIER.parse(carrierNames[i]);
            if(carrier != -1) {
                carriers.push(carrier);
            }
        }
        content = carriers.join(',');

        break;
    case ADCONSTANTS.ADTARGETTYPE.CONNECTIONTYPE.code:
        var connNames = content.split(',');
        var conns = [];
        for(var i in connNames) {
            var conn = ADCONSTANTS.CONNECTIONTYPE.parse(connNames[i]);
            if(conn != -1) {
                conns.push(conn);
            }
        }
        content = conns.join(',');

        break;
    case ADCONSTANTS.ADTARGETTYPE.STARTTIME.code:
    case ADCONSTANTS.ADTARGETTYPE.ENDTIME.code:
        var time = mMoment(content);
        if(time.isValid()) {
            // to sec.
            content = time.valueOf()/1000 + '';
        }

        break;
    case ADCONSTANTS.ADTARGETTYPE.BROWSER.code:
        var browserNames = content.split(',');
        var browsers = [];
        for(var i in browserNames) {
            var browser = ADCONSTANTS.BROWSER.parse(browserNames[i]);
            if(browser != -1) {
                browsers.push(browser);
            }
        }
        content = browsers.join(',');

        break;
    default:
        break;
    }

    target.content = content;
}

function formatUnitTarget(target) {
    var type = target.type;
    var content = target.content;

    switch(type) {
    case ADCONSTANTS.ADTARGETTYPE.ADX.code:
        var adxs = content.split(',');
        var adxNames = [];
        for(var i in adxs) {
            var adxName = ADCONSTANTS.ADXLIST.format(adxs[i]);
            if(adxName != '') {
                adxNames.push(adxName);
            }
        }
        content = adxNames.join(',');

        break;
    case ADCONSTANTS.ADTARGETTYPE.ADVIEWTYPE.code:
        switch(content) {
        case '0':
            content = 'web';
            break;
        case '1':
            content = 'wap';
            break;
        case '2':
            content = 'app';
            break;
        default:
            content = 'web';
            break;
        }

        break;
    case ADCONSTANTS.ADTARGETTYPE.OS.code:
        var oss = content.split(',');
        var osNames = [];
        for(var i in oss) {
            var osName = ADCONSTANTS.OS.format(oss[i]);
            if(osName != '') {
                osNames.push(osName);
            }
        }
        content = osNames.join(',');

        break;
    case ADCONSTANTS.ADTARGETTYPE.CARRIER.code:
        var carriers = content.split(',');
        var carrierNames = [];
        for(var i in carriers) {
            var carrierName = ADCONSTANTS.CARRIER.format(carriers[i]);
            if(carrierName != '') {
                carrierNames.push(carrierName);
            }
        }
        content = carrierNames.join(',');

        break;
    case ADCONSTANTS.ADTARGETTYPE.CONNECTIONTYPE.code:
        var conns = content.split(',');
        var connNames = [];
        for(var i in conns) {
            var connName = ADCONSTANTS.CONNECTIONTYPE.format(conns[i]);
            if(connName != '') {
                connNames.push(connName);
            }
        }
        content = connNames.join(',');

        break;
    case ADCONSTANTS.ADTARGETTYPE.STARTTIME.code:
    case ADCONSTANTS.ADTARGETTYPE.ENDTIME.code:
        var intTime = parseInt(content);
        // to mis
        var time = mMoment(intTime*1000);
        if(time.isValid()) {
            content = time.format(ADCONSTANTS.HOURLYTIME).toString();
        }

        break;
    case ADCONSTANTS.ADTARGETTYPE.BROWSER.code:
        var browsers = content.split(',');
        var browserNames = [];
        for(var i in browsers) {
            var browserName = ADCONSTANTS.BROWSER.format(browsers[i]);
            if(browserName != '') {
                browserNames.push(browserName);
            }
        }
        content = browserNames.join(',');

        break;
    default:
        break;
    }

    target.content = content;
}

module.exports.checkIdeaAssert = checkIdeaAssert;
module.exports.formatIdeaAsset = formatIdeaAsset;
module.exports.getAdxInfo = getAdxInfo;
module.exports.totalBudgetByPlanId = totalBudgetByPlanId;
module.exports.getPlanInfoById = getPlanInfoById;
module.exports.adsPlanBalanceInfo = adsPlanBalanceInfo;
module.exports.parserUnitTarget = parserUnitTarget;
module.exports.formatUnitTarget = formatUnitTarget;