/*
 * @file  ads_idea_list.js
 * @description get the ad user's ad idea list API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.09
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'ads_idea_list.logic';
var URLPATH = '/v1/aduser/ads/idea/list';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mADPlanModel = require('../../model/adlib_plans').create();
var mADUnitModel = require('../../model/adlib_units').create();
var mADIdeaModel = require('../../model/adlib_ideas').create();
var mADIdeaAuditModel = require('../../model/adclick_audit_ideas').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidUserId(data);
        },
    },
    plan_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidPlanId(data);
        },
        optional: true,
    },
    unit_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidUnitId(data);
        },
        optional: true,
    },
    index: {
        data: 1,
        rangeCheck: function(data) {
            return data>=0;
        },
        optional: true,
    },
    count: {
        data: 1,
        rangeCheck: function(data) {
            return data>=0 && data<=ADCONSTANTS.PAGEMAXCOUNT;
        },
        optional: true,
    },
    sort: {
        data: '',
        rangeCheck: function(data) {
            var sort = ADCONSTANTS.DATASORT.find(data);
            if (!sort) {
                return false;
            }

            return mIs.inArray(sort.code, [
                ADCONSTANTS.DATASORT.CREATETIME_ASC.code,
                ADCONSTANTS.DATASORT.CREATETIME_DESC.code,
                ADCONSTANTS.DATASORT.UPDATETIME_DESC.code,
                ])
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
    
    var ideas = data.ideas;
    var resData = {
        total: data.total,
        size: ideas.length,
        list: [],
    };

    for (var i = 0; i < ideas.length; i++) {
        var slots = [];
        var idea_slots = [];
        if (ideas[i].idea_slots) {
            slots = ideas[i].idea_slots.split(',');
        }
        for (var j = 0; j < slots.length; j++) {
            idea_slots.push ({type: ADCONSTANTS.IDEASLOTTYPE.format(slots[j])});
        }
        var idea = {
            plan_id: ideas[i].plan_id,
            unit_id: ideas[i].unit_id,
            idea_id: ideas[i].idea_id,
            plan_name: ideas[i].plan_name,
            unit_name: ideas[i].unit_name,
            idea_name: ideas[i].idea_name,
            idea_slots: idea_slots,
            idea_type: ADCONSTANTS.IDEATYPE.format(ideas[i].idea_type),
            landing_page: ideas[i].landing_page,
            adview_type: ADCONSTANTS.ADVIEWTYPE.format(ideas[i].adview_type),
            idea_trade: ideas[i].idea_trade ||'',
            idea_status: ADCONSTANTS.ADSTATUS.format(ideas[i].idea_status),
            audit_status: ADCONSTANTS.AUDIT.format(ideas[i].audit_status),
            failure_message: ideas[i].failure_message,
            //imp_monitor_urls: data.imp_monitor_urls.split(' '),
            //click_monitor_urls: data.click_monitor_urls.split(' '),
            assets: JSON.parse(ideas[i].assets),
            update_time: mMoment(ideas[i].update_time).format(ADCONSTANTS.DATATIMEFORMAT), 
        };
        if (ideas[i].imp_monitor_urls) {
            idea.imp_monitor_urls = ideas[i].imp_monitor_urls.split(' ');
        }
        if (ideas[i].click_monitor_urls) {
            idea.click_monitor_urls = ideas[i].click_monitor_urls.split(' ');
        }
        resData.list.push(idea);
    }

    return resData;
}

function preprocess(param) {
    if (param.sort) {
        param.sort = ADCONSTANTS.DATASORT.parse(param.sort);
    }
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id;

    var logmsg = ' to get ad plan idea list for user:' + user_id;
    mLogger.debug('Try '+logmsg);
    var match = {
        user_id: user_id,
    };
    if (param.plan_id) {
        match.plan_id = param.plan_id;
    }
    if (param.unit_id) {
        match.unit_id = param.unit_id;
    }

    preprocess(param);

    mAsync.waterfall([
        //1. check total number of ad plans in the system
        function(next) {
            var query = {
                match: match,
            };
            mADIdeaModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    next(null, total);
                }
            });
        },
        //2. get the plan ideas
        function(total, next) {
            if (total==0) {
                return next(null, {total: 0, ideas: []});
            }
            var index = param.index || 0;
            var count = param.count || ADCONSTANTS.DEFAULTCOUNT;
            var offset = index * count;
            if (offset>=total) {
                mLogger.info(
                    'There is no more data in the system for user:'+user_id);
                return next(null, {total: total, ideas: []});
            }

            //2.1 create the sql statment
            var sqlstr = 'select * ' ;
            sqlstr += ' from ' + mADIdeaModel.tableName;
            sqlstr +=' where ';
            sqlstr += mUtils.compileMatchStr(match);
            if (mUtils.isExist(param.sort)) {
                if (param.sort==ADCONSTANTS.DATASORT.CREATETIME_ASC.code) {
                    sqlstr += ' ORDER BY create_time ASC ';
                }else if (param.sort==ADCONSTANTS.DATASORT.CREATETIME_DESC.code) {
                    sqlstr += ' ORDER BY create_time DESC ';
                }else if (param.sort==ADCONSTANTS.DATASORT.UPDATETIME_DESC.code) {
                    sqlstr += ' ORDER BY update_time DESC ';
                }
            }

            sqlstr +=' limit '+count+' offset '+offset;
            sqlstr +=';';

            //2.2 query the database            
            var query = {
                sqlstr: sqlstr,
            };

            mADIdeaModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {     
                    next(null, {total: total, ideas: rows});
                }
            });
        },
        //3. get the unit name
        function(datas, next){
            if(datas.total == 0){
                return next(null, datas);
            }

            var unit_id_array = [];
            var ideas = datas.ideas;

            for(var x in ideas){
                unit_id_array.push(ideas[x].unit_id);
                ideas[x].unit_name = '';
            }

            //3.1 create the sql statment
            var sqlstr = 'select unit_name, unit_id '
            sqlstr += ' from ' + mADUnitModel.tableName;
            sqlstr +=' where unit_id';
            sqlstr += ' in ( ' + unit_id_array.join(',') + ' );';

            //3.2 query the database
            var query = {
                sqlstr: sqlstr,
            };

            mADUnitModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    for(var x in rows){
                        for(var y in ideas){
                            if(rows[x].unit_id === ideas[y].unit_id){
                                ideas[y].unit_name = rows[x].unit_name;
                            }
                        }
                    }

                    next(null, {total: datas.total, ideas: ideas});
                }
            });
        },
        //4. get the plan name
        function(datas, next){
            if(datas.total == 0){
                return next(null, datas);
            }

            var plan_id_array = [];
            var ideas = datas.ideas;

            for(var x in ideas){
                plan_id_array.push(ideas[x].plan_id);
                ideas[x].plan_name = '';
            }

            //3.1 create the sql statment
            var sqlstr = 'select plan_name, plan_id '
            sqlstr += ' from ' + mADPlanModel.tableName;
            sqlstr +=' where plan_id';
            sqlstr += ' in ( ' + plan_id_array.join(',') + ' );';

            //3.2 query the database
            var query = {
                sqlstr: sqlstr,
            };

            mADPlanModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    for(var x in rows){
                        for(var y in ideas){
                            if(rows[x].plan_id === ideas[y].plan_id){
                                ideas[y].plan_name = rows[x].plan_name;
                            }
                        }
                    }

                    next(null, {total: datas.total, ideas: ideas});
                }
            });
        },
        //5. get the idea audit status
        function(datas, next) {
            if (datas.ideas.length==0) {
                return next(null, datas);
            }
            var ideas_ids = [];
            var ideas = datas.ideas;

            for(var x in ideas){
                ideas_ids.push(ideas[x].idea_id);
                ideas[x].audit_status = ADCONSTANTS.AUDIT.UNSUBMIT.code;
                ideas[x].failure_message = ADCONSTANTS.AUDIT.UNSUBMIT.name;
            }

            //3.1 create the sql statment
            var sqlstr = 'select audit_status, idea_id, failure_message'
            sqlstr += ' from ' + mADIdeaAuditModel.tableName;
            sqlstr +=' where idea_id';
            sqlstr += ' in ( ' + ideas_ids.join(',') + ' );';

            //3.2 query the database
            var query = {
                sqlstr: sqlstr,
            };

            mADIdeaAuditModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    for(var x in rows){
                        for(var y in ideas){
                            if(rows[x].idea_id === ideas[y].idea_id){
                                ideas[y].audit_status = rows[x].audit_status;
                                if (ideas[y].audit_status!=ADCONSTANTS.AUDIT.PASS.code) {
                                    ideas[y].failure_message = rows[x].failure_message;
                                }else {
                                    ideas[y].failure_message = ADCONSTANTS.AUDIT.PASS.name;
                                }
                            }
                        }
                    }

                    next(null, {total: datas.total, ideas: ideas});
                }
            });
        },
    ], function(err, datas) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(datas);
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

