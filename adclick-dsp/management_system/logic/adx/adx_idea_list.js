/*
 * @file  adx_idea_list.js
 * @description adx idea information list API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.13
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'adx_idea_list.logic';
var URLPATH = '/v1/adx/idea/list';

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
var mDspAdUserModel = require('../../model/dsp_aduser').create();
var mAdxAuditIdeaModel = require('../../model/adlib_audit_ideas').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

var mRefModel = {
    adx_id: {
        data: 1,
        rangeCheck: function(data) {
            return data > 0;
        }
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
    var list = [];

    for (var i = 0; i < ideas.length; i++) {
        var idea = ideas[i];
        if (!idea.assets || !idea.idea_name || !idea.plan_name || !idea.unit_name) {
            continue;
        }
        var assets = JSON.parse(idea.assets);
        var ideaUrl = null;
        var ideaType = idea.idea_type;
        if (ideaType === ADCONSTANTS.IDEATYPE.IMAGE.code) {
            ideaUrl = assets.main_img.url;
        } else if (ideaType === ADCONSTANTS.IDEATYPE.FLASH.code) {
            ideaUrl = assets.flash.url;
        } else if (ideaType === ADCONSTANTS.IDEATYPE.VIDEO.code) {
            ideaUrl = assets.video.url;
        } else if (ideaType === ADCONSTANTS.IDEATYPE.NATIVE.code) {
            ideaUrl = assets.display_url;
        } else if (ideaType === ADCONSTANTS.IDEATYPE.TEXT.code) {
            ideaUrl = 'title: ' + assets.title;
        } else {
            ideaUrl = assets.main_img.url;
        }
        var item = {
            id: idea.id,
            idea_name: idea.idea_name,
            unit_name: idea.unit_name,
            plan_name: idea.plan_name,
            user_name: idea.user_name,
            adview_type: ADCONSTANTS.ADVIEWTYPE.format(idea.adview_type),
            idea_url: ideaUrl,
            landing_page: idea.landing_page,
            adx_idea_id: idea.adx_idea_id,
            idea_type: ADCONSTANTS.IDEATYPE.format(idea.idea_type),
            signature: idea.signature,
            audit_status: ADCONSTANTS.AUDIT.format(idea.audit_status),
            failure_message: idea.failure_message
        };
        list.push(item);
    }

    var resData = {
        total: data.total,
        size: list.length,
        list: list
    };
    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});
    }


    var logmsg = ' to get the adx audit ideas list in the system' ;
    mLogger.debug('Try ' + logmsg);

    if (param.sort) {
        param.sort = ADCONSTANTS.DATASORT.parse(param.sort);
    }

     mAsync.waterfall([
        //1. check total number of adx audit ideas in the system
        function(next) {
            var match = {
                adx_id: param.adx_id
            };
            var query = {
                match: match,
            };
            mAdxAuditIdeaModel.count(query, function(err, total) {
                if (err) {
                    next(err);
                }else {
                    next(null, total);
                }
            });
        },
        //2. get the adx list
        function(total, next) {
            if (total === 0) {
                return next(null, {total: 0, ideas: []});
            }
            var index = param.index || 0;
            var count = param.count || ADCONSTANTS.DEFAULTCOUNT;
            var offset = index * count;
            if (offset>=total) {
                mLogger.info(
                    'There is no more adx audit idea in the system');
                return next(null, {total: total, ideas: []});
            }

            //2.1 create the sql statment
            var sqlstr = 'select * ' ;
            sqlstr += ' from ' + mAdxAuditIdeaModel.tableName;
            sqlstr += ' WHERE adx_id = ' + param.adx_id;
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

            mAdxAuditIdeaModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    var idea_ids = [];
                    var plan_ids = [];
                    var unit_ids = [];
                    var user_ids = [];
                    for (var i = 0; i < rows.length; i++) {
                        idea_ids.push(rows[i].idea_id);
                        plan_ids.push(rows[i].plan_id);
                        unit_ids.push(rows[i].unit_id);
                        user_ids.push(rows[i].user_id);
                    }
                    mAsync.series({
                        //1.get idea information
                        ideaInfo: function(nx) {
                            var sqlstr = 'SELECT idea_id,idea_name,idea_type,adview_type,assets,landing_page';
                            sqlstr += ' FROM ' + mADIdeaModel.tableName;
                            sqlstr += ' WHERE idea_id in(' + idea_ids.join(',') + ');';
                            var query = {
                                sqlstr: sqlstr
                            };
                            mADIdeaModel.query(query, function(err, res) {
                                if (err) {
                                    nx(err);
                                } else {
                                    nx(null, res);
                                }
                            });
                        },
                        planName: function(nx) {
                            var sqlstr = 'SELECT plan_id,plan_name';
                            sqlstr += ' FROM ' + mADPlanModel.tableName;
                            sqlstr += ' WHERE plan_id in(' + plan_ids.join(',') + ');';
                            var query = {
                                sqlstr: sqlstr
                            };
                            mADPlanModel.query(query, function(err, res) {
                                if(err) {
                                    nx(err);
                                } else {
                                    nx(null, res);
                                }
                            });
                        },
                        unitName: function(nx) {
                            var sqlstr = 'SELECT unit_id,unit_name';
                            sqlstr += ' FROM ' + mADUnitModel.tableName;
                            sqlstr += ' WHERE unit_id in(' + unit_ids.join(',') + ');';
                            var query = {
                                sqlstr: sqlstr
                            };
                            mADUnitModel.query(query, function(err, res) {
                                if (err) {
                                    nx(err);
                                } else {
                                    nx(null, res);
                                }
                            });
                        },
                        userName: function(nx) {
                            var sqlstr = 'SELECT user_id,user_name';
                            sqlstr += ' FROM ' + mDspAdUserModel.tableName;
                            sqlstr += ' WHERE user_id in(' + user_ids.join(',') + ');';
                            var query = {
                                sqlstr: sqlstr
                            };
                            mDspAdUserModel.query(query, function(err, res) {
                                if (err) {
                                    nx(err);
                                } else {
                                    nx(null, res);
                                }
                            });
                        }
                    }, function(err, result) {
                        if (err) {
                            next(err);
                        } else {
                            var ideas = result.ideaInfo;
                            var plan_names = result.planName;
                            var unit_names = result.unitName;
                            var user_names = result.userName;
                            for (var i = 0; i < rows.length; i++) {
                                var idea = rows[i];
                                for (var j = 0; j < plan_names.length; j++) {
                                    if (idea.plan_id === plan_names[j].plan_id) {
                                        idea.plan_name = plan_names[j].plan_name;
                                        break;
                                    }
                                }
                                for (var j = 0; j < unit_names.length; j++) {
                                    if (idea.unit_id === unit_names[j].unit_id) {
                                        idea.unit_name = unit_names[j].unit_name;
                                        break;
                                    }
                                }
                                for (var j = 0; j < user_names.length; j++) {
                                    if (idea.user_id === user_names[j].user_id) {
                                        idea.user_name = user_names[j].user_name;
                                        break;
                                    }
                                }
                                for (var j = 0; j < ideas.length; j++) {
                                    if (idea.idea_id === ideas[j].idea_id) {
                                        idea.idea_name = ideas[j].idea_name;
                                        idea.idea_type = ideas[j].idea_type;
                                        idea.adview_type = ideas[j].adview_type;
                                        idea.assets = ideas[j].assets;
                                        idea.landing_page = ideas[j].landing_page;
                                        break;
                                    }
                                }
                            }
                            next(null, {total: total, ideas: rows}) 
                        }
                    });
                }
            });
        }
    ], function(err, data) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(data);
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

