/*
 * @file  getSms.js
 * @description getSms page js logic
 * @copyright dmtec.cn reserved, 2016
 * @author jiangtu
 * @date 2016.11.19
 * @version 0.0.1 
 */

$(function() {
    $("#forgetPass").click(function(){
        var username = $("#for-username").val();
        var phonenumber = $("#for-mobile").val();
        var smscode = $("#for-smsCode").val();
        var pass = $("#for-password").val();
        var repass = $("#for-repassword").val();
        var data = {
            "name": username,
            "mobile": phonenumber,
            "smscode": smscode,
            "password": pass
        };

        if(username == "" || username.length > 32){
            setInfoDiv($("#err-msg"), "error", "用户名不能为空，长度不长于32位");
            return;
        }else if(!isPassword(pass)){
            setInfoDiv($("#err-msg"), "error", "密码格式错误！必须包含数字，大小字母，长度6-16位");
            return;
        }else if(pass != repass){
            setInfoDiv($("#err-msg"), "error", "两次密码不一致");
            return;
        }else if(!isMobile(phonenumber)){
            setInfoDiv($("#err-msg"), "error", "手机号码格式有误");
            return;
        }else if(smscode == ""){
            setInfoDiv($("#err-msg"), "error", "验证码不能为空");
            return;
        }
        
        var param = {
            sinterface : SERVERCONF.USERS.FORGETPASS,
            data : {
                "name": username,
                "mobile": phonenumber,
                "smscode": smscode,
                "password": hex_sha1(pass + SYSTEM.SALT)
            }
        }
        
        ajaxCall(param, function(err, data){
            if(err){
                if(err.code == ERRCODE.SMSCODE_INVALID.code){
                    setInfoDiv($("#err-msg"), "info", "短信验证码错误或该验证码已经使用过");
                }else if(err.code == ERRCODE.SMSCODE_OUTOFDATE.code){
                    setInfoDiv($("#err-msg"), "info", "短信验证码过期");
                }else if(err.code == ERRCODE.DATA_INVALID.code){
                    setInfoDiv($("#err-msg"), "info", "手机号和用户名不匹配");
                }else{
                    setInfoDiv($("#err-msg"), "info", "密码重置失败");
                } 
            }else{
                alert("密码修改成功，请返回登录");
                window.location.href = "/index.html";
            }
        })

        
    })

})