/*
 * @file  internal_message_list.js
 * @description internal message list API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.30
 * @version 3.0.1 
 */
'use strict';
var MODULENAME = 'internal_message_list.logic';
var URLPATH = '/v3/settings/system/msg/list';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../logic_api");

//models
var mMessageQueryView = require('../../../model/message_query_view').create();

//utils
var mLogger = require('../../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../../utils/data_helper');
var mUtils = require('../../../../utils/utils');

//common constants
var ERRCODE = require('../../../../common/errCode');
var ADCONSTANTS = require('../../../../common/adConstants');

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidUserId(data);
        },
    },
    oper_id: { 
        data: 'password',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
    },
    index: {
        data: 1,
        rangeCheck: function(data) {
            return data >=0;
        },
    },
    count: {
        data: 1,
        rangeCheck: function(data) {
            return data>=10 && data <= ADCONSTANTS.PAGEMAXCOUNT;
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
    categories: {
        data: '',
        rangeCheck: function(data) {
            var type = ADCONSTANTS.MESSAGECATEGORIES.find(data);
            return type ? true: false;
        },
    },
    sort:{
        data: '',
        rangeCheck: function(data) {
            var type = ADCONSTANTS.DATASORT.find(data);
            if (!type) {
                return false;
            }
            return mIs.inArray(type.code, [
                    ADCONSTANTS.DATASORT.CREATETIME_ASC.code,
                    ADCONSTANTS.DATASORT.CREATETIME_DESC.code
                ]);
        },
        optional: true,
    },
    notify_status: {
        data: '',
        rangeCheck: function(data) {
            var status = ADCONSTANTS.MESSAGEREADSTATUS.find(data);
            return status? true: false;
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
    var msgs = data.msgs;
    var resData = {
        total: data.total,
        size: msgs.length,
        list: []
    };
    for (var i = 0; i < msgs.length; i++) {
        var msg = {
            msg_id: msgs[i].msg_id,
            categories: msgs[i].categories,
            subcategories: msgs[i].subcategories,
            title: msgs[i].title,
            content: msgs[i].content,
            notify_status: ADCONSTANTS.MESSAGEREADSTATUS.format(msgs[i].notify_status),
            create_time: mMoment(msgs[i].create_time).format(ADCONSTANTS.DATATIMEFORMAT),
        };
        resData.list.push(msg);
    }

    return resData;
}

function preprocess(param) {
    if (param.categories) {
        param.categories = ADCONSTANTS.MESSAGECATEGORIES.parse(param.categories);
    }
    if (param.start_time) {
        param.start_time = mMoment(param.start_time).format(ADCONSTANTS.DATATIMEFORMAT);
    }
    if (param.end_time) {
        param.end_time = mMoment(param.end_time).format(ADCONSTANTS.DATATIMEFORMAT);
    }
    if (param.sort) {
        param.sort = ADCONSTANTS.DATASORT.parse(param.sort);
    }
    if (param.notify_status) {
        param.notify_status = ADCONSTANTS.MESSAGEREADSTATUS.parse(param.notify_status);
    }
}

function commonSql(param) {
    var sqlstr =' where (user_id='+param.user_id+') ';
    if (param.categories!=ADCONSTANTS.MESSAGECATEGORIES.ALL.code) {
        sqlstr += ' and (categories='+ param.categories+')';
    }
    if (mUtils.isExist(param.notify_status)) {
        sqlstr += ' and (notify_status='+param.notify_status+')';
    }
    sqlstr +=' and receiver="'+param.oper_id+'"';
    sqlstr +=' and ( create_time between "'+ param.start_time +'" and "'+ param.end_time+'") ';
    return sqlstr
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }

    var user_id = param.user_id;
    mLogger.debug('Try to get the internal message for user :' + user_id);

    preprocess(param);

    mAsync.waterfall([
        //1. read the total message for the ad user
        function(next) {
            var sqlstr = 'select count(*) as total from '+ mMessageQueryView.tableName;
            sqlstr += commonSql(param);
            sqlstr +=';'

            var query = {
                sqlstr: sqlstr,
            };
            mMessageQueryView.query(query, function(err, rows){
                if (err) {
                    next(err);
                }else {
                    if (!rows || rows.length==0) {
                        var msg = 'There is no matched message';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_NO_MATCH_DATA, msg:msg});
                    }

                    next(null, rows[0].total);
                }
            });
        },
        //2. look up the message data
        function(total, next) {
            var count = param.count || 10;
            var index = param.index || 0;
            var offset = index * count;
            if (offset>=total) {
                return next(null, {total: total, msgs:[]});
            }

            var sqlstr = 'select * from '+ mMessageQueryView.tableName;
            sqlstr += commonSql(param);
            if (mUtils.isExist(param.sort)) {
                if (param.sort==ADCONSTANTS.DATASORT.CREATETIME_ASC.code) {
                    sqlstr += ' ORDER BY create_time ASC ';
                }else if (param.sort==ADCONSTANTS.DATASORT.CREATETIME_DESC.code) {
                    sqlstr += ' ORDER BY create_time DESC ';
                }
            }
            sqlstr += ' limit '+count +' offset '+offset;  
            sqlstr +=';'
            
            mLogger.debug('The query sql: '+ sqlstr);
            var query = {
                sqlstr: sqlstr,
            };

            mMessageQueryView.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    next(null, {total: total, msgs: rows});
                }
            });
        },
    ], 
    function(err, result){
        if (err) {
            mLogger.error('Failed to get the msg list for user ' + user_id);
            fn(err);
        } else{
            mLogger.info('Success to get the msg list for user ' +  user_id);
            var resData = packageResponseData(result);
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
