// miniERP entry for web server
// copyright@dmtec.cn reserved, 2016
/*
 * history:
 * 2016.10.31, created by Andy.zhou
 *  
 */
/*
 * @file  account_recharge_log.js
 * @description dsp user account recharge info data model and API
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
'use strict';
var MODULENAME = 'adclickdsp.app';

//system modules
var express = require('express');
var app = express();
var fs = require('fs');
var debug = require('debug')(MODULENAME);
var path = require('path');

//helper
var mDatahelper = require('../utils/data_helper');
var mLogger = require('../utils/logger')(MODULENAME);

//utils
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
    host: mDBConfig.adclickDsp.host,
    port: mDBConfig.adclickDsp.port,
    user     : mDBConfig.adclickDsp.user,
    password : mDBConfig.adclickDsp.password,
    database: mDBConfig.adclickDsp.database,
    checkExpirationInterval: 900000,// How frequently expired sessions will be cleared; milliseconds. 
    expiration: 86400000,// The maximum age of a valid session; milliseconds. 
};
var sessionStore = new MySQLStore(sqlOptions);

app.use(session({
  unset:'destroy',
  key: 'adclickdsp_session_cookie',
  secret: 'adclickdspXsw@#edc110',
  // store: sessionStore,
  cookie: {path:'/', secure:false, httpOnly:false, maxAge: 2*3600*1000,},
  
}));

/// body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded());

/// morgan log
var morgan = require('morgan');
app.use(morgan('combined'));

// Mount model API //////////////////////////////////////////////

///////////////////////////////////////////////////////


// Mount logic API ////////////////////////////////////

// ACL logic
var acl = require('./logic/acl');
app.use(acl.router);

//user interfaces
var userApi = require('./logic/user/user_api');
app.use(userApi.router);

//util interface
var utilsApi = require('./logic/utils/utils_api');
app.use(utilsApi.router); 

//ads
var adsApi = require('./logic/ads/ads_api');
app.use(adsApi.router);

//audit_log
var auditLogApi = require('./logic/auditLog/audit_log_api');
app.use(auditLogApi.router);

var recordsApi = require('./logic/records/records_api');
app.use(recordsApi.router);

var rulesApi = require('./logic/rules/rules_api');
app.use(rulesApi.router);

var settingsApi = require('./logic/settings/settings_api');
app.use(settingsApi.router);

var uploadApis = require('./logic/upload/upload_api');
app.use(uploadApis.router);

// front static resource ////////////////////////////////////
//static path
if (CONFIG.NGINX===false) {
  app.use(express.static(__dirname + '/view'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname +'/download'));
  app.use(express.static(__dirname +'/fileserver/files'));
}


///////////////////////////////////////////////////////


// Mount view pages ////////////////////////////////////

// front
//var api_front_index = fs.readFileSync(__dirname+'/front/main.html');
//app.use('/main', function(req, res){
//  console.log('req.session:%j', req.session);

//  res.set('Content-Type', 'text/html');
//  res.write(api_front_index);
//  res.end();
//});


// SPA portal
app.use(function(req, res){
  debug('req.url'+req.originalUrl);

  if (CONFIG.CROSSENABLE) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  if (CONFIG.NGINX===true) {
      var json = {};
      json.code = ERRCODE.NOVIEW;
      json.message = 'Adclick DSP, no view';
      res.json(json);
  }else {
      res.set('Content-Type', 'text/html');
      res.send('Adclick DSP, no view');
  }
});

var server = app.listen(CONFIG.BIZPORT);
mLogger.info('Adclick DSP business http server listening on ' + CONFIG.BIZPORT);

module.exports = server;