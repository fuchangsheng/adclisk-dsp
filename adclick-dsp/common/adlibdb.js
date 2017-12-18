/*
 * @file  adlibdb.js
 * @description mySql connection pool for dsp user account 
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
var database =  (process.env.DB_ENV && 'dsp_adlib') || 'dsp_adlib';

var mysql = require('mysql');
var pool  = mysql.createPool({
    host     : '192.168.0.167',
    user     : 'shuao',
    password : 'Zaq1xsw2110',
    database       : database,
    connectionLimit: 20,
    queueLimit     : 30
});

module.exports = pool;
