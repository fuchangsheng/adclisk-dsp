// Error code helper 
// copyright@demtec.com reserved, 2016
/*
 * history:
 * 2016.11.01, created by Andy.zhou
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
var config = {};
var deploy = (process.env.ADCLICK_DEPLOY && process.env.ADCLICK_DEPLOY==='release') || false;
var adx_sandbox = (process.env.ADX_SANDBOX && process.env.ADX_SANDBOX === 'adx_sandbox') || false;

if (deploy) {
    config = {
        HOST: 'http://172.16.1.180',
        PORT: 80,
        GRADES_DASHBOARD_HOST: 'http://rtb.adclick.com.cn:80',
        BIZPORT: 6188,
        MGRPORT: 6189,
        FILEPORT: 6190,
        CROSSENABLE: false,
        NGINX: true,
        DBFILE: '../conf/config.txt'
    };
} else {
    config = {
        HOST: 'http://172.16.1.180',
        PORT: 6188,
        GRADES_DASHBOARD_HOST: 'http://rtb.adclick.com.cn:80',
        BIZPORT: 6188,
        MGRPORT: 6189,
        FILEPORT: 6190,
        CROSSENABLE: true,
        NGINX: false,
        DBFILE: '../conf/config.txt'
    };
}

if (adx_sandbox) {
    config.BES_HOST = 'https://apitest.es.baidu.com';
    config.MGTV_HOST = 'http://adx.da.mgtv.com';
    config.AD_SWITCH = 'http://api.sandbox.adswitch.cn';
} else {
    config.BES_HOST = 'https://api.es.baidu.com';
    config.MGTV_HOST = 'http://adx.da.mgtv.com';
    config.AD_SWITCH = '';
}

module.exports = config;
