/*
 * @file  account_info.js
 * @description account information html page js logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.14
 * @version 0.0.1 
 * @requires account/info.html
 * @requires js/constants.js
 * @requires js/tool.js
 * @requires js/component.js
 */
'use strict';

!function(){
    // page static elements
    var mAccountBalanceText = null;
    
    var mRechargeBtn = null;
    var mRechargeBtn1 = null;
    var mRechargeBtn2 = null;
    var mRechargeBtn3 = null;
    var mRechargeBtn4 = null;
    var mAmountForm = null;
    var mRechargeAmountInput = null;
    var mAlipaySubmitBtn = null;
    var mWxpaySubmitBtn = null;

    //constan variabls
    var PAYURL = 'pay.html';
    var DEFAULTAMOUNT = '10000.00';
    
    //module variables
    var mAmount = 0;

    /////////////////////////////////////////////////////////////////
    // on page load
    ////////////////////////////////////////////////////////////////
    $(function() {      
        var current_tab = window.current_tab || "";
        
        if (current_tab == "info") {
            initContentOfInfo();
        }
        
        initPageStaticElements();

        onPageload();
        registerCB();

    });

    function initContentOfInfo() {

    }

    function initPageStaticElements() {
        mAccountBalanceText =  $('#account-balance');

        mRechargeBtn = $('.recharge-btn');
        mRechargeBtn1 = $('#recharge-1');
        mRechargeBtn2 = $('#recharge-2');
        mRechargeBtn3 = $('#recharge-3');
        mRechargeBtn4 = $('#recharge-4');
        mAmountForm = $('#amount-form');
        mRechargeAmountInput = $('#recharge-amount');
        mAlipaySubmitBtn = $('#alipaysubmit');
        mWxpaySubmitBtn = $('#wxpaysubmit');
    }

    function onPageload() {
        getAccountBalance();
    }

    function registerCB() {
        mRechargeBtn.click(function() {
            $(this).addClass("choosed").siblings().removeClass("choosed");
        });
        
        mRechargeBtn1.click(function() {
            mAmountForm.hide();
            mAmount = mRechargeBtn1.val()
            updatePayButtonState();
        });
        mRechargeBtn2.click(function() {
            mAmountForm.hide();
            mAmount = mRechargeBtn2.val();
            updatePayButtonState();
        });
        mRechargeBtn3.click(function() {
            mAmountForm.hide();
            mAmount = mRechargeBtn3.val();
            updatePayButtonState();
        });

        mRechargeBtn4.click(function() {
            mAmountForm.show();
            mRechargeAmountInput.val( DEFAULTAMOUNT);
            mAmount = DEFAULTAMOUNT;
            updatePayButtonState();
        });

        mAlipaySubmitBtn.click(function() {
            var pay = {
                type: 1,
                amount: Number(mAmount).toFixed(2),
            };
            var url = createPayUrl(pay);
            window.open ( url );
        });
        mWxpaySubmitBtn.click(function() {
            var pay = {
                type: 2,
                amount: Number(mAmount).toFixed(2),
            };

            var url = createPayUrl(pay);
            window.open ( url );
        });

        mRechargeAmountInput.bind('input propertychange', function() {
            mAmount = mRechargeAmountInput.val();
            updatePayButtonState();
        });
    }

    /////////////////////////////////////////////////////////////////
    // local functions
    ////////////////////////////////////////////////////////////////
    function createPayUrl(pay) {
        var param = $.param( pay );
        return PAYURL +'?' + param;
    }

    function getAccountBalance() {        
        var param ={
            sinterface: SERVERCONF.ACCOUNT.BALANCE,
            data: {}
        };
        
        function scb(data) {
            console.log(JSON.stringify(data));
            var account_balance = data.balance || 0;
            mAccountBalanceText.text(account_balance);
        }
        function ecb(err) {
            var msg = getErrMsg(err);
            alert(msg);
        }

        ajaxCall(param, function(err, data){
            if (err) {
                ecb(err);
            }else {
                scb(data);
            }
        });
    }

    function updatePayButtonState() {
        console.log('amount is '+ mAmount);
        if (mAmount > SYSTEM.RECHARGEMIN && isMoney(mAmount)) {
            console.log('To remove the disabled');
            mAlipaySubmitBtn.removeAttr('disabled');
            mWxpaySubmitBtn.removeAttr('disabled');
        }else {
            console.log('To add the disabled');
            mAlipaySubmitBtn.attr('disabled', 'disabled');
            mWxpaySubmitBtn.attr('disabled', 'disabled');
        }
    }
}();