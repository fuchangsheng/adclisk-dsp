/*
 * @file  main.js
 * @description dsp main.html js logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.05
 * @version 0.0.1 
 */

$.ajaxSetup({
  cache: false
});

/**
 * add role control
 * @author zhangyuanfang 2017-08-30
 */
function initNavbar() {
  var data = [];
  // role control
  var role = sessionStorage.getItem('_role');
  var r = _role[role] || false;
  if (r && r.account.enable) {
    var obj = {"name": "account","type": "dropdown","text": "账户","icon": "user","menu":[]};
    
    if (r.account.adverInfo.enable) {
      obj.menu.push({"type": "link","text": "账号中心","url": "/user/user.html"});
      obj.menu.push({"type": "divider"});
    }
    
    if (r.account.credential.enable) {
      obj.menu.push({"type": "link","text": "资质文件","url": "/user/qual.html"});
      obj.menu.push({"type": "divider"});
    }
    
    if (r.account.actor) {
      obj.menu.push({"type": "link","text": "协作者管理","url": "/user/auth.html"});
      obj.menu.push({"type": "divider"});
    }
    
    if (r.account.resetpwd) {
      obj.menu.push({"type": "link","text": "密码重置","url": "/user/resetPass.html"});
    }
    
    if (obj.menu.length) {
      data.push(obj);
    }
  }
  
  if (r && r.message.enable) {
    var obj = {"name": "message","type": "dropdown","text": "消息","icon": "envelope","badge": "msgcount","menu":[]};
    
    if (r.message.contact.enable || r.message.channel.enable) {
      obj.menu.push({"type": "link","text": "消息设置","url": "/message/set.html"});
      obj.menu.push({"type": "divider"});
    }
    
    if (r.message.msgLog) {
      obj.menu.push({"type": "link","text": "查看消息","url": "/message/msgList.html"});
      obj.menu.push({"type": "divider"});
    }
    
    if (r.message.optLog) {
      obj.menu.push({"type": "link","text": "操作日志","url": "/message/opLog.html"});
    }
    
    if (obj.menu.length) {
      data.push(obj);
    }
  }
  
  if (r && r.help) {
    var obj = {
      "name": "help",
      "type": "dropdown",
      "text": "帮助",
      "icon": "question-sign",
      "menu": [
        {"type": "link","text": "常见问题","url": "/tool/faq.html"},
        {"type": "divider"},
        {"type": "link","text": "咨询客服","url": "#"},
        {"type": "divider"},
        {"type": "link","text": "反馈意见","url": "#"}
      ]
    };
    
    data.push(obj);
  }

  var navbar = $("#navbar");
  for(var i = 0; i < data.length; i++) {
    var item = data[i];
    if(item.type == "dropdown") {
      var dropdown = $("<li class=\"dropdown\"></li>");
      var icon = "";
      if(item.icon) {
        icon = " glyphicon-" + item.icon;
      }
      var badge = "";
      if(item.badge) {
        badge = "<span id=\"" + item.badge + "\" class=\"badge\"></span>";
      }
      dropdown.append($("<a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\"><span class=\"glyphicon" + icon + "\"></span>&nbsp;" + (item.text || "") + "&nbsp;" + badge + "</a>"));
      var ul = $("<ul class=\"dropdown-menu\"></ul>");
      for(var j = 0; j < item.menu.length; j++) {
        var entry = item.menu[j];
        if(entry.type == "link") {
          ul.append($("<li><a href=\"" + (entry.url || "#") + "\">" + (entry.text || "") + "</a></li>"));
        } else if(entry.type == "divider") {
          ul.append($("<li class=\"divider\"></li>"));
        }
      }
      dropdown.append(ul);
      navbar.append(dropdown);
    }
  }
}

/**
 * add role control
 * @author zhangyuanfang 2017-08-30
 */
function initSidenav() {
  var data = [];
  // role control
  var role = sessionStorage.getItem('_role');
  var r = _role[role] || false;
  if (r) {
    if (r.dashboard) {
      data.push({"type": "link","text": "Dashboard","icon": "home","url": "/dashboard/overall.html"});
    }
    
    if (r.dataChart.enable) {
      data.push({"type": "link","text": "数据报表","icon": "stats","url": "/dashboard/report.html"});
    }

    if (r.realtime) {
      data.push({"type": "link","text": "实时报表","icon": "time","url": "/dashboard/realtime.html"});
    }
    
    if (r.ad.enable) {
      data.push({"type": "link","text": "广告计划","icon": "leaf","url": "/ad/plan.html"});
    }
    
    if (r.finance.enable) {
      data.push({"type": "link","text": "财务管理","icon": "usd","url": "/account/info.html"});
    }
    
    if (r.tool) {
      data.push({"type": "link","text": "工具箱","icon": "wrench","url": "/tool/tool.html"});
    }
  }

  var sidenav = $("#sidenav");
  for(var i = 0; i < data.length; i++) {
    var item = data[i];
    var icon = "";
    if(item.icon) {
      icon = " glyphicon-" + item.icon;
    }
    if(item.type == "link") {
      sidenav.append($("<a href=\"" + (item.url || "#") + "\"><span class=\"glyphicon" + icon + "\"></span>&nbsp;" + item.text + "</a>"));
    }
  }
  sidenav.find("a").eq(0).css("font-size", "16px").children("span").css("font-size", "18px");
}

function initUsername() {
  if(window.config.user_name && sessionStorage.getItem('_role')) {
    $('#weluser').text('欢迎您: ' + window.config.user_name);
    return;
  }

  var sinterface = SERVERCONF.USERS.USERNAME;
  var param = {
    sinterface: sinterface,
    data: {},
  };

  ajaxCall(param, function(err, data) {
    if(err) {
      ecb(err);
    } else {
      scb(data);
    }
  });

  var scb = function(data) {
    console.log(JSON.stringify(data));
    var user_name = data.user_name || '';
    var user_role = data.role; // user role
    $('#weluser').text('欢迎您: ' + user_name);
    window.config.user_name = user_name;

    var role = '';
    switch(user_role) {
      case 0:
        role = 'main';
        break;
      case 1:
        role = 'admin';
        break;
      case 2:
        role = 'operator';
        break;
      case 3:
        role = 'viwer';
        break;
      case 4:
        role = 'financil';
        break;
      default:
        break;
    }

    sessionStorage.setItem('_role', role); // save user role to sessionStorage
    initNavbar();
    initSidenav();
    selectMenu();
  }
  var ecb = function(data) {
    console.log(data);
    $('#weluser').text('欢迎您: ');
  }
}

function initUnreadMsgNum() {
  var sinterface = SERVERCONF.MESSAGE.UNREADMSGNUM;
  var param = {
    sinterface: sinterface,
    data: {},
  };
  ajaxCall(param, function(err, data) {
    if(err) {
      ecb(err);
    } else {
      scb(data);
    }
  });
  var scb = function(data) {
    console.log(JSON.stringify(data));
    var num = data.num || 0;
    if(num > 0) {
      $('#msgcount').text(num);
    } else {
      $('#msgcount').text("");
    }
  }
  var ecb = function(data) {
    console.log(data);
    $('#msgcount').text();
  }
}

function selectMenu() {
  var current_nav = window.current_nav || "";
  var role = sessionStorage.getItem('_role');
  if (role === 'financil') {
    if (current_nav == "finance") {
      $("#sidenav>a").eq(0).addClass("active");
    } else if(current_nav == "user") {
      $("#navbar>li").eq(1).addClass("active");
    }
  } else {
    if(current_nav == "dashboardoverall") {
      $("#sidenav>a").eq(0).addClass("active");
    } else if(current_nav == "datareport") {
      $("#sidenav>a").eq(1).addClass("active");
    } else if(current_nav == "realtime") {
      $("#sidenav>a").eq(2).addClass("active");
    } else if(current_nav == "ad") {
      $("#sidenav>a").eq(3).addClass("active");
    } else if(current_nav == "finance") {
      $("#sidenav>a").eq(4).addClass("active");
    } else if(current_nav == "tool") {
      $("#sidenav>a").eq(5).addClass("active");
    } else if(current_nav == "user") {
      $("#navbar>li").eq(1).addClass("active");
    } else if(current_nav == "message") {
      $("#navbar>li").eq(2).addClass("active");
    }
  }
}

function initNavbarData() {
  initUsername();
  initUnreadMsgNum();
}

$(function() {
  window.config = {};
  initNavbarData();

  $('.navbar-right li a').removeAttr("href");
  $('.navbar-right li a').addClass("logout-btn");
  $('.logout-btn').click(function() {
    confirm("确认退出登录？", function() {
      var param = {
        sinterface: SERVERCONF.USERS.LOGOUT,
        data: {}
      }
      ajaxCall(param, function(err, data) {
        if(err) {
          alert("退出失败");
        } else {
          sessionStorage.clear(); // remove user role info
          window.location.href = '/index.html';
        }
      })
    })
  })
});

// role config section
window._role = {
  'main': {
    'dashboard': true,
    'dataChart': {
      'enable': true,
      'report': true,
      'download': true
    },
    'realtime': true,
    'ad': {
      'enable': true,
      'plan': {
        'enable': true,
        'read': true,
        'write': true
      },
      'unit': {
        'enable': true,
        'read': true,
        'write': true
      },
      'unitDirect': {
        'enable': true,
        'read': true,
        'write': true
      },
      'idea': {
        'enable': true,
        'read': true,
        'write': true
      },
      'ideaLib': {
        'enable': true,
        'read': true,
        'write': true
      }
    },
    'finance': {
      'enable': true,
      'balance': true,
      'charge': true,
      'records': true,
      'invoice': {
        'enable': true,
        'read': true,
        'write': true
      },
      'draw': {
        'enable': true,
        'read': true,
        'write': true
      }
    },
    'message': {
      'enable': true,
      'contact': {
        'enable': true,
        'read': true,
        'write': true
      },
      'channel': {
        'enable': true,
        'read': true,
        'write': true
      },
      'msgLog': true,
      'optLog': true
    },
    'account': {
      'enable': true,
      'adverInfo': {
        'enable': true,
        'read': true,
        'write': true
      },
      'credential': {
        'enable': true,
        'read': true,
        'write': true
      },
      'actor': true,
      'resetpwd': true
    },
    'tool': true,
    'help': true
  },
  'admin': {
    'dashboard': true,
    'dataChart': {
      'enable': true,
      'report': true,
      'download': true
    },
    'realtime': true,
    'ad': {
      'enable': true,
      'plan': {
        'enable': true,
        'read': true,
        'write': true
      },
      'unit': {
        'enable': true,
        'read': true,
        'write': true
      },
      'unitDirect': {
        'enable': true,
        'read': true,
        'write': true
      },
      'idea': {
        'enable': true,
        'read': true,
        'write': true
      },
      'ideaLib': {
        'enable': true,
        'read': true,
        'write': true
      }
    },
    'finance': {
      'enable': true,
      'balance': true,
      'charge': false,
      'records': true,
      'invoice': {
        'enable': true,
        'read': true,
        'write': false
      },
      'draw': {
        'enable': true,
        'read': true,
        'write': false
      }
    },
    'message': {
      'enable': true,
      'contact': {
        'enable': true,
        'read': true,
        'write': true
      },
      'channel': {
        'enable': true,
        'read': true,
        'write': true
      },
      'msgLog': true,
      'optLog': true
    },
    'account': {
      'enable': true,
      'adverInfo': {
        'enable': true,
        'read': true,
        'write': true
      },
      'credential': {
        'enable': true,
        'read': true,
        'write': true
      },
      'actor': true,
      'resetpwd': true
    },
    'tool': true,
    'help': true
  },
  'operator': {
    'dashboard': true,
    'dataChart': {
      'enable': true,
      'report': true,
      'download': true
    },
    'realtime': true,
    'ad': {
      'enable': true,
      'plan': {
        'enable': true,
        'read': true,
        'write': true
      },
      'unit': {
        'enable': true,
        'read': true,
        'write': true
      },
      'unitDirect': {
        'enable': true,
        'read': true,
        'write': true
      },
      'idea': {
        'enable': true,
        'read': true,
        'write': true
      },
      'ideaLib': {
        'enable': true,
        'read': true,
        'write': true
      }
    },
    'finance': {
      'enable': true,
      'balance': true,
      'charge': false,
      'records': false,
      'invoice': {
        'enable': false
      },
      'draw': {
        'enable': false
      }
    },
    'message': {
      'enable': true,
      'contact': {
        'enable': true,
        'read': true,
        'write': true
      },
      'channel': {
        'enable': true,
        'read': true,
        'write': true
      },
      'msgLog': true,
      'optLog': true
    },
    'account': {
      'enable': true,
      'adverInfo': {
        'enable': true,
        'read': true,
        'write': true
      },
      'credential': {
        'enable': true,
        'read': true,
        'write': true
      },
      'actor': false,
      'resetpwd': true
    },
    'tool': true,
    'help': true
  },
  'viwer': {
    'dashboard': true,
    'dataChart': {
      'enable': true,
      'report': true,
      'download': true
    },
    'realtime': true,
    'ad': {
      'enable': false,
      'plan': {
        'enable': false,
        'read': false,
        'write': false
      },
      'unit': {
        'enable': false,
        'read': false,
        'write': false
      },
      'unitDirect': {
        'enable': false,
        'read': false,
        'write': false
      },
      'idea': {
        'enable': false,
        'read': false,
        'write': false
      },
      'ideaLib': {
        'enable': false,
        'read': false,
        'write': false
      }
    },
    'finance': {
      'enable': false,
      'balance': false,
      'charge': false,
      'records': false,
      'invoice': {
        'enable': false
      },
      'draw': {
        'enable': false
      }
    },
    'message': {
      'enable': false,
      'contact': {
        'enable': false,
        'read': false,
        'write': false
      },
      'channel': {
        'enable': false,
        'read': false,
        'write': false
      },
      'msgLog': true,
      'optLog': false
    },
    'account': {
      'enable': true,
      'adverInfo': {
        'enable': true,
        'read': true,
        'write': false
      },
      'credential': {
        'enable': true,
        'read': true,
        'write': false
      },
      'actor': false,
      'resetpwd': true
    },
    'tool': false,
    'help': true
  },
  'financil': {
    'dashboard': false,
    'dataChart': {
      'enable': false,
      'report': false,
      'download': false
    },
    'realtime': false,
    'ad': {
      'enable': false,
      'plan': {
        'enable': false,
        'read': false,
        'write': false
      },
      'unit': {
        'enable': false,
        'read': false,
        'write': false
      },
      'unitDirect': {
        'enable': false,
        'read': false,
        'write': false
      },
      'idea': {
        'enable': false,
        'read': false,
        'write': false
      },
      'ideaLib': {
        'enable': false,
        'read': false,
        'write': false
      }
    },
    'finance': {
      'enable': true,
      'balance': true,
      'charge': true,
      'records': true,
      'invoice': {
        'enable': true,
        'read': true,
        'write': true
      },
      'draw': {
        'enable': true,
        'read': true,
        'write': true
      }
    },
    'message': {
      'enable': false,
      'contact': {
        'enable': false,
        'read': false,
        'write': false
      },
      'channel': {
        'enable': false,
        'read': false,
        'write': false
      },
      'msgLog': false,
      'optLog': false
    },
    'account': {
      'enable': true,
      'adverInfo': {
        'enable': false,
        'read': false,
        'write': false
      },
      'credential': {
        'enable': false,
        'read': false,
        'write': false
      },
      'actor': false,
      'resetpwd': true
    },
    'tool': false,
    'help': true
  }
};