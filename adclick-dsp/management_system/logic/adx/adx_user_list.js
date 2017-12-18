/*
 * @file  adx_user_list.js
 * @description adx user information list API and logic
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.17
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'adx_user_list.logic';
var URLPATH = '/v1/adx/user/list';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');

var LogicApi = require("../logic_api");

//models
var mAdxAuditUserModel = require('../../model/adlib_audit_users').create();
var mDspAdUserModel = require('../../model/dsp_aduser').create();


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

    var users = data.users;
    var list = [];

    for (var i = 0; i < users.length; i++) {
        if (!users[i].user_name) {
            continue;
        }
        var user = {
            id: users[i].id,
            user_id: users[i].user_id,
            user_name: users[i].user_name,
            qualification_name: users[i].qualification_name,
            site_name: users[i].site_name,
            site_url: users[i].site_url,
            signature: users[i].signature,
            audit_status: ADCONSTANTS.AUDIT.format(users[i].audit_status),
            failure_message: users[i].failure_message
        };
        list.push(user);
    }
    var resData = {
        total: data.total,
        size: list.length,
        list: list,
    };

    return resData;
}

function processRequest(param, fn){
    if (!validate(param)) {
        var msg = 'Invalid data';
        mLogger.error(msg);
        return fn({code: ERRCODE.PARAM_INVALID, msg: msg});
    }


    var logmsg = ' to get the adx audit users list in the system' ;
    mLogger.debug('Try ' + logmsg);

    if (param.sort) {
        param.sort = ADCONSTANTS.DATASORT.parse(param.sort);
    }

     mAsync.waterfall([
        //1. check total number of adx audit users in the system
        function(next) {
            var match = {
                adx_id: param.adx_id
            };
            var query = {
                match: match,
            };
            mAdxAuditUserModel.count(query, function(err, total) {
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
                return next(null, {total: 0, users: []});
            }
            var index = param.index || 0;
            var count = param.count || ADCONSTANTS.DEFAULTCOUNT;
            var offset = index * count;
            if (offset>=total) {
                mLogger.info('There is no more adx audit user in the system');
                return next(null, {total: total, users: []});
            }

            //2.1 create the sql statment
            var sqlstr = 'select * ' ;
            sqlstr += ' from ' + mAdxAuditUserModel.tableName;
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

            mAdxAuditUserModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                } else {
                    var user_ids = [];
                    for (var i = 0; i < rows.length; i++) {
                        user_ids.push(rows[i].user_id);
                    }
                    var sqlstr = 'SELECT user_id,user_name,qualification_name,site_name,site_url';
                    sqlstr += ' FROM ' + mDspAdUserModel.tableName;
                    sqlstr += ' WHERE user_id in(' + user_ids.join(',') + ');';
                    var query = {
                        sqlstr: sqlstr
                    };
                    mDspAdUserModel.query(query, function(err, res) {
                        if (err) {
                            next(err);
                        } else {
                            for (var i = 0; i < rows.length; i++) {
                                var user = rows[i];
                                for(var j = 0; j < res.length; j++) {
                                    if (user.user_id === res[j].user_id) {
                                        user.user_name = res[j].user_name;
                                        user.qualification_name = res[j].qualification_name;
                                        user.site_name = res[j].site_name;
                                        user.site_url = res[j].site_url;
                                        break;
                                    }
                                }
                            }
                            next(null, {total: total, users: rows});
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

