/*
 * @file  alipay.js
 * @description alipay view API and logic
 * @copyright dmtec.cn reserved, 2017
 * @author Gary.cui
 * @date 2017.11.28
 * @version 3.0.1 
 */
'use strict';
var mFs = require('fs');

var ERRCODE = require('../../../../../common/errCode');
var ADCONSTANTS = require('../../../../../common/adConstants');

var AlipayConfig = {
    partner:'2088521144418121' //合作身份者id，以2088开头的16位纯数字
    ,key:'wcmlm7co87hfouloe8otxx1p4gia2487'//安全检验码，以数字和字母组成的32位字符
    ,seller_email:'han349064224@126.com' //卖家支付宝帐户 必填
    ,host: ADCONSTANTS.SERVER.HOST //域名
    ,cacert: __dirname+'/cacert.pem'//ca证书路径地址，用于curl中ssl校验 请保证cacert.pem文件在当前文件夹目录中
    ,transport: 'https' //访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http
    ,input_charset:'utf-8'//字符编码格式 目前支持 gbk 或 utf-8
    ,sign_type:"MD5"//签名方式 不需修改
    ,create_direct_pay_by_user_return_url : '/v1/pay/alipay/return_url'
    ,create_direct_pay_by_user_notify_url: '/v1/pay/alipay/notify_url'
    ,refund_fastpay_by_platform_pwd_notify_url : '/alipay/refund_fastpay_by_platform_pwd/notify_url'
    ,create_partner_trade_by_buyer_notify_url: '/aplipay/create_partner_trade_by_buyer/notify_url'
    ,create_partner_trade_by_buyer_return_url: '/aplipay/create_partner_trade_by_buyer/return_url'
    
    ,trade_create_by_buyer_return_url : '/alipay/trade_create_by_buyer/return_url'
    ,trade_create_by_buyer_notify_url: '/alipay/trade_create_by_buyer/notify_url'
};

var WechatPayConfig = {
  partnerKey: '4vf5602d4wmuqwon1do3iu154jtm52a4',
  appId: 'wx47d2b17677400c45',
  mchId: '1487567452',
  notifyUrl: ADCONSTANTS.SERVER.HOST + '/v1/pay/wechat/notify_url',
  pfx: mFs.readFileSync(__dirname+'/apiclient_cert.p12'),
}

module.exports.AlipayConfig = AlipayConfig;
module.exports.WechatPayConfig = WechatPayConfig;