const ERRORCODE = {
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

const AUDITTYPE = {
    UNDEFINE:{code: 0, name:'未定义'},
    ACCOUNT: {code: 1, name:'账户'},
    ADSPLAN: {code: 2, name:'广告计划'},
    ADSUNIT: {code: 3, name:'广告单元'},
    ADSIDEA: {code: 4, name:'广告创意'},
    FINANCE: {code: 5, name:'财务'},
    TARGETTEMPLATE: {code: 6, name: '定向模板'},
    CUSTOMAUDIENCE: {code: 7, name: '自定义受众'},
    ASSET: {code: 8, name: '素材'},
    MESSAGE: {code: 9, name: '消息'},
    RULE: {code: 10, name: '自动规则'},
    REPORT: {code: 11, name: '广告报告'},
};


/*TODO
const SERVERCONF = {
    HOST : 'http://dsp.adclick.com.cn',
    PORT : '80',
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
            path: '/v1/user/checklogin',
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
            path : '/v3/settings/finance/balance',
            method : 'GET'
        },
        RECHARGERECORDS : {
            path : '/v3/settings/finance/recharge/list',
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
            path : '/v3/settings/finance/invoice/list',
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
} */

//TODO
const SERVERCONF = {
    HOST : 'http://dsp.adclick.com.cn',
    PORT : '80',
    USERS : {
        USERVIEW : {
            path: '/v1/user/view',
            method: 'GET'
        },
        USERNAME : {
            path: '/v3/settings/account/info/view',
            method: 'POST'
        },
        USERTYPE : {
            path: '/v1/user/usertype',
            method: 'GET'
        },
        CHECKLOGIN: {
            path: '/v1/user/checklogin',
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
            path: '/v3/settings/finance/invoice-info/list',
            method: 'GET'
        },
        INVOICEEDIT: {
            path: '/v3/settings/finance/invoice-info/edit',
            method: 'POST'
        },
        INVOICEDEL: {
            path: '/v3/settings/finance/invoice-info/del',
            method: 'POST'
        },
        INVOICEADD: {
            path: '/v3/settings/finance/invoice-info/add',
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
             path : '/v3/settings/finance/balance',
             method : 'GET'
         },
         RECHARGERECORDS : {
             path : '/v3/settings/finance/recharge/list',
             method : 'GET'
         },
         ALIPAY : {
             path : '/v3/settings/finance/pay/ali-pay',
             method : 'POST'
         },
         ALIPAYRETURN :{
            path: '/v3/pay/payinfo',
            method: 'POST'
         },
         WECHATPAY : {
             path : '/v3/settings/finance/pay/wechat-pay',
             method : 'POST'
         },
         INVOICEREQUEST : {
            path : '/v3/settings/finance/invoice/add',
             method : 'POST'
         },
         INVOICERECORDS : {
             path : '/v3/settings/finance/invoice/list',
             method : 'GET'
         },
         INVOICEBALANCE : {
             path : '/v3/settings/finance/invoice/amount',
             method : 'GET'
         },
         PAYORDERVIEW : {
             path : '/v3/settings/finance/pay/wechat-query',
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
     TEAMWORKER : {
        LIST : {
            path : '/v3/settings/system/operator/list',
            method : 'GET'    
        },
        ADD : {
            path : '/v3/settings/system/operator/add',
            method : 'POST'
        },
        DEL : {
            path : '/v3/settings/system/operator/del',
            method : 'POST'
        },
        EDIT : {
            psth : '/v3/settings/system/operator/edit',
            method : 'POST'
        }
     },
     OPEARTION : {
         OPERATELOG : {
             path : '/v3/records/operate-log',
             method : 'POST'
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
    SUMMARY: {
        DAILYSUMMARY: {
            path: '/v3/ads/summary/dailylist',
            method: 'GET'
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
let mERRMSGBUF = null; 

function getErrMsg(param){
    let code = param.code || param;
    if(!code){
        return '未知错误';
    }
    if(!mERRMSGBUF){
        mERRMSGBUF = [];
        Object.keys(ERRORCODE).forEach(function(k){
            mERRMSGBUF.push(ERRORCODE[k]);
        });
    }
    for(let i = 0 ;i<mERRMSGBUF.length;i++){
        if(code == mERRMSGBUF[i].code){
            return mERRMSGBUF[i].msg;
        }
    }
    return '未知错误';
}

var SYSTEM = {
    RECHARGEMIN : 0,
    SALT : "%7F$S0V34I-9R*DCGu|BTv)=zkplrtKqjN:h_P]Y@gMQes!cZ<Owb>aJ[E}nd#6(52f?UL1\{&8WAHoy/X+imx",
}



export { ERRORCODE, SERVERCONF, getErrMsg, SYSTEM ,AUDITTYPE};
