/*
 * @file  email_verify_done.js
 * @description email verify done page js logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.26
 * @version 0.0.1 
 */
'use strict';

!function() {
    // page static elements
    var mTitleH =  null;
    var mMessageH = null;

    /********************************************************************/
    /*
    /********************************************************************/
    $(function(){
        initPageStaticElements();

        var param = parseURLParameter();
        renderPage(param);
    });

    function initPageStaticElements() {
        mTitleH = $('#title');
        mMessageH = $('#message');
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
            mTitleH.text('邮件验证失败');
            mMessageH.text('如有疑问，请和工作人员联系！');
        }
    }
}();