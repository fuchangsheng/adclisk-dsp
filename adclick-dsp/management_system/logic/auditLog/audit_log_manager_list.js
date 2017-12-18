/*
 * @file  audit_log_manager_list.js
 * @description audit manager log list API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Gary.cui
 * @date 2016.12.05
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'audit_log_manager_list.logic';
var URLPATH = '/v1/auditlog/manager/list';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mAuditLogModel = require('../../model/audit_log').create();
var mAdManagerModel = require('../../model/management_admin').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
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
            id: msgs[i].id,
            mgr_id: msgs[i].mgr_id,
            mgr_name: msgs[i].name,
            role: ADCONSTANTS.ROLE.format(msgs[i].role),
            content: msgs[i].content,
            create_time: mMoment(msgs[i].create_time).format(ADCONSTANTS.DATATIMEFORMAT),
        };
        resData.list.push(msg);
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
    if (param.sort) {
        param.sort = ADCONSTANTS.DATASORT.parse(param.sort);
    }
}

function commonSql(param) {
    var sqlstr =' where (type='+ ADCONSTANTS.AUDITMANAGERTYPE.OPERATOR.code+')';
    sqlstr +=' and ( create_time between "'+ param.start_time +'" and "'+ param.end_time+'") ';
    return sqlstr
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});
    }

    preprocess(param);

    mLogger.debug('Try to get the audit log for manager :' + param.mgr_id);
    
    mAsync.waterfall([
        //1. read the total message for the manager
        function(next) {
            var sqlstr = 'select count(*) as total from '+ mAuditLogModel.tableName;
            sqlstr += commonSql(param);
            sqlstr +=';'

            var query = {
                sqlstr: sqlstr,
            };
            mAuditLogModel.query(query, function(err, rows){
                if (err) {
                    next(err);
                }else {
                    if (!rows || rows.length==0) {
                        var msg = 'There is no matched audit log';
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

            var sqlstr = 'select * from '+ mAuditLogModel.tableName;
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

            mAuditLogModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    next(null, {total: total, msgs: rows});
                }
            });
        },
        //3. get manager name
        function(data, next){
            var mgr_id_array = [];
            var msgs = data.msgs;

            for(var x in msgs){
                msgs[x].name = '';
                msgs[x].role = '';
                if(isNaN(msgs[x].mgr_id)) {
                    continue;
                }

                mgr_id_array.push(msgs[x].mgr_id);
            }

            if(mgr_id_array.length === 0){
                return next(null, data);
            }

            //3.1 create the sql statment
            var sqlstr = 'select name, role, id '
            sqlstr += ' from ' + mAdManagerModel.tableName;
            sqlstr +=' where id';
            sqlstr += ' in ( ' + mgr_id_array.join(',') + ' );';

            //3.2 query the database
            var query = {
                sqlstr: sqlstr,
            };

            mAdManagerModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    for(var x in rows){
                        for(var y in msgs){
                            if(rows[x].id == msgs[y].mgr_id){
                                msgs[y].name = rows[x].name;
                                msgs[y].role = rows[x].role;
                            }
                        }
                    }

                    next(null, {total: data.total, msgs: msgs});
                }
            });
        },
    ], 
    function(err, result){
        if (err) {
            mLogger.error('Failed to get the audit log for manager ' + param.mgr_id);
            fn(err);    
        }else{
            mLogger.info('Success to get the audit log for manager ' +  param.mgr_id);
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
