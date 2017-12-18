'use strict';

var MODULENAME = 'assets_add.logic';
var URLPATH = '/v3/utils/assets/add'

var debug = require('debug')(MODULENAME);
var router = require('express').Router();
var async = require('async');
var isJs = require('is_js');
var moment = require('moment');

var LogicApi = require('../../logic_api');

var assetsModel = require('../../../model/adlib_assets').create();

var logger = require('../../../../utils/logger')(MODULENAME);
var dataHelper = require('../../../../utils/data_helper');
var utils = require('../../../../utils/utils');

var ERRCODE = require('../../../../common/errCode');
var ADCONSTANTS = require('../../../../common/adConstants');

var refModel = {
    user_id: {
        data: 1,
        rangeCheck: function(data) {
            return utils.isValidUserId(data);
        }
    },
    asset_name: {
        data: '',
        rangeCheck: utils.notEmpty
    },
    url: {
        data: '',
        rangeCheck: utils.notEmpty
    },
    width: {
        data: 1,
        rangeCheck: utils.isPostiveNumber
    },
    height: {
        data: 1,
        rangeCheck: utils.isPostiveNumber
    },
    duration: {
        data: 1,
        rangeCheck: utils.isPostiveNumber,
        optional: true
    },
    //assets_type:1,2,3
    asset_type: {
        data: '',
        rangeCheck: function(data) {
            var type = ADCONSTANTS.ASSETTYPE.parse(data);
            return (type !== -1);
        }
    },
    asset_tag: {
        data: '',
        rangeCheck: utils.notEmpty,
        optional: true
    }
};

var logicHelper = new LogicApi({
    debug: debug,
    moduleName: MODULENAME,
    refModel: refModel
});



function validate(data) {
    if (!data) {
        return false;
    }
    return logicHelper.validate({
        inputModel: data
    });
}


function packageResponseData(data) {
    if (!data) { return {}; }
    return {
        assets_id: data.asset_id
    };
}

function preProcess(param){
    if(!param.ratio){
        param.ratio = String(parseFloat(param.width)/parseFloat(param.height))
    }
    return param;
}

var processRequest = function(param, fn) {
    //1. validate param
    if (!validate(param)) {
        var msg = 'Invalid param';
        logger.error(msg);
        return fn({
            code: ERRCODE.PARAM_INVALID,
            msg: msg
        });
    }

    param = preProcess(param);

    var user_id = param.user_id;
    var logmsg = ' to create assets for user: ' + user_id;
    logger.debug('Try' + logmsg);

    async.waterfall([
        //1. check whether assetsName duplicated
        function(next){
            var match = {
                user_id: user_id,
                asset_name: param.asset_name
            };
            assetsModel.count({match:match}, function(err, total){
                if(err){return next(err);}
                if(total > 0){
                    var msg = 'Duplicated asset name :' + param.asset_name;
                    logger.error(msg);
                    return next({code:ERRCODE.DB_DATADUPLICATED,msg:msg});
                }
                next(null,{});
            });
        },
        //2. create thumbnail
        function(data, next){
            var value = {
                user_id: user_id,
                asset_name: param.asset_name,
                url: param.url,
                width: param.width,
                height: param.height,
                duration: param.duration ? param.duration : 0,
                ratio: param.ratio ? param.ratio : '0',
                asset_type: ADCONSTANTS.ASSETTYPE.parse(param.asset_type),
                asset_tag: param.asset_tag || ''
            };
            var check = false;
            var match = {};
            switch(value.asset_type){
                case ADCONSTANTS.ASSETTYPE.FLASH.code:
                    if(value.url){
                        match.asset_type = ADCONSTANTS.ASSETTYPE.FLASH.code;
                        match.url = value.url;
                        match.width = value.width;
                        match.height = value.height;
                        match.source_path = ADCONSTANTS.SERVER.ROOT + 'idea/flash/';
                        match.thumbnail = ADCONSTANTS.SERVER.FILESERVER + 'idea/flash/';
                        check = true;
                    }
                    break;
                case ADCONSTANTS.ASSETTYPE.VIDEO.code:
                    if(value.url && value.duration && value.ratio){
                        match.asset_type = ADCONSTANTS.ASSETTYPE.VIDEO.code;
                        match.url = value.url;
                        match.width = value.width;
                        match.height = value.height;
                        match.duration = value.duration;
                        match.ratio = value.ratio;
                        match.source_path = ADCONSTANTS.SERVER.ROOT + 'idea/video/';
                        match.thumbnail = ADCONSTANTS.SERVER.FILESERVER + 'idea/video/';
                        check = true;
                    }
                    break; 
            }
            if(check){
                var pathsep = (match.url.indexOf('/')!=-1)? '/' : mPath.sep;
                var splits = match.url.split(pathsep);
                var filename = splits.pop();
                var datedir = splits.pop();
                var usrdir = splits.pop();
                match.source_path += usrdir + '/' + datedir + '/';
                match.thumbnail += usrdir + '/' + datedir + '/';
                var source = match.source_path + filename;
                var size = {w : match.width, h : match.height};
                var folder = match.source_path;
                var dst_filename = filename+'.jpg';

                var options = {
                    source : source,
                    folder : folder,
                    size : size,
                };
                logger.debug('thumbnail: ',match.thumbnail);
                utils.generateThumbnailEx(options, function(ret, msg){
                    logger.debug('Generate thumbnail : '+ret?'Success':'Failed');
                    if(ret) {
                        match.thumbnail = match.thumbnail + dst_filename;
                    }else{
                        match.thumbnail = '';
                    }
                    next(null, match.thumbnail);
                });                
            }else{
                next(null,'');
            }
        },
        //3.create the assets
        function(thumbnail, next){
            var value = {
                user_id: user_id,
                asset_name: param.asset_name,
                url: param.url,
                width: param.width,
                height: param.height,
                duration: param.duration ? param.duration : 0,
                ratio: param.ratio ? param.ratio : '0',
                thumbnail: thumbnail,
                asset_type: ADCONSTANTS.ASSETTYPE.parse(param.asset_type),
                asset_tag: param.asset_tag || ''
            };
            var query = {
                fields: value,
                values: [value]
            };
            assetsModel.create(query, function(err, rows){
                if(err){return next(err);}
                return next(null,{asset_id: rows.insertId || -1});
            });
        },
        //3.to get assets id
        function(data,next){
            if(data.asset_id >= 0){return next(null, data);}

            var query = {
                select: {
                    asset_id: 1
                },
                match: {
                    user_id: user_id,
                    asset_name: param.asset_name
                }
            };
            assetsModel.lookup(query, function(err, rows){
                if(err){return next(err);}

                return next(null, rows[0]);
            });
        }
    ], function(err, data) {
        if (err) {
            logger.error('Failed' + logmsg);
            fn(err);
        } else {
            logger.debug('Succeed' + logmsg);
            fn(null, packageResponseData(data));
        }
    });

};


router.post(URLPATH, function(req, res, next) {
    var param = req.body;
    logicHelper.responseHttp({
        req: req,
        res: res,
        next: next,
        param: param,
        processRequest: processRequest
    });
});

module.exports.router = router;