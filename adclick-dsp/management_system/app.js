// miniERP entry for web server
// copyright@dmtec.cn reserved, 2016
/*
 * history:
 * 2016.12.2, created by LiXingxin
 *  
 */
/*
 * @file  app.js
 * @description dsp management entry API
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.2
 * @version 0.0.1 
 */

'use strict';
var MODULENAME = 'adclickdsp_management.app';

var express = require('express');
var path = require('path');
var debug = require('debug')(MODULENAME);
var app = express();

//helper
var mDatahelper = require('../utils/data_helper');
var mLogger = require('../utils/logger')(MODULENAME);
var mUtils = require('../utils/utils');

//common constants
var ERRCODE = require('../common/errCode');
var ADCONSTANTS = require('../common/adConstants');
var CONFIG = require('../common/config');

// db
var config_path = path.join(__dirname,'../conf/config.txt');
var mConf = mUtils.loadJson(config_path);
var mDBConfig = mConf.db;

// Middlewares
/// cookie
var cookieParser = require('cookie-parser');
app.use(cookieParser());

/// cookie session
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var sqlOptions = {
    host: mDBConfig.adclickMgr.host,
    port: mDBConfig.adclickMgr.port,
    user     : mDBConfig.adclickMgr.user,
    password : mDBConfig.adclickMgr.password,
    database: mDBConfig.adclickMgr.database,
    checkExpirationInterval: 900000,// How frequently expired sessions will be cleared; milliseconds. 
    expiration: 86400000,// The maximum age of a valid session; milliseconds. 
};
var sessionStore = new MySQLStore(sqlOptions);

app.use(session({
  unset:'destroy',
  key: 'adclickdsp_mgr_session_cookie',
  secret: 'adclickdspXsw@#edc110',
  store: sessionStore,
  cookie: {path:'/', secure:false, httpOnly:false, maxAge: 2*3600*1000,},
}));

/// body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

/// morgan log
var morgan = require('morgan');
app.use(morgan('combined'));

// pre create needed dict
mUtils.createCommonDir('./', ['download/captha']);

// static path
if (CONFIG.NGINX===false){
  app.use(express.static(path.join(__dirname, '/public')));
  app.use(express.static(path.join(__dirname, '/views')));
  app.use(express.static(path.join(__dirname, '/download')));
}


// ACL logic
var acl = require('./logic/acl.js');
app.use('/*', acl.router);

//back router api
var adminRouter = require('./logic/administrator/admin_logic_api');
app.use(adminRouter.router);

var api_users = require('./logic/user/user_api');
app.use(api_users.router);

var api_aduser_mgr = require('./logic/aduser_management/aduser_api');
app.use(api_aduser_mgr.router);

var api_ads_mgr = require('./logic/ads_management/ads_api');
app.use(api_ads_mgr.router);

var api_finance_management = require('./logic/finance_management/finance_management_api');
app.use(api_finance_management.router);

var api_adx = require('./logic/adx/adx_api');
app.use(api_adx.router);

var api_dashboard = require('./logic/dashboard/dashboard_api');
app.use(api_dashboard.router);

var api_dashboard_realtime = require('./logic/dashboard_realtime/dashboard_api');
app.use(api_dashboard_realtime.router);

var messageApi = require('./logic/message/message_api');
app.use(messageApi.router);

var auditLogApi = require('./logic/auditLog/audit_log_api');
app.use(auditLogApi.router);

var verifyApis = require('./logic/verify/verify_api');
app.use(verifyApis.router);

var coastApi = require('./logic/cost/cost_api');
app.use(coastApi.router);

var tasktApi = require('./logic/task/task_api');
app.use(tasktApi.router);

//static views router
//var views = require('./logic/views_router');
//app.use(views.router);

///////////////////////////////
//task
var taskApi = require('./task/task_api');

// SPA portal
app.use(function(req, res){
  debug('req.url: ' + req.originalUrl);

  if (CONFIG.CROSSENABLE) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.set('Content-Type', 'text/html');
  res.send('AdClick DSP management, no view');
});

var server = app.listen(CONFIG.MGRPORT);
mLogger.info('adclick dsp management http server listening on ' + CONFIG.MGRPORT);

module.exports = server;