
'use strict';
var MODULENAME = 'ads_unit_target_edit.js';
var URLPATH = '/v3/ads/unit/target_setting_edit';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../../logic_api");
var AdsUtils = require('../../utils/ads_utils');
var adAdselect = require("./ads_adselect");

//models
var mADPlanModel = require('../../../model/adlib_plans').create()
var mADUnitModel = require('../../../model/adlib_units').create();
var mADIdeaModel = require('../../../model/adlib_ideas').create();
var mADUnitTargetModel = require('../../../model/adlib_unit_target').create();
var mADIdeaAuditModel = require('../../../model/adclick_audit_ideas').create();
var mAdxAuditIdeaModel = require('../../../model/adlib_audit_ideas').create();

//utils
var mLogger = require('../../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../../utils/data_helper');
var mUtils = require('../../../../utils/utils');

//common constants
var ERRCODE = require('../../../../common/errCode');
var ADCONSTANTS = require('../../../../common/adConstants');

var mRefModel = {
    user_id: {
        data: 1,
        rangeCheck: function(data) {
            return mUtils.isValidUserId(data);
        },
    },
    unit_id: {
        data: 'name',
        rangeCheck: function(data) {
            return !mUtils.isEmpty(data);
        },
    },
    targets: {
        data: [],
        rangeCheck: function(data) {
            if(data.length <= 0) {
                return false;
            }

            for (var i = 0; i < data.length; i++) {
                var target = data[i];
                var type = ADCONSTANTS.ADTARGETTYPE.find(target.type);
                if (!type) {
                    return false;
                }
            }

            return true;
        },
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
    
    var resData = {
        unit_id: data.unit_id,
    };

    return resData;
}

function getAdPlanId(param, fn) {
    var match = {
        user_id: param.user_id,
        unit_id: param.unit_id,
    };
    var select = {
        plan_id: 1,
    }

    var query = {
        match: match,
        select: select,
    };

    mADUnitModel.lookup(query, function(err, rows) {
        if(err) {
            fn(err);
        }else {
            if(rows.length==0) {
                var msg = 'There is no match data!';
                mLogger.error(msg);
                return fn({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
            }
            param.plan_id = rows[0].plan_id;
            fn(null, param);
        }
    });
}

function readOldUnitTargets(param, fn) {
    mLogger.debug('calling readOldUnitTargets!');

    var match = {
        user_id: param.user_id,
        unit_id: param.unit_id,
        status: ADCONSTANTS.ADTARGETSTATUS.START.code,
    };

    var select = {
        type: 0,
        content: '',
    }

    var query = {
        match: match,
        select: select,
    };

    query.connection = param.connection;
    mADUnitTargetModel.lookup(query, function(err, rows) {
        if (err) {
            fn(err);
        }else {
            param.old = rows;
            fn(null, param);
        }
    });
}

function removeOldUnitTargets(param, fn) {
    mLogger.debug('calling removeOldUnitTargets!');

    var match = {
        user_id: param.user_id,
        unit_id: param.unit_id,
    };
            
    var query = {
        match: match,
    };

    query.connection = param.connection;
    mADUnitTargetModel.remove(query, function(err, rows) {
        if (err) {
            fn(err);
        }else {
            fn(null, {});
        }
    });
}

function createNewUnitTargets(param, fn) {
    mLogger.debug('calling createNewUnitTargets!');

    var values = [];
    var targets = param.targets;
    for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        var value = {
            id : mDataHelper.createNumberId(''),
            plan_id: param.plan_id,
            unit_id: param.unit_id,
            user_id: param.user_id,
            type: ADCONSTANTS.ADTARGETTYPE.parse(target.type),
            content: target.content,
            status: ADCONSTANTS.ADTARGETSTATUS.parse(target.status),
        };
        AdsUtils.parserUnitTarget(value);
        values.push(value);
    }

    var old_rows = param.old;
    for(var i = 0; i < old_rows.length; i++) {
        if( (old_rows[i].type ===  ADCONSTANTS.ADTARGETTYPE.FREQIMPDAILY.code) ||
            (old_rows[i].type ===  ADCONSTANTS.ADTARGETTYPE.FREQCLICKDAILY.code) ){
            var value = {
                id : mDataHelper.createNumberId(''),
                plan_id: param.plan_id,
                unit_id: param.unit_id,
                user_id: param.user_id,
                type: old_rows[i].type,
                content: old_rows[i].content,
                status: ADCONSTANTS.ADTARGETSTATUS.START.code,
            };
            values.push(value);
        }
    }

    var query = {
        fields: values[0],
        values: values,
    };
    query.connection = param.connection;
    mADUnitTargetModel.create(query, function(err, rows) {
        if (err) {
            fn(err);
        }else {
            fn(null, rows);
        }
    });
}

function updateAdxList(param, fn) {
    mLogger.debug('calling updateAdxList!');

    var targets = param.targets;
    var adx_target = [];
    for(var i in targets) {
        var target = targets[i];
        if(ADCONSTANTS.ADTARGETTYPE.parse(target.type) == ADCONSTANTS.ADTARGETTYPE.ADX.code
            && ADCONSTANTS.ADTARGETSTATUS.parse(target.status) == ADCONSTANTS.ADTARGETSTATUS.START.code) {
            var adxNames = target.content.split(',');
            var adxs = [];
            for(var j in adxNames) {
                var adx = ADCONSTANTS.ADXLIST.parse(adxNames[j]);
                if(adx != -1) {
                    adxs.push(adx);
                }
            }
            target.content = adxs.join(',');
            target.unit_id = param.unit_id;
            adx_target = [target];
            break;
        }
    }
    var adxInfo = AdsUtils.getAdxInfo([param.unit_id], adx_target);

    var old_rows = param.old;
    var old_adx_target = [];
    for(var i in old_rows) {
        var target = old_rows[i];
        if(target.type == ADCONSTANTS.ADTARGETTYPE.ADX.code) {
            target.unit_id = param.unit_id;
            old_adx_target = [target];
            break;
        }
    }
    var oldAdxInfo = AdsUtils.getAdxInfo([param.unit_id], old_adx_target);

    var newAddAdxList = [];
    var newRemoveAdxList = [];

    // find removed adx
    for(var i in oldAdxInfo[param.unit_id]) {
        var old_adx = oldAdxInfo[param.unit_id][i];
        for(var j in adxInfo[param.unit_id]) {
            var new_adx = adxInfo[param.unit_id][j];

            if(old_adx == new_adx) {
                break;
            }
            // last one means removed
            if(j == adxInfo[param.unit_id].length-1) {
                newRemoveAdxList.push(old_adx);
            }
        }
    }

    // find new added adx
    for(var i in adxInfo[param.unit_id]) {
        var new_adx = adxInfo[param.unit_id][i];
        for(var j in oldAdxInfo[param.unit_id]) {
            var old_adx = oldAdxInfo[param.unit_id][j];

            if(old_adx == new_adx) {
                break;
            }
            // last one means new added
            if(j == oldAdxInfo[param.unit_id].length-1) {
                newAddAdxList.push(new_adx);
            }
        }
    }

    var msg = 'to update adx audit idea for unit_id='+param.unit_id;
    mLogger.debug('Try ' + msg);
    mAsync.waterfall([
        //0. find out all ideas
        function(next) {
            var match = {
                user_id: param.user_id,
                unit_id: param.unit_id,
            }
            var select = mADIdeaAuditModel.refModel;

            var query = {
                match: match,
                select: select,
            };
            mADIdeaAuditModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    var ideas = [];
                    // find out all not is unsubmit ideas and failed ideas
                    for(var i in rows) {
                        if(rows[i].audit_status != ADCONSTANTS.AUDIT.UNSUBMIT.code &&
                            rows[i].audit_status != ADCONSTANTS.AUDIT.FAILED.code) {
                            ideas.push(rows[i]);
                        }
                    }
                    next(null, ideas);
                }
            });
        },
        //1. do remove
        function(ideas, next) {
            if((ideas.length == 0) || newRemoveAdxList.length == 0) {
                return next(null, ideas);
            }

            var idea_ids = [];
            for(var i in ideas) {
                idea_ids.push(ideas[i].idea_id);
            }

            var sqlstr = 'delete from ' + mAdxAuditIdeaModel.tableName;
            sqlstr += ' where idea_id in (' + idea_ids.join(',')+')';
            sqlstr += ' and adx_id in (' + newRemoveAdxList.join(',')+')';

            var query = {
                sqlstr: sqlstr,
            };
            mAdxAuditIdeaModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                }else {
                    next(null, ideas);
                }
            });
        },
        //2. do add
        function(ideas, next) {
            if((ideas.length == 0) || (newAddAdxList.length == 0)) {
                return next(null, ideas);
            }

            var values = [];
            for(var i in newAddAdxList) {
                var adx_id = newAddAdxList[i];
                for(var j in ideas) {
                    var idea = ideas[j];
                    var value = {
                        idea_id: idea.idea_id,
                        unit_id: idea.unit_id,
                        plan_id: idea.plan_id,
                        user_id: param.user_id,
                        adx_id: adx_id,
                        audit_status: ADCONSTANTS.AUDIT.UNCHECK.code,
                    };

                    values.push(value);
                }
            }

            var query = {
                fields: values[0],
                values: values,
            };
            mAdxAuditIdeaModel.create(query, next);
        },
    ], function(err, data) {
        if(err) {
            mLogger.error('Failed ' + msg);
            fn(err);
        }else {
            mLogger.debug('Success ' + msg);
            fn(null);
        }
    });
}

function transactionCallback(param, fn) {

    mAsync.series([
        function(next){
            removeOldUnitTargets(param, next);
        },
        function(next) {
            createNewUnitTargets(param, next);
        },
        function(next) {
            updateAdxList(param, next);
        },
    ], function(err, data) {
        if (err) {
            fn(err);
        }else {
            fn(null, data);
        }
    });
}

//bes
function getAdSlectTags(param){
    var adselect = {}
    var unit_id = param.unit_id;
    var targets = param.targets;
    adselect.unit_id = unit_id;
    for(var i = 0; i < targets.length; i++){
        var target = targets[i];
        if(target.type == '广告优选' && target.content){
            adselect.tags = target.content;
            adAdselect.tagProcess(adselect);
            break;
        }
    }
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});     
    }
    
    var user_id = param.user_id;
    var logmsg = ' to edit ad plan unit targets for user:' + user_id;
    mLogger.debug('Try '+logmsg);

    getAdSlectTags(param);

    mAsync.series([
        function(next) {
            getAdPlanId(param, next);
        },
        function(next) {
            readOldUnitTargets(param, next);
        },
        function(next) {
            param.transactionFun = transactionCallback;
            mADUnitTargetModel.doTransaction(param, function(err, data) {
                if(err){
                    next(err);
                }else{
                    next(null, {});
                }
            });
        }
    ], function(err, data) {
        if (err) {
            mLogger.error('Failed' + logmsg);
            fn(err);
        }else {
            mLogger.debug('Success' + logmsg);
            var resData = packageResponseData(param);
            fn(null, resData);
        }
    });
}

/*
* export the post interface
*/
mRouter.post(URLPATH, function(req, res, next){
    var param = req.body;

    mLogicHelper.responseHttp({
        res: res,
        req: req,
        next: next,
        processRequest: processRequest,
        param: param,       
    });
});

module.exports.router = mRouter;
