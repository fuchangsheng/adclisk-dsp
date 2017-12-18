/*
 * @file  db.js
 * @description mySql connection pool for dsp system
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
'use strict'

var mysql = require('mysql');
var mUtils = require('../utils/utils');
var mPath = require('path');
var ADCONSTANTS = require('./adConstants');
var CONFIG = require('./config');

var path = mPath.join(__dirname, CONFIG.DBFILE);
var mConf = mUtils.loadJson(path);

var mDBConfig = mConf.db;

function createDB(dbConfig){
    return mysql.createPool({
        host     : dbConfig.host,
        user     : dbConfig.user,
        password : dbConfig.password,
        database       : dbConfig.database,
        port: dbConfig.port || 3306,
        connectionLimit: dbConfig.connection || ADCONSTANTS.DBCONNECTIONLIMIT,
        queueLimit     : dbConfig.queue || ADCONSTANTS.DBQUEUELIMIT,
    });
}

var adclickDspDB = createDB(mDBConfig.adclickDsp);

var adclickMgrDB = createDB(mDBConfig.adclickMgr);

var adlibAuditDB = createDB(mDBConfig.adlibAudit);

var adclickDashBoardDB = createDB(mDBConfig.adlibDashboard);

var adlibPaloDB  = createDB(mDBConfig.adlibPalo);

var adlibAdsDB = createDB(mDBConfig.adlibAD);

var adlibAdxDB = createDB(mDBConfig.adlibAdx);

var realTimeDB = createDB(mDBConfig.realTime);

var taskDB = createDB(mDBConfig.task);

var controllerDB = createDB(mDBConfig.controller);

var adlibTags = createDB(mDBConfig.adlibTags);

var adxConfig = createDB(mDBConfig.adxConfig);

var adxPalo = createDB(mDBConfig.adxPalo);

module.exports.adclickDspDB = adclickDspDB;
module.exports.adclickMgrDB = adclickMgrDB;
module.exports.adlibAuditDB = adlibAuditDB;
module.exports.adclickDashBoardDB = adclickDashBoardDB;
module.exports.adlibPaloDB = adlibPaloDB;
module.exports.adlibAdsDB = adlibAdsDB;
module.exports.adlibAdxDB = adlibAdxDB;
module.exports.realTimeDB = realTimeDB;
module.exports.taskDB = taskDB;
module.exports.controllerDB = controllerDB;
module.exports.adlibTags = adlibTags;
module.exports.adxConfig = adxConfig;
module.exports.adxPalo = adxPalo;