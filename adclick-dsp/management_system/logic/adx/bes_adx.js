/*
 * @file  bes_adx.js
 * @description baidu bes adx data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.18
 * @version 0.0.1 
 */

'use strict';
var MODULENAME = 'bes_adx.logic';

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
var base64 = require('base-64');
var ADXID = ADCONSTANTS.ADXLIST.BES.code;
var headers = {
    'Content-type': 'application/json'
};
var HOST = ADCONSTANTS.ADX_SERVER.BES_HOST;
var UPLOADUSERURL = HOST + '/v1/advertiser/add';
var UPDATEUSERURL = HOST + '/v1/advertiser/update';
var USERQUERYALLURL = HOST + '/v1/advertiser/getAll';
var USERQUERYURL = HOST + '/v1/advertiser/get';
var UPLOADIDEAURL = HOST + '/v1/creative/add';
var UPDATEIDEAURL = HOST + '/v1/creative/update';
var IDEAQUERYALLURL = HOST + '/v1/creative/getAll';
var IDEAQUERYURL = HOST + '/v1/creative/get';
var UPLOADLICENCEURL = HOST + '/v1/advertiser/uploadQualification';
var UPDATEMAINLICENCEURL = HOST + '/v1/advertiser/updateMainQualification';
var LICENCEQUERYURL = HOST + '/v1/advertiser/queryQualificationInfo';

//adx config cache
var mConfig = null;
var mGetBesConfig = function(fn) {
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
                    mConfig = config;
                    fn(null, mConfig);
                }
            }
        });
    }
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

// package idea
var packageIdea = function(originCreative) {
    var creative = {};
    creative.creativeId = originCreative.idea_id;
    var assets = JSON.parse(originCreative.assets);
    if (originCreative.idea_type === ADCONSTANTS.IDEATYPE.VIDEO.code) {
        creative.adview_type = 3;
        creative.type = 3;
        creative.creativeUrl = assets.video.url;
        creative.height = assets.video.h;
        creative.width = assets.video.w;
        creative.duration = assets.video.duration;
        creative.dataRate = 270;
    } else {
        if (originCreative.adview_type === ADCONSTANTS.ADVIEWTYPE.WEB.code) {
            creative.adviewType = 1;
            switch(originCreative.idea_type) {
                case ADCONSTANTS.IDEATYPE.IMAGE.code:
                    creative.type = 1;
                    creative.creativeUrl = assets.main_img.url;
                    creative.height = assets.main_img.h;
                    creative.width = assets.main_img.w;
                    break;
                case ADCONSTANTS.IDEATYPE.FLASH.code:
                    creative.creativeUrl = assets.flash.url;
                    creative.type = 2;
                    creative.height = assets.flash.h;
                    creative.width = assets.flash.w;
                    break;
                /* native idea
                case ADCONSTANTS.IDEATYPE.NATIVE.code:
                    creative.style = 1;
                    creative.type = 4;
                    creative.descrition = assets.desc;
                    var urls = [];
                    urls.push(assets.icon_img.url);
                    urls.push(assets.logo_img.url);
                    urls.push(assets.main_img.url);    
                    creative.creativeUrls = urls;    //创意url列表               
                    creative.height = assets.main_img.h;
                    creative.width = assets.main_img.w;
                    break;
                */
                case ADCONSTANTS.IDEATYPE.IMAGETEXT.code:
                    creative.style = 1;
                    creative.type = 4;
                    creative.creativeUrl = assets.main_img.url;
                    creative.descrition = assets.desc;
                    creative.height = assets.main_img.h;
                    creative.width = assets.main_img.w;
                    creative.title = assets.title;
                    break;
                default:
                    return false;
            }
        } else if (originCreative.adview_type === ADCONSTANTS.ADVIEWTYPE.WAP.code) {
            creative.adviewType = 1;
            switch(originCreative.idea_type) {
                case ADCONSTANTS.IDEATYPE.IMAGE.code:
                    creative.type = 1;
                    creative.creativeUrl = assets.main_img.url;
                    creative.height = assets.main_img.h;
                    creative.width = assets.main_img.w;
                    break;
                case ADCONSTANTS.IDEATYPE.FLASH.code:
                    creative.creativeUrl = assets.flash.url;
                    creative.type = 2;
                    creative.height = assets.flash.h;
                    creative.width = assets.flash.w;
                    break;
                /* native idea
                case ADCONSTANTS.IDEATYPE.NATIVE.code:
                    creative.style = 3;
                    creative.type = 4;
                    creative.descrition = assets.desc;
                    var urls = [];
                    urls.push(assets.icon_img.url);
                    urls.push(assets.logo_img.url);
                    urls.push(assets.main_img.url);    
                    creative.creativeUrls = urls;    //创意url列表  
                    creative.height = assets.main_img.h;
                    creative.width = assets.main_img.w;
                    break;
                */
                case ADCONSTANTS.IDEATYPE.IMAGETEXT.code:
                    creative.style = 3;
                    creative.type = 4;
                    creative.creativeUrl = assets.main_img.url;
                    creative.descrition = assets.desc;
                    creative.height = assets.main_img.h;
                    creative.width = assets.main_img.w;
                    creative.title = assets.title;
                    break;
                default:
                    return false;
            }
        } else if (originCreative.adview_type === ADCONSTANTS.ADVIEWTYPE.APP.code) {
            creative.adviewType = 2;
            creative.interactiveStyle = 0;
            switch(originCreative.idea_type) {
                case ADCONSTANTS.IDEATYPE.IMAGE.code:
                    creative.creativeUrl = assets.main_img.url;
                    creative.type = 1;
                    creative.height = assets.main_img.h;
                    creative.width = assets.main_img.w;
                    break;
                /* native idea
                case ADCONSTANTS.IDEATYPE.NATIVE.code:
                    creative.type = 4;
                    creative.style = 5;
                    creative.descrition = assets.desc;
                    var urls = [];
                    urls.push(assets.icon_img.url);
                    urls.push(assets.logo_img.url);
                    urls.push(assets.main_img.url);    
                    creative.creativeUrls = urls;    //创意url列表
                    creative.height = assets.main_img.h;
                    creative.width = assets.main_img.w;
                    break;
                */
                case ADCONSTANTS.IDEATYPE.IMAGETEXT.code:
                    creative.type = 4;
                    creative.style = 5;
                    creative.creativeUrl = assets.main_img.url;
                    creative.descrition = assets.desc;
                    creative.height = assets.main_img.h;
                    creative.width = assets.main_img.w;
                    creative.title = assets.title;
                    break;
                    break;
                default:
                    return false;
            }
        }
    }                                                                             
    creative.creativeTradeId = parseInt(originCreative.idea_trade);  //创意所属行业
    creative.landingPage = originCreative.landing_page;
    var monitor_urls = [];
    /* monitor urls
    if (originCreative.imp_monitor_urls.length === 0) {
        var tmp_url = originCreative.imp_url;
        monitor_urls.push(tmp_url);
    } else {
        monitor_urls = originCreative.imp_monitor_urls.split(' ');
    }
    */
    monitor_urls.push(originCreative.imp_url);
    creative.monitorUrls = monitor_urls;
    var b64_landing_page = base64.encode(originCreative.landing_page);
    var urlSafe1 = b64_landing_page.replace(/\+/g, '-');
    var urlSafe_landing_page = urlSafe1.replace(/\//g, '_');
    creative.targetUrl = originCreative.click_url + '&lp=' + urlSafe_landing_page;    //点击链接
    creative.advertiserId = originCreative.user_id;
    return creative;
};

//check if user has been uploaded
//only 5 users allowed
var userStatusRouter = function(param, fn) {
    var url = USERQUERYURL;
    var users = param.users;

    var msg = ' to check if user has been uploaded.';
    mLogger.debug('Try' + msg);

    mAsync.waterfall([
        //1. get adx configuration
        function(next) {
            mGetBesConfig(function(err, conf) {
                if (err) {
                    next(err);
                } else {
                    next(null, conf);
                }
            });
        },
        // 2.query if user uploaded 
        function(config, next) {
            var authHeader = {
                dspId: config.dspId,
                token: config.token
            };
            var data = {
                advertiserIds: users,
                authHeader: authHeader
            };
            var option = {
                url: url,
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            }
            request(option, function(err, res, body) {
                if (err) {
                    next(err);
                } else {
                    if (res.statusCode === 200) {
                        var jsonBody = mJsonParse(body);
                        if (jsonBody) {
                            next(null, jsonBody);
                        } else {
                            next({code: ERRCODE.DATA_INVALID, msg: '返回JSON解析错误！'});
                        }
                    } else {
                        next({code:ERRCODE.REQUEST_FAILED, msg: '请求失败'});
                    }
                }
            });
        }, 
        // 3.decide upload or update
        function(body, next) {
            var userList = body.response;
            if (!userList) {
                next({code: ERRCODE.DATA_INVALID, msg: 'adx返回数据错误！'});
            } else {
                if (userList.length === 0) {
                    mUploadUser(param, function(err, res) {
                        if (err) {
                            next(err);
                        } else {
                            next(null, res);
                        }
                    });   
                    
                } else {
                    param.url = UPDATEUSERURL;
                    mUploadUser(param, function(err, res) {
                        if (err) {
                            next(err);
                        } else {
                            next(null, res);
                        }
                    });
                }
            }
        }
        // 3.upload licence
        // function(args, next) {
        //     mAsync.map(users, function(user_id, cb) {
        //         var args = {
        //             user_id: user_id
        //         };
        //         licenceStatusRouter(args, function(err) {
        //             if (err) {
        //                 mLogger.error('Failed to upload qualification of user: ' + user_id);
        //                 cb(null);
        //             } else {
        //                 cb(null);
        //             }
        //         });
        //     }, function(err) {
        //         if (err) {
        //             next(err);
        //         } else {
        //             next(null, args);
        //         }
        //     });
        // }          
    ], function(err, res) {
        if (err) {
            mLogger.error('Failed' + msg);
            fn(err);
        } else {
            mLogger.debug('Success' + msg);
            fn(null, {});
        }
    });
};

//check if idea has been uploaded
//only 10 ideas allowed
var ideaStatusRouter = function(param, fn) {
    var url = IDEAQUERYURL;
    var ideas = param.ideas;

    var msg = ' to check if idea has been uploaded.';
    mLogger.debug('Try' + msg);

    mAsync.waterfall([
        // 1.get adx configuration
        function(next) {
            mGetBesConfig(function(err, conf) {
                if (err) {
                    next(err);
                } else {
                    next(null, conf);
                }
            });
        },
        // 2.query idea if uploaded
        function(conf, next) {
            var authHeader = {
                dspId: conf.dspId,
                token: conf.token
            };
            var data = {
                creativeIds: ideas,
                authHeader: authHeader
            };
            var option = {
                url: url,
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            }
            request(option, function(err, res, body) {
                if (err) {
                    next(err);
                } else {
                    if (res.statusCode === 200) {
                        var jsonBody = mJsonParse(body);
                        if (jsonBody) {
                            next(null, jsonBody);
                        } else {
                            next({code: ERRCODE.DATA_INVALID, msg: '返回JSON解析错误！'});
                        }
                    } else {
                        next({code: ERRCODE.REQUEST_FAILED, msg: '请求失败！'});
                    }
                }
            });            
        },
        // 3.decide upload or update
        function(body, next) {
            var ideaList = body.response;
            if (!ideaList) {
                next({code: ERRCODE.DATA_INVALID, msg: 'adx返回数据错误！'});
            } else {
                if (!ideaList || ideaList.length === 0) {
                    mUploadIdea(param, function(err, res) {
                        if (err) {
                            next(err);
                        } else {
                            next(null, res);
                        }
                    });
                } else {
                    param.url = UPDATEIDEAURL;
                    mUploadIdea(param, function(err, res) {
                        if (err) {
                            next(err);
                        } else {
                            next(null, res);
                        }
                    });
                }    
            }
        }
    ], function(err, res) {
        if (err) {
            mLogger.error('Failed' + msg);
            fn(err);
        } else {
            mLogger.debug('Success' + msg);
            fn(null, res);
        }
    });
};

//check if licence has been uploaded
//only one user allowed 
var licenceStatusRouter = function(param, fn) {
    var url = LICENCEQUERYURL;
    var user_id = param.user_id;

    var msg = ' to check if licence has been uploaded.';
    mLogger.debug('Try' + msg);

    mAsync.waterfall([
        // 1.get adx configuration
        function(next) {
            mGetBesConfig(function(err, conf) {
                if (err) {
                    next(err);
                } else {
                    next(null, conf);
                }
            });
        },
        // 2.query licence if uploaded
        function(conf, next) {
            var authHeader = {
                dspId: conf.dspId,
                token: conf.token
            };
            var data = {
                advertiserId: user_id,
                needLicenceImgUrl: false,
                authHeader: authHeader
            };
            var option = {
                url: url,
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            }
            request(option, function(err, res, body) {
                if (err) {
                    next(err);
                } else {
                    if (res.statusCode === 200) {
                        var jsonBody = mJsonParse(body);
                        if (jsonBody) {
                            next(null, jsonBody);
                        } else {
                            next({code: ERRCODE.DATA_INVALID, msg: '返回JSON解析错误！'});
                        }
                    } else {
                        next({code: ERRCODE.REQUEST_FAILED, msg: '请求失败！'});
                    }
                }
            });            
        },
        // 3.decide upload or update
        function(body, next) {
            var qualification = body.qualification;
            if (!qualification) {
                var users = [];
                users.push(user_id);
                var args = {
                    users: users
                };
                mUploadLicence(args, function(err) {
                    if (err) {
                        next(err);
                    } else {
                        next(null);
                    }
                });
            } else {
                var args = {
                    user_id: user_id
                };
                mUpdateMainLicence(args, function(err) {
                    if (err) {
                        next(err);
                    } else {
                        next(null);
                    }
                });
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

//upload users
//Only 5 users allowed per time to upload
var mUploadUser = function(param, fn) {
    var url = param.url || UPLOADUSERURL;
    var users = param.users;
    var update_time = mMoment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    var msg = ' to upload advertiser to BES...';
    mLogger.debug('Try' + msg);
    mAsync.waterfall([
        // 1.get advertisers infomation
        function(next) {
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
        function(args, next) {
            mGetBesConfig(function(err, conf) {
                if (err) {
                    next(err);
                } else {
                    next(null, {users: args, conf: conf});
                }
            });
        },
        // 3.upload
        function(data, next) {
            var conf = data.conf;
            var userList = data.users;
            var advertisers = [];
            for (var i = 0; i < userList.length; i++) {
                var user = {
                    advertiserId: userList[i].user_id,
                    advertiserLiteName: userList[i].user_name,
                    //主体资质名称
                    advertiserName: userList[i].company_name,
                    siteName: userList[i].site_name,
                    telephone: userList[i].telephone,
                    address: userList[i].address
                };
                if (userList[i].site_url && userList[i].site_url.length !== 0) {
                    var site_url = null;
                    if (mIs.startWith(userList[i].site_url, 'http://') || mIs.startWith(userList[i].site_url, 'https://')) {
                        site_url = userList[i].site_url;
                    } else {
                        site_url = 'http://' + userList[i].site_url;
                    }
                    user.siteUrl = site_url;
                }
                advertisers.push(user);
            }
            var authHeader = {
                dspId: conf.dspId,
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
            }
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
            if (resBody.status === 0) {
                var sqlstr = 'UPDATE ' + mAdxAuditUserModel.tableName;
                sqlstr += ' SET audit_status = ' + ADCONSTANTS.AUDIT.UNCHECK.code;
                sqlstr += ',update_time = \'' + update_time;
                sqlstr += '\' WHERE adx_id = ' + ADXID;
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
            } else if (resBody.status === 1) {
                var errors = resBody.errors;
                var failList = [];
                var succList = [];
                for (var i = 0; i < errors.length; i++) {
                    var error = errors[i];
                    failList.push(users[error.index]);
                }
                for (var i = 0; i < users.length; i++) {
                    if (!mIs.inArray(users[i], failList)) {
                        succList.push(users[i]);
                    }
                }
                mAsync.series({
                    succ: function(next1) {
                        var sqlstr = 'UPDATE ' + mAdxAuditUserModel.tableName;
                        sqlstr += ' SET audit_status = ' + ADCONSTANTS.AUDIT.UNCHECK.code;
                        sqlstr += ',update_time = \'' + update_time;
                        sqlstr += '\' WHERE adx_id = ' + ADXID;
                        sqlstr += ' AND user_id in(' + succList.join(',');
                        sqlstr += ');';
                        var query = {
                            sqlstr: sqlstr
                        };
                        mAdxAuditUserModel.query(query, function(err, rows) {
                            if (err) {
                                next1(err);
                            } else {
                                next1(null);
                            }
                        });
                    },
                    fail: function(next1) {
                        mAsync.map(errors, function(error, cb) {
                            var user_id = users[error.index];
                            var update = {
                                audit_status: ADCONSTANTS.AUDIT.FAILED.code,
                                failure_message: error.message
                            };
                            var match = {
                                user_id: user_id,
                                adx_id: ADXID 
                            };
                            var query = {
                                update: update,
                                match: match
                            };
                            mAdxAuditUserModel.update(query, function(err, rows) {
                                if (err) {
                                    mLogger.error('Failed to update audit status to Failed for :' + user_id);
                                    cb(null);
                                } else {
                                    cb(null);
                                }
                            });
                        }, function(err) {
                            if (err) {
                                next1(err);
                            } else {
                                next1(null);
                            }
                        });
                    }
                }, function(err) {
                    if (err) {
                        next(err);
                    } else {
                        next(null);
                    }
                });
            } else {
                var errors = resBody.errors;
                mAsync.map(errors, function(error, cb) {
                    var user_id = users[error.index];
                    var update = {
                        audit_status: ADCONSTANTS.AUDIT.FAILED.code,
                        failure_message: error.message
                    };
                    var match = {
                        user_id: user_id,
                        adx_id: ADXID
                    };
                    var query = {
                        update: update,
                        match: match
                    };
                    mAdxAuditUserModel.update(query, function(err, rows) {
                        if (err) {
                            mLogger.error('Failed to update audit status to uncheck for :' + user_id);
                            cb(null);
                        } else {
                            cb(null);
                        }
                    });
                }, function(err) {
                    if (err) {
                        next(err);
                    } else {
                        next(null);
                    }
                });
            }
        }
    ], function(err) {
        if (err) {
            fn(err);
        } else {
            fn(null);
        }
    });
};

//query all users' audit status between start time and end time
var mUserAuditQueryAll = function(param, fn) {
    var url = USERQUERYALLURL;
    var startDate = param.start_date;
    var endDate = param.end_date;

    var msg = ' to query all advertisers from bes between ';;
    msg += startDate + ' and ' + endDate;
    mLogger.debug('Try' + msg);

    mAsync.waterfall([
        // 1.get bes adx config
        function(next) {
            mGetBesConfig(function(err, conf) {
                if (err) {
                    next(err);
                } else {
                    next(null, conf);
                }
            });
        },
        // 2.get all advertisers audit result
        function(config, next) {
            var authHeader = {
                dspId: config.dspId,
                token: config.token
            };
            var data = {
                authHeader: authHeader,
                startDate: startDate,
                endDate: endDate
            };
            var option = {
                url: url,
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            }
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
                        next({code: ERRCODE.REQUEST_FAILED, msg: '请求失败'});
                    }
                }
            });
        },
        // 3.update audit status
        function(resBody, next) {
            var advertisers = resBody.response;
            var list_pass = [];
            for (var i = 0; i < advertises.length; i++) {
                if (advtisers[i].isWhiteUser === 1) {
                    list_pass.push(advertisers[i].advertiserId);
                }
            }
            var update_time = mMoment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            var sqlstr = 'UPDATE ' + mAdxAuditUserModel.tableName;
            sqlstr += ' SET audit_status = ' + ADCONSTANTS.AUDIT.PASS.code;
            sqlstr += ',update_time = \'' + update_time;
            sqlstr += '\' WHERE adx_id = ' + ADXID;
            sqlstr += ' AND user_id in(' + list_pass.join(',');
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

//100 users allowed to query per time
var mUserAuditQueryById = function(param, fn) {
    var url = USERQUERYURL;
    var userList = param.users;
    var update_time = mMoment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    var msg = ' to query user audit status from bes by id!';
    mLogger.debug('Try' + msg);

    mAsync.waterfall([
        // 1.get bes adx configuration
        function(next) {
            mGetBesConfig(function(err, conf) {
                if (err) {
                    next(err);
                } else {
                    next(null, conf);
                }
            });
        },
        // 2.query audit status from bes
        function(config, next) {
            var authHeader = {
                dspId: config.dspId,
                token: config.token
            };
            var data = {
                advertiserIds: userList,
                authHeader: authHeader
            };
            var option = {
                url: url,
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            }
            //console.info(JSON.stringify(option));
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
        // 3.update audit status
        function(resBody, next) {
            if (resBody.status === 0) {
                var advertisers = resBody.response;
                var list_pass = [];
                for (var i = 0; i < advertisers.length; i++) {
                    if (advertisers[i].isWhiteUser === 1) {
                        list_pass.push(advertisers[i].advertiserId);
                    }
                }
                if (list_pass.length !== 0) {
                    var sqlstr = 'UPDATE ' + mAdxAuditUserModel.tableName;
                    sqlstr += ' SET audit_status = ' + ADCONSTANTS.AUDIT.PASS.code;
                    sqlstr += ',update_time = \'' + update_time;
                    sqlstr += '\' WHERE adx_id = ' + ADXID;
                    sqlstr += ' AND user_id in(' + list_pass.join(',');
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
                    next(null);
                }
            } else if (resBody.status === 1) {
                var errors = resBody.errors;
                var users = resBody.response;
                mAsync.series({
                    succ: function(next1) {
                        var list_pass = [];
                        for (var i = 0; i < users.length; i++) {
                            if (users[i].isWhiteUser === 1) {
                                list_pass.push(users[i].advertiserId);
                            }
                        }
                        var sqlstr = 'UPDATE ' + mAdxAuditUserModel.tableName;
                        sqlstr += ' SET audit_status = ' + ADCONSTANTS.AUDIT.UNCHECK.code;
                        sqlstr += ',update_time = \'' + update_time;
                        sqlstr += '\' WHERE adx_id = ' + ADXID;
                        sqlstr += ' AND user_id in(' + list_pass.join(',');
                        sqlstr += ');';
                        var query = {
                            sqlstr: sqlstr
                        };
                        mAdxAuditUserModel.query(query, function(err, rows) {
                            if (err) {
                                next1(err);
                            } else {
                                next1(null);
                            }
                        });
                    },
                    fail: function(next1) {
                        mAsync.map(errors, function(error, cb) {
                            var user_id = userList[error.index];
                            var update = {
                                audit_status: ADCONSTANTS.AUDIT.FAILED.code,
                                failure_message: error.message
                            };
                            var match = {
                                user_id: user_id,
                                adx_id: ADXID 
                            };
                            var query = {
                                update: update,
                                match: match
                            };
                            mAdxAuditUserModel.update(query, function(err, rows) {
                                if (err) {
                                    mLogger.error('Failed to update audit status to Failed for :' + user_id);
                                    cb(null);
                                } else {
                                    cb(null);
                                }
                            });
                        }, function(err) {
                            if (err) {
                                next1(err);
                            } else {
                                next1(null);
                            }
                        });
                    }
                }, function(err) {
                    if (err) {
                        next(err);
                    } else {
                        next(null);
                    }
                });
            } else {
                var errors = resBody.errors;
                mAsync.map(errors, function(error, cb) {
                    var user_id = userList[error.index];
                    var update = {
                        audit_status: ADCONSTANTS.AUDIT.FAILED.code,
                        failure_message: error.message
                    };
                    var match = {
                        user_id: user_id,
                        adx_id: ADXID
                    };
                    var query = {
                        update: update,
                        match: match
                    };
                    mAdxAuditUserModel.update(query, function(err, rows) {
                        if (err) {
                            mLogger.error('Failed to update audit status to uncheck for :' + user_id);
                            cb(null);
                        } else {
                            cb(null);
                        }
                    });
                }, function(err) {
                    if (err) {
                        next(err);
                    } else {
                        next(null);
                    }
                });               
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

//upload ideas
//Only 10 ideas allowed to upload per time
var mUploadIdea = function(param, fn) {
    var url = param.url || UPLOADIDEAURL;
    var ideaList = param.ideas;
    var update_time = mMoment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    var msg = ' to upload ideas to bes!';
    mLogger.debug('Try' + msg);

    mAsync.waterfall([
        //1.get information of every idea
        function(next) {
            var sqlstr = 'SELECT * from ' + mAdIdeaModel.tableName;
            sqlstr += ' WHERE idea_id in(' + ideaList.join(',');
            sqlstr += ');';
            var query = {
                sqlstr: sqlstr
            };
            mAdIdeaModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                } else {
                    next(null, rows);
                }
            });
        },
        //2.get bes adx configuration
        function(args, next) {
            mGetBesConfig(function(err, conf) {
                if (err) {
                    next(err);
                } else {
                    next(null, {ideas: args, conf: conf});
                }
            });
        },
        //3.upload ideas
        function(args, next) {
            var ideas = args.ideas;
            var conf = args.conf;
            var creatives = [];
            for (var i = 0; i < ideas.length; i++) {
                ideas[i].click_url = conf.clickUrl;
                ideas[i].imp_url = conf.impUrl;
                var creative = packageIdea(ideas[i]);
                if (creative) {
                    /*
                    var tmp = {
                        advertiserId: creative.advertiserId,
                        creativeId: creative.creativeId,
                        adviewType: creative.adviewType,
                        interactiveStyle: creative.interactiveStyle,
                        creativeUrl: creative.creativeUrl,
                        type: creative.type,
                        dataRate: creative.dataRate,
                        duration: creative.duration,
                        height: creative.height,
                        width: creative.width,
                        creativeTradeId: creative.creativeTradeId,
                        landingPage: creative.landingPage,
                        monitorUrls: creative.monitorUrls,
                        targetUrl: creative.targetUrl
                    }
                    creatives.push(tmp);
                    */
                    creatives.push(creative);
                }
            }
            if (creatives.length === 0) {
                next({code: ERRCODE.PARAM_INVALID, msg: '提交失败，请检查adx是否支持广告类型。'});
            } else {
                var authHeader = {
                    dspId: conf.dspId,
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
        //4.update upload status
        function(resBody, next) {
            if (resBody.status === 0) {
                var sqlstr = 'UPDATE ' + mAdxAuditIdeaModel.tableName;
                sqlstr += ' SET audit_status = ' + ADCONSTANTS.AUDIT.UNCHECK.code;
                sqlstr += ',update_time = \'' + update_time;
                sqlstr += '\' WHERE adx_id = ' + ADXID;
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
            } else if (resBody.status === 1) {
                var errors = resBody.errors;
                var failList = [];
                var succList = [];
                for (var i = 0; i < errors.length; i++) {
                    var error = errors[i];
                    failList.push(ideaList[error.index]);
                }
                for (var i = 0; i < ideaList.length; i++) {
                    if (!mIs.inArray(ideaList[i], failList)) {
                        succList.push(ideaList[i]);
                    }
                }
                mAsync.series({
                    succ: function(next1) {
                        var sqlstr = 'UPDATE ' + mAdxAuditIdeaModel.tableName;
                        sqlstr += ' SET audit_status = ' + ADCONSTANTS.AUDIT.UNCHECK.code;
                        sqlstr += ',update_time = \'' + update_time;
                        sqlstr += '\' WHERE adx_id = ' + ADXID;
                        sqlstr += ' AND idea_id in(' + succList.join(',');
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
                    },
                    fail: function(next1) {
                        mAsync.map(errors, function(error, cb) {
                            var idea_id = ideaList[error.index];
                            var update = {
                                audit_status: ADCONSTANTS.AUDIT.FAILED.code,
                                failure_message: error.message
                            };
                            var match = {
                                idea_id: idea_id,
                                adx_id: ADXID
                            };
                            var query = {
                                update: update,
                                match: match
                            };
                            mAdxAuditIdeaModel.update(query, function(err, rows) {
                                if (err) {
                                    mLogger.error('Failed to update audit status to Failed for :' + idea_id);
                                    cb(null);
                                } else {
                                    cb(null);
                                }
                            });
                        }, function(err) {
                            if (err) {
                                next1(err);
                            } else {
                                next1(null);
                            }
                        });
                    }
                }, function(err) {
                    if (err) {
                        next(err);
                    } else {
                        next(null);
                    }
                });
            } else {
                var errors = resBody.errors;
                mAsync.map(errors, function(error, cb) {
                    var idea_id = ideaList[error.index];
                    var update = {
                        audit_status: ADCONSTANTS.AUDIT.FAILED.code,
                        failure_message: error.message
                    };
                    var match = {
                        idea_id: idea_id,
                        adx_id: ADXID
                    };
                    var query = {
                        update: update,
                        match: match
                    };
                    mAdxAuditIdeaModel.update(query, function(err, rows) {
                        if (err) {
                            mLogger.error('Failed to update audit status to  Failed for :' + idea_id);
                            cb(null);
                        } else {
                            cb(null);
                        }
                    });
                }, function(err) {
                    if (err) {
                        next(err);
                    } else {
                        next(null);
                    }
                });
            }
        },
        //5.add adx_idea_id
        function(next) {
            mAsync.map(ideaList, function(idea, cb) {
                var update = {
                    adx_idea_id: idea.toString()
                };
                var match = {
                    idea_id: idea,
                    adx_id: ADXID
                };
                var query = {
                    update: update,
                    match: match
                };
                mAdxAuditIdeaModel.update(query, function(err, rows) {
                    if (err) {
                        mLogger.error('Failed to update adx_idea_id for idea: ' + idea);
                        cb(null);
                    } else {
                        cb(null);
                    }
                });
            }, function(err) {
                if (err) {
                    mLogger.error('Failed to add adx_idea_id for idea ids:' + ideaList);
                    next(null);
                } else {
                    next(null);
                }
            });
        }
    ], function(err) {
        if (err) {
            fn(err);
        } else {
            fn(null);
        }
    });
};

//query all ideas' audit status between start time and end time
var mIdeaAuditQueryAll = function(param, fn) {
    var url = IDEAQUERYALLURL;
    var startDate = param.start_date;
    var endDate = param.end_date;

    var msg = ' to query all ideas status between ' + startDate;
    msg += ' and ' + endDate;
    mLogger.debug('Try' + msg);

    mAsync.waterfall([
        // 1.get bes adx configuration
        function(next) {
            mGetBesConfig(function(err, conf) {
                if (err) {
                    next(err);
                } else {
                    next(null, conf);
                }
            });
        },
        // 2.query idea audit status
        function(conf, next) {
            var authHeader = {
                dspId: conf.dspId,
                token: conf.token
            };
            var data = {
                authHeader: authHeader,
                startDate: startDate,
                endDate: endDate
            };
            var option = {
                url: url,
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            }
            request(option, function(err, res, body) {
                if (err) {
                    next(err);
                } else {
                    if (res.statusCode === 200) {
                        var jsonBody = mJsonParse(body);
                        if (jsonBody) {
                            next(null, jsonBody);
                        } else {
                            next({code: ERRCODE.DATA_INVALID, msg: '返回JSON解析错误！'});
                        }
                    } else {
                        next({code: ERRCODE.REQUEST_FAILED, msg: '请求失败'});
                    }
                }
            });
        },
        // 3.update audit status
        function(resBody, next) {
            var ideas = resBody.response;
            mAsync.map(ideas, function(idea, cb) {
                if (idea.state === 0) {
                    var update = {
                        audit_status: ADCONSTANTS.AUDIT.PASS.code
                    };
                    var match = {
                        adx_id: ADXID,
                        idea_id: idea.creativeId,
                        adx_idea_id: idea.creativeId
                    };
                    var query = {
                        update: update,
                        match: match
                    };
                    mAdxAuditIdeaModel.update(query, function(err, rows) {
                        if (err) {
                            mLogger.error('Failed to update audit status of BES for idea: ' + idea.creativeId);
                            cb(null);
                        } else {
                            cb(null);
                        }
                    });
                } else if (idea.state === 2) {
                    var update = {
                        audit_status: ADCONSTANTS.AUDIT.FAILED.code
                    };
                    var match = {
                        adx_id: ADXID,
                        idea_id: idea.creativeId,
                        adx_idea_id: idea.creativeId
                    };
                    var query = {
                        update: update,
                        match: match
                    };
                    mAdxAuditIdeaModel.update(query, function(err, rows) {
                        if (err) {
                            mLogger.error('Failed to update audit status of BES for idea: ' + idea.creativeId);
                            cb(null);
                        } else {
                            cb(null);
                        }
                    });
                }
            }, function(err) {
                if (err) {
                    next(err);
                } else {
                    next(null);
                }
            });
        }
    ], function(err) {
        if (err) {
            mLogger.error('Failed' + msg);
            fn(err);
        } else {
            mLogger.debug('Success' + msg);
            fn(null);
        }
    });
};

//100 ideas allowed to query per time
var mIdeaAuditQueryById = function(param, fn) {
    var url = IDEAQUERYURL;
    var ideaList = param.ideas;
    var update_time = mMoment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    var msg = ' to query idea audit status by id from BES!';
    mLogger.debug('Try' + msg);

    mAsync.waterfall([
        // 1.get bes adx configuration
        function(next) {
            mGetBesConfig(function(err, conf) {
                if (err) {
                    next(err);
                } else {
                    next(null, conf);
                }
            });
        },
        // 2.query idea audit status
        function(conf, next) {
            var authHeader = {
                dspId: conf.dspId,
                token: conf.token
            };
            var data = {
                creativeIds: ideaList,
                authHeader: authHeader
            };
            var option = {
                url: url,
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            }
            request(option, function(err, res, body) {
                if (err) {
                    next(err);
                } else {
                    if (res.statusCode === 200) {
                        mLogger.debug('Bes response: ' + body);
                            var jsonBody = mJsonParse(body);
                            if (jsonBody) {
                                next(null, jsonBody);
                            } else {
                                next({code: ERRCODE.DATA_INVALID, msg: '返回JSON解析错误！'});
                            }
                    } else {
                        next({code: ERRCODE.REQUEST_FAILED, msg: '请求失败！'});
                    }
                }
            });
        },
        // 3.update audit status
        function(resBody, next) {
            if (resBody.status === 0) {
                var ideas = resBody.response;
                var list_pass = [];
                var list_fail = [];
                for (var i = 0; i < ideas.length; i++) {
                    if (ideas[i].state === 0) {
                        list_pass.push(ideas[i].creativeId);
                    } else if (ideas[i].state === 2) {
                        list_fail.push(ideas[i].creativeId);
                    }
                }
                mAsync.series({
                    pass: function(nx) {
                        if (list_pass.length !== 0) {
                            var sqlstr = 'UPDATE ' + mAdxAuditIdeaModel.tableName;
                            sqlstr += ' SET audit_status = ' + ADCONSTANTS.AUDIT.PASS.code;
                            sqlstr += ',update_time = \'' + update_time;
                            sqlstr += '\' WHERE adx_id = ' + ADXID;
                            sqlstr += ' AND idea_id in (' + list_pass.join(',');
                            sqlstr += ');';
                            var query = {
                                sqlstr: sqlstr
                            };
                            mAdxAuditIdeaModel.query(query, function(err, rows) {
                                if (err) {
                                    nx(err);
                                } else {
                                    nx(null);
                                }
                            });
                        } else {
                            nx(null);
                        }
                    },
                    fail: function(nx) {
                        if (list_fail.length !== 0) {
                            var sqlstr = 'UPDATE ' + mAdxAuditIdeaModel.tableName;
                            sqlstr += ' SET audit_status = ' + ADCONSTANTS.AUDIT.FAILED.code;
                            sqlstr += ',update_time = \'' + update_time;
                            sqlstr += '\' WHERE adx_id = ' + ADXID;
                            sqlstr += ' AND idea_id in (' + list_fail.join(',');
                            sqlstr += ');';
                            var query = {
                                sqlstr: sqlstr
                            };
                            mAdxAuditIdeaModel.query(query, function(err, rows) {
                                if (err) {
                                    nx(err);
                                } else {
                                    nx(null);
                                }
                            });
                        } else {
                            nx(null);
                        }
                    }
                }, function(err) {
                    if (err) {
                        next(err);
                    } else {
                        next(null);
                    }
                });
            } else if (resBody.status === 1) {
                var ideas = resBody.response;
                var errors = resBody.errors;
                var list_pass = [];
                var list_fail = [];
                for (var i = 0; i < ideas.length; i++) {
                    if (ideas[i].state === 0) {
                        list_pass.push(ideas[i].creativeId);
                    } else if (ideas[i].state === 2) {
                        list_fail.push(ideas[i].creativeId);
                    }
                }
                mAsync.series({
                    pass: function(nx) {
                        if (list_pass.length === 0) {
                            nx(null);
                        } else {
                            var sqlstr = 'UPDATE ' + mAdxAuditIdeaModel.tableName;
                            sqlstr += ' SET audit_status = ' + ADCONSTANTS.AUDIT.PASS.code;
                            sqlstr += ',update_time = \'' + update_time;
                            sqlstr += '\' WHERE adx_id = ' + ADXID;
                            sqlstr += ' AND idea_id in (' + list_pass.join(',');
                            sqlstr += ');';
                            var query = {
                                sqlstr: sqlstr
                            };
                            mAdxAuditIdeaModel.query(query, function(err, rows) {
                                if (err) {
                                    nx(err);
                                } else {
                                    nx(null);
                                }
                            });   
                        }
                    },
                    fail: function(nx) {
                        if (list_fail.length !== 0) {
                            var sqlstr = 'UPDATE ' + mAdxAuditIdeaModel.tableName;
                            sqlstr += ' SET audit_status = ' + ADCONSTANTS.AUDIT.FAILED.code;
                            sqlstr += ',update_time = \'' + update_time;
                            sqlstr += '\' WHERE adx_id = ' + ADXID;
                            sqlstr += ' AND idea_id in (' + list_fail.join(',');
                            sqlstr += ');';
                            var query = {
                                sqlstr: sqlstr
                            };
                            mAdxAuditIdeaModel.query(query, function(err, rows) {
                                if (err) {
                                    nx(err);
                                } else {
                                    nx(null);
                                }
                            });
                        }                       
                    },
                    error: function(nx) {
                        mAsync.map(errors, function(error, cb) {
                            var idea_id = ideaList[error.index];
                            var update = {
                                audit_status: ADCONSTANTS.AUDIT.FAILED.code,
                                failure_message: error.message
                            };
                            var match = {
                                idea_id: idea_id,
                                adx_id: ADXID
                            };
                            var query = {
                                update: update,
                                match: match
                            };
                            mAdxAuditIdeaModel.update(query, function(err, rows) {
                                if (err) {
                                    mLogger.error('Failed to update audit status to  Failed for :' + idea_id);
                                    cb(null);
                                } else {
                                    cb(null);
                                }
                            });
                        }, function(err) {
                            if (err) {
                                nx(err);
                            } else {
                                nx(null);
                            }
                        });                        
                    }
                }, function(err) {
                    if (err) {
                        next(err);
                    } else {
                        next(null);
                    }
                });
            } else {
                var errors = resBody.errors;
                mAsync.map(errors, function(error, cb) {
                    var idea_id = ideaList[error.index];
                    var update = {
                        audit_status: ADCONSTANTS.AUDIT.FAILED.code,
                        failure_message: error.message
                    };
                    var match = {
                        idea_id: idea_id,
                        adx_id: ADXID
                    };
                    var query = {
                        update: update,
                        match: match
                    };
                    mAdxAuditIdeaModel.update(query, function(err, rows) {
                        if (err) {
                            mLogger.error('Failed to update audit status to  Failed for :' + idea_id);
                            cb(null);
                        } else {
                            cb(null);
                        }
                    });
                }, function(err) {
                    if (err) {
                        next(err);
                    } else {
                        next(null);
                    }
                });
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

//upload licence
//Only 5 users allowed to upload licence per time
var mUploadLicence = function(param, fn) {
    var url = UPLOADLICENCEURL;
    var users = param.users;

    var msg = ' to upload licence to BES ...';
    mLogger.debug('Try' + msg);

    mAsync.waterfall([
        // 1.get user licence infomation
        function(next) {
            mAsync.map(users, function(user_id, cb) {
                var sqlstr = 'Select * from ' + mDspAdUserModel.tableName;
                sqlstr += ' where user_id = ' + user_id + ';';
                var query = {
                    sqlstr: sqlstr
                };
                mDspAdUserModel.query(query, function(err, rows) {
                    if (err) {
                        cb(err);
                    } else {
                        if (rows && rows.length != 0) {
                            var main_licence = {
                                type: rows[0].qualification_type,
                                name: rows[0].qualification_name,
                                number: rows[0].qualification_number,
                                validDate: rows[0].valid_date_end
                            };
                            var user = {
                                advertiserId: user_id,
                                mainLicence: main_licence
                            };
                            cb(null, user);
                        } else {
                            mLogger.error('There is no user :' + user_id);
                            cb(null);
                        }
                    }
                });
            }, function(err, result) {
                if (err) {
                    next(err);
                } else {
                    next(null, result);
                }
            });
        },
        // 2.get adx information
        function(args, next) {
            mGetBesConfig(function(err, conf) {
                if (err) {
                    next(err);
                } else {
                    next(null, {user: args, conf: conf});
                }
            });
        },
        // 3.upload licences
        function(args, next) {
            var advertisers = args.user;
            var conf = args.conf;
            var authHeader = {
                dspId: conf.dspId,
                token: conf.token
            };
            var data = {
                authHeader: authHeader,
                qualifications: advertisers
            };
            var option = {
                url: url,
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            }
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
                        next({code: ERRCODE.REQUEST_FAILED, msg: '请求失败'});
                    }
                }
            });   
        }
    ], function (err, body) {
        if (err) {
            mLogger.error('Failed' + msg);
            fn(err);
        } else {
            if (body.status === 0) {
                var response = body.qualificationStatuses;
                if (response.status === 0) {
                    mLogger.error('Failed' + msg);
                    mLogger.error('Failed reason is : ' + response.message);
                } else {
                    mLogger.debug('Success' + msg);
                }
            }
            fn(null);
        }
    });
};

//Only one users allowed to update main licence per time
var mUpdateMainLicence = function(param, fn) {
    var url = UPDATEMAINLICENCEURL;
    var user_id = param.user_id;

    var msg = ' to update main licence to BES......';
    mLogger.debug('Try' + msg);

    mAsync.waterfall([
        // 1.get user licence infomation
        function(next) {
            var sqlstr = 'Select * from ' + mDspAdUserModel.tableName;
            sqlstr += ' where user_id = ' + user_id + ';';
            var query = {
                sqlstr: sqlstr
            };
            mDspAdUserModel.query(query, function(err, rows) {
                if (err) {
                    next(err);
                } else {
                    if (rows && rows.length != 0) {
                        var main_licence = {
                            type: rows[0].qualification_type,
                            name: rows[0].qualification_name,
                            number: rows[0].qualification_number,
                            validDate: mMoment(rows[0].valid_date_end).format('YYYY-MM-DD')
                        };
                        if (rows[0].qualification && rows[0].qualification.length !== 0) {
                            var qualificationUrls = [];
                            qualificationUrls.push(rows[0].qualification);
                            main_licence.imgUrls = qualificationUrls;
                        }
                        var user = {
                            advertiserId: user_id,
                            mainLicence: main_licence
                        };
                        next(null, user);
                    } else {
                        mLogger.error('There is no user :' + user_id);
                        next(null);
                    }
                }
            });

        },
        // 2.get adx information
        function(args, next) {
            mGetBesConfig(function(err, conf) {
                if (err) {
                    next(err);
                } else {
                    next(null, {user: args, conf: conf});
                }
            });
        },
        // 3.upload licences
        function(args, next) {
            var advertiser = args.user;
            var conf = args.conf;
            var authHeader = {
                dspId: conf.dspId,
                token: conf.token
            };
            var data = {
                authHeader: authHeader,
                qualification: advertiser
            };
            var option = {
                url: url,
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            }
            request(option, function(err, res, body) {
                if (err) {
                    next(err);
                } else {
                    if (res.statusCode === 200) {
                        var jsonBody = mJsonParse(body);
                        //console.info('Bes response: ' + JSON.stringify(jsonBody)) 
                        if (jsonBody) {
                            next(null, jsonBody);
                        } else {
                            next({code: ERRCODE.DATA_INVALID, msg: '返回JSON解析错误！'});
                        }
                    } else {
                        next({code: ERRCODE.REQUEST_FAILED, msg: '请求失败'});
                    }
                }
            });
            
        }
    ], function (err, body) {
        if (err) {
            mLogger.error('Failed' + msg);
            fn(err);
        } else {
            var response = body.qualificationStatuses;
            if (response && response.status === 0) {
                mLogger.error('Failed' + msg);
                mLogger.error('Failed reason is : ' + response.message);
            } else {
                mLogger.debug('Success' + msg);
            }
            fn(null);
        }
    });
};


module.exports.uploadIdea = mUploadIdea;
module.exports.ideaAuditQuery = mIdeaAuditQueryById;
module.exports.uploadUser = mUploadUser;
module.exports.userAuditQuery = mUserAuditQueryById;
module.exports.userAuditQueryAll = mUserAuditQueryAll;
module.exports.ideaAuditQueryAll = mIdeaAuditQueryAll;
module.exports.uploadLicence = mUploadLicence;
module.exports.updateLicence = mUpdateMainLicence;
module.exports.userSubmitRouter = userStatusRouter;
module.exports.ideaSubmitRouter = ideaStatusRouter;
module.exports.licenceSubmitRouter = licenceStatusRouter;