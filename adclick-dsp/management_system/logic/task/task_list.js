/*
 * @file  task_list.js
 * @description task list API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.02.20
 * @version 1.1.0 
 */
'use strict';
var MODULENAME = 'task_list.logic';
var URLPATH = '/v1/task/list';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mTaskModel = require('../../model/task').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    task_type: {
        data: '',
        rangeCheck: function(data) {
            return (ADCONSTANTS.TASKTYPE.find(data)!=null);
        },
        optional: true,
    },
    start_time: {
        data: 'YYYY-MM-DD HH:mm:ss',
        rangeCheck: function(data) {
            return mUtils.verifyDatatime(data, ADCONSTANTS.DATATIMEFORMAT);
        },
        optional: true,
    },
    end_time: {
        data: 'YYYY-MM-DD HH:mm:ss',
        rangeCheck: function(data) {
            return mUtils.verifyDatatime(data, ADCONSTANTS.DATATIMEFORMAT);
        },
        optional: true,
    },
    status: {
        data: '成功',
        rangeCheck: function(data) {
            return (ADCONSTANTS.TASKSTATUS.find(data)!=null);
        },
        optional: true,
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
    sort: {
        data: '',
        rangeCheck: function(data) {
            return (data in mTaskModel.refModel);
        },
        optional: true,
    },
    order: {
        data: '',
        rangeCheck: function(data) {
            return (ADCONSTANTS.ORDER.find(data)!=null);
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

    var tasks = data.data;
    for(var i in tasks) {
        tasks[i].process_time = mMoment(tasks[i].process_time).format(ADCONSTANTS.DATATIMEFORMAT);
        tasks[i].create_time = mMoment(tasks[i].create_time).format(ADCONSTANTS.DATATIMEFORMAT);
        tasks[i].update_time = mMoment(tasks[i].update_time).format(ADCONSTANTS.DATATIMEFORMAT);
    }

    var resData = {
        total: data.total,
        size: data.data.length,
        list: tasks
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
    if (param.status) {
        switch(param.status) {
        case ADCONSTANTS.TASKSTATUS.SUCCESS.name:
            param.status = 'SUCCESS';
            break;
        case ADCONSTANTS.TASKSTATUS.RUNNING.name:
            param.status = 'RUNNING';
            break;
        case ADCONSTANTS.TASKSTATUS.FAILED.name:
            param.status = 'FAILED';
            break;
        default:
            break;
        }
    }
    if(param.sort) {
        if(param.order) {
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
    }
}

function getCommmonSql(param) {
    var hasCondition = false;
    var sqlstr =' from '+ mTaskModel.tableName;
    if(param.task_type) {
        if(!hasCondition) {
            hasCondition = true;
            sqlstr += ' where';
        }
        sqlstr += ' task_type = "' + param.task_type + '"';
    }
    if(param.status) {
        if(!hasCondition) {
            hasCondition = true;
            sqlstr += ' where';
        } else {
            sqlstr += ' and';
        }
        sqlstr += ' status = "' + param.status + '"';
    }
    if(param.start_time) {
        if(!hasCondition) {
            hasCondition = true;
            sqlstr += ' where';
        } else {
            sqlstr += ' and';
        }
        sqlstr += ' process_time >="' + param.start_time+'"';
    }
    if(param.end_time) {
        if(!hasCondition) {
            hasCondition = true;
            sqlstr += ' where';
        } else {
            sqlstr += ' and';
        }
        sqlstr += ' process_time <="' + param.end_time+'"';
    }
    if(param.sort) {
        sqlstr += ' order by ' + param.sort;
        if(param.order) {
            sqlstr += ' ' + param.order;
        }
    }

    return sqlstr;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var logmsg = ' to get the task list.' ;
    mLogger.debug('Try '+logmsg);

    preprocess(param);
    var commonSql = getCommmonSql(param);

    mAsync.waterfall([
        //1.check total number
        function(next) {
            var sqlstr = 'select count(*) as total';
            sqlstr += getCommmonSql(param);
            sqlstr += ';';
            var query = {
                sqlstr: sqlstr,
            };
            mTaskModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    next(null, rows[0].total);
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
                    'There is no more data in the system for task.');
                return next(null, {total: total, data: []});
            }
            var sqlstr = 'select * ';
            sqlstr += getCommmonSql(param);
            sqlstr += ' limit ' + count + ' offset ' + offset;
            sqlstr += ';';
            var query = {
                sqlstr: sqlstr,
            };
            mTaskModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    next(null, {total: total, data: rows});
                }
            });
        },
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

