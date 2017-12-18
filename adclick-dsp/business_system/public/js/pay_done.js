/*
 * @file  pay_done.js
 * @description pay done page js logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.18
 * @version 0.0.1 
 */
'use strict';

!function() {
    // page static elements
    var mPayTitleH =  null;
    var mPayHintH = null;

    /********************************************************************/
    /*
    /********************************************************************/
    $(function(){
        initPageStaticElements();

        var param = parseURLParameter();
        renderPage(param);
    });

    function initPageStaticElements() {
        mPayTitleH = $('#paytitle');
        mPayHintH = $('#payhint');
    }

    function parseURLParameter() {
        var vars = {}, hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            //vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    function renderPage(param) {
        var status = param.status || 0;
        if (status!=0) {
            mPayTitleH.text('充值失败');
            mPayHintH.text('如有疑问，请和工作人员联系！');
        }
    }
}();