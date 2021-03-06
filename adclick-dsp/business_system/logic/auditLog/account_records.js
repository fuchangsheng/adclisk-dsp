'use strict'

var MODULENAME = 'account_records.logic';
var URLPATH = '/v3/records/account';
var router = require('express').Router();


var async = require('async');
var debug = require('debug')(MODULENAME);

var utils = require('../../../utils/utils');
var LogicApi = require('../logic_api');
var logger = require('../../../utils/logger')(MODULENAME);
var ADCONSTANTS = require('../../../common/adConstants');
var ERRORCODE = require('../../../common/errCode');
var mMoment = require('moment');

var auditLogModel = require('../../model/audit_log').create();

var refModel = {
    user_id:{
        data: 1,
        rangeCheck: utils.isValidUserId
    },
    oper_id:{
        data: '',
        rangeCheck: utils.notEmpty
    },
    start_time: {
        data: 'YYYY-MM-DD HH:mm:ss',
        rangeCheck: function(data) {
            return utils.verifyDatatime(data, ADCONSTANTS.DATATIMEFORMAT);
        }
    },
    end_time: {
        data: 'YYYY-MM-DD HH:mm:ss',
        rangeCheck: function(data) {
            return utils.verifyDatatime(data, ADCONSTANTS.DATATIMEFORMAT);
        }
    },
    index:{
        data: 1,
        rangeCheck: utils.isNaturNum,
        optional:true
    },
    count:{
        data: 1,
        rangeCheck: function(data){
            return (utils.isPositiveNumber(data)) && (data <= ADCONSTANTS.PAGEMAXCOUNT);
        },
        optional:true
    },
    type:{
        data: '',
        rangeCheck:function(type){
            var code = ADCONSTANTS.AUDITTYPE.parse(type); 
            return ((code !== -1) && (code !== 0))
        },
        optional:true
    },
    origin:{
        data:'',
        rangeCheck: utils.notEmpty,
        optional:true
    }
};


var logicHelper = new LogicApi({
    moduleName: MODULENAME,
    debug:debug,
    refModel:refModel
});


function preProcess(param){
    param.index = param.index || 0;
    param.count = param.count || ADCONSTANTS.PAGEMAXCOUNT;
    if(param.type){
        param.type = ADCONSTANTS.AUDITTYPE.parse(param.type);
    }
    if (param.start_time) {
        param.start_time = mMoment(param.start_time).format(ADCONSTANTS.DATATIMEFORMAT);
    }
    if (param.end_time) {
        param.end_time = mMoment(param.end_time).format(ADCONSTANTS.DATATIMEFORMAT);
    }
}

function validate(data){
    if(!data){return false;}
    return logicHelper.validate({inputModel:data});
}

function getSql(param, limit){
    var sql = ' WHERE user_id=' + param.user_id;
    sql += ' AND level = 1';
    if(param.type){
        sql += ' AND type=' + param.type;
    }
    if(param.origin){
        sql += ' AND origin="' + param.origin + '"';
    }
    if(param.start_time && param.end_time){
        sql += ' AND ( create_time between "' + param.start_time + '" and "' + param.end_time + '")'
    }
    sql += ' ORDER BY create_time DESC';
    if(limit){
        sql += ' LIMIT ' + param.count + ' OFFSET ' + (param.count * param.index);
    }
    sql += ';';
    return sql;
}

function processData(rows){
    var list = [];
    for(var i = 0; i < rows.length; i ++){
        var record = {};
        var contents = JSON.parse(rows[i].content);
        record.action = contents.action || '';
        record.result = contents.result || '';
        record.obj = contents.obj || '';
        record.origin = rows[i].origin || '';
        record.create_time = mMoment(rows[i].create_time).format(ADCONSTANTS.DATATIMEFORMAT) || '';
        list.push(record); 
    }
    return list;
}

function packageResponseData(data){
    var resData = {
        total: data.total,
        size:data.list.length,
        list:processData(data.list)
    }
    return resData;
}

var processRequest = function(param, fn){
    if(!validate(param)){
        var msg = 'Invalid param .';
        logger.error(msg);
        return fn({code:ERRORCODE.PARAM_INVALID,msg:msg});
    }

    preProcess(param);

    var user_id = param.user_id;
    var logmsg = ' to get account records for user :' + user_id;
    logger.debug('Try' + logmsg);

    async.waterfall([
        //1. count
        function(next){
            var sql = 'SELECT COUNT(*) AS total FROM ' + auditLogModel.tableName  + getSql(param);
            var query = {sqlstr:sql};
            auditLogModel.query(query,function(err,rows){
                if(err){return next(err);}
                return next(null, rows[0].total || 0);
            });
        },
        function(total, next){
            var sql = 'SELECT * FROM ' + auditLogModel.tableName + getSql(param, true);
            auditLogModel.query({sqlstr:sql}, function(err, rows){
                if(err){return next(err);}
                next(null, {total:total,list:rows});
            });
        }
    ], function(err, data){
        if(err){
            logger.error('Failed' + logmsg);
            return fn(err);
        }else{
            logger.debug('Succeed' + logmsg);
            return fn(null, packageResponseData(data));
        }
    });

}



router.post(URLPATH, function(req, res, next){
    var param = req.body;
    logicHelper.responseHttp({
        req:req,
        res:res,
        next:next,
        param:param,
        processRequest:processRequest
    });

});

module.exports.router = router; 