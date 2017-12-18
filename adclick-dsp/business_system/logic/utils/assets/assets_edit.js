'use strict';

var MODULENAME = 'assets_edit.logic';
var URLPATH = '/v3/utils/assets/edit';
var router = require('express').Router();

var assetsModel = require('../../../model/adlib_assets').create();

var LogicApi = require('../../logic_api');
var async = require('async');

var debug = require('debug')(MODULENAME);
var logger = require('../../../../utils/logger')(MODULENAME);


var utils = require('../../../../utils/utils');
var ERRCODE = require('../../../../common/errCode');
var ADCONSTANTS = require('../../../../common/adConstants');

var refModel = {
    user_id: {
        data: 1,
        rangeCheck: utils.isValidUserId
    },
    asset_id: {
        data: 1,
        rangeCheck: utils.isValidAssetId
    },
    asset_name: {
        data: '',
        rangeCheck: utils.notEmpty
    }
};

var logicHelper = new LogicApi({
    debug: debug,
    moduleName: MODULENAME,
    refModel: refModel
});


function validate(data){
    if(!data){
        return false;
    }
    return logicHelper.validate({
        inputModel: data
    });
}

function packageResponseData(data){
    if(!data){return {};}
    return {
        asset_id: data.asset_id
    };
}

var processRequest = function(param, fn){
    //1. validate param
    if(!validate(param)){
        var msg = 'Invalid param';
        logger.error(msg);
        return fn({code:ERRCODE.PARAM_INVALID,mgs:msg});
    }

    var user_id = param.user_id;
    var logmsg = ' to edit asset_name for user: ' + user_id;
    logger.debug('Try' + logmsg);

    async.waterfall([
        //1.check if asset exist 
        function(next){
            var match = {
                user_id: user_id,
                asset_id: param.asset_id 
            };
            assetsModel.count({match:match},function(err, total){
                if(err){return next(err);}
                if(total == 0){
                    var msg = 'No asset matches asset_id = ' + param.asset_id;
                    logger.error(msg);
                    return next({code:ERRCODE.DB_NO_MATCH_DATA,msg:msg});
                }
                next(null,{});

            });
        },
        //2.update asset_name
        function(data, next){
            var query = {
                match:{
                    user_id: user_id,
                    asset_id:param.asset_id
                },
                update:{
                    asset_name: param.asset_name
                }
            };
            assetsModel.update(query, function(err, rows){
                if(err){return next(err);}
                return next(null,{asset_id:param.asset_id});
            });
        }
    ],function(err, data){
        if(err){
            logger.error('Failed' + logmsg);
            fn(err);
        }else{
            logger.debug('Succeed' + logmsg);
            fn(null, packageResponseData(data));
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