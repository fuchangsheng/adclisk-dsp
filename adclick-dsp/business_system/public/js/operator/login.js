/*
 * @file  login.js
 * @description login page js logic
 * @copyright dmtec.cn reserved, 2016
 * @author jiangtu
 * @date 2016.11.21
 * @version 0.0.1 
 */

! function() {
  var mName = null;
  var mPassword = null;
  var mCode = null;
  var mImg = null;
  var mLoginSubBtn = null;
  var mLoginBtn = null;
  var mErrMsg = null;
  var mGetSmsPic = null;
  var token = null;
  var role = null; // user role

  $(function() {
    initPageStaticElements();
    mLoginBtn.click(function() {
      $("#login-modal-form").modal("show");
      mLoginSubBtn.prop("disabled", true);
      mCode.val('');
      getToken();
    })

    mGetSmsPic.click(function() {
      mLoginSubBtn.prop("disabled", true);
      mCode.val('');
      getToken();
    })

    mCode.keyup(function() {
      verifyCode(token, mCode.val());
    })

    mLoginSubBtn.click(function() {
      var user_name = mName.val();
      var pass = mPassword.val();
      var sms_code = mCode.val();
      if(user_name == "" || pass == "") {
        setInfoDiv(mErrMsg, "error", "用户名密码不能为空");
        return;
      } else if(!isPassword(pass)) {
        setInfoDiv(mErrMsg, "error", "密码格式错误！必须包含数字，大小字母，长度6-16位");
        return;
      }
      login(user_name, pass, sms_code, token);
    })

    var param = {
      sinterface: SERVERCONF.USERS.CHECKLOGIN,
      data: {},
    };

    ajaxCall(param, function(err, data) {
      if(err) {} else {
        var user_role = data.role || ''; // get user role
        switch (user_role){
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
        isLoginInit();
      }
    });

    var href = window.location.href;
    if(href.indexOf("#resgit_success") > 0) {
      mLoginBtn.click();
    }
  })

  function getToken() {
    var param = {
      sinterface: SERVERCONF.USERS.GETVERIFYCODE,
      data: {}
    };

    ajaxCall(param, function(err, data) {
      if(err) {
        setInfoDiv(mErrMsg, "error", "获取验证码有误");
      } else {
        token = data.token;
        getImg(token);
      }
    })
  }

  function getImg(tok) {
    var param = {
      sinterface: SERVERCONF.USERS.GETVERIFYIMG,
      data: {
        "token": tok
      }
    };

    ajaxCall(param, function(err, data) {
      if(err) {
        setInfoDiv(mErrMsg, "error", "获取验证码有误");
      } else {
        //var imgurl = SERVERCONF.HOST +':'+ SERVERCONF.PORT + '/' + data.file;
        var imgurl = getServerURL('/' + data.file);
        $("#inputImg").attr("src", imgurl);
      }
    })
  }

  function verifyCode(tok, smsCode) {
    var param = {
      sinterface: SERVERCONF.USERS.VERIFYIMGVERIFY,
      data: {
        "token": tok,
        "code": smsCode
      }
    }

    ajaxCall(param, function(err, data) {
      if(err) {
        mLoginSubBtn.prop("disabled", true);
      } else {
        mLoginSubBtn.prop("disabled", false);
      }
    })
  }

  function login(name, passwd, code, tok) {
    var param = {
      sinterface: SERVERCONF.USERS.LOGIN,
      data: {
        "name": name,
        "password": hex_sha1(passwd + SYSTEM.SALT),
        "token": tok,
        "code": code
      }
    }

    ajaxCall(param, function(err, data) {
      if(err) {
        setInfoDiv(mErrMsg, "error", "用户名或密码有误");
        mCode.val("");
        mGetSmsPic.click();
        mLoginSubBtn.prop("disabled", true);
      } else {
        $("#login-modal-form").modal("hide");
        window.location.href = '/index.html';
      }
    })
  }

  function isLoginInit() {
    var link_url = role === 'financil' ? '/account/info.html' : '/dashboard/overall.html';
    
    mLoginBtn.unbind("click");
    mLoginBtn.attr("href", link_url).html("进入投放管理平台");
    mLoginBtn.parent().append("<a class='nav-btn logout-btn' href='javascript:;'><span class='glyphicon glyphicon-log-out'></span>&nbsp;退出&nbsp;</a>");
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
            sessionStorage.clear(); // remove user role
            window.location.href = '/index.html';
          }
        })
      })
    })
  }

  function initPageStaticElements() {
    mName = $("#username");
    mPassword = $("#password");
    mCode = $("#inputSmscode");
    mImg = $("#inputImg");
    mLoginSubBtn = $("#login");
    mLoginBtn = $("#login-btn");
    mErrMsg = $("#err-msg");
    mGetSmsPic = $("#getSms-pic");
  }
}();