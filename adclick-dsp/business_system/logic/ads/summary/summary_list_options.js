/*
 * @file  summary_list_options.js
 * @description get summary list data according to the options API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author yangshiyu
 * @date 2017.11.29
 * @version 0.0.1 
 */

'use strict';
var MODULENAME = 'summary_list_options.logic';
var URLPATH = '/v3/ads/summary/optionslist';

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

var mAcceptTypes = [
    ADCONSTANTS.ADOPTIONALTYPE.CITY.code,
    ADCONSTANTS.ADOPTIONALTYPE.PROVINCE.code,
    ADCONSTANTS.ADOPTIONALTYPE.DEVICE.code,
    ADCONSTANTS.ADOPTIONALTYPE.ADSLOT.code,
    ADCONSTANTS.ADOPTIONALTYPE.TIME_HOURLY.code,
    ADCONSTANTS.ADOPTIONALTYPE.HOURLY.code,
    ADCONSTANTS.ADOPTIONALTYPE.WEEK.code,
    ADCONSTANTS.ADOPTIONALTYPE.OS.code,
    ADCONSTANTS.ADOPTIONALTYPE.ADVIEW.code,
];

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function (data) {
            return mUtils.isValidUserId(data);
        },
    },
    index: {
        data: 1,
        rangeCheck: function (data) {
            return data >= 0;
        },
        optional: true,
    },
    count: {
        data: 1,
        rangeCheck: function (data) {
            return data >= 0 && data <= ADCONSTANTS.PAGEMAXCOUNT;
        },
        optional: true,
    },
    options: {
        data: "",
        rangeCheck: function (data) {
            return mUtils.checkSummaryOptionsType(data, mAcceptTypes);
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
};

var mLogicHelper = new LogicApi({
    debug: mDebug,
    moduleName: MODULENAME,
    refModel: mRefModel,
});

function validate(param) {
    console.log("begin validate");
    if (!param) {
        mLogger.debug("!param");
        return false;
    }
    console.log("hahahaha");
    mLogger.debug("97param:" + JSON.stringify(param));
    return mLogicHelper.validate({
        inputModel: param,
    });
}

function fenToYuan(amount) {
    try {
        var num = Number(amount);
        var newNum = num / 100;
        return newNum.toFixed(2);
    } catch (e) {
        mLogger.error('Failed to translate the amount to yuan:' + amount);
        return -1;
    }
}

function packageResponseData(data, item_offset, count, type) {
    if (!data) {
        return {};
    }
    var items = data.items;
    var all_request = 0,
        all_bid = 0,
        all_click = 0,
        all_imp = 0,
        all_download = 0;
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
        all_download: 0,
        all_bid: 0,
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
        var cost_yuan = Number(fenToYuan(items[i].cost / 1000));
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
        if (items[i].download != 0) {
            cpa = cost_yuan / items[i].download;
            cpa = Number(cpa.toFixed(5));
        }
        all_bid += items[i].bid;
        all_request += items[i].request;
        all_imp += items[i].imp;
        all_click += items[i].click;
        all_download += items[i].download;
        all_cost += cost_yuan;
        var item = {
            request: items[i].request,
            imp: items[i].imp,
            download: items[i].download,
            click: items[i].click,
            bid: items[i].bid,
            cost: cost_yuan,
            CPM: cpm,
            CPC: cpc,
            CPA: cpa,
            CTR: ctr,
        };
        switch (type) {
            case ADCONSTANTS.ADOPTIONALTYPE.CITY.code:
                item.city = items[i].city;
                break;
            case ADCONSTANTS.ADOPTIONALTYPE.PROVINCE.code:
                item.prov = items[i].prov;
                break;
            case ADCONSTANTS.ADOPTIONALTYPE.DEVICE.code:
                item.device = items[i].device;
                break;
            case ADCONSTANTS.ADOPTIONALTYPE.TIME_HOURLY.code:
                item.time = items[i].time;
                break;
            case ADCONSTANTS.ADOPTIONALTYPE.HOURLY.code:
                item.hour = items[i].hour;
                break;
            case ADCONSTANTS.ADOPTIONALTYPE.WEEK.code:
                item.week_day = items[i].week_day;
                break;
            case ADCONSTANTS.ADOPTIONALTYPE.OS.code:
                item.os = items[i].os;
                break;
            case ADCONSTANTS.ADOPTIONALTYPE.ADVIEW.code:
                item.adview_type = items[i].adview_type;
                break;
                // case ADCONSTANTS.ADOPTIONALTYPE.ADSLOT.code:
                //     item.adslot = items[i].adslot;
                //     break;
            default:
                break;
        }
        resData.all_bid = all_bid;
        resData.all_request = all_request;
        resData.all_imp = all_imp;
        resData.all_click = all_click;
        resData.all_cost = all_cost;
        resData.all_cost = Number(resData.all_cost.toFixed(5));
        resData.all_download = all_download;
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
        if (all_download > 0) {
            resData.cpa_total = all_cost / all_download;
            resData.cpa_total = Number(resData.cpa_total.toFixed(5));
        }
        console.log("data[" + i + "]:" + JSON.stringify(data.items[i]));
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

function getQuerySql(param) {
    var type = ADCONSTANTS.ADOPTIONALTYPE.parse(param.options);
    var sqlstr = 'SELECT ';
    var commonsql = ' SUM(request) AS request,SUM(bid) AS bid,SUM(imp) AS imp,SUM(click) AS click,SUM(download) AS download,SUM(cost) AS cost';
    commonsql += ' FROM ' + mADSummaryModel.tableName + ' WHERE user_id = ' + param.user_id;
    mLogger.debug("type:" + type.toString());
    switch (type) {
        case ADCONSTANTS.ADOPTIONALTYPE.CITY.code:
            sqlstr += 'city,' + commonsql;
            sqlstr += ' AND ( ' + 'date BETWEEN "' + param.begin_date + ' 00:00:00' + '" AND "' + param.end_date + ' 23:59:59")';
            sqlstr += ' GROUP BY city;';
            break;
        case ADCONSTANTS.ADOPTIONALTYPE.PROVINCE.code:
            sqlstr += 'prov,' + commonsql;
            sqlstr += ' AND ( ' + 'date BETWEEN "' + param.begin_date + ' 00:00:00' + '" AND "' + param.end_date + ' 23:59:59")';
            sqlstr += ' GROUP BY prov;';
            break;
        case ADCONSTANTS.ADOPTIONALTYPE.DEVICE.code:
            sqlstr += 'device,' + commonsql;
            sqlstr += ' AND ( ' + 'date BETWEEN "' + param.begin_date + ' 00:00:00' + '" AND "' + param.end_date + ' 23:59:59")';
            sqlstr += ' GROUP BY device;';
            break;
            // case ADCONSTANTS.ADOPTIONALTYPE.ADSLOT.code:
            //     return "adslot";
        case ADCONSTANTS.ADOPTIONALTYPE.TIME_HOURLY.code:
            sqlstr += " date_format(date,'%Y-%m-%d %H:00:00') AS time," + commonsql;
            sqlstr += ' AND ( ' + 'date BETWEEN "' + param.begin_date + ' 00:00:00" AND "' + param.end_date + ' 23:59:59")';
            sqlstr += ' GROUP BY date_format(date,"%Y-%m-%d %H:00:00") ORDER BY date_format(date,"%Y-%m-%d %H:00:00") ASC;';
            break;
        case ADCONSTANTS.ADOPTIONALTYPE.HOURLY.code:
            sqlstr += " date_format(date,'%H') AS hour," + commonsql;
            sqlstr += ' AND ( ' + 'date BETWEEN "' + param.begin_date + ' 00:00:00" AND "' + param.end_date + ' 23:59:59")';
            sqlstr += ' GROUP BY hour ORDER BY date_format(date,"%H") ASC;';
            break;
        case ADCONSTANTS.ADOPTIONALTYPE.WEEK.code:
            sqlstr += " MOD((TO_DAYS(date) - TO_DAYS('2000-01-02')),7) AS week_day," + commonsql;
            sqlstr += " AND (date BETWEEN '" + param.begin_date + " 00:00:00" + "' AND '" + param.end_date + " 23:59:59')";
            sqlstr += " GROUP BY week_day ORDER BY MOD((TO_DAYS(date) - TO_DAYS('2000-01-02')),7) ASC;";
            break;
        case ADCONSTANTS.ADOPTIONALTYPE.OS.code:
            sqlstr += " os," + commonsql;
            sqlstr += " AND (date BETWEEN '" + param.begin_date + " 00:00:00" + "' AND '" + param.end_date + " 23:59:59')";
            sqlstr += " GROUP BY os ORDER BY os;";
            break;
        case ADCONSTANTS.ADOPTIONALTYPE.ADVIEW.code:
            sqlstr += " adview_type," + commonsql;
            sqlstr += " AND (date BETWEEN '" + param.begin_date + " 00:00:00" + "' AND '" + param.end_date + " 23:59:59')";
            sqlstr += " GROUP BY adview_type ORDER BY adview_type;";
            break;
        default:
            return -1;
    }
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

    preprocess(param);
    var type = ADCONSTANTS.ADOPTIONALTYPE.parse(param.options);
    console.log("type:" + type);
    var sqlstr = getQuerySql(param);
    var logmsg = " to list all info about user:" + param.user_id;
    mLogger.debug("Try " + logmsg);

    mAsync.waterfall([
        function (next) {
            mLogger.debug("sqlstr:" + sqlstr);
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
                        }, 0, count, type);
                    } else {
                        var index = param.index || 0;
                        var count = param.count || ADCONSTANTS.DEFAULTCOUNT;
                        var item_offset = index * count;
                        if (item_offset >= rows.length) {
                            mLogger.info('There is no more data in the system for user:' + user_id);
                            return next(null, {
                                items: []
                            }, 0, count, type);
                        }
                        console.log("rows.length:" + rows.length);
                        //console.log("rows:"+JSON.stringify(rows[0]));
                        //console.log("date:" + rows[0].date + "request:" + rows[0].request + ";click:" + rows[0].click + ";cost:" + rows[0].cost + ";");
                        //console.log("imp:" + rows[0].imp + ";bid:" + rows[0].bid + ";download:" + rows[0].download);
                        next(null, {
                            items: rows
                        }, item_offset, count, type);
                    }

                }
            });
        }
    ], function (err, data, item_offset, count, type) {
        if (err) {
            mLogger.error("Failed" + logmsg);
            fn(err);
        } else {
            console.log("210:data[0]:" + JSON.stringify(data[0]));
            mLogger.debug("Success" + logmsg);
            var resData = packageResponseData(data, item_offset, count, type);
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