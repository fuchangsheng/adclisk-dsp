/*
 * @file  login.js
 * @description dsp management login page js logic
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.11.21
 * @version 0.0.1 
 */

!function(){
    var mName = null;
    var mPassword = null;
    var mCode = null;
    var mImg = null;
    var mLoginBtn = null;
    var mErrMsg = null;
        
    var token = null;
    var passReg = /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,16}$/
    $(function(){
        initPageStaticElements();
        mImg.click(function(){
            getToken();
        })
        mImg.click();
    
        mCode.keyup(function(){
            verifyCode(token, mCode.val());
        })
            
        mLoginBtn.click(function(){
            var user_name = mName.val();
            var pass = mPassword.val();
            var sms_code = mCode.val();
            if(user_name == "" || pass == ""){
                errorMesg("用户名或密码不能为空");
                return;
            }else if(!passReg.test(pass)){
                errorMesg("密码强度不够！必须包含数字，大小字母，长度6-16位");
                return;
            }
            login(user_name, pass, sms_code, token);
        })
    })
       
    function getToken(){
        var param = {
            sinterface : SERVERCONF.MGR.CAPREQUEST,
            data : {}
        };
        
        ajaxCall(param, function(err, data){
            if(err){
                var error_msg = "获取token有误";
                errorMesg(error_msg);
            }else{
                token = data.token;
                getImg(token);
            }
        })
    }
    
    function getImg(tok){
        var param = {
            sinterface : SERVERCONF.MGR.CAPREQUESTIMG,
            data: {
                "token": tok
            }
        };
        
        ajaxCall(param, function(err, data){
            if(err){
                var error_msg = "获取验证码有误";
                errorMesg(error_msg);
            }else{
                //var imgurl = SERVERCONF.HOST +':'+ SERVERCONF.PORT + '/' + data.file;
                var imgurl = getServerURL('/' + data.file);
                $("#inputImg").attr("src", imgurl);
            }
        })
    }
    
    function verifyCode(tok, smsCode){
        var param = {
            sinterface : SERVERCONF.MGR.CAPVERIFY,
            data: {
                "token" : tok,
                "code" : smsCode
            }
        }
        
        ajaxCall(param, function(err, data){
            if(err){
                mLoginBtn.prop("disabled", true);
            }else{
                mLoginBtn.prop("disabled", false);
            }
        })
    }
    
    function login(name, passwd, code, tok){
        var param = {
            sinterface : SERVERCONF.MGR.LOGIN,
            data: {
                "name": name,
                "password": hex_sha1(passwd + SYSTEM.SALT),
                "token": tok,
                "code": code
            }
        }
        
        ajaxCall(param, function(err, data){
            if(err){
                var error_msg = "用户名或密码有误";
                errorMesg(error_msg);
            }else{
                window.location.href = '/';
            }
        })
    }
    
    function errorMesg(msg){
        mErrMsg.html("<div class='alert alert-danger alert-dismissible' role='alert'>" +
                       "<button type='button' class='close' data-dismiss='alert'>" +
                         "<span aria-hidden='true'>×</span><span class='sr-only'>Close</span>" +
                       "</button>" +
                       "<strong>Error!</strong><span>" + msg + "</span>" +
                     "</div>");
    }
    
    function initPageStaticElements(){
        mName = $("#inputUser");
        mPassword = $("#inputPassword");
        mCode = $("#inputSmscode");
        mImg = $("#inputImg");
        mLoginBtn = $("#login");
        mErrMsg = $("#err-msg");
    }
    
}();