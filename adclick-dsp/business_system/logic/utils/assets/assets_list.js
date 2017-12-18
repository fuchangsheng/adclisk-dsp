'use strict';

var MODULENAME = 'assets_list.logic';
var URLPATH = '/v3/utils/assets/list';
var router = require('express').Router();

var assetsModel = require('../../../model/adlib_assets').create();

var LogicApi = require('../../logic_api');
var async = require('async');

var debug = require('debug')(MODULENAME);
var logger = require('../../../../utils/logger')(MODULENAME);


var utils = require('../../../../utils/utils');
var ERRCODE = require('../../../../common/errCode');
var ADCONSTANTS = require('../../../../common/adConstants');

var moment = require('moment');


var refModel = {
    user_id: {
        data: 1,
        rangeCheck: utils.isValidUserId
    },
    type: {
        data: '',
        rangeCheck: function(data){
            var type = ADCONSTANTS.ASSETTYPE.parse(data);
            return (type !== -1);
        },
        optional: true
    },
    index: {
        data: 1,
        rangeCheck: utils.isNaturNum,
        optional: true
    },
    count: {
        data: 1,
        rangeCheck:function(data){
            return utils.isNaturNum(data) && data <= ADCONSTANTS.PAGEMAXCOUNT;
        },
        optional: true
    },
    sort: {
        data:'',
        rangeCheck:function(data){
            var code = ADCONSTANTS.ASSETSORT.parse(data);
            return (code != -1);
        },
        optional:true
    }

};

var logicHelper = new LogicApi({
    debug: debug,
    modulename:MODULENAME,
    refModel:refModel
});


function validate(data){
    if(!data){return false;}
    return logicHelper.validate({
        inputModel: data
    });
}

function preProcessParam(data){
    if(data.type !== undefined){
        data.type = ADCONSTANTS.ASSETTYPE.parse(data.type);
    }
    if(data.index === undefined){
        data.index = 0;
    }
    if(data.count === undefined){
        data.count = ADCONSTANTS.PAGEMAXCOUNT;
    }

    data.offset = data.index * data.count;
    if(data.sort !== undefined){
        data.sort = ADCONSTANTS.ASSETSORT.parse(data.sort);
        switch(data.sort){
            case 1:
                data.sort = " ORDER BY create_time ASC ";
                break;
            case 2:
                data.sort = " ORDER BY create_time DESC ";
                break;
            case 3:
                data.sort = " ORDER BY update_time ASC ";
                break;
            case 4:
                data.sort = " ORDER BY update_time DESC ";
                break;
            case 5:
                data.sort = " ORDER BY width ASC ";
                break;
            case 6:
                data.sort = " ORDER BY width DESC ";
                break;
            case 7:
                data.sort = " ORDER BY height ASC ";
                break;
            case 8:
                data.sort = " ORDER BY height DESC ";
                break;
            case 9:
                data.sort = " ORDER BY duration ASC ";
                break;
            case 10:
                data.sort = " ORDER BY duration DESC ";
                break;
        }
    }else{
        data.sort = " ORDER BY create_time DESC ";
    }
}

function packageResponseData(data){
    if(!data){return {};}
    if(data.list){
        for(var i = 0; i < data.list.length; i++){
            if(data.list[i].asset_type !== undefined){
                data.list[i].asset_type = ADCONSTANTS.ASSETTYPE.format(data.list[i].asset_type);
                data.list[i].create_time = moment(data.list[i].create_time).format(ADCONSTANTS.DATATIMEFORMAT);
                data.list[i].update_time = moment(data.list[i].update_time).format(ADCONSTANTS.DATATIMEFORMAT);
            }
        }
    }
    return data;
}

function getListSql(param){
    var sql = 'SELECT * FROM ' + assetsModel.tableName + ' WHERE user_id=' + param.user_id;
    if(utils.isNaturNum(param.type)){
        sql += ' AND asset_type=' + param.type;
    }
    sql += param.sort;
    sql += ' LIMIT ' + param.count + ' OFFSET ' + param.offset + ';';
    logger.debug(sql);
    return sql;
}

function getCountSql(param){
    var sql = 'SELECT count(*) AS total FROM ' + assetsModel.tableName + ' WHERE user_id=' + param.user_id;
    if(utils.isNaturNum(param.type)){
        sql += ' AND asset_type=' + param.type;
    }
    sql += param.sort;
    sql += ';';
    logger.debug(sql);
    return sql;
}

var processRequest = function(param, fn){
    //1. validate param
    if(!validate(param)){
        var msg = 'Invalid param .';
        logger.error(msg);
        return fn({code:ERRCODE.PARAM_INVALID,msg:msg});
    }

    var user_id = param.user_id;
    var logmsg = ' to list asset for user: ' + user_id ;
    logger.debug('Try' + logmsg);

    preProcessParam(param);


    async.waterfall([
        //1. count
        function(next){
            var sql = getCountSql(param);
            assetsModel.query({sqlstr:sql}, function(err, rows){
                if(err){return next(err);}
                return next(null,rows[0].total);
            })
        },
        //2. query list
        function(total, next){
            var sqlstr = getListSql(param);
            assetsModel.query({sqlstr:sqlstr}, function(err, rows){
                if(err){return next(err);}
                var data = {
                    total: total,
                    size: rows.length,
                    list: rows
                };
                return next(null,packageResponseData(data));
            });

        },
    ], function(err, data){
        if(err){
            logger.error('Failed' + logmsg);
            fn(err);
        }else{
            logger.debug('Succeed' + logmsg);
            fn(null, data);
        }
    });
}


router.post(URLPATH, function(req, res, next){
    var param = req.body || {};
    logicHelper.responseHttp({
        req: req,
        res: res,
        next: next,
        param: param,
        processRequest: processRequest
    });
});




module.exports.router = router;