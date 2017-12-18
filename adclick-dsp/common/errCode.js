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

var errCode = module.exports = {
    PARAM_INVALID: 10001,
    NEED_LOGIN: 10002,
    NOLOGIN: 10003,
    NOVIEW: 10004,

    INVALID_VERIFYCODE: 20001,
    SMSCODE_SEND_FAILED:20002,
    SMSCODE_TOOMANY: 20003,
    SMSCODE_INVALID: 20004,
    SMSCODE_OUTOFDATE: 20005,
    TOKEN_OUTOFDATE: 20006,
    
    INVALID_USER_PASSWD: 30001,
    PASSWORD_TOO_SIMPLE: 30002,
    INVOICE_UNEDITABLE: 30003,
    DATA_INVALID: 30004,
    INVOICE_REQUIRE_AMOUNT_TOOLARGE: 30005,
    WECHATPAY_CREATEORDER_FAILED: 30006,
    ALIPAY_VERIFY_FAILED: 30007,
    PERMISSIONS_LIMITED: 30008,
    BUDGET_OVERFLOW: 30009,
    
    DB_ERROR: 40001,
    DB_NO_MATCH_DATA :40002,
    DB_CONNECTION_FAIL :40003,
    DB_PARAMS_INVALID :40004,
    DB_VALUES_INVALID : 40005,
    DB_QUERY_FAIL :40006,
    DB_NO_MORE_DATA  : 40007,
    DB_TRANSACTION_ERR: 40008,
    DB_SQL_EMPTY: 40009,
    DB_DATADUPLICATED: 40010,
    DB_CREATEDATAFAILED: 40011,

    REQUEST_FAILED: 50001,
    REQUEST_INVALID: 50002,
    REQUEST_DENIED: 50003,

    ASSET_BEINGUSED: 60001
};

module.exports = errCode;


