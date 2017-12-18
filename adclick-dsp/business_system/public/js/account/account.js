/*
 * @file  account.js
 * @description account information html page js logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.14
 * @version 0.0.1 
 * @requires js/constants.js
 * @requires js/tool.js
 * @requires js/component.js
 */
'use strict';

! function() {
  /////////////////////////////////////////////////////////////////
  // on page load
  ////////////////////////////////////////////////////////////////
  $(function() {
    var tabs_config = [];
    var role = sessionStorage.getItem('_role');
    var r = window._role[role] || false;
    if(r && r.finance.enable) {
      if(r.finance.charge) {
        $('#rechage-pannel').css('display', '');
      } else {
        $('#rechage-pannel').remove();
      }

      if(r.finance.balance || r.finance.charge) {
        tabs_config.push({"name": "info","text": "财务信息","url": "/account/info.html"});
      }

      if(r.finance.records) {
        tabs_config.push({"name": "record","text": "充值记录","url": "/account/records.html"});
      }

      if(r.finance.invoice.enable) {
        tabs_config.push({"name": "userinvoice","text": "发票信息","url": "/account/invoice-info.html"});
      }

      if(r.finance.draw.enable) {
        tabs_config.push({"name": "invoice","text": "发票开具","url": "/account/invoice.html"});
      }
    }

    initTabs(tabs_config, current_tab);

  });

  function onPageload() {

  }

  /////////////////////////////////////////////////////////////////
  // local functions
  ////////////////////////////////////////////////////////////////
}();