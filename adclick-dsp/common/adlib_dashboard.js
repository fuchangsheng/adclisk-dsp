/*
 * @file  adlib_dashboard.js
 * @description mySql connection pool for dashboard 
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.10
 * @version 0.0.1 
 */
var database =  (process.env.DB_ENV && 'dsp_dashboard') || 'dsp_dashboard';

var mysql = require('mysql');
var pool  = mysql.createPool({
    host     : '192.168.0.154',
    user     : 'shuao',
    password : 'Zaq1xsw2110',
    database       : database,
    connectionLimit: 20,
    queueLimit     : 30
});

module.exports = pool;
