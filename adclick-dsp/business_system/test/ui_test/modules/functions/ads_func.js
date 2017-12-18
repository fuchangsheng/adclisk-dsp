/*
 * @file ads_func.js
 * @description functions for testing of ads module
 * @copyright dmtec.cn reserved, 2017
 * @author tahitian
 * @date 2017.1.16
 * @version 0.0.1 
 */
'use strict';

var MODULENAME = 'ads_func.js';

//system modules
var mDebug = require('debug')(MODULENAME);
var mAsync = require('async');
var mMoment = require('moment');
var mIs = require('is_js');

// constants
var ADCONSTANTS = require('../../../../../common/adConstants');

//utils
var mLogger = require('../../../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../../../utils/data_helper');
var mUtils = require('../../../../../utils/utils');
// var AdsUtils = require('../../logic/ads/ads_utils');

// dataModels
var mAdminModel = require('../../../../model/management_admin').create();
var mADPlanModel = require('../../../../model/adlib_plans').create();
var mADUnitModel = require('../../../../model/adlib_units').create();
var mADUnitTargetModel = require('../../../../model/adlib_unit_target').create();
var mADIdeaModel = require('../../../../model/adlib_ideas').create();

function formatWidthHeight(param) {
    param.w = Number(param.w);
    param.h = Number(param.h);
}

function formatDuration(param) {
    param.duration = Number(param.duration);
}

function formatIdeaAsset(type, asset) {
    if(type==ADCONSTANTS.IDEATYPE.IMAGE.code) {
        if (asset.main_img) {
            formatWidthHeight(asset.main_img);
        }
    }else if (type==ADCONSTANTS.IDEATYPE.FLASH.code) {
        if (asset.flash) {
            formatWidthHeight(asset.flash);
        }
    }else if (type==ADCONSTANTS.IDEATYPE.VIDEO.code) {
        if (asset.video) {
            formatWidthHeight(asset.video);
            formatDuration(asset.video);
        }
    }else if (type==ADCONSTANTS.IDEATYPE.NATIVE.code) {
        if (asset.icon_img) {
            formatWidthHeight(asset.icon_img);
        }
        if (asset.logo_img) {
            formatWidthHeight(asset.logo_img);
        }
        if (asset.main_img) {
            formatWidthHeight(asset.main_img);
        }
    }else if (type==ADCONSTANTS.IDEATYPE.IMAGETEXT.code) {
        if (asset.main_img) {
            formatWidthHeight(asset.main_img);
        }
    }
}

var add_plan = function(param, cb){
    if (param.budget) {
        //to fen unit
        param.budget = mUtils.yuanToFen(param.budget);
    }

    mAsync.waterfall([
        //1. check whether the name duplicated in the system
        function(next) {
            var match = {
                user_id: param.user_id,
                plan_name: param.plan_name,
            };
            var query = {
                match: match,
            };
            mADPlanModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    if (total>0) {
                        var msg = 'The plan name duplicated!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_DATADUPLICATED, msg:msg});
                    }
                    next(null, {});
                }
            });
        },
        //2. create the plan
        function(data, next) {
            var value = {
                user_id: param.user_id,
                plan_name: param.plan_name,
                start_time: mMoment(param.start_time),
                end_time: mMoment(param.end_time),
                budget: param.budget,
                plan_cycle: param.plan_cycle,
                plan_status: ADCONSTANTS.ADSTATUS.NOTSTART.code,
            };
            
            var query = {
                fields: value,
                values: [value],
            };
            mADPlanModel.create(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    next(null, {plan_id: rows.insertId || -1});
                }
            });
        },
        //3 to get the plan id
        function(data, next) {
            if (data.plan_id >= 0) {
                return next(null, data);
            }

            var select = {
                plan_id: 1,
            };
            var match = {
                user_id: param.user_id,
                plan_name: param.plan_name,
            };
            var query = {
                select: select,
                match: match,
            };
            mADPlanModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    return next(null, rows[0]);
                }
            });
        },
    ], function(err, data) {
        // plan_id = data.plan_id;
        cb(err, data);
    });
}

var del_plan = function(param, fn){
    mADPlanModel.remove({ match : { plan_id : param.plan_id } }, function(err){
        fn(err);
    });
}

var add_unit = function(param, cb){
    if (mUtils.isExist(param.bid)) {
        //to fen unit
        param.bid = mUtils.yuanToFen(param.bid);
    }
    if(mUtils.isExist(param.bid_type)) {
        param.bid_type = ADCONSTANTS.ADBIDTYPE.parse(param.bid_type);
    }

    var user_id = param.user_id;
    var plan_id = param.plan_id;

    mAsync.waterfall([
        //1. check whether the name duplicated in the system
        function(next) {
            var match = {
                user_id: user_id,
                plan_id: plan_id,
                unit_name: param.unit_name,
            };
            
            var query = {
                match: match,
            };
            mADUnitModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    if (total>0) {
                        var msg = 'The unit name duplicated!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_DATADUPLICATED, msg:msg});
                    }
                    next(null, {});
                }
            });
        },
        //2. create the plan unit
        function(data, next) {
            var value = {
                user_id: user_id,
                plan_id: plan_id,
                unit_name: param.unit_name,
                bid: param.bid,
                bid_type: param.bid_type,
                unit_status: ADCONSTANTS.ADSTATUS.NOTSTART.code,
            };
            
            var query = {
                fields: value,
                values: [value],
            };
            mADUnitModel.create(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    next(null, {unit_id: rows.insertId || -1});
                }
            });
        },
        //3. try to get the unit id
        function(data, next) {
            if (data.unit_id >=0 ) {
                return next(null, data);
            }

            var select = {
                unit_id : 1,
            };
            var match = {
                user_id: user_id,
                plan_id: plan_id,
                unit_name: param.unit_name,
            };
            var query = {
                select: select,
                match: match,
            };
            mADUnitModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    next(null, rows[0]);
                }
            });
        },
        //4. create the unit target
        function(data, next) {
            if(!mUtils.isExist(param.imp) && !mUtils.isExist(param.click)){
                return next(null, data);
            }

            var unit_id = data.unit_id;
            var value = {
                id : 1,
                type : 0,
                unit_id: unit_id,
                plan_id: plan_id,
                user_id: user_id,
                status: ADCONSTANTS.ADTARGETSTATUS.NOTSTART.code,
                content : '',
            };

            var values = [];
            if(mUtils.isExist(param.imp)){
                var impvalue = {
                    unit_id: value.unit_id,
                    plan_id: value.plan_id,
                    user_id: value.user_id,
                    status: value.status,
                };
                impvalue.id = mDataHelper.createNumberId(MODULENAME+value.user_id+value.plan_id+value.unit_id);
                impvalue.type = ADCONSTANTS.ADTARGETTYPE.FREQIMPDAILY.code;
                impvalue.content = param.imp+'';
                impvalue.status = ADCONSTANTS.ADTARGETSTATUS.START.code;
                values.push(impvalue);
            }
            if(mUtils.isExist(param.click)){
                var clickvalue = {
                    unit_id: value.unit_id,
                    plan_id: value.plan_id,
                    user_id: value.user_id,
                    status: value.status,
                };
                clickvalue.id = mDataHelper.createNumberId(MODULENAME+value.user_id+value.plan_id+value.unit_id);
                clickvalue.type = ADCONSTANTS.ADTARGETTYPE.FREQCLICKDAILY.code;
                clickvalue.content = param.click+'';
                clickvalue.status = ADCONSTANTS.ADTARGETSTATUS.START.code;
                values.push(clickvalue);
            }

            var query = {
                fields: value,
                values: values,
            };

            mADUnitTargetModel.create(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    next(null, data);
                }
            });
        },
    ], function(err, data) {
        cb(err, data);
    });
}

var del_unit = function(param, fn){
    mADUnitModel.remove({ match : { unit_id : param.unit_id } }, function(err){
        if(err) fn(err);
        else {
            mADUnitTargetModel.remove({ match : { unit_id : param.unit_id } }, function(err){
                fn(err);
            });
        }
    });
}

var add_idea = function(param, cb){
    if (param.idea_type) {
        param.idea_type = ADCONSTANTS.IDEATYPE.parse(param.idea_type);
        if (param.assets) {
            formatIdeaAsset(param.idea_type, param.assets);
        }
    }
    if (param.adview_type) {
        param.adview_type = ADCONSTANTS.ADVIEWTYPE.parse(param.adview_type);
    }

    var user_id = param.user_id;
    var plan_id = param.plan_id;
    var unit_id = param.unit_id;

    mAsync.waterfall([
        //0. find the plan id
        function(next) {
            var select = {
                plan_id: 1,
            };
            var match = {
                unit_id: unit_id,
                user_id: user_id,
            };
            var query = {
                select: select,
                match: match,
            };
            mADUnitModel.lookup(query, function(err, rows){
                if (err) {
                    next(err);
                }else {
                    if (!rows || rows.length==0) {
                        var msg ='There is no match unit!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    }
                    plan_id = rows[0].plan_id;
                    next(null, plan_id);
                }
            });
        },
        //1. check whether the name duplicated in the system
        function(data, next) {
            var match = {
                user_id: user_id,
                plan_id: plan_id,
                unit_id: unit_id,
                idea_name: param.idea_name,
            };
            
            var query = {
                match: match,
            };
            mADIdeaModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    if (total>0) {
                        var msg = 'The idea name is duplicated!';
                        mLogger.error(msg);
                        return next({code: ERRCODE.DB_DATADUPLICATED, msg:msg});
                    }
                    next(null, {});
                }
            });
        },
        //2. create the plan unit
        function(data, next) {
            var idea_slots =  param.idea_slots || [];
            var idea_type = param.idea_type || 0;
            var assets = param.assets || {};
            var adview_type = param.adview_type || 0;
            var idea_trade = param.idea_trade || '';
            var imp_monitor_urls = [];
            var click_monitor_urls = [];
            var landing_page = null;

            // check urls 
            if (param.imp_monitor_urls) {
                for (var i in param.imp_monitor_urls) {
                    var url = param.imp_monitor_urls[i];
                    if (mIs.startWith(url, 'http://') || mIs.startWith(url, 'https://')) {
                        imp_monitor_urls.push(url);
                    } else {
                        var mUrl = 'http://' + url;
                        imp_monitor_urls.push(mUrl);
                    }
                }
            }
            if (param.click_monitor_urls) {
                for (var i in param.click_monitor_urls) {
                    var url = param.click_monitor_urls[i];
                    if (mIs.startWith(url, 'http://') || mIs.startWith(url, 'https://')) {
                        click_monitor_urls.push(url);
                    } else {
                        var mUrl = 'http://' + url;
                        click_monitor_urls.push(mUrl);
                    }
                }
            }
            if (param.landing_page) {
                if (mIs.startWith(param.landing_page, 'http://') || mIs.startWith(param.landing_page, 'https://')) {
                    landing_page = param.landing_page;
                } else {
                    landing_page = 'http://' + param.landing_page;
                }
            } else {
                landing_page = '';
            }
            
            var assetsStr = JSON.stringify(assets);
            assetsStr = assetsStr.replace(/"/g,"\\\"");

            var value = {
                user_id: user_id,
                plan_id: plan_id,
                unit_id: param.unit_id,
                idea_name: param.idea_name,
                idea_slots: mUtils.compileIdeaSlots(idea_slots),
                idea_type: idea_type,
                landing_page: landing_page,
                assets: assetsStr,
                idea_status: ADCONSTANTS.ADSTATUS.NOTSTART.code,
                adview_type: adview_type,
                idea_trade: idea_trade,
                imp_monitor_urls: imp_monitor_urls.join(' '),
                click_monitor_urls: click_monitor_urls.join(' '),
            };
            
            var query = {
                fields: value,
                values: [value],
            };
            mADIdeaModel.create(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    next(null, {idea_id: rows.insertId || -1});
                }
            });
        },
        //3 to get the idea id
        function(data, next) {
            if (data.idea_id >= 0) {
                return next(null, data);
            }

            var select = {
                idea_id: 1,
            };
            var match = {
                user_id: user_id,
                plan_id: plan_id,
                unit_id: unit_id,
                idea_name: param.idea_name,
            };
            var query = {
                select: select,
                match: match,
            };
            mADIdeaModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    return next(null, rows[0]);
                }
            });
        }
    ], function(err, data) {
        cb(err, data);
    });
};

var del_idea = function(param, cb){
    mADIdeaModel.remove({ match : { idea_id : param.idea_id } }, function(err){
        cb(err);
    });
};

var ads_add = function(user_id, cb){
    var id = {};

    var plan_param = {
        user_id : user_id,
        plan_name : Math.random().toString(36).substr(2, 6),
        start_time : '2016-12-1 00:00:00',
        end_time : '2016-12-6 00:00:00',
        budget : 1000,
        plan_cycle : 'abc',
    }

    var unit_param = {
        user_id : user_id,
        plan_id : 0,
        unit_name : Math.random().toString(36).substr(2, 6),
        bid : 1,
        bid_type : 'CPM',
        imp : 1,
        click : 1,
    }

    var idea_param = {
        user_id : user_id,
        plan_id : 0,
        unit_id : 0,
        idea_name : Math.random().toString(36).substr(2, 6),
        idea_slots : [{type : '忽略',},],
        idea_type : '文字',
        landing_page : 'http://www.google.cn/',
        adview_type : 'WEB',
        assets : {},
    }

    add_plan(plan_param, function(err, data){
        if(err) cb(err, null);
        else if(data.plan_id) {
            id.plan_id = data.plan_id;
            unit_param.plan_id = data.plan_id;
            add_unit(unit_param, function(err, data){
                // done(err);
                if(err) cb(err, id);
                else if(data.unit_id) {
                    id.unit_id = data.unit_id;
                    idea_param.plan_id = id.plan_id;
                    idea_param.unit_id = id.unit_id;
                    add_idea(idea_param, function(err, data){
                        id.idea_id = data.idea_id;
                        cb(err, id);
                    });
                }
            });
        }
    });
};

var ads_del = function(param, cb){
    // var user_id = param.user_id;
    var idea_id = param.idea_id;
    var unit_id = param.unit_id;
    var plan_id = param.plan_id;

    if(idea_id) {
        del_idea({ idea_id : idea_id }, function(err){
            if(err) console.error(err);
            if(unit_id){
                del_unit({ unit_id : unit_id }, function(err){
                    if(err) console.error(err);
                    if(plan_id){
                        del_plan({ plan_id : plan_id }, function(err){
                            if(!err) console.log('Data is cleaned up!');
                            cb(err);
                        });
                    }
                });
            }
        });
    }
};

module.exports.add_plan = add_plan;
module.exports.del_plan = del_plan;
module.exports.add_unit = add_unit;
module.exports.del_unit = del_unit;
module.exports.add_idea = add_idea;
module.exports.del_idea = del_idea;
module.exports.ads_add = ads_add;
module.exports.ads_del = ads_del;
