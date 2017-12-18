 /*
 * @file  mgtv_adx.js
 * @description mang guo TV data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.14
 * @version 0.0.1 
 */

'use strict';
var MODULENAME = 'adswitch_adx.logic';

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
var mDspAdUserModel = require('../../model/dsp_aduser').create();
var mAdxAuditUserModel = require('../../model/adlib_audit_users').create();

//utils
var mLogger = require('../../../utils/logger')(MODULENAME);
var mDataHelper = require('../../../utils/data_helper');
var mUtils = require('../../../utils/utils');

//common constants
var ERRCODE = require('../../../common/errCode');
var ADCONSTANTS = require('../../../common/adConstants');

//private constants
var headers = {
    'Content-type': 'application/json'
};
var HOST = ADCONSTANTS.ADX_SERVER.AD_SWITCH;
var USERUPLOADURL = HOST + '/advertiser/add';
var USERUPDATEURL = HOST + '/advertiser/update';
var USERQUERYURL = HOST + '/advertiser/status';
var IDEAUPLOADURL = HOST + '/creative/add';
var IDEAUPDATEURL = HOST + '/creative/update';
var IDEAQUERYURL = HOST + '/creative/status';

//adx config cache
var mConfig = null;
var ADXID = ADCONSTANTS.ADXLIST.AD_SWITCH.code;

var mGetAdSWitchConfig = function(fn) {
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

var adSwitchIndustryMap = function(subcat_id){
    var map = {
        5101: 1709011,//安全安保
        5102: 1709021,
        5103: 1709031,
        5104: 1709041,
        5105: 1709051,
        5106: 1709061,
        5201: 1710011,//办公文教
        5202: 1710021,
        5203: 1710031,
        5301: 1204231,//彩票
        5401: 1707143,//物流快递
        5402: 1707143,
        5403: 1707143,
        5404: 1707143,
        5405: 1707143,
        5501: 1207011,//成人用品
        5601: 1801101,//出版传媒
        5602: 1801121,
        5603: 1801131,
        5701: 1502091,//电脑硬件
        5702: 1502123,
        5703: 1502101,
        5704: 1502161,
        5801: 1702011,//电子电工
        5802: 1702021,
        5803: 1702031,
        5804: 1702041,
        5805: 1702051,
        5806: 1702061,//
        5901: 1309013,//房地产装修
        5902: 1309023,
        5903: 1308071,
        5904: 1309043,
        5905: 1309043,
        6001: 1501011,//分类平台
        6002: 1501021,
        6003: 1501031,
        6004: 1501041,
        6005: 1501051,
        6006: 1501061,
        6007: 1501071,
        6101: 1101013,//服装鞋帽 1101
        6102: 1102023,//         1102
        6103: 1101113,
        6201: 1103013,//箱包饰品 1103
        6202: 1104013,//         1104
        6301: 1704011,//化工原料
        6302: 1704021,
        6303: 1704031,
        6304: 1704041,
        6305: 1704051,
        6306: 1704061,
        6307: 1704071,
        6401: 1703011,//机械设备
        6402: 1703021,
        6403: 1703031,
        6404: 1703041,
        6405: 1703051,
        6406: 1703061,
        6407: 1703071,
        6408: 1703081,
        6409: 1703091,
        6410: 1703101,
        6411: 1703111,
        6412: 1703121,
        6413: 1703131,
        6414: 1703141,
        6415: 1703151,
        6416: 1703161,
        6417: 1703171,
        6418: 1703181,
        6419: 1703191,
        6420: 1703201,
        6421: 1703211,
        6422: 1703221,
        6423: 1703231,
        6424: 1703241,
        6501: 1305011,//家庭日用品
        6502: 1305021,
        6503: 1305031,
        6504: 1306011,
        6601: 1302023,//家用电器
        6602: 1302053,
        6603: 1302063,
        6604: 1302043,
        6605: 1302013,
        6701: 2401011,//教育培训
        6702: 2401043,
        6703: 2401053,
        6704: 2401263,
        6705: 2401263,
        6706: 2401172,
        6707: 2401203,
        6708: 2401191,
        6709: 2401221,
        6710: 2401153,
        6801: 1711033,//节能环保
        6802: 1711023,
        6803: 1711013,
        6901: 1204203,//金融服务
        6902: 1204141,
        6903: 1204193,
        6904: 1204243,
        6905: 1204081,
        7001: 1306041,//礼品
        7101: 1602011,//旅游住宿 16
        7102: 1603013,
        7103: 1604013, //1604
        7201: 1206013,//美容美妆
        7202: 1206033,
        7301: 1206121,//母婴护理
        7401: 1701093,//农林牧渔
        7402: 1701103,
        7403: 1701103,
        7404: 1701063,
        7405: 1701013,
        7406: 1701021,
        7501: 1504023,//软件 1504
        7502: 1503011,
        7503: 1503021,
        7504: 1503031,
        7505: 1503041,
        7506: 1503051,
        7507: 1503061,
        7508: 1503071,
        7509: 1503081,
        7510: 1503091,
        7601: 1707231,//商务服务
        7602: 1707083,
        7603: 1707221,
        7604: 1707051,
        7605: 1707041,
        7606: 1707063,
        7607: 1707103,
        7608: 1707241,
        7609: 1707251,
        7610: 1707151,
        7611: 1707023,
        7612: 1707291,
        7613: 1707261,
        7701: 1308011,//生活服务
        7702: 1308081,
        7703: 1308181,
        7704: 1308063,
        7705: 1308221,
        7706: 1308121,
        7707: 1308141,
        7708: 1308221,
        7801: 2003031,//食品保健品
        7802: 2003011,
        7803: 2002063, //2002
        7805: 2002013,
        7806: 2003141,
        7901: 1502013,//手机数码
        7902: 1502171,
        8101: 1501181,//网络服务
        8102: 1501151,
        8201: 2202303,//医疗服务
        8202: 2202313,
        8203: 2204061,
        8204: 2206061,
        8205: 2203033,
        8206: 2206071,
        8207: 2206051,
        8208: 2205011,
        8209: 2205031,
        8301: 2302011,//游戏
        8302: 2302021,
        8303: 2302031,
        8401: 2102031,//运动休闲娱乐
        8501: 1706011,//招商加盟
        8502: 1706021,
        8503: 1706031,
        8504: 1706041,
        8505: 1706051,
        8506: 1706061,
        8507: 1706071,
        8508: 1706081,
        8509: 1706091,
        8510: 1706101,
        8511: 1706111,
        8512: 1706121,
        8601: 1802081,//学术公管社会组织
        8701: 1802011,//国际组织
    };
    if(map[subcat_id]){
        return map[subcat_id];
    }else{
        return 2501013;
    }  
};

var adSwitchCategoryMap = function(cate_id){
    if(cate_id == 83){
        return 50003;//game
    }else if(cate_id == 60){
        return 50002;//electronic commerce
    }else{
        return 50004;
    }
};

// package idea
var packageIdea = function(originCreative, adx_id) {
    var creative = {};
    if(originCreative.adx_idea_id){
        creative.CreativeId = parseInt(originCreative.adx_idea_id);
    }
    creative.OCreativeId = originCreative.audit_idea_id.toString(); //idea id in adclick dsp audit table
    creative.AdvertiserId = originCreative.adx_user_id;//adx user id
    creative.TargetUrl = originCreative.landing_page; 
    creative.AdxIds = [adx_id];
    creative.DestinationUrl = [originCreative.landing_page];
    if(originCreative.imp_monitor_urls){
        creative.MonitorUrls = originCreative.imp_monitor_urls.split(" ");
    }
    if(originCreative.click_monitor_urls){
        creative.TargetTrack = originCreative.click_monitor_urls.split(" ");
    }
    var assets = JSON.parse(originCreative.assets);
    if(originCreative.idea_type == ADCONSTANTS.IDEATYPE.IMAGE.code){
        creative.Type = 1; //图片
        creative.CreativeUrl = assets.main_img.url;
        creative.Height = assets.main_img.h;
        creative.Width = assets.main_img.w;
    }else if(originCreative.idea_type == ADCONSTANTS.IDEATYPE.FLASH.code){
        creative.Type = 2;//flash
        creative.CreativeUrl = assets.flash.url;
        creative.Height = assets.flash.h;
        creative.Width = assets.flash.w;
    }else if(originCreative.idea_type == ADCONSTANTS.IDEATYPE.VIDEO.code){
        creative.Type = 3;//视频
        creative.CreativeUrl = assets.video.url;
        creative.Height = assets.video.h;
        creative.Width = assets.video.w;
    }else if(originCreative.idea_type == ADCONSTANTS.IDEATYPE.IMAGETEXT.code){
        creative.Type = 5;//原生（图文）
        creative.CreativeUrl = assets.main_img.url;
        creative.Height = assets.main_img.h;
        creative.Width = assets.main_img.w;
        if(adx_id = ADCONSTANTS.AD_SWITCH_ADX_LIST.AD_SWITCH_TENCENT.code){//only support 150*120
            return {package_msg: "提交失败，请检查adx是否支持广告类型"};
        }else if(adx_id == ADCONSTANTS.AD_SWITCH_ADX_LIST.AD_SWITCH_JD.code){
            return {package_msg: "提交失败，请检查adx是否支持广告类型"};
        }else{
            return {package_msg: "提交失败，请检查adx是否支持广告类型"};
        }
    }else{
        return {package_msg: "提交失败，请检查adx是否支持广告类型"};
    }
    return creative;
};

//json exception process
var mJsonParse = function(body) {
    var data = null;
    try {
        data = JSON.parse(body);
    } catch (e) {
        mLogger.error(e);
        data = false;
    }
    return data;
}; 

//upload idea
var mUploadIdea = function(param, fn) {
    var url = '';
    var ideaList = param.ideas;
    var adx_id = param.adx_id;
    var adx_template_name = ADCONSTANTS.ADXLIST.format(adx_id);
    var adx_template_id = ADCONSTANTS.AD_SWITCH_ADX_LIST.parse(adx_template_name);

    var msg = ' to upload ideas to ad switch!';
    mLogger.debug('Try' + msg);

    mAsync.waterfall([
        //1.get information of idea
        function(next) {
            var sqlstr = 'SELECT * from ' + mAdIdeaModel.tableName;
            sqlstr += ' WHERE idea_id = ' + ideaList[0];
            var query = {
                sqlstr: sqlstr
            };
            mAdIdeaModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                } else {
                    next(null, rows[0]);
                }
            });
        },
        //2.get ad switch adx configuration
        function(args, next) {
            mGetAdSWitchConfig(function(err, conf) {
                if (err) {
                    next(err);
                } else {
                    next(null, {ideas: args, conf: conf});
                }
            });
        },
        //3.get user name which may be used in some template like 20009
        function(args, next) {
            var sqlstr = "select user_name from " + mDspAdUserModel.tableName;
            sqlstr += " Where user_id = " + args.ideas.user_id;
            var query = {
                sqlstr: sqlstr
            };
            mDspAdUserModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                } else {
                    args.ideas.user_name = rows[0].user_name + '_' + adx_id;
                    next(null, args);
                }
            });
        },
        //4.get adx_user_id
        function(args, next){
            var sqlstr = "select adx_user_id, audit_status from " + mAdxAuditUserModel.tableName;
            sqlstr += " WHERE adx_id = " + adx_id;
            sqlstr += " AND user_id = " + args.ideas.user_id;
            var query = {
                sqlstr: sqlstr
            };
            mAdxAuditUserModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                } else {
                    if(rows.length && rows[0].adx_user_id && rows[0].audit_status === 0){
                        args.ideas.adx_user_id = rows[0].adx_user_id;
                        next(null, args);
                    }else{
                        next({code: ERRCODE.REQUEST_FAILED, msg: '请先提交该广告主，并等待审核通过'});
                    }
                }
            });
        },
        //5.get audit idea id
        function(args, next){
            var sqlstr = "select id, adx_idea_id from " + mAdxAuditIdeaModel.tableName;
            sqlstr += " WHERE adx_id = " + adx_id;
            sqlstr += " AND idea_id = " + args.ideas.idea_id;
            var query = {
                sqlstr: sqlstr
            };
            mAdxAuditUserModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                } else {
                    if(rows[0].adx_idea_id){
                        url = IDEAUPDATEURL;
                        args.ideas.adx_idea_id = rows[0].adx_idea_id;
                    }else{
                        url = IDEAUPLOADURL;
                    }
                    args.ideas.audit_idea_id = parseInt(adx_id.toString() + ideaList[0].toString());//rows[0].id;
                    next(null, args);
                }
            });
        },
        //6.do upload or update
        function(args, next) {
            var ideas = args.ideas;
            var conf = args.conf;
            var creatives = [];
            var creative = packageIdea(ideas, adx_template_id);
            if(creative.package_msg){
                return next({code: ERRCODE.PARAM_INVALID, msg: creative.package_msg});
            }else{
                creatives.push(creative);
            }
            
            if (creatives.length === 0) {
                next({code: ERRCODE.PARAM_INVALID, msg: '提交失败，请检查adx是否支持广告类型。'});
            } else {
                var authHeader = {
                    dspId: parseInt(conf.dsp_id),
                    token: conf.token
                };
                var data = {
                    authHeader: authHeader,
                    request: creatives
                };
                var strBody = JSON.stringify(data);
                var option = {
                    url: url,
                    method: 'POST',
                    headers: headers,
                    body: strBody
                };

                request(option, function(err, res, body) {
                    if (err) {
                        next(err);
                    } else {
                        if (res.statusCode === 200) {
                            var jsonBody = mJsonParse(body);
                            if ( jsonBody) {
                                next(null, jsonBody);
                            } else {
                                next({code: ERRCODE.DATA_INVALID, msg: '返回JSON解析错误！'});
                            }
                        } else {
                            next({code: ERRCODE.REQUEST_FAILED, msg: '提交失败'});
                        }
                    }
                });
            } 
        },
        //5.update upload status
        function(resBody, next) {
            if (resBody.errCode === 0) {
                var result = resBody.result;
                var idea_id = [];
                for(var k in result){
                    idea_id.push(k);
                }
                var idea_result = result[idea_id[0]];
                var check_status = '';
                if(idea_result.msg && !idea_result.result){
                    check_status = ADCONSTANTS.AUDIT.FAILED.code;
                }else{
                    check_status = ADCONSTANTS.AUDIT.UNCHECK.code;
                }
                var sqlstr = 'UPDATE ' + mAdxAuditIdeaModel.tableName;
                sqlstr += ' SET audit_status = ' + check_status;
                if(idea_result.result){
                    sqlstr += ' ,adx_idea_id = ' + idea_result.result.CreativeId;
                }
                if(idea_result.msg){
                    sqlstr += ' ,failure_message = "' + idea_result.msg + '"';
                }
                sqlstr += ' WHERE adx_id = ' + adx_id;
                sqlstr += ' AND idea_id in(' + ideaList.join(',');
                sqlstr += ');';
                var query = {
                    sqlstr: sqlstr
                };
                mAdxAuditIdeaModel.query(query, function(err, rows) {
                    if (err) {
                        next(err);
                    } else {
                        next(null);
                    }
                });
            } else {
                 next({code:ERRCODE.REQUEST_FAILED, massage: 'Request Failed!'});
            }
        },
    ], function(err) {
        if (err) {
            fn(err);
        } else {
            fn(null);
        }
    });
};

//audit query 
var mIdeaAuditQuery = function(param, fn) {
    var url = IDEAQUERYURL;
    var ids = param.ideas;
    var adx_id = param.adx_id;
    var ideaId = ids[0];

    var msg = ' to query idea audit status to ad switch for idea: ' + ideaId;
    mLogger.debug('Try' + msg);

    mAsync.waterfall([
        // 1.get adx idea id
        function(next) {
            var select = {
                id: 1,
                adx_idea_id: 1
            };
            var match = {
                idea_id: ideaId,
                adx_id: adx_id,
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
            var idea = [];
            idea.push(args.id);
            var data = {
                idea: idea
            };
            mGetAdSWitchConfig(function(err, conf) {
                if (err) {
                    next(err);
                } else {
                    data.config = conf;
                    next(null, data);
                }
            });
        },
        // 3.query audit status from ad switch
        function(args, next) {
            var authHeader = {
                dspId: parseInt(args.config.dsp_id),
                token: args.config.token
            };
            var creative_ids = {
                OCreativeIds: [adx_id.toString()+ideaId.toString()]
            };
            var data = {
                request: creative_ids,
                authHeader: authHeader
            };
            var option = {
                url: url,
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            };

            request(option, function(err, res, body) {
                if (err) {
                    next(err);
                } else {
                    if (res.statusCode === 200) {
                        mLogger.debug('Bes response: ' + body);
                        var jsonBody = mJsonParse(body);
                        if ( jsonBody) {
                            next(null, jsonBody);
                        } else {
                            next({code: ERRCODE.DATA_INVALID, msg: '返回JSON解析错误！'});
                        }
                    } else {
                        next({code:ERRCODE.REQUEST_FAILED, massage: 'Request Failed!'});
                    }
                }
            });
        },
        // 4.update audit status
        function(args, next) {
            if (args.errCode === 0) {
                var audit_status = args.result[adx_id.toString()+ideaId.toString()].result[0].Status;// -2: 不通过 -1: 审核中 0:待审核 1:审核通过
                var fail_msg = '';
                if(audit_status == -2){
                    audit_status = ADCONSTANTS.AUDIT.FAILED.code;
                    fail_msg = args.result[0].Status.Info;
                }else if(audit_status == -1 || audit_status == 0){
                    audit_status = ADCONSTANTS.AUDIT.UNCHECK.code;
                }else if(audit_status == 1){
                    audit_status = ADCONSTANTS.AUDIT.PASS.code;
                }else{
                    next(null);
                }
                var sqlstr = 'UPDATE ' + mAdxAuditIdeaModel.tableName;
                sqlstr += ' SET audit_status = ' + audit_status;
                sqlstr += ' ,failure_message = "' + fail_msg + '"';
                sqlstr += ' WHERE adx_id = ' + adx_id;
                sqlstr += ' AND idea_id = ' + ideaId;
                var query = {
                    sqlstr: sqlstr
                };
                mAdxAuditIdeaModel.query(query, function(err, rows) {
                    if (err) {
                        next(err);
                    } else {
                        next(null);
                    }
                });
                
            }  else {
                next({code:ERRCODE.REQUEST_FAILED, massage: 'Request Failed!'});
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
    var url = '';
    var users = param.users;
    var adx_id = param.adx_id;
    var adx_template_name = ADCONSTANTS.ADXLIST.format(adx_id);
    var adx_template_id = ADCONSTANTS.AD_SWITCH_ADX_LIST.parse(adx_template_name);

    var msg = ' to upload advertiser to AD_SWITCH...';
    mLogger.debug('Try' + msg);

    mAsync.waterfall([
        //1.get advertiser info
        function(next){
            mAsync.map(users, function(user_id, cb) {
                var sqlStr = 'Select * from ' + mDspAdUserModel.tableName;
                sqlStr += ' Where user_id = ' + user_id;
                sqlStr += ';';
                var query = {
                    sqlStr: sqlStr
                };
                mDspAdUserModel.query(query, function(err, rows) {
                    if (err) {
                        cb(err);
                    } else {
                        if (rows && rows.length !== 0) {
                            var data = rows[0];
                            cb(null, data);
                        } else {
                            mLogger.error('There is no information for user: ' + user_id);
                            cb(null);
                        } 
                    }
                });
            }, function(err, res) {
                if (err) {
                    next(err);
                } else {
                    next(null, res);
                }
            });
        },
        // 2.get adx configuration
        function(data, next) {
            mGetAdSWitchConfig(function(err, conf) {
                if (err) {
                    next(err);
                } else {
                    next(null, {users: data, conf: conf});
                }
            });
        },
        // 3.checkout upload or update
        function(data, next) {
            var sqlStr = 'Select adx_user_id, adx_qual_id from ' + mAdxAuditUserModel.tableName;
            sqlStr += ' Where adx_id = ' + adx_id;
            sqlStr += ' and user_id = ' + users[0];
            var query = {
                sqlStr: sqlStr
            };
            mAdxAuditUserModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                } else {
                    if(rows[0].adx_user_id){
                        url = USERUPDATEURL;
                        data.users[0].adx_qual_id = rows[0].adx_qual_id;
                    }else{
                        url = USERUPLOADURL;
                    }
                    next(null, data);
                }
            });

        },
        // 3.do upload or update
        function(data, next) {
            var conf = data.conf;
            var userList = data.users;
            var advertisers = [];
            for (var i = 0; i < userList.length; i++) {
                var user = {
                    UserName: userList[i].user_name + '_' + adx_id,
                    SiteName: userList[i].site_name,
                    Industry: adSwitchIndustryMap(userList[i].subcategories),//industry map to complete
                    Category: adSwitchCategoryMap(userList[i].categories),//category map to complete
                };
                if (userList[i].site_url && userList[i].site_url.length !== 0) {
                    var site_url = null;
                    if (mIs.startWith(userList[i].site_url, 'http://') || mIs.startWith(userList[i].site_url, 'https://')) {
                        site_url = userList[i].site_url;
                    } else {
                        site_url = 'http://' + userList[i].site_url;
                    }
                    user.SiteUrl = site_url;
                }
                var qualifications = [];
                var qualification = {
                    Name: userList[i].qualification_name,
                    TypeId: 1001,
                    Image: userList[i].qualification
                };
                if(url == USERUPDATEURL){
                    user.AdvertiserId = userList[i].adx_user_id;
                    qualification.QId = userList[i].adx_qual_id;
                }
                qualifications.push(qualification);
                user.Qualifications = qualifications;
                if(url == USERUPLOADURL){
                    user.Meno = "新加";
                }else{
                    user.Meno = "编辑广告主信息";
                }

                //set template id
                user.AdxIds = [adx_template_id];
                
                advertisers.push(user);
            }
            var authHeader = {
                dspId: parseInt(conf.dsp_id),
                token: conf.token
            };
            var reqData = {
                authHeader: authHeader,
                request: advertisers
            };
            var option = {
                url: url,
                method: 'POST',
                headers: headers,
                body: JSON.stringify(reqData)
            };

            request(option, function(err, res, body) {
                if (err) {
                    next(err);
                } else {
                    if (res.statusCode !== 200) {
                        next({code: ERRCODE.REQUEST_FAILED, msg: '请求失败'});
                    } else {
                        var jsonBody = mJsonParse(body);
                        if ( jsonBody) {
                            next(null, jsonBody);
                        } else {
                            next({code: ERRCODE.DATA_INVALID, msg: '返回JSON解析错误！'});
                        }
                    }
                }
            });
        },
        // 4.update check status
        function(resBody, next) {
            if (resBody.errCode === 0) {
                var result = resBody.result;
                var user_name = [];
                for(var k in result){
                    user_name.push(k);
                }
                var user_result = result[user_name[0]];
                var check_status = '';
                if(user_result.msg && !user_result.result){
                    check_status = ADCONSTANTS.AUDIT.FAILED.code;
                }else{
                    check_status = ADCONSTANTS.AUDIT.UNCHECK.code;
                }
                var sqlstr = 'UPDATE ' + mAdxAuditUserModel.tableName;
                sqlstr += ' SET audit_status = ' + check_status;
                if(user_result.result){
                    sqlstr += ' ,adx_user_id = ' + user_result.result.AdvertiserId;
                    sqlstr += ' ,adx_qual_id = ' + user_result.result.Qualifications[0].QId;
                }
                if(user_result.msg){
                    sqlstr +=' ,failure_message = "' + user_result.msg + '"';
                }
                sqlstr += ' WHERE adx_id = ' + adx_id;
                sqlstr += ' AND user_id in(' + users.join(',');
                sqlstr += ');';
                var query = {
                    sqlstr: sqlstr
                };
                mAdxAuditUserModel.query(query, function(err, rows) {
                    if (err) {
                        next(err);
                    } else {
                        next(null);
                    }
                });
            } else {
                next({code:ERRCODE.REQUEST_FAILED, massage: 'Request Failed!'});
            }
        }
    ], function(err){
        if(err){
            mLogger.error('Failed' + msg);
            fn(err);
        }else{
            fn(null);
        }
    });
};

//process user audit query(query by id) req
var mUserAuditQuery = function(param, fn) {
    var url = USERQUERYURL;
    var userList = param.users;
    var adx_id = param.adx_id;

    var msg = ' to query user audit status from ad switch by id!';
    mLogger.debug('Try' + msg);

    mAsync.waterfall([
        // 1.get ad_switch adx configuration
        function(next) {
            mGetAdSWitchConfig(function(err, conf) {
                if (err) {
                    next(err);
                } else {
                    next(null, conf);
                }
            });
        },
        //2.get adx_idea_id
        function(config, next){
            var adx_user_list = [];
            var sqlstr = "select adx_user_id from " + mAdxAuditUserModel.tableName;
            sqlstr += " WHERE adx_id = " + adx_id;
            sqlstr += " AND user_id = " + userList[0];
            var query = {
                sqlstr: sqlstr
            };
            mAdxAuditUserModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                } else {
                    adx_user_list.push(rows[0].adx_user_id);
                    next(null, {config: config, userList: adx_user_list});
                }
            });
        },
        // 2.query audit status from bes
        function(data, next) {
            var authHeader = {
                dspId: parseInt(data.config.dsp_id),
                token: data.config.token
            };
            var advertiser_ids = {
                advertiserIds: data.userList
            };
            var data = {
                request: advertiser_ids,
                authHeader: authHeader
            };
            var option = {
                url: url,
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            };

            request(option, function(err, res, body) {
                if (err) {
                    next(err);
                } else {
                    if (res.statusCode === 200) {
                        mLogger.debug('Ad Switch response: ' + body);
                        var jsonBody = mJsonParse(body);
                        if ( jsonBody) {
                            next(null, jsonBody);
                        } else {
                            next({code: ERRCODE.DATA_INVALID, msg: '返回JSON解析错误！'});
                        }
                    } else {
                        next({code:ERRCODE.REQUEST_FAILED, massage: 'Request Failed!'});
                    }
                }
            });
        },
        // 3.update audit status
        function(resBody, next) {
            if (resBody.errCode === 0) {
                var audit_status = resBody.result[0].Status[0].Status;// -2: 不通过 -1: 审核中 0:待审核 1:审核通过
                var fail_msg = '';
                if(audit_status == -2){
                    audit_status = ADCONSTANTS.AUDIT.FAILED.code;
                    fail_msg = resBody.result[0].Status[0].Info;
                }else if(audit_status == -1 || audit_status == 0){
                    audit_status = ADCONSTANTS.AUDIT.UNCHECK.code;
                }else if(audit_status == 1){
                    audit_status = ADCONSTANTS.AUDIT.PASS.code;
                }else{
                    next(null);
                }
                var sqlstr = 'UPDATE ' + mAdxAuditUserModel.tableName;
                sqlstr += ' SET audit_status = ' + audit_status;
                sqlstr += ' ,failure_message = "' + fail_msg + '"';
                sqlstr += ' WHERE adx_id = ' + adx_id;
                sqlstr += ' AND user_id = ' + userList[0];
                var query = {
                    sqlstr: sqlstr
                };
                mAdxAuditUserModel.query(query, function(err, rows) {
                    if (err) {
                        next(err);
                    } else {
                        next(null);
                    }
                });
                
            }  else {
                next({code:ERRCODE.REQUEST_FAILED, massage: 'Request Failed!'});
            }
        }
    ], function(err) {
        if (err) {
            mLogger.error('Failed' + msg);
            fn(err);
        } else {
            mLogger.debug('Success' + msg);
            fn(null, {});
        }
    });
};

module.exports.ideaSubmitRouter = mUploadIdea;
module.exports.ideaAuditQuery = mIdeaAuditQuery;
module.exports.userSubmitRouter = mUploadUser;
module.exports.userAuditQuery = mUserAuditQuery;