/*
 * @file  coast_detail_adx.js
 * @description adx coast detail API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.22
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'coast_overview_adx.logic';
var URLPATH = '/v1/cost/detail';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mCoastModel = require('../../model/adlib_palo_charge').create();
var mDspAduserModel = require('../../model/dsp_aduser').create();
var mAdlibIdeaModel = require('../../model/adlib_ideas').create();
var mAdlibPlanModel = require('../../model/adlib_plans').create();
var mAdlibUnitModel = require('../../model/adlib_units').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');



var mRefModel = {
    adx_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidAdxId(data);
        },
    },
    start_time: {
        data: 'YYYY-MM-DD HH:mm:ss',
        rangeCheck: function(data) {
            return mUtils.verifyDatatime(data, ADCONSTANTS.DATATIMEFORMAT);
        }
    },
    end_time: {
        data: 'YYYY-MM-DD HH:mm:ss',
        rangeCheck: function(data) {
            return mUtils.verifyDatatime(data, ADCONSTANTS.DATATIMEFORMAT);
        }
    },
    dimension: {
        data: 'user',
        rangeCheck: function(data) {
            return mIs.inArray(data, ['user', 'plan', 'unit', 'idea', 'day']);
        }
    },
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
    order: {
        data: '',
        rangeCheck: function(data) {
            return ADCONSTANTS.ORDER.find(data);
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

    for(var i in data.data) {
        var record = data.data[i];
        record.cost = mUtils.fenToYuan(record.cost/1000);
        record.revenue = mUtils.fenToYuan(record.revenue/1000);
    }

    var resData = {
        total: data.total,
        size: data.data.length,
        list: data.data
    }

    return resData;
}

function preprocess(param) {
    if (param.start_time) {
        param.start_time = mMoment(param.start_time).format(ADCONSTANTS.DATATIMEFORMAT);
    }
    if (param.end_time) {
        param.end_time = mMoment(param.end_time).format(ADCONSTANTS.DATATIMEFORMAT);
    }
    if (param.dimension === 'user') {
        param.dimension = 'user_id';
    }
    if (param.dimension === 'plan') {
        param.dimension = 'plan_id';
    }
    if (param.dimension === 'unit') {
        param.dimension = 'unit_id';
    }
    if (param.dimension === 'idea') {
        param.dimension = 'idea_id';
    }
    if (param.dimension === 'day') {
        param.dimension = 'DATE_FORMAT(date, "%Y-%m-%d")';
    }

    switch(param.order) {
    case ADCONSTANTS.ORDER.ASC.name:
        param.order = 'asc';
        break;
    case ADCONSTANTS.ORDER.DESC.name:
        param.order = 'desc';
        break;
    default:
        break;
    }
}

function getCommmonSql(param) {
    var sqlstr =' from '+ mCoastModel.tableName;
    sqlstr += ' where adx='+ param.adx_id;
    sqlstr += ' and ( date between "' + param.start_time + '" and "' + param.end_time + '") ';
    sqlstr += ' group by ' + param.dimension;
    if(param.dimension == 'plan_id') {
        sqlstr += ' ,user_id';
    }else if(param.dimension == 'unit_id') {
        sqlstr += ' ,user_id,plan_id';
    } else if(param.dimension == 'idea_id') {
        sqlstr += ' ,user_id,plan_id ,unit_id';
    } else {

    }
    sqlstr += ' ORDER BY '+param.dimension;
    if(param.order) {
        sqlstr += ' '+param.order;
    } else {
        sqlstr += ' asc';
    }
    return sqlstr;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var adx_id = param.adx_id;
    var logmsg = ' to get the cost data for adx:' + adx_id ;
    mLogger.debug('Try '+logmsg);

    preprocess(param);
    var commonSql = getCommmonSql(param);

    var sqlstr = 'select ' + param.dimension;
    if(param.dimension == 'plan_id') {
        sqlstr += ' ,user_id';
    }else if(param.dimension == 'unit_id') {
        sqlstr += ' ,user_id,plan_id';
    } else if(param.dimension == 'idea_id') {
        sqlstr += ' ,user_id,plan_id ,unit_id';
    } else if(param.dimension == 'DATE_FORMAT(date, "%Y-%m-%d")') {
        sqlstr += ' as date_time';
    } else {

    }
    sqlstr += ',sum(imp) as imp,';
    sqlstr += 'sum(click) as click, sum(cost) as cost,';
    sqlstr += 'sum(revenue) as revenue';
    sqlstr += commonSql;    

    mAsync.waterfall([
        //1.check total number
        function(next) {
            var query = {
                sqlstr: sqlstr,
            };
            mCoastModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    next(null, rows.length);
                }
            });
        },
        // 2.get data
        function(total, next) {
            var index = param.index || 0;
            var count = param.count || ADCONSTANTS.DEFAULTCOUNT;
            var offset = index * count;
            if (offset>=total) {
                mLogger.info(
                    'There is no more data in the system for adx:'+ adx_id);
                return next(null, {total: total, data: []});
            }
            var sql = sqlstr + ' limit ' + count + ' offset ' + offset;
            sql += ';';
            var query = {
                sqlstr: sql,
            };
            mCoastModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    next(null, {total: total, data: rows});
                }
            });
        },
        //2. get dimension name
        function(args, next) {
            mAsync.map(args.data, function(row, cb) {
                mAsync.series([
                    function(next) {
                        if(!row.user_id)
                            return next(null);

                        var select = {
                            user_name: 'user_name'
                        };
                        var match = {
                            user_id: row.user_id
                        };
                        var query = {
                            select: select,
                            match: match
                        };
                        mDspAduserModel.lookup(query, function(err,rows) {
                            if (err) {
                                next(err);
                            } else {
                                if (!rows || rows.length === 0) {
                                    row.user_name = '未找到用户名';
                                    // cb({code: ERRCODE.DB_NO_MATCH_DATA, msg: '无匹配数据'});
                                } else {
                                    row.user_name = rows[0].user_name;
                                }
                                next(null);
                            }
                        });
                    },
                    function(next) {
                        if(!row.plan_id)
                            return next(null);

                        var select = {
                            plan_name: 'plan_name'
                        };
                        var match = {
                            plan_id: row.plan_id
                        };
                        var query = {
                            select: select,
                            match: match
                        };
                        mAdlibPlanModel.lookup(query, function(err, rows) {
                            if (err) {
                                next(err);
                            } else {
                                if (!rows || rows.length === 0) {
                                    // cb({code: ERRCODE.DB_NO_MATCH_DATA, msg: '无匹配数据'});
                                    row.plan_name = '未找到计划名';
                                } else {
                                    row.plan_name = rows[0].plan_name;
                                }
                                next(null);
                            }
                        });
                    },
                    function(next) {
                        if(!row.unit_id)
                            return next(null);

                        var select = {
                            unit_name: 'unit_name'
                        };
                        var match = {
                            unit_id: row.unit_id
                        };
                        var query = {
                            select: select,
                            match: match
                        };
                        mAdlibUnitModel.lookup(query, function(err, rows) {
                            if (err) {
                                next(err);
                            } else {
                                if (!rows || rows.length === 0) {
                                    // cb({code: ERRCODE.DB_NO_MATCH_DATA, msg: '无匹配数据'});
                                    row.unit_name = '未找到单元名';
                                } else {
                                    row.unit_name = rows[0].unit_name;
                                }
                                next(null);
                            }
                        });
                    },
                    function(next) {
                        if(!row.idea_id)
                            return next(null);

                        var select = {
                            idea_name: 'idea_name'
                        };
                        var match = {
                            idea_id: row.idea_id
                        };
                        var query = {
                            select: select,
                            match: match
                        };
                        mAdlibIdeaModel.lookup(query, function(err, rows) {
                            if (err) {
                                next(err);
                            } else {
                                if (!rows || rows.length === 0) {
                                    // cb({code: ERRCODE.DB_NO_MATCH_DATA, msg: '无匹配数据'});
                                    row.idea_name = '未找到创意名';
                                } else {
                                    row.idea_name = rows[0].idea_name;
                                }
                                next(null);
                            }
                        });
                    }
                ], function(err) {
                    cb(null, row);
                });
            }, function(err, result) {
                if (err) {
                    next(err);
                } else {
                    next(null, {total: args.total, data: result});
                }
            });
        }
    ],function(err, data) {
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

