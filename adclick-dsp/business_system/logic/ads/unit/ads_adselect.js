/*
 * @file  ads_adselect_ad_list.js
 * @description demo usage of bes adselect
 * @copyright dmtec.cn reserved, 2017
 * @author Andy.zhou
 * @date 2017.05.19
 * @version 0.1.1 
 */
'use strict';
var MODULENAME = 'list_ad.logic';

//system modules
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../logic_api");
var AdTagClient = require('../../../../utils/adSelect/ad_tag_http_client');
var mAdTagClient = new AdTagClient({});

//models
var mADlibTagsModel = require('../../../model/adlib_ad_tags').create();

//utils
var mLogger = require('../../../../utils/logger')(MODULENAME);
var mUtils = require('../../../../utils/utils');


//common constants
var ERRCODE = require('../../../../common/errCode');
var ADCONSTANTS = require('../../../../common/adConstants');

function tagProcess(param){
    mLogger.debug('广告优选参数：' + JSON.stringify(param));
    //add tag to db
    var tags = param.tags.split(',');
    for(var i = 0; i < tags.length; i++){
        addTags(tags[i]);
    }

    var logmsg = ' to update(delete-->upload) the ad tags with unit id=' + param.unit_id;
    //query ad
    mAsync.series([
        function(next){
            deleteAd(param, next);
        },
        function(next) {
            uploadAd(param, next);
        }
    ], function(err, data) {
        if (err) {
            mLogger.debug('Failed ' + logmsg);
        }else {
            mLogger.debug('Success ' + logmsg);
        }
    });
    
}

function addTags(str){
    mAsync.waterfall([
        //filter the tag
        function(next){
            var match = {
                sub_categories: str
            };
            var select = {
                id: 1,
            };
            var query = {
                select: select,
                match: match,
            };
            mADlibTagsModel.lookup(query, function(err, rows){
                if(err){
                    next(err);
                }else{
                    var tags = [];
                    if(rows.length == 0){
                        tags.push(str);
                    }
                    next(null, tags);
                }
            })
        },
        //3. insert the new tag to database
        function(tags, next){
            if(tags.length){
                var value = {
                    code: 99,
                    sub_code: 9999,
                    categories: '其他',
                    sub_categories: str,
                };
                var query = {
                    fields: value,
                    values: [value], 
                };
                mADlibTagsModel.create(query, function(err, rows){
                    if (err) {
                        next(err);
                    }else {
                        next(null, tags);
                    }
                });
            }else{
                next(null, tags);
            }
        },
        //update to the ad select system
        function(tags, next){
            var data = {tags: tags};
            mAdTagClient.addTag({data: data}, function(err, data){
                if (err) {
                    next(err);
                }else{
                    next(null, data);
                }
            });   
        }
    ], function(err, data){
        if (err) {
            mLogger.error('Failed add tags ');
        }else {
            mLogger.debug('Success add tags ');
        }  
    })
}

function queryAd(id){
    var logmsg = ' to query the ad tags with unit id=' + id;
    var data = {
        adid: id,
    }
    mAdTagClient.queryAd({data: data}, function(err, data){
        if (err) {
            mLogger.error('Failed '+ logmsg);
        }else {
            mLogger.debug('Success '+ logmsg);
        }
    });
}

function deleteAd(param, fn){
    var logmsg = ' to delete the ad tags with unit id=' + param.unit_id;
    var data = {
        adid: param.unit_id,
    };

    mAdTagClient.deleteAd({data: data}, function(err, data){
         if (err) {
            mLogger.error('Failed ' + logmsg);
            fn(err);
        }else {
            fn(null, param);
        }       
    });
}

function uploadAd(param, fn){
    var logmsg = ' to upload the ad tags with unit id=' + param.unit_id;
    var tags = param.tags.split(',');
    var data = {
        adid: param.unit_id,
        tags: tags,
    };
    mAdTagClient.uploadAd({data: data}, function(err, data){
         if (err) {
            mLogger.error('Failed ' + logmsg);
            fn(err);
        }else {
            fn(null, param);
        }       
    });
}

module.exports.tagProcess = tagProcess;