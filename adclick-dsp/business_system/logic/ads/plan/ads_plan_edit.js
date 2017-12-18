/*
 * @file  ads_plan_edit.js
 * @description edit the ad user's ad plan API and logic
 * notice:we will set the plan to not start after edit
 * user must start it again
 * @copyright dmtec.cn reserved, 2016
 * @author yangshiyu
 * @date 2017.11.27
 * @version 0.0.1 
 */

'use strict';
var MODULENAME = "ads_plan_edit.logic";
var URLPATH = '/v3/ads/plan/edit';

var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require("async");
var mIs = require("is_js");
var mMoment = require("moment");

var LogicApi = require('../../logic_api');

var mADPlanModel = require("../../../model/adlib_plans").create();

var mLogger = require("../../../../utils/logger")(MODULENAME);
var mDataHelper = require("../../../../utils/data_helper");
var mUtils = require("../../../../utils/utils");
                
var ERRCODE = require("../../../../common/errCode");
var ADCONSTANTS = require("../../../../common/adConstants");

var mRefModel = {
    user_id:{
        data:1,
        rangeCheck:function(data){
            return mUtils.isValidUserId(data);
        },
    },
    plan_id:{
        data:1,
        rangeCheck:function(data){
            return mUtils.isValidPlanId(data);
        },
    },
    plan_name:{
        data:"name",
        rangeCheck:function(data){
            return !mUtils.isEmpty(data);
        },
    },
    start_time:{
        data:"YYYY-MM-DD HH:mm:ss",
        rangeCheck:function(data){
            return mUtils.verifyDatatime(data);
        },
    },
    end_time:{
        data:"YYYY-MM-DD HH:mm:ss",
        rangeCheck:function(data){
            return mUtils.verifyDatatime(data);
        },
        optional:true,
    },
    budget:{
        data:1,
        rangeCheck:function(data){
            return data > ADCONSTANTS.ADPLANBUDGETMIN;
        },
    },
    plan_cycle:{
        data:"",
        rangeCheck:function(data){
            return !mUtils.isEmpty(data);
        },
    },
    delivery_type:{
        data:1,
        rangeCheck:function(data){
            return mUtils.isValidDeliveryType(data);
        },
    },
};


var mLogicHelper = new LogicApi({
    debug : mDebug,
    refModel : mRefModel,
    moduleName : MODULENAME
});

function validate(data){
    if(!data){
        return false;
    }
    return mLogicHelper.validate({
        inputModel:data,
    });
}

function preProcess(param){
    
    if(param.budget){
        param.budget = mUtils.yuanToFen(param.budget);
    }
}


function packageResponseData(data){
    if (!data) {
        return {};
    }
    
    var resData = {
        plan_id: data.plan_id,
    };
    return resData;
}

function processRequest(param,fn){
    if(!validate(param)){
        var msg = "Invalid data";
        mLogger.error(msg);
        return fn({code:ERRCODE.PARAM_INVALID,msg:msg});
    }

    var user_id = param.user_id;
    var logmsg = " to edit ad plan for user:" + user_id;
    
    mLogger.debug("Try " + logmsg);
    preProcess(param);
    mAsync.series([
        function(next){
            var match = {
                user_id:user_id,
                plan_name:param.plan_name,
            };
            var select = {
                plan_id:1,
            };
            var query = {
                select:select,
                match:match,
            };
            mADPlanModel.lookup(query,function(err,rows){
                if(err){
                    next(err);
                }else{
                    if(rows && rows.length > 0){
                        var data = rows[0];
                        if(data.plan_id != param.plan_id){
                            var msg = "The plan name duplicated!";
                            mLogger.error(msg);
                            return next({code:ERRCODE.DB_DATADUPLICATED,msg:msg});
                        }
                    }
                    next(null);
                }
            });
        },

        function(next){
            console.log("param.plan_id2:"+param.plan_id);
            var update = {
                plan_name:param.plan_name,
                start_time:mMoment(param.start_time),
                budget:param.budget,
                plan_cycle:param.plan_cycle,
                plan_status:ADCONSTANTS.ADSTATUS.NOTSTART.code,
            };
            //// One-day budget must be more than 100
            // if(param.budget < 10000){
            //     var msg = "Budget is less than 100";
            //     mLogger.error(msg);
            //     return fn({
            //         code: ERRCODE.BUDGET_NOTENOUGH,
            //         msg: msg
            //     });
            // }
            if (typeof (param.end_time) == "undefined") {
                value.end_time = mMoment(ADCONSTANTS.DEFAULTPLANENDTIME);
            } else {
                value.end_time = mMoment(param.end_time);
            }
            var match = {
                user_id:user_id,
                plan_id:param.plan_id,
            };
            var query = {
                match:match,
                update:update,
            };
            mADPlanModel.update(query,next);
        },
    ],function(err){
        if(err){
            mLogger.error("Failed" + logmsg);
            fn(err);
        }else{
            mLogger.debug("Succeed" + logmsg);
            var resData = packageResponseData(param);
            fn(null,resData);
        }
    });

}

mRouter.post(URLPATH,function(req,res,next){
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









