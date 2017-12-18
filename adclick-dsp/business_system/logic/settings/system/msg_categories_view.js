'use strict';

var MODULENAME = 'msg_categories_view.logic';
var URLPATH = '/v3/settings/system/msg-categories/view';
var router = require('express').Router();

var debug = require('debug')(MODULENAME);
var utils = require('../../../../utils/utils');
var logger = require('../../../../utils/logger')(MODULENAME);
var ADCONSTANTS = require('../../../../common/adConstants');
var ERRORCODE = require('../../../../common/errCode');

var async = require('async');

//models
var mMsgNotifySetModel = require('../../../model/msg_notify_set').create();

var refModel = {
    user_id:{
        data: 1,
        rangeCheck: utils.isValidUserId
    }
};


var LogicApi = require('../../logic_api');
var logicHelper = new LogicApi({
    debug: debug,
    refModel: refModel,
    moduleName: MODULENAME
});


function validate(data){
    if(!data){return false;}
    return logicHelper.validate({
        inputModel:data
    });
}

function packageResponseData(list){
    var data = {};
    if((!list) || (!list.length)){return {};}
    for(var i = 0; i < list.length; i++){
        var row = list[i];
        var categories = ADCONSTANTS.MESSAGECATEGORIES.format(row.c);
        data[categories] = [];
    }
    for(var i = 0; i < list.length; i++){
        var row = list[i];
        var categories = ADCONSTANTS.MESSAGECATEGORIES.format(row.c);
        data[categories].push(ADCONSTANTS.MESSAGESUBCATEGORIES.format(row.sc));
    }
    return data;
}

var processRequest = function(param, fn){
    
    if(!validate(param)){
        var msg = 'Invalid param .';
        logger.error(msg);
        return fn({code:ERRORCODE.PARAM_INVALID,msg:msg});        
    }

    var user_id = param.user_id;
    var logmsg = ' to query message setting categories for user ' + user_id;
    logger.debug('Try' + logmsg);


    async.waterfall([
        function(next){
            var sql = 'SELECT categories AS c, subcategories as sc FROM ';
            sql += mMsgNotifySetModel.tableName;
            sql += ' GROUP BY categories, subcategories';
            sql += ';'
            mMsgNotifySetModel.query({sqlstr:sql}, function(err, rows){
                if(err){return next(err);}
                next(null, rows);
            });
        }
    ], function(err, data){
        if(err){
            logger.error('Error' + logmsg);
            return fn(err);
        }else{
            logger.debug('Success' + logmsg);
            return fn(null, packageResponseData(data));
        }
    });
};



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