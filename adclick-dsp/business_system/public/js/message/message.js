/*
 * @file  message.js
 * @description message information html page js logic
 * @copyright dmtec.cn reserved, 2016
 * @date 2016.11.22
 * @version 0.0.1
 * @requires js/constants.js
 * @requires js/tool.js
 * @requires js/component.js
 */
!function(){
  $(function() {
    var tabs_config = [];
    var role = sessionStorage.getItem('_role');
    var r = window._role[role] || false;
    if (r && r.message.enable) {
      if (r.message.contact.enable || r.message.channel.enable) {
        tabs_config.push({"name": "set", "text": "消息设置", "url": "/message/set.html"});
      }
      
      if (r.message.msgLog) {
        tabs_config.push({"name": "msgList", "text": "查看消息", "url": "/message/msgList.html"});
      }
      
      if (r.message.optLog) {
        tabs_config.push({"name": "opLog", "text": "操作日志", "url": "/message/opLog.html"});
      }
    }
    
    var current_tab = window.current_tab || "";
    initTabs(tabs_config, current_tab);
  });
  
}();