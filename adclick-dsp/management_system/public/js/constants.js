/*
 * @file  constants.js
 * @description constants
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.16
 * @version 0.0.1 
 */
'use strict';

/** ***************************************************************************************** */
/*******************************************************************************
 * error msg constants and help functions /
 ******************************************************************************/
var ERRCODE = {
    REQUESTERR : {
        code : 1,
        msg : ''
    },

    PARAM_INVALID : {
        code : 10001,
        msg : '参数错误'
    },

    INVALID_VERIFYCODE : {
        code : 20001,
        msg : '验证码错误'
    },
    SMSCODE_SEND_FAILED : {
        code : 20002,
        msg : '短信验证码发送失败'
    },
    SMSCODE_TOOMANY : {
        code : 20003,
        msg : '请求短信验证码过于频繁'
    },
    SMSCODE_INVALID : {
        code : 20004,
        msg : '短信验证码错误'
    },
    SMSCODE_OUTOFDATE : {
        code : 20005,
        msg : '短信验证码过期'
    },
    TOKEN_OUTOFDATE : {
        code : 20006,
        msg : '短信令牌过期'
    },

    INVALID_USER_PASSWD : {
        code : 30001,
        msg : '用户名或者密码错误'
    },
    PASSWORD_TOO_SIMPLE : {
        code : 30002,
        msg : '用户密码过于简单'
    },
    INVOICE_UNEDITABLE : {
        code : 30003,
        msg : '发票无法编辑'
    },
    DATA_INVALID : {
        code : 30004,
        msg : '无效数据'
    },
    INVOICE_REQUIRE_AMOUNT_TOOLARGE : {
        code : 30005,
        msg : '开票金额过大'
    },
    WECHATPAY_CREATEORDER_FAILED : {
        code : 30006,
        msg : '微信支付创建失败'
    },

    DB_ERROR : {
        code : 40001,
        msg : '数据库错误'
    },
    DB_NO_MATCH_DATA : {
        code : 40002,
        msg : '没有匹配数据'
    },
    DB_CONNECTION_FAIL : {
        code : 40003,
        msg : '数据库访问失败'
    },
    DB_PARAMS_INVALID : {
        code : 40004,
        msg : '数据库参数错误'
    },
    DB_VALUES_INVALID : {
        code : 40005,
        msg : '数据库无效数据'
    },
    DB_QUERY_FAIL : {
        code : 40006,
        msg : '数据库访问失败'
    },
    DB_NO_MORE_DATA : {
        code : 40007,
        msg : '没有新数据'
    },
    DB_TRANSACTION_ERR : {
        code : 40008,
        msg : '事务失败'
    },
    DB_SQL_EMPTY : {
        code : 40009,
        msg : '空查询'
    },
    DB_DATADUPLICATED : {
        code : 40010,
        msg : '数据重复'
    },
    DB_CREATEDATAFAILED : {
        code : 40011,
        msg : '数据创建失败'
    },
};

var mERRMSGBUF = null;

function getErrMsg(param) {
    var code = param.code || param;
    if (!code) {
    return '未知错误！';
    }

    if (!mERRMSGBUF) {
    mERRMSGBUF = [];
    Object.keys(ERRCODE).forEach(function(k) {
        mERRMSGBUF.push(ERRCODE[k]);
    });
    }

    for (var i = 0; i < mERRMSGBUF.length; i++) {
    if (mERRMSGBUF[i].code == code) {
        return mERRMSGBUF[i].msg;
    }
    }
    return '未知错误！';
}

/** ***************************************************************************************** */
/*******************************************************************************
 * server service path /
 ******************************************************************************/

var SERVERCONF = {
    HOST : 'http://admin.dsp.adclick.com.cn',
    PORT : '80',
    ADMIN : {
        ADUSERLIST : {
            path : '/v1/aduser/list',
            method : 'GET',
        },
        ADUSERVIEW : {
            path : '/v1/aduser/view',
            method : 'GET',
        },
        ADUSERUSERTYPE : {
            path : '/v1/aduser/usertype',
            method : 'GET',
        },
        ADUSERUSERTYPEUPDATE : {
            path : '/v1/aduser/usertype/update',
            method : 'POST',
        },
        ADUSERQUALIFITIONVIEW : {
            path : '/v1/aduser/qualification/view',
            method : 'GET',
        },
        ADUSERIDEALIST : {
            path : '/v1/aduser/ads/idea/list',
            method : 'GET',
        },
        ADUSERUNITVIEW : {
            path : '/v1/aduser/ads/unit/view',
            method : 'GET',
        },
        ADUSERUNITTARGETDETAIL : {
            path : '/v1/aduser/ads/unit/target/details',
            method : 'GET',
        },
        ADUSERINVOICELIST : {
            path : '/v1/aduser/invoice/list',
            method : 'GET',
        },
        ADUSERSLOTPRICELIST : {
            path : '/v1/aduser/slot/price/list',
            method : 'GET',
        },
        ADUSERSLOTPRICECONTROL : {
            path : '/v1/aduser/slot/price/op',
            method : 'POST',
        },
        ADUSERSLOTPRICEADD : {
            path : '/v1/aduser/slot/price/add',
            method : 'POST',
        },
        ADUSERIDEAAUDIT : {
            path : '/v1/aduser/ads/idea/audit',
            method : 'POST',
        },
        ADUSERINVOICEAUDIT : {
            path : '/v1/aduser/invoice/audit',
            method : 'POST'
        },
        ADUSERQUALIFITIONAUDIT : {
            path : '/v1/aduser/qualification/audit',
            method : 'POST'
        },
        ADUSERAUDIT : {
            path : '/v1/aduser/audit',
            method : 'POST'
        },
        ADMINADD : {
            path : '/v1/admin/add',
            method : 'POST'
        },
        ADMINUPDATE : {
            path : '/v1/admin/update',
            method : 'POST'
        },
        ADMINDEL : {
            path : '/v1/admin/delete',
            method: 'POST'
        },
        ADMINLIST : {
            path : '/v1/admin/list',
            method : 'GET'
        },
        ADMININFO : {
            path: '/v1/admin/info',
            method : 'GET'
        },
        TAGUSERSUM : {
            path: '/v1/aduser/tag/user_sum',
            method : 'POST'
        }
    },
    MGR : {
        LOGIN : {
            path : '/v1/mgr/login',
            method : 'POST'
        },
        CAPREQUEST : {
            path : '/v1/mgr/captha/request',
            method : 'POST'
        },
        CAPREQUESTIMG : {
            path : '/v1/mgr/captha/request/img',
            method : 'GET'
        },
        CAPVERIFY : {
            path : '/v1/mgr/captha/verify',
            method : 'POST'
        },
        LOGOUT : {
            path : '/v1/mgr/logout',
            method : 'POST'
        }
    },
    USERS : {
        USERNAME : {
            path: '/v1/user/info',
            method: 'GET'
        },
        USEREDIT : {
            path: '/v1/user/edit',
            method: 'POST'
        },
        QUALIFICATIONEDIT: {
            path: '/v1/user/qualification/edit',
            method: 'POST'
        },
        EDITCONTACT: {
            path: '/v1/user/contact/edit',
            method: 'POST'
        },
        INVOICELIST: {
            path: '/v1/user/invoice/list',
            method: 'GET'
        },
        INVOICEEDIT: {
            path: '/v1/user/invoice/edit',
            method: 'POST'
        },
        INVOICEDEL: {
            path: '/v1/user/invoice/del',
            method: 'POST'
        },
        INVOICEADD: {
            path: '/v1/user/invoice/add',
            method : 'POST'
        },
        OPERATORLIST:{
            path: '/v1/user/operator/list',
            method: 'GET'
        },
        OPERATORADD:{
            path: '/v1/user/operator/add',
            method: 'POST'
        },
        OPERATORVERIFY:{
            path: '/v1/user/operator/verify',
            method: 'POST',
        },
        GETSMS : {
            path : '/v1/sms/request',
            method : 'POST',
        },
        LOGIN : {
            path : '/v1/user/login',
            method : 'POST',
        },
        LOGOUT : {
            path :  '/v1/user/logout',
            method : 'POST'
        },
        REGIST : {
            path : '/v1/user/register',
            method : 'POST',
        },
        RESETPASS : {
            path : '/v1/user/password/reset',
            method : 'POST',
        },
        FORGETPASS : {
            path : '/v1/user/password/forget',
            method : 'POST',
        },
        GETVERIFYCODE : {
            path : '/v1/captha/request',
            method : 'POST',
        },
        GETVERIFYIMG : {
            path : '/v1/captha/request/img',
            method : 'GET',
        },
        VERIFYIMGVERIFY : {
            path : '/v1/captha/verify',
            method : 'POST'
        },
        DELOPERATOR: {
            path: '/v1/user/operator/del',
            method : 'POST'
        }
    },
    MESSAGE : {
        UNREADMSGNUM : {
            path : '/v1/message/num/unread',
            method : 'GET'
        },
        SETMSG : {
            path : '/v1/message/set/view',
            method : 'GET'
        },
        MSGLIST : {
            path : '/v1/message/list',
            method : 'GET'
        },
        ReceiverList : {
            path : '/v1/message/receivers/list',
            method : 'GET'
        },
        EDITMSG : {
            path : '/v1/message/set/edit',
            method : 'POST'
        },
        DELCONTACT:{
            path:'/v1/message/receivers/del',
            method:'POST'
        },
        ADDCONTACT:{
            path:'/v1/message/receivers/add',
            method:'POST'
        },
        SMSVERIFY:{
            path:'/v1/message/smsreceivers/verify',
            method:'POST'
        },
        MSGSTATUS:{
            path:'/v1/message/read',
            method:'POST'
        }
    },
    ACCOUNT : {
        BALANCE : {
            path : '/v1/faccount/balance',
            method : 'GET'
        },
        RECHARGERECORDS : {
            path : '/v1/faccount/records',
            method : 'GET'
        },
        ALIPAY : {
            path : '/v1/pay/alipay/pay',
            method : 'POST'
        },
        WECHATPAY : {
            path : '/v1/pay/wechat/pay',
            method : 'POST'
        },
        INVOICEREQUEST : {
            path : '/v1/faccount/invoice/request',
            method : 'POST'
        },
        INVOICERECORDS : {
            path : '/v1/aduser/faccount/invoice/records',
            method : 'GET'
        },
        INVOICEFINISH : {
            path : '/v1/aduser/faccount/invoice/finish',
            method : 'POST'
        },
        INVOICEAUDIT : {
            path : '/v1/aduser/faccount/invoice/audit',
            method : 'POST'
        },
        INVOICEPROCESS : {
            path : '/v1/aduser/faccount/invoice/process',
            method : 'POST'
        },
        INVOICEDELIVER : {
            path : '/v1/aduser/faccount/invoice/delivery',
            method : 'POST'
        },
        INVOICEBALANCE : {
            path : '/v1/faccount/invoice/balance',
            method : 'GET'
        },
        PAYORDERVIEW : {
            path : '/v1/pay/wechat/query',
            method : 'GET'
        },
        VRECHARGE:{
            path:'/v1/aduser/faccount/vrecharge',
            method:'POST'
        },
        OPRECORDS:{
            path:'/v1/aduser/faccount/oprecords',
            method:'GET'
        },
        RECHARGEUPDATE:{
            path:'/v1/aduser/faccount/recharge/update',
            method:'POST'
        }
    },
    ADS : {
        PLANLIST : {
            path : '/v1/ad/plan/list',
            method : 'GET'
        },
        PLANSEARCH : {
            path : '/v1/ad/plan/search',
            method : 'GET'
        },
        PLANCONTROL : {
            path : '/v1/ad/plan/op',
            method : 'POST'
        },
        PLANCREATE : {
            path : '/v1/ad/plan/create',
            method : 'POST'
        },
        PLANEDIT : {
            path : '/v1/ad/plan/edit',
            method : 'POST'
        },
        PLANVIEW : {
            path : '/v1/ad/plan/view',
            method : 'GET'
        },
        PLANDEL : {
            path : '/v1/ad/plan/del',
            method : 'POST'
        },
        UNITLIST : {
            path : '/v1/ad/unit/list',
            method : 'GET'
        },
        UNITCONTROL : {
          path : '/v1/ad/unit/op',
          method : 'POST'
        },
        UNITDEL : {
            path : '/v1/ad/unit/del',
            method : 'POST'
        },
        UNITVIEW : {
            path : '/v1/ad/unit/view',
            method : 'GET'
        },
        UNITCREATE :{
            path : '/v1/ad/unit/create',
            method : 'POST'
        },
        UNITEDIT : {
            path :'/v1/ad/unit/edit',
            method : 'POST'
        },
        UNITTARGETDETAILS : {
            path : '/v1/ad/unit/target/details',
            method : 'GET'
        },
        UNITTARGETEDIT : {
            path : '/v1/ad/unit/target/edit',
            method : 'POST'
        },
        IDEALIST : {
            path : '/v1/ad/idea/list',
            method : 'GET'
        },
        IDEAVIEW : {
            path : '/v1/ad/idea/view',
            method : 'GET'
        },
        IDEAOP : {
            path : '/v1/ad/idea/op',
            method : 'POST'
        },
        IDEADEL : {
            path : '/v1/ad/idea/del',
            method : 'POST'
        },
        IDEAPIC : {
            path : '/v1/upload/idea/pic',
            method : 'POST'
        },
        IDEAFLASH : {
            path : '/v1/upload/idea/flash',
            method : 'POST',
        },
        IDEAVIDEO : {
            path : '/v1/upload/idea/video',
            method : 'POST',
        },
        IDEAEDIT : {
            path : '/v1/ad/idea/edit',
            method: 'POST'
        },
        IDEAADD : {
            path : '/v1/ad/idea/create',
            method : 'POST'
        },
        UNITSEARCH: {
            path : '/v1/ad/unit/search',
            method: 'GET'
        }
    },
    DASHBOARD : {
        ADUSERVIEW : {
            path : '/v1/dashboard/aduser/view',
            method : 'GET'
        },
        ADUSERDOWNLOAD : {
            path : '/v1/dashboard/aduser/download',
            method : 'GET',
        },
        SUMMARY : {
            path : '/v1/dashboard/summary',
            method : 'GET'
        },
        IDEASUMMARY : {
            path : '/v1/dashboard/idea/summary',
            method : 'GET'
        },
        UNITSUMMARY : {
            path : '/v1/dashboard/unit/summary',
            method : 'GET'
        },
        PLANSUMMARY : {
            path : '/v1/dashboard/plan/summary',
            method : 'GET'
        },
        IDEATOP : {
            path : '/v1/dashboard/idea/top',
            method : 'GET'
        },
        OVERVIEWALL : {
            path : '/v1/dashboard/overview/all',
            method : 'GET'
        },
        OVERVIEWALLDOWNLOAD : {
            path : '/v1/dashboard/overview/all/download',
            method : 'GET'
        },
        OVERVIEWUSER : {
            path : '/v1/dashboard/overview/user',
            method : 'GET'
        },
        OVERVIEWUSERDOWNLOAD : {
            path : '/v1/dashboard/overview/user/download',
            method : 'GET'
        },
        OVERVIEWADX : {
            path : '/v1/dashboard/overview/adx',
            method : 'GET'
        },
        OVERVIEWADXDOWNLOAD : {
            path : '/v1/dashboard/overview/adx/download',
            method : 'GET'
        },
        REALTIMEALL : {
            path : '/v1/dashboard/realtime/all',
            method : 'GET'
        },
        REALTIMEALLDOWNLOAD : {
            path : '/v1/dashboard/realtime/all/download',
            method : 'GET'
        },
        REALTIMEUSER : {
            path : '/v1/dashboard/realtime/user',
            method : 'GET'
        },
        REALTIMEUSERDOWNLOAD : {
            path : '/v1/dashboard/realtime/user/download',
            method : 'GET'
        },
        REALTIMEADX : {
            path : '/v1/dashboard/realtime/adx',
            method : 'GET'
        },
        REALTIMEADXDOWNLOAD : {
            path : '/v1/dashboard/realtime/all/download',
            method : 'GET'
        },
        QUERY:{
            path : '/v1/dashboard/query',
            method : 'GET'
        },
        ADDRESSLIST : {
            path : '/v1/dashboard/address/list',
            method : 'GET'
        },
    },
    UPLOAD : {
        LICENSE : {
            path : '/v1/upload/license',
            method : 'POST'
        },
        QUALIFICATION : {
            path : '/v1/upload/qualification',
            method : 'POST'
        },
        INVOICE : {
            path : '/v1/upload/invoice',
            method : 'POST'
        },
    },
    AUDITLOG : {
        OPLOG : {
            path : '/v1/auditlog/manager/list',
            method : 'GET'
        }
    },
    ADX : {
        LIST : {
            path : '/v1/adx/list',
            method : 'GET'
        },
        IDEALIST : {
            path : '/v1/adx/idea/list',
            method : 'GET'
        },
        IDEASUBMIT : {
            path : '/v1/adx/idea/submit',
            method : 'GET'
        },
        IDEAQUERY : {
            path : '/v1/adx/idea/query',
            method : 'GET'
        },
        USERQUERY : {
            path : '/v1/adx/user/query',
            method : 'GET'
        },
        LICENSESUBMIT : {
            path : '/v1/adx/licence/submit',
            method : 'GET'
        },
        IDEAUPDATE : {
            path : '/v1/adx/idea/update',
            method : 'GET'
        },
        USERLIST : {
            path : '/v1/adx/user/list',
            method : 'GET'
        },
        USERSUBMIT : {
            path : '/v1/adx/user/submit',
            method : 'GET'
        },
        CONFIG : {
            path : '/v1/adx/config',
            method : 'POST'
        },
        IDEAAUDITEDIT: {
            path: '/v1/adx/idea/audit/edit',
            method: 'POST'
        }
        
    },
    COST: {
        OVERVIEW : {
            path : '/v1/cost/overview',
            method: 'GET'
        },
        DETAIL : {
            path : '/v1/cost/detail',
            method: 'GET'
        }
    },
    TASK: {
        TASKLIST : {
            path: '/v1/task/list',
            method: 'GET'
        },
        TASKRESTART : {
            path: '/v1/task/restart',
            method: 'POST'
        }
    }
}

var SYSTEM = {
    RECHARGEMIN : 0,
    SALT : "%7F$S0V34I-9R*DCGu|BTv)=zkplrtKqjN:h_P]Y@gMQes!cZ<Owb>aJ[E}nd#6(52f?UL1\{&8WAHoy/X+imx",
}

var ADCONSTANT = {
        ROLE: {
        CREATOR: '主账号',
        ADMIN: '管理员',
        OPERATOR: '操作员',
        VIWER: '观察员',
        FINANCIAL: '财务',
    },
    AUDIT: {
        PASS: '审核通过',
        UNCHECK: '未审核',
        VERIFYING: '审核中',
        FAILED: '审核失败',
        SUBMIT: '已提交', 
        UNSUBMIT: '未提交'
    },
    MESSAGESUBCATEGORIES: {
        SYSTEMNOTIFY: '系统通知',
        CHECKADFAIL:  '广告审核不通过',
        ACCOUNTOVERDAYLIMIT: '账户消耗达到日限额',
        ACCOUNTADPLANOVERDAYLIMIT: '推广计划消耗达到日限额',
        ACCOUNTADIDEADONE: '创意定制完成通知',
        ACCOUNTADEXPIRE: '广告投放到期预警',
        FINANCIALNOBALANCE: '账户余额为零提醒',
        FINANCIALBALANCE500: '账户余额不足500元预警',
        FINANCIALBALANCE3DAY: '账户余额不足3日消耗预警',
        FINANCIALRECHARGEDONE: '资金到账提醒',
    },
    MESSAGECHANNEL: {
        EMPTY: 'empty',
        SMS: '手机短信',
        EMAIL: '邮件',
        SMSEMAIL: '手机短信，邮件',
        EMAILSMS: '邮件，手机短信',
    },
    MESSAGEREADSTATUS: {
        READ:  '已读',
        UNREAD:  '未读',
    },
    RECEIVERTYPE: {
        OPERATOR:  '站内消息',
        SMS:  '手机短信',
        EMAIL:  '邮件',
    },
    OVERVIEWTYPE: {
        USER : 'user_id',
        ADX : 'adx_id',
        ALL : 'all_id',
    },
    FINANCIALACCOUNT: {
        REAL:  '现金账户',
        VIRTUAL: '虚拟账户',
    },
    INVOICETYPE: {
        GENERAL:  '增值税普票',
        SPECIAL:  '增值税专票',
    },
    INVOICEITEM : {
        AD: '广告费',
        ADSERVICE: '广告服务费',
    },
    ADSTATUS: {
        START: '投放中',
        NOTSTART:  '未启动',
        PAUSE:  '暂停',
    },
    ADACTION: {
        START: '启动',
        PAUSE: '暂停',
    },
    ADVIEWTYPE: {
        WEB: 'WEB',
        WAP: 'WAP',
        APP: 'APP',
    },
    IDEATYPE: {
        IMAGE: '图片',
        FLASH: 'flash',
        VIDEO: '视频',
        NATIVE: '原生',
        TEXT: '文字',
        IMAGETEXT: '图文',
    },
    IDEASLOTTYPE: {
        IGNORE: '忽略',
        BANNERFIXED: '横幅-固定型横幅',
        OPENSCREEN: '开屏',
        TABLESCREEN: '插屏',
        VIDEO: '视频',
        INFOFLOW: '信息流',
        BANNERFLOAT: '横幅-悬浮型横幅',
    },
    DASHBOARDDATA: {
        ALL:  '所有',
        REQUEST:  '请求',
        BID:  '竞价',
        IMP:  '展现',
        CLICK: '点击',
        CTR: '点击率',
        CPC: 'CPC',
        CPM: 'CPM',
        COST: '花费',
    },
    OPERCHECKACTION:  {
        GRANT: '授权',
        REJECT: '拒绝',
    },
    ADTARGETTYPE: {
        ADX: 'adx',
        ADVIEWTYPE: '流量类型',
        REGIONS: '地域',
        BLOCKEDREGIONS: '地域黑名单',
        ADSELECT: '广告优选',
        CYCLE: '投放时段',
        COOKIES: 'cookie',
        BLOCKEDCOOKIES: 'cookie黑名单',
        SITES: '站点',
        BLOCKEDSITES: '站点黑名单',
        OS:'操作系统',
        CARRIER: '运营商',
        CONNECTIONTYPE: '连网类型',
        STARTTIME: '开始投放时间',
        EDNTIME: '结束投放时间',
        ADSLOT: '广告位',
        FREQIMPDAILY: '展现频次',
        FREQCLICKDAILY: '点击频次',
        BROWSER: '浏览器',
    },
    DATASORT: {
        CREATETIME_ASC: '创建时间增序',
        CREATETIME_DESC: '创建时间减序',
        UPDATETIME_ASC: '更新时间增序',
        UPDATETIME_DESC: '更新时间减序',
    },
    DATAUNIT: {
        UNIT_MINUTE: '分',
        UNIT_5MINUTE: '5分',
        UNIT_HOUR: '小时',
        UNIT_DAY: '天',
        UNIT_MONTH: '月',
        UNIT_YEAR: '年',
    },
    ADXLIST:{
        BES: 'BES',
        BCH: 'BCH',
        MEIZU: 'MEIZU',
        DEMO: 'DEMO',
        CLOUD_ADX: 'CLOUD_ADX',
        ADX_A5: 'ADX_A5',
        CLOUD_ADROI: 'CLOUD_ADROI',
        ADX_MGTV: 'ADX_MGTV',
        AD_SWITCH: 'AD_SWITCH',
        ADX_IPUSH: 'ADX_IPUSH',
        AD_SWITCH_TENCENT: 'AD_SWITCH_TENCENT',
        AD_SWITCH_JD: 'AD_SWITCH_JD'
    },
    REALTIMEDATE:{
        ALL:'all',
        MOUTH:'mouth',
        DAY:'day',
        HOUR:'hour',
        MINUTE:'minute',
    },
    DASHBOARDCHOOSEID:{
        ALLIDEA:'allidea',
        PLAN:'plan_id',
        UNIT:'unit_id',
        IDEA:'idea_id',
    },
    REALTIMECHOOSE:{
      BIDREQ:{
          prefix:'cloud_dsp',
          name:'bid_req',
      },
      BID:{
          prefix:'cloud_dsp',
          name:'bid',
      },  
      IMP:{
          prefix:'cloud_dsp',
          name:'imp',
      },  
      CLICK:{
          prefix:'cloud_dsp',
          name:'click',
      },  
      COST:{
          prefix:'cloud_dsp',
          name:'cost',
      },  
      COSTCPM:{
          prefix:'cloud_dsp',
          name:'cost_cpm',
      },  
      COSTCPC:{
          prefix:'cloud_dsp',
          name:'cost_cpc',
      },  
      COSTCPD:{
          prefix:'cloud_dsp',
          name:'cost_cpd',
      },  
    },
    REALTIMECHOOSEPERSECOND:{
        BIDREQ:{
            prefix:'cloud_dsp',
            name:'bid_req_per_second',
        },
        BID:{
            prefix:'cloud_dsp',
            name:'bid_per_second',
        },  
        IMP:{
            prefix:'cloud_dsp',
            name:'imp_per_second',
        },  
        CLICK:{
            prefix:'cloud_dsp',
            name:'click_per_second',
        },  
        COST:{
            prefix:'cloud_dsp',
            name:'cost_per_second',
        },  
        COSTCPM:{
            prefix:'cloud_dsp',
            name:'cost_cpm_per_second',
        },  
        COSTCPC:{
            prefix:'cloud_dsp',
            name:'cost_cpc_per_second',
        },  
        COSTCPD:{
            prefix:'cloud_dsp',
            name:'cost_cpd_per_second',
        },  
      },
}