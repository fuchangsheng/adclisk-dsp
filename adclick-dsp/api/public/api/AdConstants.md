# AdConstants 说明
---
```
 /*
 * @file  adConstants.js
 * @description ad constans 
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.10.30
 * @version 0.0.1 
 */
'use strict';
var CONFIG = require('./config');
var CDataModel = require('./cdata_model');


var adConstants = {
    SERVER: {
        HOST: CONFIG.HOST+':'+CONFIG.PORT,
        //FILESERVER: CONFIG.HOST+':'+CONFIG.PORT+'/',  //no authentication 
        FILESERVER: CONFIG.HOST+'/',
        FILESERVER_2: CONFIG.HOST+':'+CONFIG.FILEPORT+'/', //nodejs server, need the authentication
        ROOT:'./fileserver/files/',
        PORTRAITROOT:'./fileserver/files/portrait/',
        PICSROOT: './fileserver/files/pics/',
        DOWNLOAD: './download/',
    },
    GRADES_DASHBOARD_HOST: CONFIG.GRADES_DASHBOARD_HOST,
    ADX_SERVER: {
        MGTV_HOST: CONFIG.MGTV_HOST,
        BES_HOST: CONFIG.BES_HOST,
        AD_SWITCH: CONFIG.AD_SWITCH,
    },
    MANAGE: 'manage-',
    DBCONNECTIONLIMIT: 30,
    DBQUEUELIMIT: 30,
    UPLOADFILEDNAME: 'upload-file',
    SMSCODEPERIODTIME: 60, //min
    PAGEMAXCOUNT: 200,
    FENUNIT: 100,
    HOURLYTIME: "YYYY-MM-DD HH:00:00",
    DATAFORMAT: 'YYYY-MM-DD',
    DATATIMEFORMAT: 'YYYY-MM-DD HH:mm:ss',
    MONTHLYFORMAT: 'YYYY-MM',
    DEFAULTPAGE: '/index.html',
    PASSWORDMAXLEN: 16,
    PAYDONEHTML: '/pub/pay_done.html',
    EMAILVERIFYDONEHTML: '/pub/email_verify_done.html',
    ROLEPERMISSIONPATHNAME: './business_system/conf/role-permission.json',
    DEFAULTCOUNT: 200,
    ROLE: new CDataModel({
        CREATOR: {code:0, name: '主账号'},
        ADMIN: {code:1, name: '管理员'},
        OPERATOR: {code:2, name: '操作员'},
        VIWER: {code:3, name: '观察员'},
        FINANCIAL: {code:4, name: '财务人员'},
        CUSTOMER: {code:5, name: '客户'},
    }),
    AUDIT: new CDataModel({
        UNSUBMIT: {code: -1, name: '未提交'},
        PASS: {code:0, name: '审核通过'},
        UNCHECK: {code:1, name: '未审核'},
        VERIFYING: {code:2, name: '审核中'},
        FAILED: {code:3 , name: '审核失败'},
        SUBMIT: {code:4, name: '已提交'},
    }),
    STATUS: new CDataModel({
        VALID: {code:0,  name: '有效'},
        DELTED: {code:1,  name: '删除'},
    }),
    TOKENSTATUS: new CDataModel({
        PASS: {code: 0, name:'验证成功'},
        SEND: {code: 1, name:'已发送'},
        FAILED: {code: 2, name:'验证失败'},
    }),
    VERIFYCODESTATUS: new CDataModel({
        PASS: {code:0,  name: '通过'},
        CREATE: {code:1,  name: '创建'},
        GENERATE: {code:2,  name: '生成'},
        FAILED: {code:3,  name: '失败'},
    }),
    VERIFYCODEIMAGE: {
        CHARCOUNT: 4,
        WIDTH: 256,
        HEIGHT: 60,
        OFFSET: 64,
        QUALITY: 100,
        FONTSIZE: 57,
    },
    APPINFO: {
        KEY: '23432071',
        SECRET:'d3602a7f07993e5dea031b142393774a',
        RESTURL:'http://gw.api.taobao.com/router/rest',
        NAME:'数凹DSP',
    },
    SMSSTATUS: new CDataModel({
        PASS:  {code:0,  name: '通过'},
        CREATE:  {code:1, name: '创建'},
        FAILED:  {code:2, name: '失败'},
    }),
    MESSAGECATEGORIES: new CDataModel({
        ALL:  {code:0,  name: '所有消息'},
        SYSTEM:  {code:1,  name: '系统消息'},
        AUDIT:  {code:2,   name: '审核消息'},
        ACCOUNT:  {code:3,  name: '账户消息'},
        FINANCIAL:  {code:4,  name: '财务消息'},
    }),
    MESSAGESUBCATEGORIES: new CDataModel({
        SYSTEMNOTIFY: {code: 1, name: '系统通知'},
        CHECKADFAIL:  {code: 1001, name: '广告审核不通过'},
        ACCOUNTOVERDAYLIMIT: {code: 2001, name: '账户消耗达到日限额'},
        ACCOUNTADPLANOVERDAYLIMIT: {code: 2002, name: '推广计划消耗达到日限额'},
        ACCOUNTADIDEADONE: {code: 2003, name: '创意定制完成通知'},
        ACCOUNTADEXPIRE: {code: 2005, name: '广告投放到期预警'},
        FINANCIALNOBALANCE: {code: 3001, name: '账户余额为零提醒'},
        FINANCIALBALANCE500: {code: 3002, name: '账户余额不足500元预警'},
        FINANCIALBALANCE3DAY: {code: 3003, name: '账户余额不足3日消耗预警'},
        FINANCIALRECHARGEDONE: {code: 3004, name: '资金到账提醒'},        
    }),
    MANAGERMESSAGECATEGORIES: new CDataModel({
        ALL:  {code:0,  name: '所有消息'},
        WARN:  {code:1,  name: '告警消息'},
    }),
    MESSAGECHANNEL: new CDataModel({
        EMPTY: {code: 0, name: 'empty'},
        SMS: {code: 1, name:'手机短信'},
        EMAIL: {code: 2, name:'邮件'},
        SMSEMAIL: {code: 3, name: '手机短信，邮件'},
        EMAILSMS: {code: 3, name: '邮件，手机短信'},
    }),
    MESSAGEREADSTATUS: new CDataModel({
        READ:  {code:0,  name: '已读'},
        UNREAD:  {code:1,  name: '未读'},
    }),
    RECEIVERTYPE: new CDataModel({
        OPERATOR:  {code:0,  name: '站内消息'},
        SMS:  {code:1,  name: '手机短信'},
        EMAIL:  {code:2,  name: '邮件'},
    }),
    EMAILVERIFYTYPE: new CDataModel({
        ADDRECEIVER: {code: 1, name: '新增收件人'},
    }),
    DATASTATUS: new CDataModel({
        VALID: {code:0, name:'有效'},
        INVALID: {code: 1, name: '无效'},
        DELTED: {code: 2, name:'删除'},
    }),
    FINANCIALACCOUNT: new CDataModel({
        REAL:  {code:1,  name: '现金账户'},
        VIRTUAL:  {code:2,  name: '虚拟账户'},
    }),
    FINANCIALRECHARGE : new CDataModel({
        INTERNETBANK:  {code:0,  name: '网银充值'},
        ALIPAY:  {code:1,  name: '支付宝充值'},
        WECHAT:  {code:2,  name: '微信充值'},
        VMANUAL:  {code:3,  name: '后台充值'},
    }),
    REACHAGESTATUS: new CDataModel({
        SUCCESS:  {code:0,  name: '充值成功'},
        CREATE:  {code:1,  name: '充值创建'},
        VERIFY:  {code:2,  name: '充值验证中'},
        FAIL:  {code:3,  name: '充值失败'},
    }),
    INVOICETYPE: new CDataModel({
        GENERAL:  {code:1,  name: '增值税普票'},
        SPECIAL:  {code:2,  name: '增值税专票'},
    }),
    INVOICEITEM : new CDataModel( {
        AD: {code: 0, name: '广告费'},
        ADSERVICE: {code: 1, name: '广告服务费'},
    }),
    INVOICESTATUS: new CDataModel({
        DONE:  {code:0,  name: '完成'},
        SUBMIT:  {code:1,  name: '提交中'},
        PROCCESSING:  {code:2,  name: '处理中'},
        PROCCESSED: {code: 3, name: '已开票'},
        SENT: {code:4, name:'已发送'},
        RECEIVED: {code: 5, name:'已签收'},
        CHECKFAIL: {code: 6, name:'开票拒绝'},
    }),
    ADPLANBUDGETMIN: 0,
    ADBIDTYPE: new CDataModel({
        CPM:  {code:0,  name: 'CPM'},
        CPC:  {code:1,  name: 'CPC'},
        CPD:  {code:2,  name: 'CPD'},
        CPT:  {code:3,  name: 'CPT'},
    }),
    ADSTATUS: new CDataModel({
        START: {
            code: 0,
            name: '启用'
        },
        NOTSTART: {
            code: 1,
            name: '未启动'
        },
        PAUSE: {
            code: 2,
            name: '暂停'
        },
        REMOVE: {
            code: 3,
            name: '临时删除'
        },
    }),
    ADSTATUS2: new CDataModel({
        ALL:  {code:0,  name: '全部'},
        START:  {code:1,  name: '启动'},
        NOTSTART:  {code:2,  name: '未启动'},
    }),
    ADTARGETSTATUS: new CDataModel({
        START:  {code:0,  name: '启用'},
        NOTSTART:  {code:1,  name: '未启用'},
    }),
    ADACTION: new CDataModel({
        START: {
            code: 0,
            name: '启动'
        },
        NOTSTART: {
            code: 1,
            name: '未启动'
        },
        PAUSE: {
            code: 2,
            name: '暂停'
        },
        REMOVE: {
            code: 3,
            name: '临时删除'
        },
    }),
    PLANENDTIMELASTYEARS : 10,
    ADDELIVERYTYPE: new CDataModel({
        UNIFORM: {
            code: 1,
            name: '匀速投放'
        },
        ACCELERATE: {
            code: 1,
            name: '加速投放'
        },
    }),
    ADVIEWTYPE: new CDataModel({
        WEB: {code: 0, name: 'WEB'},
        WAP: {code: 1, name: 'WAP'},
        APP: {code: 2, name: 'APP'},
    }),
    ASSETTYPE: new CDataModel({
        IMAGE: {code: 1, name: '图片'},
        FLASH: {code: 2, name: 'flash'},
        VIDEO: {code: 3, name: '视频'},
    }),
    ASSETSORT: new CDataModel({
        CREATETIME_ASC: {code:1,name:'创建时间增序'},
        CREATETIME_DESC: {code:2,name:'创建时间减序'},
        UPDATETIME_ASC: {code:3,name:'更新时间增序'},
        UPDATETIME_DESC: {code:4,name:'更新时间减序'},
        WIDTH_ASC: {code:5,name:'宽度增序'},
        WIDTH_DESC: {code:6,name:'宽度减序'},
        HEIGHT_ASC: {code:7,name:'高度增序'},
        HEIGHT_DESC: {code:8,name:'高度减序'},
        DURATION_ASC: {code:9,name:'视频时长增序'},
        DURATION_DESC: {code:10,name:'视频时长减序'},
    }),
    IDEATYPE: new CDataModel({
        IMAGE: {code: 1, name: '图片'},
        FLASH: {code: 2, name: 'flash'},
        VIDEO: {code: 3, name: '视频'},
        NATIVE: {code: 4, name: '原生'},
        TEXT: {code: 5, name: '文字'},
        IMAGETEXT: {code: 6, name: '图文'},
    }),
    OPENTYPE: new CDataModel({
        INSITE: {code: 0, name: '站内'},
        OUTSITE: {code: 1, name: '站外'},
    }),
    ADSTYLE: new CDataModel({
        DEFAULT: {code: -1, name: '默认'},
        TIMGBTEXT: {code: 0, name: '上图下文'},
        ONLYIMG: {code: 1, name: '纯图'},
        LIMGRTEXT: {code: 2, name: '左图右文'},
        LIMGMTEXTRBTN: {code: 3, name: '左图中文右按钮'},
        EMBEDDED: {code: 4, name: '嵌入式'},
    }),
    IDEASLOTTYPE: new CDataModel({
        BANNERFIXED: {code: 1, name:'横幅-固定型横幅'},
        OPENSCREEN: {code: 2, name:'开屏'},
        TABLESCREEN: {code: 3, name:'插屏'},
        VIDEO: {code: 4, name:'视频'},
        INFOFLOW: {code: 5, name:'信息流'},
        BANNERFLOAT: {code: 6, name:'横幅-悬浮型横幅'},
    }),
    DASHBOARDDATA: new CDataModel({
        ALL:  {code: 0, name: '所有'},
        REQUEST:  {code: 1, name: '请求'},
        BID:  { code: 2, name: '竞价'},
        IMP:  { code: 3, name: '展现'},
        CLICK: {code: 4, name: '点击'},
        CTR: {code: 5,name: '点击率'},
        CPC: {code: 6, name: 'CPC'},
        CPM: {code: 7, name: 'CPM'},
        COST: {code: 8, name: '花费'},
        CON: {code: 9, name: '转化'},
        CVT: {code: 10, name: '转化率'},
    }),
    OPERCHECKACTION:  new CDataModel({
        GRANT: {code: 0, name:'授权'},
        REJECT: {code: 1, name:'拒绝'},
    }),
    // ADTARGETTYPE: new CDataModel({
    //     ADX: {code: 1, name:'adx'},
    //     ADVIEWTYPE: {code: 2, name:'流量类型'},
    //     REGIONS: {code: 3, name:'地域'},
    //     BLOCKEDREGIONS: {code: 4, name:'地域黑名单'},
    //     ADSELECT: {code: 5, name:'广告优选'},
    //     CYCLE: {code: 6, name:'投放时段'},
    //     COOKIES: {code: 7, name:'cookie'},
    //     BLOCKEDCOOKIES: {code: 8, name:'cookie黑名单'},
    //     SITES: {code: 9, name:'站点'},
    //     BLOCKEDSITES: {code: 10, name:'站点黑名单'},
    //     OS: {code: 11, name:'操作系统'},
    //     CARRIER: {code: 12, name:'运营商'},
    //     CONNECTIONTYPE: {code: 13, name:'连网类型'},
    //     STARTTIME: {code: 14, name:'开始投放时间'},
    //     ENDTIME: {code: 15, name:'结束投放时间'},
    //     ADSLOT: {code: 16, name:'广告位'},
    //     FREQIMPDAILY: {code: 17, name:'展现频次'},
    //     FREQCLICKDAILY: {code: 18, name:'点击频次'},
    //     BROWSER: {code: 19, name:'浏览器'},
    //     EXPERIMENT: {code: 23, name: '实验'},
    //     AGE: {code: 25, name: '年龄'},
    //     SEX: {code: 26, name: '性别'},
    //     EDUCATION: {code: 27, name: '用户学历'},
    //     MARRIAGE: {code: 28, name: '婚姻状态'},
    //     WORK: {code: 29, name: '工作状态'},
    //     BUSINESSINTEREST: {code: 30, name: '商业兴趣'},
    //     HOUSE: {code: 31, name: '楼盘兴趣'},
    //     HOUSEPRICE: {code: 32, name: '居住社区价格'},
    //     PHONE: {code: 1000, name: '手机型号'},
    //     RETARGET: {code: 1001, name: '用户重定向'},
    //     LBS: {code: 1002, name: 'LBS'},
    // }),
    ADOPTIONALTYPE: new CDataModel({
        CITY: {
            code: 0,
            name: '城市'
        },
        PROVINCE: {
            code: 1,
            name: '省份'
        },
        DEVICE: {
            code: 2,
            name: '设备'
        },
        ADSLOT: {
            code: 3,
            name: '广告位'
        },
        TIME_HOURLY: {
            code: 4,
            name: '时间'
        },
    }),

    SUMMARYDATA: new CDataModel({
        ALL: {
            code: 0,
            name: '所有'
        },
        REQUEST: {
            code: 1,
            name: '请求'
        },
        BID: {
            code: 2,
            name: '竞价'
        },
        IMP: {
            code: 3,
            name: '展现'
        },
        CLICK: {
            code: 4,
            name: '点击'
        },
        CTR: {
            code: 5,
            name: '点击率'
        },
        CPC: {
            code: 6,
            name: '单次点击花费'
        },
        CPM: {
            code: 7,
            name: '千次展现花费'
        },
        COST: {
            code: 8,
            name: '花费'
        },
        ACTIVE: {
            code: 9,
            name: '激活'
        },
        CPA: {
            code: 10,
            name: '单次激活花费'
        },
    }),


    ADTARGETTYPE: new CDataModel({
        ADX: {code: 1, name:'adx'},
        ADVIEWTYPE: {code: 2, name:'流量类型'},
        REGIONS: {code: 3, name:'地域'},
        BLOCKEDREGIONS: {code: 4, name:'地域黑名单'},
        ADSELECT: {code: 5, name:'广告优选'},
        CYCLE: {code: 6, name:'投放时段'},
        COOKIES: {code: 7, name:'cookie'},
        BLOCKEDCOOKIES: {code: 8, name:'cookie黑名单'},
        SITES: {code: 9, name:'站点'},
        BLOCKEDSITES: {code: 10, name:'站点黑名单'},
        OS: {code: 11, name:'操作系统'},
        CARRIER: {code: 12, name:'运营商'},
        CONNECTIONTYPE: {code: 13, name:'连网类型'},
        STARTTIME: {code: 14, name:'开始投放时间'},
        ENDTIME: {code: 15, name:'结束投放时间'},
        ADSLOT: {code: 16, name:'广告位'},
        FREQIMPDAILY: {code: 17, name:'展现频次'},
        FREQCLICKDAILY: {code: 18, name:'点击频次'},
        BROWSER: {code: 19, name:'浏览器'},
        IP: {code: 21, name:'IP'},
        BLOCKEDIP: {code: 22, name:'IP黑名单'},
        EXPERIMENT: {code: 23, name: '实验'},
        PHONE: {code: 24, name: '手机型号'},
        RETARGET: {code: 25, name: '用户重定向'},
        LBS: {code: 26, name: 'LBS'},
        SEX: {code: 27, name: '性别'},
        AGE: {code: 28, name: '年龄'},
        CHANNEL: {code: 29, name: '频道'},
        CATEGORY: {code: 30, name: '类别'},
    }),
    AUDITTYPE: new CDataModel({
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
    }),
    AUDITMANAGERTYPE: new CDataModel({
        UNDEFINE:{code: 0, name:'未定义'},
        MANAGER: {code: 1, name:'账户管理'},
        ADS: {code: 2, name:'广告管理'},
        ADUSER: {code: 3, name:'广告主管理'},
        FINANCE: {code: 4, name:'财务管理'},
        USER: {code: 5, name: '用户管理'},
        OPERATOR: {code: 6, name: '用户操作'},
    }),
    DATASORT: new CDataModel({
        CREATETIME_ASC: {code: 0, name: '创建时间增序'},
        CREATETIME_DESC: {code: 1, name: '创建时间减序'},
        UPDATETIME_ASC: {code: 2, name: '更新时间增序'},
        UPDATETIME_DESC: {code: 3, name: '更新时间减序'},
    }),
    DATAUNIT: new CDataModel({
        UNIT_MINUTE: {code: 1, name:'分'},
        UNIT_5MINUTE: {code: 2, name:'5分'},
        UNIT_HOUR: {code: 3, name:'小时'},
        UNIT_DAY: {code: 4, name: '天'},
        UNIT_MONTH: {code: 5, name: '月'},
        UNIT_YEAR: {code: 6, name: '年'},
    }),
    ADUITOPERATEID: new CDataModel({
        UNDEFINE:{code: 0, name:'未定义'},
        REGISTER:{code: 100, name: '注册主账号'},
        RESETPASSWORD:{code: 101, name:'重置密码'},
        EDITACCOUNTINFO:{code:102,name:'编辑广告主信息'},
        EDITACCOUNTQULIFICATION:{code:103,name:'编辑广告主行业资质'},
        ADDROLE:{code:201,name:'添加协作者角色'},
        EDITROLE:{code:202,name:'编辑协作者权限'},
        DELROLE:{code:203,name:'删除协作者角色'},
        ADDOPERATOR:{code:204, name:'添加协作者'},
        EDITOPERATOR:{code:205,name:'编辑协作者'},
        DELOPERATOR:{code:206,name:'删除协作者'},
        CREATEADSPLAN:{code:301,name:'创建广告计划'},
        EDITADSPLAN:{code:302,name:'编辑广告计划'},
        TRASHADSPLAN:{code:303,name:'删除广告计划'},
        COPYADSPLAN:{code:304,name:'复制广告计划'},
        CHANGEADSPLANSTATUS:{code:305,name:'启动/暂停广告计划'},
        DELADSPLAN:{code:306,name:'彻底删除广告计划'},
        SAVEPLANREPORTS:{code:307,name:'保存报告'},
        CREATEADSUNIT:{code:401,name:'创建广告单元'},
        EDITADSUNIT:{code:402,name:'编辑广告单元'},
        TRASHADSUNIT:{code:403,name:'删除广告单元'},
        DELADSUNIT:{code:404,name:'彻底删除广告单元'},
        EDITTARGETSETTING:{code:405,name:'编辑单元定向'},
        CHANGEADSUNITSTATUS:{code:406,name:'启动/暂停广告单元'},
        COPYADSUNIT:{code:407,name:'复制广告单元'},
        LOWESTCOSTSETTING:{code:408,name:'最低出价配置'},
        SAVEUNITREPORTS:{code:409,name:'保存报告'},
        CREATEADSIDEA:{code:501,name:'创建广告创意'},
        EDITADSIDEA:{code:502,name:'编辑广告创意'},
        TRASHADSIDEA:{code:503,name:'删除广告创意'},
        DELADSIDEA:{code:504,name:'彻底删除广告创意'},
        COPYADSIDEA:{code:505,name:'复制广告创意'},
        CHANGEADSIDEASTATUS:{code:506,name:'启动/暂停广告创意'},
        SAVEIDEAREPORTS:{code:507,name:'保存报告'},
        CREATERULE:{code:601,name:'创建自动规则'},
        EDITRULE:{code:602,name:'编辑自动规则'},
        DELRULE:{code:603,name:'删除自动规则'},
        CHANGERULESTATUS:{code:604,name:'启动/暂停自动规则'},
        CREATETARGETTEMPLATE:{code:701,name:'创建定向模板'},
        EDITTARGETTEMPLATE:{code:702,name:'编辑定向模板'},
        DELTARGETTEMPLATE:{code:703,name:'删除定向模板'},
        CREATEASSET:{code:801,name:'新建素材'},
        EDITASSET:{code:802,name:'编辑素材'},
        DELASSET:{code:803,name:'删除素材'},
        DELREPORTS:{code:900,name:'删除报告'},
        CREATECUSTOMAUDIENCE:{code:1001,name:'新建自定义受众'},
        DELCUSTOMAUDIENCE:{code:1002,name:'删除自定义受众'},
        WECHATPAY:{code:1101,name:'微信支付'},
        ALIPAY:{code:1102,name:'支付宝支付'},
        CREATEINVOICEINFO:{code:1201,name:'新增发票信息'},
        EDITINVOICEINFO:{code:1202,name:'编辑发票信息'},
        DELINVOICEINFO:{code:1103,name:'删除发票信息'},
        INVOICE:{code:1104,name:'开票'},
        INVOICESIGN:{code:1105,name:'发票签收'},
        ADDMESSAGERECEIVER:{code:1301,name:'新增消息接收人'},
        DELMESSAGERECEIVER:{code:1302,name:'删除消息接收人'},
        EDITMESSAGESETTING:{code:1303,name:'编辑消息结接收设置'},
    }),
    ADUITMANAGERID: new CDataModel({
        UNDEFINE:{code: 0, name:'未定义'},
        ADDMANAGER:{code: 11, name: '添加管理员'},
        DELMANAGER:{code: 12, name: '删除管理员'},
        VERIFYMANAGER:{code: 13, name: '授权管理员'},
        VERCHARGE:{code: 21, name: '虚拟账户充值'},
        VERCHARGEUPDATE:{code: 22, name: '充值状态更新'},
        INVOICEREQUEST: {code: 31, name: '开具发票'},
        INVOICERDELIVERY: {code: 32, name: '快递发票'},
    }),
    VIDEORATIO: new CDataModel({
        AD_16_9:{code: 0, name:'AD_16:9'},
        AD_4_3:{code: 1, name: 'AD_4:3'},
    }),
    ADXLIST: new CDataModel({
        BES:{code: 0, name:'BES'},
        BCH:{code: 1, name: 'BCH'},
        MEIZU:{code: 2, name:'MEIZU'},
        DEMO:{code: 3, name: 'DEMO'},
        CLOUD_ADX:{code: 4, name:'CLOUD_ADX'},
        ADX_A5:{code: 5, name: 'ADX_A5'},
        CLOUD_ADROI:{code: 6, name:'CLOUD_ADROI'},
        ADX_MGTV:{code: 7, name: 'ADX_MGTV'},
        AD_SWITCH:{code: 8, name: 'AD_SWITCH'},
        ADX_IPUSH:{code: 9, name: 'ADX_IPUSH'},
        AD_SWITCH_TENCENT:{code: 100, name: 'AD_SWITCH_TENCENT'},
        AD_SWITCH_JD:{code: 101, name: 'AD_SWITCH_JD'},
    }),
    AD_SWITCH_LIST: new CDataModel({
        AD_SWITCH_TENCENT:{code: 100, name: 'AD_SWITCH_TENCENT'},
        AD_SWITCH_JD:{code: 101, name: 'AD_SWITCH_JD'},
    }),
    AD_SWITCH_ADX_LIST: new CDataModel({
        AD_SWITCH_TENCENT: {code: 20009, name: 'AD_SWITCH_TENCENT'},
        AD_SWITCH_JD: {code: 20026, name: 'AD_SWITCH_JD'},
    }),
    ADSQUERYID: new CDataModel({
        REGIONS:{code: 0, name:'地域'},
    }),
    WEEK: new CDataModel({
        MONDAY: {code: 1, name: '星期一'},
        TUESDAY: {code: 2, name: '星期二'},
        WEDNESDAY: {code: 3, name: '星期三'},
        THURSDAY: {code: 4, name: '星期四'},
        FRIDAY: {code: 5, name: '星期五'},
        SATURDAY: {code: 6, name: '星期六'},
        SUNDAY: {code: 0, name: '星期天'},
    }),
    TASKTYPE: new CDataModel({
        CHARGEFILTER: {code: 1, name: 'ChargeFilterTask'},
        CHARGE: {code: 2, name: 'ChargeTask'},
        CHARGEUPDATE: {code: 3, name: 'ChargeUpdateTask'},
        CTRLOG: {code: 4, name: 'CtrLogTask'},
        DASHBOARDLOG: {code: 5, name: 'DashboardLogTask'},
        PALOLOG: {code: 6, name: 'PaloLogTask'},
        SHITULOG: {code: 7, name: 'ShituLogTask'},
    }),
    TASKSTATUS: new CDataModel({
        SUCCESS: {code: 1, name: '成功'},
        RUNNING: {code: 2, name: '运行中'},
        FAILED: {code: 3, name: '失败'},
    }),
    ORDER: new CDataModel({
        ASC: {code: 1, name: '正序'},
        DESC: {code: 2, name: '逆序'},
    }),
    OS: new CDataModel({
        WINDOWS: {code: 0, name: 'WINDOWS'},
        MAC: {code: 1, name: 'MAC'},
        LINUX: {code: 2, name: 'LINUX'},
        IOS: {code: 3, name: 'IOS'},
        ANDROID: {code: 4, name: 'ANDROID'},
    }),
    CARRIER: new CDataModel({
        TELCOM: {code: 0, name: '电信'},
        MOBILECOM: {code: 1, name: '移动'},
        UNICOM: {code: 2, name: '联通'},
        NETCOM: {code: 3, name: '网通'},
    }),
    CONNECTIONTYPE: new CDataModel({
        WIFI: {code: 0, name: 'WIFI'},
        GENERATION_2G: {code: 1, name: '2G'},
        GENERATION_3G: {code: 2, name: '3G'},
        GENERATION_4G: {code: 3, name: '4G'},
        ETHERNET: {code: 4, name: 'Ethernet'},
    }),
    BROWSER: new CDataModel({
        IE: {code: 0, name: '微软IE'},
        CHROME: {code: 1, name: 'Chrome'},
        FIREFOX: {code: 2, name: 'FireFox'},
        SAFARI: {code: 3, name: 'Safari'},
        Opera: {code: 4, name: 'Opera'},
        Edge: {code: 5, name: '微软Edge'},
        WECHAT: {code: 6, name: '微信浏览器'},
        QQ: {code: 7, name: 'QQ浏览器'},
        360: {code: 8, name: '360浏览器'},
        UC: {code: 9, name: 'UC浏览器'},
        SOGOU: {code: 10, name: '搜狗浏览器'},
    }),
    MESSAGESTAUS: new CDataModel({
        HASSENT: {code: 0, name: '已发送'},
        NOTSENT: {code: 1, name: '未发送'},
    }),
    CONVERSIONTYPE: new CDataModel({
        MANUAL: {code: 0, name: '手动录入'},
        AUTO: {code: 1, name: '导入csv文件'},
    }),
    ROLECATEGORIES: new CDataModel({
        ADDMANAGEMENT: {code:1, name: '广告管理'},
        AUTORULE: {code: 2, name: '自动规则'},
        TOOLS: {code: 3, name: '工具箱'},
        FINANCEMANAGEMENT: {code:4, name: '财务管理'},
        FINANCESETTING: {code:5, name: '财务设置'},
        ACCOUNTSETTING: {code:6, name: '账户设置'},
        SYSTEMSETTING: {code:7, name: '系统设置'},
        MESSAGEVIEW: {code:8, name: '查看消息'},
    }),
    ROLESUBCATEGORIES: new CDataModel({
        ADLIST: {code: 0x101, name: '广告列表'},
        ADACTIVITYRECORD: {code: 0x102, name: '活动记录'},
        ADAMOUNT: {code: 0x103, name: '涉及金额的投放数据'},
        RULECREATE: {code: 0x104, name: '创建规则'},
        REPORTEXPORT: {code: 0x105, name: '导出报告'},
        REPORTSAVE: {code: 0x106, name: '保存报告'},
        RULELIST: {code: 0x201, name: '规则列表'},
        RULEACTIVITYRECORD: {code: 0x202, name: '活动记录'},
        TARGETTEMPLATE: {code: 0x301, name: '定向模板'},
        CUSTOMAUDIENCE: {code: 0x302, name: '自定义受众'},
        ASSETLIB: {code: 0x303, name: '素材库'},
        ADREPORT: {code: 0x304, name: '广告报告'},
        TOOLREPORTEXPORT: {code: 0x305, name: '导出报告'},
        ACCOUNTAMOUNT: {code: 0x401, name: '账户余额'},
        RECHARGE: {code: 0x402, name: '充值'},
        FINANCERECORDS: {code: 0x403, name: '财务记录'},
        INVOICEMANAGEMENT: {code: 0x404, name: '发票管理'},
        ACCOUNTINFO: {code: 0x501, name: '账户基本信息'},
        ACCOUNTQUALIFICATION: {code: 0x502, name: '账户资质'},
        PASSWORDRESET: {code: 0x503, name: '密码重置'},
        ROLEMANAGEMENT: {code: 0x601, name: '权限管理'},
        OPERMANAGEMENT: {code: 0x602, name: '协作者管理'},
        OPERLOG: {code: 0x603, name: '操作日志'},
        MESSAGESET: {code: 0x604, name: '消息设置'},
        MESSAGEVIEW: {code: 0x701, name: '查看消息'},
    }),
    ROLECHANNEL: new CDataModel({
        NONE: {code: -1, name: '无效'},
        READABLLE: {code: 0, name: '只读'},
        WRITABLE: {code: 1, name: '只写'},
        READWRITABLE: {code: 2, name: '读写'},
    }),
    REPORTLIMIT: new CDataModel({
        TARGET: {code: 0, name: '对象'},
        IMP: {code: 1, name: '展现量'},
        CPM: {code: 2, name: '千次展现费用'},
        CLK: {code: 3, name: '点击量'},
        CTR: {code: 4, name: '点击率'},
        CPC: {code: 5, name: '单次点击费用'},
        CV: {code: 6, name: '转化量'},
        CVR: {code: 7, name: '转化率'},
        CPCV: {code: 8, name: '单次转化费用'},
        COST: {code: 9, name: '总费用'},
    }),
    REPORTOP: new CDataModel({
        EQ: {code: 0, name: '等于'},
        GT: {code: 1, name: '大于'},
        LT: {code: 2, name: '小于'},
        BT: {code: 3, name: '介于'},
        NBT: {code: 4, name: '不介于'},
    }),
    DELIVERYSTATUS: new CDataModel({
        NONE: {code: 0, name: '无'},
        VERIFYING: {code: 1, name: '待审核'},
        FAILED: {code: 2, name: '未通过'},
        NOSTART: {code: 4, name: '未投放'},
        DELVERING: {code: 8, name: '投放中'},
        PAUSE: {code: 16, name: '已暂停'},
        FINISH: {code: 32, name: '已完成'},
        DELETE: {code: 64, name: '已删除'},
    }),
    REPORTELEMENT: new CDataModel({
        UNITNAME: {code: 0x00000001, name: '单元名称'},
        IMP: {code: 0x00000002, name: '展现量'},
        CPM: {code: 0x00000004, name: '千次展现费用'},
        CLK: {code: 0x00000008, name: '点击量'},
        CTR: {code: 0x00000010, name: '点击率'},
        CPC: {code: 0x00000020, name: '单次点击费用'},
        CV: {code: 0x00000040, name: '转化量'},
        CVR: {code: 0x00000080, name: '转化率'},
        CPCV: {code: 0x00000100, name: '单次转化费用'},
        COST: {code: 0x00000200, name: '总费用'},
        BID: {code: 0x00000400, name: '出价'},
        BIDTYPE: {code: 0x000000800, name: '出价类型'},
        DEILVERSTATUS: {code: 0x000001000, name: '投放状态'},
    }),
    REPORTDETAILTYPE: new CDataModel({
        NONE: {code: 0, name: '无'},
        GENDER: {code: 1, name: '性别'},
        AGE: {code: 2, name: '年龄'},
        CHANNEL: {code: 3, name: '频道'},
        FAV: {code: 4, name: '兴趣'},
        WEEK: {code: 5, name: '星期'},
        DAY: {code: 5, name: '天'},
        PROV: {code: 6, name: '省'},
        CITY: {code: 7, name: '市'},
        MOBILEMODEL: {code: 8, name: '手机型号'},
        OS: {code: 9, name: '操作系统'},
        CONNTYPE: {code: 10, name: '上网类型'},
        SLOT: {code: 11, name: '广告位'},
    }),
    REPORTTARGETTYPE: new CDataModel({
        USER: {code: 1, name: '广告主'},
        PLAN: {code: 2, name: '广告计划'},
        UNIT: {code: 3, name: '广告单元'},
        IDEA: {code: 4, name: '广告创意'},
    }),
};


module.exports = adConstants;
```