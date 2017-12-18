'use strict';

var MODULENAME = 'assets_view.logic';
var URLPATH = '/v3/utils/assets/view';
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

function packageResponseData(data){
    if(!data){return {};}
    if(data.asset_type !== undefined){
        data.asset_type = ADCONSTANTS.ASSETTYPE.format(data.asset_type);
        data.create_time = moment(data.create_time).format(ADCONSTANTS.DATATIMEFORMAT);
        data.update_time = moment(data.update_time).format(ADCONSTANTS.DATATIMEFORMAT);
    }
    return data;
}

var processRequest = function(param, fn){
    //1. validate param
    if(!validate(param)){
        var msg = 'Invalid param .';
        logger.error(msg);
        return fn({code:ERRCODE.PARAM_INVALID,msg:msg});
    }

    var user_id = param.user_id;
    var logmsg = ' to view asset detail for user: ' + user_id;
    logger.debug('Try' + logmsg);

    async.waterfall([
        //lookup
        function(next){
            var select = {};
            select['*'] = 1;
            var match = {
                user_id: user_id,
                asset_id: param.asset_id
            };
            assetsModel.lookup({select:select,match:match},function(err, rows){
                if(err){return next(err);}
                if(rows && rows.length){
                    return next(null, rows[0]);
                }
                var msg = 'No asset matched asset_id = ' + param.asset_id;
                logger.error(msg);
                return next({code:ERRCODE.DB_NO_MATCH_DATA,msg:msg});
            });
        },
    ], function(err, data){
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