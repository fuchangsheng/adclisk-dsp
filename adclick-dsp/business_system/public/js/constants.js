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
    NEED_LOGIN:{
        code: 10002,
        msg: '未登录'
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
    BUDGET_OVERFLOW :{
        code : 30009,
        msg : '账户余额不足'
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
    HOST : 'http://180.76.138.144',
    PORT : '6188',
    USERS : {
        USERVIEW : {
            path: '/v1/user/view',
            method: 'GET'
        },
        USERNAME : {
            path: '/v1/user/info',
            method: 'GET'
        },
        USERTYPE : {
            path: '/v1/user/usertype',
            method: 'GET'
        },
        CHECKLOGIN: {
            path: '/v3/user/check-login',
            method: 'GET'
        },
        USEREDIT : {
            path: '/v1/user/edit',
            method: 'POST'
        },
        QUALIFICATIONVIEW : {
            path: '/v1/user/qualification/view',
            method: 'GET'
        },
        QUALIFICATIONEDIT : {
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
        INVOICESIGN: {
            path: '/v1/faccount/invoice/sign',
            method : 'GET'
        },
        OPERATORLIST:{
            path: '/v1/user/operator/list',
            method: 'GET'
        },
        OPERATORADD:{
            path: '/v1/user/operator/add',
            method: 'POST'
        },
        OPERATOREDIT:{
            path: '/v1/user/operator/edit',
            method: 'POST'
        },
        OPERATORVERIFY:{
            path: '/v1/user/operator/verify',
            method: 'POST',
        },
        GETSMS : {
            path : '/v3/sms/request',
            method : 'POST',
        },
        LOGIN : {
            path : '/v3/user/login',
            method : 'POST',
        },
        LOGOUT : {
            path :  '/v3/user/logout',
            method : 'POST'
        },
        REGIST : {
            path : '/v3/user/regist',
            method : 'POST',
        },
        RESETPASS : {
            path : '/v3/password/reset',
            method : 'POST',
        },
        FORGETPASS : {
            path : '/v3/password/forget',
            method : 'POST',
        },
        GETVERIFYCODE : {
            path : '/v3/captha/request',
            method : 'POST',
        },
        GETVERIFYIMG : {
            path : '/v3/captha/request/img',
            method : 'GET',
        },
        VERIFYIMGVERIFY : {
            path : '/v3/captha/verify',
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
        RESENDEMAIL:{
            path: '/v1/message/email/requset',
            method: 'POST'
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
            path : '/v1/faccount/invoice/records',
            method : 'GET'
        },
        INVOICEBALANCE : {
            path : '/v1/faccount/invoice/balance',
            method : 'GET'
        },
        PAYORDERVIEW : {
            path : '/v1/pay/wechat/query',
            method : 'GET'
        },
        COSTALL : {
            path : '/v1/cost/overview',
            method : 'GET'
        },
        COSTDETAIL : {
            path : '/v1/cost/detail',
            method : 'GET'
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
        },
        IDEASUBMITAUDIT : {
            path: '/v1/ad/idea/submit/audit',
            method : 'POST'
        },
        COMMONQUERY : {
            path : '/v1/ad/common/query',
            method : 'GET'
        },
        BUSINESSINTEREST: {
            path: '/v1/ad/business/interest/query',
            method: 'GET'
        },
        PHONEMODEL: {
            path: '/v1/ad/phone/model/query',
            method: 'GET'
        },
        RETARGET: {
            path: '/v1/ad/retarget/query',
            method: 'GET'
        },
        LABELQUERY : {
            path : '/v1/ad/label/query',
            method : 'GET'
        },
        CHANNELQUERY : {
            path : '/v1/ad/channel/query',
            method : 'GET'
        },
        CATEGORYQUERY : {
            path : '/v1/ad/category/query',
            method : 'GET'
        },
        ASSERTLIST: {
            path: '/v1/ad/asset/list',
            method: 'GET'
        },
        TARGETCREATE: {
            path: '/v1/ad/target/template/create',
            method : 'POST'
        },
        TARGETEDIT: {
            path: '/v1/ad/target/template/edit',
            method : 'POST'
        },
        TARGETDEL: {
            path: '/v1/ad/target/template/del',
            method : 'POST'
        },
        TARGETVIEW: {
            path: '/v1/ad/target/template/view',
            method : 'GET'
        },
        TARGETLIST: {
            path: '/v1/ad/target/template/list',
            method : 'GET'
        },
        IDEAPRIMERUPDATE: {
            path: '/v1/ad/idea/primer/update',
            method: 'POST'
        },
        UNITPRIMERCLEAR: {
            path: '/v1/ad/unit/primer/idea/clear',
            method: 'POST'
        },
        CONVERSIONADD: {
            path: '/v1/ad/conversion/create',
            method: 'POST'
        },
        CONVERSIONQUERY: {
            path: '/v1/ad/conversion/query',
            method: 'GET'
        }
    },
    DASHBOARD : {
        ADUSERVIEW : {
            path : '/v1/dashboard/aduser/view',
            method : 'GET'
        },
        PLANVIEW : {
            path : '/v1/dashboard/plan/view',
            method : 'GET'
        },
        UNITVIEW : {
            path : '/v1/dashboard/unit/view',
            method : 'GET'
        },
        IDEAVIEW : {
            path : '/v1/dashboard/idea/view',
            method : 'GET'
        },
        REALTIMEADUSERVIEW : {
            path : '/v1/dashboard/realtime/aduser/view',
            method : 'GET'
        },
        REALTIMEPLANVIEW : {
            path : '/v1/dashboard/realtime/plan/view',
            method : 'GET'
        },
        REALTIMEUNITVIEW : {
            path : '/v1/dashboard/realtime/unit/view',
            method : 'GET'
        },
        REALTIMEIDEAVIEW : {
            path : '/v1/dashboard/realtime/idea/view',
            method : 'GET'
        },
        ADUSERDOWNLOAD : {
            path : '/v1/dashboard/aduser/download',
            method : 'GET',
        },
        PLANDOWNLOAD : {
            path : '/v1/dashboard/plan/download',
            method : 'GET',
        },
        UNITDOWNLOAD : {
            path : '/v1/dashboard/unit/download',
            method : 'GET',  
        },
        IDEADOWNLOAD : {
            path : '/v1/dashboard/idea/download',
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
        UNITTOP : {
            path : '/v1/dashboard/unit/top',
            method : 'GET'
        },
        PLANTOP : {
            path : '/v1/dashboard/plan/top',
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
            path : '/v1/auditlog/operator/list',
            method : 'GET'
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
    CHECK: {
        PASS: '审核通过',
        UNCHECK: '未审核',
        VERIFYING: '审核中',
        FAILED: '审核失败', 
        UNSUBMIT: '未提交'
    },
    MESSAGECATEGORIES: {
        ALL:  '所有消息',
        SYSTEM:  '系统消息',
        AUDIT:  '审核消息',
        ACCOUNT:  '账户消息',
        FINANCIAL:  '财务消息',
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
        EMPTY : 'empty',
        SMS :'手机短信',
        EMAIL :'邮件',
        SMSEMAIL : '手机短信，邮件',
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
        SEX: '性别',
        EDUCATION: '用户学历',
        MARRIAGE: '婚姻状态',
        WORK: '工作状态',
        BUSINESSINTEREST: '商业兴趣',
        AGE: '年龄',
        HOUSEPRICE: '居住社区价格',
        RETARGET: '用户重定向',
        PHONEMODEL: '手机型号',
        CHANNEL: '频道',
        CATEGORY: '类别',
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
    VIDEORATIO:{
        AD_16_9: 'AD_16:9',
        AD_4_3: 'AD_4:3',
    },
    DASHBOARDCHOOSE:{
        ALLIDEA:'all',
        PLAN:'plan',
        UNIT:'unit',
        IDEA:'idea',
    },
    DASHBOARDCHOOSEID:{
        ALLIDEA:'allidea',
        PLAN:'plan_id',
        UNIT:'unit_id',
        IDEA:'idea_id',
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
        ADX_IPUSH: 'ADX_IPUSH',
        //AD_SWITCH: 'AD_SWITCH',
        TENCENT: 'AD_SWITCH_TENCENT',
        JD: 'AD_SWITCH_JD'
    },
    LOGININHTML: '/index.html',
}
