/*
 * @file  tab-config.js
 * @description tab-config variable
 * @copyright dmtec.cn reserved, 2016
 * @author jiangtu
 * @date 2016.12.17
 * @version 0.0.1 
 */
var user_tabs_config = [], ad_tabs_config = [], tool_tabs_config = [];

$(function() {
  var role = sessionStorage.getItem('_role');
  var r = window._role[role] || false;
  if (r && r.account.enable) {
    if (r.account.adverInfo.enable) {
      user_tabs_config.push({"name": "user", "text": "用户信息", "url": "/user/user.html"});
    }
    
    if (r.account.credential.enable) {
      user_tabs_config.push({"name": "qual", "text": "资质文件", "url": "/user/qual.html"});
    }
    
    if (r.account.actor) {
      user_tabs_config.push({"name": "userauth", "text": "协作者管理", "url": "/user/auth.html"});
    }
    
    if (r.account.resetpwd) {
      user_tabs_config.push({"name": "resetpass", "text": "密码重置", "url": "/user/resetPass.html"});
    }
  }
  
  if (r && r.ad.enable) {
    if (r.ad.plan.enable) {
      ad_tabs_config.push({"name": "plan", "text": "广告计划", "url": "/ad/plan.html"});
    }
    
    if (r.ad.unit.enable) {
      ad_tabs_config.push({"name": "unit", "text": "广告单元", "url": "/ad/unit.html"});
    }
    
    if (r.ad.idea.enable) {
      ad_tabs_config.push({"name": "idea", "text": "广告创意", "url": "/ad/idea.html"});
    }
  }
  
  if (r && r.tool) {
    if (r.ad.unitDirect.enable) {
      tool_tabs_config.push({"name":"targetPackage","text":"广告单元定向模板管理","url":"/tool/targetPackage.html"});
    }
  }
});