/*
 * @file  main.js
 * @description dsp main.html js logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.05
 * @version 0.0.1 
 */

$.ajaxSetup({ cache: false });  

function initNavbar() {
    var data = [
        {"name": "message", "type": "dropdown", "text": "消息", "icon": "envelope", "badge": "msgcount", "menu": [
            {"type": "link", "text": "操作日志", "url": "/oplog.html"},
            {"type": "divider"},
            {"type": "link", "text": "消息设置", "url": "/msg_set.html"},
            {"type": "divider"},
            {"type": "link", "text": "查看消息", "url": "/msg_list.html"},
        ]},
        {"name": "help", "type": "dropdown", "text": "帮助", "icon": "question-sign", "menu": [
            {"type": "link", "text": "常见问题", "url": "#"},
            {"type": "divider"},
            {"type": "link", "text": "咨询客服", "url": "#"},
            {"type": "divider"},
            {"type": "link", "text": "反馈意见", "url": "#"},
        ]},
    ];
    var navbar = $("#navbar");
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (item.type == "dropdown") {
            var dropdown = $("<li class=\"dropdown\"></li>");
            var icon = "";
            if (item.icon) {
                icon = " glyphicon-" + item.icon;
            }
            var badge = "";
            if (item.badge) {
                badge = "<span id=\"" + item.badge + "\" class=\"badge\"></span>";
            }
            dropdown.append($("<a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\"><span class=\"glyphicon" + icon + "\"></span>&nbsp;" + (item.text || "") + "&nbsp;" + badge + "</a>"));
            var ul = $("<ul class=\"dropdown-menu\"></ul>");
            for (var j = 0; j < item.menu.length; j++) {
                var entry = item.menu[j];
                if (entry.type == "link") {
                    ul.append($("<li><a href=\"" + (entry.url || "#") + "\">" + (entry.text || "") + "</a></li>"));
                } else if (entry.type == "divider") {
                    ul.append($("<li class=\"divider\"></li>"));
                }
            }
            dropdown.append(ul);
            navbar.append(dropdown);
        }
    }
}

function initSidenav() {
    var data = [
        {"type": "link", "text": "Dashboard", "icon": "", "url": "/overview_all.html"},
        {"type": "link", "text": "RealTime", "icon": "", "url": "/realtime_all.html"},
        {"type": "link", "text": "广告主管理", "icon": "", "url": "/user_check.html"},
        {"type": "link", "text": "创意审核", "icon": "", "url": "/idea_check.html"},
        {"type": "link", "text": "财务管理", "icon": "", "url": "/recharge.html"},
        {"type": "link", "text": "开票管理", "icon": "", "url": "/invoice.html"},
        {"type": "link", "text": "ADX接入", "icon": "", "url": "/adx_data.html"},
        {"type": "link", "text": "营收总览", "icon": "", "url": "/income_data.html"},
        {"type": "link", "text": "任务管理", "icon": "", "url": "/task.html"},
        {"type": "link", "text": "管理员", "icon": "", "url": "/admin.html"},
    ];
    var sidenav = $("#sidenav");
    var menuSize = data.length;
    for (var i = 0; i < menuSize; i++) {
        var item = data[i];
        var icon = "";
        if (item.icon) {
            icon = " glyphicon-" + item.icon;
        }
        if (item.type == "link") {
            sidenav.append($("<a href=\"" + (item.url || "#") + "\"><span class=\"glyphicon" + icon + "\"></span>&nbsp;" + item.text + "</a>"));
        }
    }
    sidenav.find("a").eq(0).css("font-size", "16px");
    sidenav.find("a").eq(1).css("font-size", "17px");
}

function initMgrName(){
    if(window.config.mgr_name) {
        $('#weluser').text('欢迎您: ' + window.config.mgr_name);
        return;
    }

    var sinterface = SERVERCONF.ADMIN.ADMININFO;
    var param = {
        sinterface: sinterface,
        data: {},
    };

    ajaxCall(param, function(err, data){
        if (err) {
            ecb(err);
        }else {
            scb(data);
        }
    });

    var scb = function(data){
        var mgr_name = data.name || '';
        $('#weluser').text('欢迎您: ' + mgr_name);
        window.config.mgr_name = mgr_name;
    }
    var ecb = function(data) {
        console.log(data);
        $('#weluser').text('欢迎您: ');
    }
}
$(function() {
    initNavbar();
    initSidenav();
    
    window.config = {};

    initMgrName();
    
    //nav active
    var current_nav = window.current_nav || "";
    if(current_nav == "overview"){
        $("#sidenav>a").eq(0).addClass("active");
    }else if(current_nav == "realtime"){
        $("#sidenav>a").eq(1).addClass("active");
    }else if(current_nav == "usercheck"){
        $("#sidenav>a").eq(2).addClass("active");
    }else if(current_nav == "ideacheck"){
        $("#sidenav>a").eq(3).addClass("active");
    }else if(current_nav == "recharge"){
        $("#sidenav>a").eq(4).addClass("active");
    }else if(current_nav == "invoice"){
        $("#sidenav>a").eq(5).addClass("active");
    }else if(current_nav == "adx"){
        $("#sidenav>a").eq(6).addClass("active");
    }else if(current_nav == "income"){
        $("#sidenav>a").eq(7).addClass("active");
    }else if(current_nav == "task"){
        $("#sidenav>a").eq(8).addClass("active");
    }else if(current_nav == "admin"){
        $("#sidenav>a").eq(9).addClass("active");
    }else if(current_nav == "message"){
        $("#navbar>li").eq(1).addClass("active");
    }
    
    $('#logout').click(function () {
        confirm("确认退出登录？", function(){
            var param = {
                sinterface : SERVERCONF.MGR.LOGOUT,
                data : {}
            };
            
            ajaxCall(param, function(err, data){
                if(err){
                    alert("退出失败");
                }else{
                    window.location.href = '/login.html';
                }
            });
        });
    });
});
