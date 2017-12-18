/*
 * @file  db.js
 * @description mySql connection pool for dsp system
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
var database =  (process.env.DB_ENV && 'adclickdsp') || 'adclickdsp';

var mysql = require('mysql');
var pool  = mysql.createPool({
    host     : '180.76.179.44',
    user     : 'dmtec',
    password : 'adclickZaq!2wsx',
    database       : database,
    connectionLimit: 20,
    queueLimit     : 30
});

module.exports = pool;
