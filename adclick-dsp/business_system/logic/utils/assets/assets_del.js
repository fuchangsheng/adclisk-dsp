'use strict';

var MODULENAME = 'assets_del.logic';
var URLPATH = '/v3/utils/assets/del';
var router = require('express').Router();

var assetsModel = require('../../../model/adlib_assets').create();
var ideaModel = require('../../../model/adlib_ideas').create();

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
        asset_id: data.asset_id,
        asset_name:data.asset_name
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
    var logmsg = ' to del asset for user: ' + user_id;
    logger.debug('Try' + logmsg);

    async.waterfall([
        //1.check if asset exist 
        function(next){
            var match = {
                user_id: user_id,
                asset_id: param.asset_id 
            };
            var select = {};
            select['*'] = 1;
            assetsModel.lookup({select:select,match:match},function(err, rows){
                if(err){return next(err);}
                if((!rows) || (rows.length == 0)){
                    var msg = 'No asset matches asset_id = ' + param.asset_id;
                    logger.error(msg);
                    return next({code:ERRCODE.DB_NO_MATCH_DATA,msg:msg});
                }
                next(null,rows[0]);

            });
        },
        //2. whether asset used by plan unit
        function(data, next){
            logger.debug(data);
            var query = {match:{user_id: user_id, asset_id: param.asset_id}};
            ideaModel.count(query, function(err, total){
                if(err){return next(err);}
                if(total > 0){
                    var msg = 'Asset is being used .'
                    logger.error(msg);
                    return next({code:ERRCODE.ASSET_BEINGUSED, msg: msg});
                }
                return next(null,data);
            });
        },
        //3. remove record
        function(data, next){
            var query = {
                match: {
                    user_id: user_id,
                    asset_id: param.asset_id
                }
            };
            assetsModel.remove(query, function(err, rows){
                if(err){return next(err);}
                return next(null,{asset_id:param.asset_id,asset_name:data.asset_name});
            });
        }        
    ], function(err, data){
        logger.debug(data);
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