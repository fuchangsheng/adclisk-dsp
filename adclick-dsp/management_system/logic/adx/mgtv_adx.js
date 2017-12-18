 /*
 * @file  mgtv_adx.js
 * @description mang guo TV data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.14
 * @version 0.0.1 
 */

'use strict';
var MODULENAME = 'mgtv_adx.logic';

//system modules
var mDebug = require('debug')(MODULENAME);
var mExpress = require('express');
var mRouter = mExpress.Router();
var mAsync = require('async');
var mIs = require('is_js');
var mMoment = require('moment');
var request = require('request');

//models
var mAdxAuditIdeaModel = require('../../model/adlib_audit_ideas').create();
var mAdIdeaModel = require('../../model/adlib_ideas').create();
var mAdxModel = require('../../model/adlib_adx').create();
var mAdxPlanModel = require('../../model/adlib_plans').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

//private constants
var HOST = ADCONSTANTS.ADX_SERVER.MGTV_HOST;
var IDEAUPLOADURL = HOST + '/creative/upload';
var IDEAQUERYURL = HOST;

//adx config cache
var mConfig = null;
var ADXID = ADCONSTANTS.ADXLIST.ADX_MGTV.code;

var mGetMgtvConfig = function(fn) {
    if (mConfig) {
        return fn(null, mConfig);
    } else {
        var sqlStr = 'SELECT * FROM ' + mAdxModel.tableName;
        sqlStr += ' WHERE id = ' + ADXID;
        sqlStr += ';';
        var query = {
            sqlstr: sqlStr
        };
        mAdxModel.query(query, function(err, rows) {
            if (err) {
                fn(err);
            } else {
                if (!rows || rows.length === 0) {
                    var msg = 'There is no match data!';
                    mLogger.error(msg);
                    fn({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                } else {
                    var config = JSON.parse(rows[0].config);
                    mConfig = config.config;
                    fn(null, mConfig);
                }
            }
        });
    }
};

//upload idea
var mUploadIdea = function(param, fn) {
    var url = IDEAUPLOADURL;
    var ideas = param.ideas;
    var ideaId = ideas[0];

    var msg = ' to upload idea to mang guo TV for idea: ' + ideaId;
    mLogger.debug('Try' + msg);

    mAsync.waterfall([
        // 1.get idea information
        function(next) {
            var sqlStr = 'Select * From ' + mAdIdeaModel.tableName;
            sqlStr += ' Where idea_id = ' + ideaId + ';';
            var query = {
                sqlstr: sqlStr
            };
            mAdIdeaModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                } else {
                    if (!rows || rows.length === 0) {
                        var msg = 'There is no match data!';
                        mLogger.error(msg);
                        next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    } else {
                        next(null, rows[0]);
                    }
                }
            });
        },
        // 2.get end time
        function(args, next) {
            var planId = args.plan_id;
            var sqlstr = 'Select start_time from ' + mAdxPlanModel.tableName;
            sqlstr += ' where plan_id = ' + planId;
            sqlstr += ';';
            var query = {
                sqlStr: sqlstr
            };
            mAdxPlanModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                } else {
                    if (!rows || rows.length === 0) {
                        var fail_msg = 'There is no match data!';
                        mLogger.error(fail_msg);
                        next({code: ERRCODE.DB_NO_MATCH_DATA, msg: fail_msg});
                    } else {
                        args.start_time = rows[0].start_time;
                        next(null, args);
                    }
                }
            });
        },
        // 3.get adx config
        function(args, next) {
            var data = {
                idea: args
            };
            mGetMgtvConfig(function(err, conf) {
                if (err) {
                    next(err);
                } else {
                    data.config = conf;
                    next(null, data);
                }
            });
        },
        // 4.upload
        function(args, next) {
            var idea = args.idea;
            var conf = args.config;
            var assets = JSON.parse(idea.assets);
            var end_time = mMoment(idea.start_time).add(6, 'months').format('YYYY-MM-DD');
            var data = {
                dsp_id: conf.dsp_id,
                token: conf.token,
                name: assets.title,
                click_url: idea.landing_page,
                end_time: end_time
            };
            if (idea.idea_type === ADCONSTANTS.IDEATYPE.IMAGE.code) {
                data.url = assets.main_img.url;
                data.creative_type = 'image';
            } else if (idea.idea_type === ADCONSTANTS.IDEATYPE.IMAGETEXT.code) {
                data.url = assets.main_img.url;
                data.creative_type = 'image';
            } else if (idea.idea_type === ADCONSTANTS.IDEATYPE.VIDEO.code) {
                data.url = assets.video.url;
                data.creative_type = 'video';
                data.play_time = assets.video.duration;
                data.xy_ratio = assets.video.xy_ratio;
            } else {
                return next({code: ERRCODE.PARAM_INVALID, massage: '不支持的广告类型'});
            }

            request.post({url: url, form: data, json: true}, function(err, res, body) {
                if (err) {
                    next(err);
                } else {
                    if (res.statusCode === 200) {
                        next(null, body);
                    } else {
                        next({code: ERRCODE.REQUEST_FAILED, msg: '提交失败'});
                    }
                }
            });
        },
        // 5.update adx idea id
        function(data, next) {
            if (data.status === 0) {
                var update = {
                    adx_idea_id: data.id,
                    audit_status: ADCONSTANTS.AUDIT.UNCHECK.code
                };
                var match = {
                    idea_id: ideaId,
                    adx_id: ADXID
                };
                var query = {
                    update: update,
                    match: match
                };
                mAdxAuditIdeaModel.update(query, function(err, rows) {
                    if (err) {
                        next(err);
                    } else {
                        next(null);
                    }
                });
            } else {
                next({code:ERRCODE.REQUEST_FAILED, massage: data.msg});
            }
        }
    ], function(err) {
        if (err) {
            mLogger.error('Failed ' + msg);
            fn(err);
        } else {
            mLogger.debug('Success ' + msg);
            fn(null);
        }
    });
};

//audit query 
var mIdeaAuditQuery = function(param, fn) {
    var url = IDEAQUERYURL;
    var ids = param.ideas;
    var ideaId = ids[0];

    var msg = ' to query idea audit status to mang guo TV for idea: ' + ideaId;
    mLogger.debug('Try' + msg);

    mAsync.waterfall([
        // 1.get adx idea id
        function(next) {
            var select = {
                adx_idea_id: 1
            };
            var match = {
                idea_id: ideaId,
                adx_id: ADXID
            };
            var query = {
                select: select,
                match: match
            };
            mAdxAuditIdeaModel.lookup(query, function(err, rows) {
                if (err) {
                    next(err);
                } else {
                    if (!rows || rows.length === 0) {
                        var msg = 'There is no match data!';
                        mLogger.error(msg);
                        next({code: ERRCODE.DB_NO_MATCH_DATA, msg: msg});
                    } else {
                        next(null, rows[0]);
                    }
                }
            });
        },
        // 2.get dsp_id and token
        function(args, next) {
            var data = {
                idea: args
            };
            mGetMgtvConfig(function(err, conf) {
                if (err) {
                    next(err);
                } else {
                    data.config = conf;
                    next(null, data);
                }
            });
        },
        // 3.query audit status from mang guo TV
        function(args, next) {
            var idea = args.idea;
            var conf = args.config;
            var path = '/creative/' + idea.adx_idea_id + '/info';
            var target = url + path;
            var data = {
                dsp_id: conf.dsp_id,
                token: conf.token
            };
            request.post({url: target, form: data, json: true}, function(err, res, body) {
                if (err) {
                    next(err);
                } else {
                    if (res.statusCode !== 200) {
                        next({code: ERRCODE.REQUEST_FAILED, msg: '查询失败'});
                    } else {
                        next(null, body);
                    }
                }
            });
        },
        // 4.update audit status
        function(args, next) {
            if (args.status === 0) {
                if (args.data.status === 1) {
                    var update = {
                        audit_status: ADCONSTANTS.AUDIT.PASS.code
                    };
                    var match = {
                        idea_id: ideaId,
                        adx_id: ADXID
                    };
                    var query = {
                        update: update,
                        match: match
                    };
                    mAdxAuditIdeaModel.update(query, function(err, rows) {
                        if (err) {
                            next(err);
                        } else {
                            next(null, {audit_status: ADCONSTANTS.AUDIT.PASS.name});
                        }
                    });
                } else if (args.data.status === -1) {
                    var update = {
                        audit_status: ADCONSTANTS.AUDIT.FAILED.code,
                        failure_message: args.data.remark
                    };
                    var match = {
                        idea_id: ideaId,
                        adx_id: ADXID
                    };
                    var query = {
                        update: update,
                        match: match
                    };
                    mAdxAuditIdeaModel.update(query, function(err, rows) {
                        if (err) {
                            next(err);
                        } else {
                            next(null, {audit_status: ADCONSTANTS.AUDIT.FAILED.name});
                        }
                    });
                } else {
                    next(null, {audit_status: ADCONSTANTS.AUDIT.UNCHECK.name});
                }
            } else {
                next({code: ERRCODE.REQUEST_FAILED, msg: args.msg});
            }
        }
    ], function(err, result) {
        if (err) {
            mLogger.error('Failed ' + msg);
            fn(err);
        } else {
            mLogger.debug('Success ' + msg);
            fn(null, result);
        }
    });
};

//process user upload req
var mUploadUser = function(param, fn) {
    return fn({code: ERRCODE.REQUEST_INVALID, msg: '无此上传接口，请向其他ADX请求！'});
};

//process user audit query req
var mUserAuditQuery = function(param, fn) {
    return fn({code: ERRCODE.REQUEST_INVALID, msg: '无此上传接口，请向其他ADX请求！'});
};

module.exports.ideaSubmitRouter = mUploadIdea;
module.exports.ideaAuditQuery = mIdeaAuditQuery;
module.exports.userAuditQuery = mUserAuditQuery;
module.exports.userSubmitRouter = mUploadUser;