/*
 * @file  summary_list_daily.js
 * @description get summary list data API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author yangshiyu
 * @date 2017.11.28
 * @version 0.0.1 
 */

'use strict';
var MODULENAME = 'summary_list_daily.logic';
var URLPATH = '/v3/ads/summary/dailylist';

var mDebug = require("debug")(MODULENAME);
var mExpress = require("express");
var mRouter = mExpress.Router();
var mAsync = require("async");
var mIs = require("is_js");
var mMoment = require("moment");

var LogicApi = require("../../logic_api");

//models
var mADSummaryModel = require("../../../model/adlib_summary_daily").create();

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
    begin_date: {
        data: 'YYYY-MM-DD',
        rangeCheck: function (data) {
            return mUtils.verifyDatatime(data, ADCONSTANTS.DATAFORMAT);
        },
    },
    end_date: {
        data: 'YYYY-MM-DD',
        rangeCheck: function (data) {
            return mUtils.verifyDatatime(data, ADCONSTANTS.DATAFORMAT);
        },
    },
    index: {
        data: 1,
        rangeCheck: function(data) {
            return data >= 0;
        },
        optional: true,
    },
    count: {
        data: 1,
        rangeCheck: function(data) {
            return data>=0 && data <= ADCONSTANTS.PAGEMAXCOUNT;
        },
        optional: true,
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

function fenToYuan(amount) {
    try{
        var num = Number(amount);
        var newNum = num / 100;
        return newNum.toFixed(2);
    }catch(e){
        mLogger.error('Failed to translate the amount to yuan:'+amount);
        return -1;
    }
}

function getTimeUnit(begin_date, end_date) {
    var duringDays = mMoment(begin_date).diff(end_date);
    if (duringDays == 0) {
        return ADCONSTANTS.DATAUNIT.UNIT_HOUR;
    } else {
        return ADCONSTANTS.DATAUNIT.UNIT_DAY;
    }
}

function packageResponseData(data, item_offset, count) {
    if (!data) {
        return {};
    }
    var items = data.items;
    var all_request = 0,
        //all_bid = 0,
        all_click = 0,
        all_imp = 0,
        all_active = 0;
    var cpm_total = 0,
        cpc_total = 0,
        cpa_total = 0,
        ctr_total = 0,
        all_cost = 0;
    var resData = {
        item_total: items.length,
        count: count,
        all_request: 0,
        all_imp: 0,
        all_click: 0,
        all_active: 0,
        //all_bid: 0,
        all_cost: 0,
        cpm_total: 0,
        cpc_total: 0,
        cpa_total: 0,
        ctr_total: 0,
        list: []
    }
    console.log("83data.length:" + items.length);
    console.log("83:data[0]:" + JSON.stringify(items[0]));
    console.log("84:item_offset:" + item_offset);
    console.log("85:count:" + count);
    for (var i = item_offset; i < count && i < items.length; ++i) {
        var cost_yuan = Number(fenToYuan(items[i].cost/1000));
        var cpm = 0;
        var ctr = 0;
        if (items[i].imp != 0) {
            cpm = cost_yuan * 1000 / items[i].imp;
            cpm = Number(cpm.toFixed(5));
            ctr = items[i].click / items[i].imp;
            ctr = Number(ctr.toFixed(5));
        }
        var cpc = 0;
        if (items[i].click != 0) {
            cpc = cost_yuan / items[i].click;
            cpc = Number(cpc.toFixed(5));
        }
        var cpa = 0;
        if (items[i].active != 0) {
            cpa = cost_yuan / items[i].active;
            cpa = Number(cpa.toFixed(5));
        }
        //all_bid += items[i].bid;
        all_request += items[i].request;
        all_imp += items[i].imp;
        all_click += items[i].click;
        all_active += items[i].active;
        all_cost += cost_yuan;
        var item = {
            date: items[i].date,
            request: items[i].request,
            imp: items[i].imp,
            active: items[i].active,
            click: items[i].click,
            //bid: items[i].bid,
            cost: cost_yuan,
            CPM: cpm,
            CPC: cpc,
            CPA: cpa,
            CTR: ctr,
        };
        //resData.all_bid = all_bid;
        resData.all_request = all_request;
        resData.all_imp = all_imp;
        resData.all_click = all_click;
        resData.all_cost = all_cost;
        resData.all_active = all_active;
        if (all_imp > 0) {
            resData.cpm_total = all_cost * 1000 / all_imp;
            resData.cpm_total = Number(resData.cpm_total.toFixed(5));
            resData.ctr_total = all_click / all_imp;
            resData.ctr_total = Number(resData.ctr_total.toFixed(5));
        }
        if (all_click > 0) {
            resData.cpc_total = all_cost / all_click;
            resData.cpc_total = Number(resData.cpc_total.toFixed(5));
        }
        if (all_active > 0) {
            resData.cpa_total = all_cost / all_active;
            resData.cpa_total = Number(resData.cpa_total.toFixed(5));
        }
        console.log("data[" + i + "]:" + JSON.stringify(data[i]));
        resData.list.push(item);
    }
    return resData;
}


function preprocess(param) {
    if (param.begin_date) {
        param.begin_date = mMoment(param.begin_date).format(ADCONSTANTS.DATAFORMAT);
    }
    if (param.end_date) {
        param.end_date = mMoment(param.end_date).format(ADCONSTANTS.DATAFORMAT);
    }
}

function getSqlstr(param) {
    
    var mTimeUnit = getTimeUnit(param.begin_date, param.end_date);
    var sqlstr = 'SELECT';
    if (mTimeUnit == ADCONSTANTS.DATAUNIT.UNIT_HOUR) {
        sqlstr += ' date_format(date,"%Y-%m-%d %H:00:00") AS date,';
        sqlstr += ' SUM(request) AS request,SUM(imp) AS imp,SUM(click) AS click,SUM(download) AS active,SUM(cost) AS cost';
        sqlstr += ' FROM ' + mADSummaryModel.tableName;
        sqlstr += ' WHERE user_id=' + param.user_id;
        sqlstr += ' AND ( date BETWEEN "' + param.begin_date + ' 00:00:00' + '" AND "' + param.end_date + ' 23:59:59")';
        sqlstr += ' GROUP BY date ORDER BY date_format(date,"%Y-%m-%d %H:00:00") ';
    } else if (mTimeUnit == ADCONSTANTS.DATAUNIT.UNIT_DAY) {
        sqlstr += ' date_format(date,"%Y-%m-%d") AS date,';
        sqlstr += ' SUM(request) AS request,SUM(imp) AS imp,SUM(click) AS click,SUM(download) AS active,SUM(cost) AS cost';
        sqlstr += ' FROM ' + mADSummaryModel.tableName;
        sqlstr += ' WHERE user_id=' + param.user_id;
        sqlstr += ' AND ( date BETWEEN "' + param.begin_date + ' 00:00:00' + '" AND "' + param.end_date + ' 23:59:59")';
        sqlstr += ' GROUP BY date ORDER BY date';
    }

    if (mUtils.isExist(param.sort) && (param.sort == ADCONSTANTS.DATASORT.CREATETIME_ASC.code)) {
        sqlstr += ' DESC;';
    } else {
        sqlstr += ' ASC;';
    }

    return sqlstr;
}


function processRequest(param, fn) {
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);

        return fn({
            code: ERRCODE.PARAM_INVALID,
            msg: msg
        });
    }

    var logmsg = " to list all info about user:" + param.user_id;
    mLogger.debug("Try " + logmsg);

    mAsync.waterfall([
        //1.get total number of items
        //function(next){
        //     var sqlstr = "";
        //     sqlstr += "select count(*) as total ";
        //     sqlstr += " from " + mADSummaryModel.tableName;
        //     sqlstr += " where date = '" + param.date + "'";

        //     var query = {
        //         sqlstr: sqlstr,
        //     };

        //     mADSummaryModel.query(query,function(err,rows){
        //         if(err){
        //             next(err);
        //         }else{
        //             next(null,rows[0].total);
        //         }
        //     });
        // },
        //2.get list
        function (next) {
            var index = param.index || 0;
            var count = param.count || ADCONSTANTS.DEFAULTCOUNT;
            var offset = index * count;
            var sqlstr = getSqlstr(param);
            console.log("sqlstr:" + sqlstr);

            var query = {
                sqlstr: sqlstr,
            };

            mADSummaryModel.query(query, function (err, rows) {
                if (err) {
                    next(err);
                } else {
                    if (!rows || rows.length == 0) {
                        //Todo: test it 
                        console.log("184:rows.length:" + rows.length);
                        var count = param.count || ADCONSTANTS.DEFAULTCOUNT;
                        return next(null, {
                            items: []
                        }, 0, count);
                    } else {
                        var index = param.index || 0;
                        var count = param.count || ADCONSTANTS.DEFAULTCOUNT;
                        var item_offset = index * count;
                        if (item_offset >= rows.length) {
                            mLogger.info('There is no more data in the system for user:' + user_id);
                            return next(null, {
                                items: []
                            }, 0, count);
                        }
                        console.log("rows.length:" + rows.length);
                        //console.log("rows:"+JSON.stringify(rows[0]));
                        //console.log("date:" + rows[0].date + "request:" + rows[0].request + ";click:" + rows[0].click + ";cost:" + rows[0].cost + ";");
                        //console.log("imp:" + rows[0].imp + ";bid:" + rows[0].bid + ";download:" + rows[0].download);
                        next(null, {
                            items: rows
                        }, item_offset, count);
                    }

                }
            });
        }
    ], function (err, data, item_offset, count) {
        if (err) {
            mLogger.error("Failed" + logmsg);
            fn(err);
        } else {
            console.log("210:data[0]:" + JSON.stringify(data[0]));
            mLogger.debug("Success" + logmsg);
            var resData = packageResponseData(data, item_offset, count);
            fn(null, resData);
        }
    });
}


mRouter.get(URLPATH, function (req, res, next) {
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