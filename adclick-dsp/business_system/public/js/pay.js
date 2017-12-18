/*
 * @file  pay.js
 * @description pay page js logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.14
 * @version 0.0.1 
 */
'use strict';

!function() {
    // page static elements
    var mPayTitleH =  null;
    var mPayAmountH = null;
    var mPayerNameH = null;
    var mDefaultSureBtn = null;
    var mWxQRCodeDiv = null;
    var mHintPanel = null;
    var mDefaultSureTitle = null;

    //module variable
    var mWxQRCodeUrl = null;
    var mWxOrderId = null;
    var mWxTimer = null;

    /********************************************************************/
    /*
    /********************************************************************/
    $(function(){
        initPageStaticElements();

        var pay = parseURLParameter();
    
        initPage(pay);

        rendPayInfo(pay);

        registerCB(pay);
    });

    function registerCB(pay) {
        mDefaultSureBtn.click(function() {

            if (mWxQRCodeUrl) {
                jQuery('#wxqrcode').qrcode({width: 160, height: 160, text: mWxQRCodeUrl});

                mHintPanel.text('请打开微信扫码支付！');
                startWxQuery();
                mWxQRCodeUrl = null;
            }else {
                if (pay.type==1) {
                    return;
                }
                
                var data = {
                    amount: pay.amount,
                };
                var param = {
                    sinterface:  SERVERCONF.ACCOUNT.WECHATPAY,
                    data: data,
                };
                
                ajaxCall(param, function(err, data) {
                    if (err) {
                        return alert(getErrMsg(err));
                    }
                    mWxQRCodeDiv.empty();
                    jQuery('#wxqrcode').qrcode(
                        {width: 160, height: 160, 
                         text: data.content});
                    mWxOrderId = data.id;

                    mHintPanel.text('请打开微信扫码支付！');
                    startWxQuery();
            
                });
            }           
        });
    }

    function initPageStaticElements() {
        mPayTitleH = $('#paytitle');
        mPayAmountH = $('#payeramount'); 
        mPayerNameH = $('#payername');
        mDefaultSureBtn = $('#defaultsure');
        mWxQRCodeDiv = $('#wxqrcode');
        mHintPanel = $('#hintMsg');
        mDefaultSureTitle = $('#defaultsureTitle');
    }

    function initPage(pay) {
        var paytitle= '';
        var hintMsg = '';
        var bntTitle = '';
        if (pay.type==1) {
            paytitle ='支付宝充值';
            hintMsg = '确认无误后请点击确认按钮';
            bntTitle = '确认';
        }else {
            paytitle ='微信扫码充值';
            hintMsg = '确认无误后请点击获取二维码按钮';
            bntTitle = '获取二维码';
        }

        mPayTitleH.text(paytitle);
        mHintPanel.text(hintMsg);
        mDefaultSureTitle.text(bntTitle);
        
        mPayAmountH.text('金额：'+pay.amount+'元');

        getUserName(function(err, data) {
            if (err) {
                mPayerNameH.text('付款方：');
            }else {
                mPayerNameH.text('付款方：'+data);
            }
        });
    }

    function rendPayInfo(pay) {
        var sinterface = null;
        if (pay.type==1) {
            sinterface = SERVERCONF.ACCOUNT.ALIPAY;
        }else {
            sinterface = SERVERCONF.ACCOUNT.WECHATPAY;
        }
        
        var param = {
            sinterface: sinterface
        };
        var data = {
            amount: pay.amount,
        };
        param.data = data;

        ajaxCall(param, function(err, data) {
            if (err) {
                return alert(getErrMsg(err));
            }
            if (pay.type==1) {
                $('#payserver').html(data.content);
            }else {
                mWxQRCodeUrl = data.content;
                mWxOrderId = data.id;
                console.log('The trade id is:'+mWxOrderId);
            }
            
        });
    }

    function startWxQuery() {
        if (!mWxOrderId) {
            console.log('There is no query orderid!');
            return;
        }
        if (mWxTimer) {
            console.log('The query was already started!');
            return ;
        }
        mWxTimer = setInterval(queryWxOrder, 10000);
    }

    function queryWxOrder() {
        if (!mWxOrderId) {
            stopWxQuery();
        }

        var param = {
            sinterface: SERVERCONF.ACCOUNT.PAYORDERVIEW,
            data: {
                id: mWxOrderId,
            }
        };
        function scb(data) {
            if (data && data.html) {
                stopWxQuery();
                window.location.href=data.html;
            }
        }
        function ecb(err) {

        }

        ajaxCall(param, function(err, data){
            if (err) {
                ecb(err);
            }else {
                scb(data);
            }
        })
    }

    function stopWxQuery() {
        if (mWxTimer) {
            clearInterval(mWxTimer);
            mWxOrderId = null;
            mWxTimer = null;
        }
    }
}();