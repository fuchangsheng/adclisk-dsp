/*
 * @file  getSms.js
 * @description getSms page js logic
 * @copyright dmtec.cn reserved, 2016
 * @author jiangtu
 * @date 2016.11.19
 * @version 0.0.1 
 */

$(function() {
    var timer = null;
    $("#getSms").click(function(){
        var phonenumber = $(".phone-number").val();
        if(!isMobile(phonenumber)){
            alert("请输入合法的手机号码！");
        }else{
            var num = 60;
            $(this).attr("disabled",true).val("重新发送(" + num + ")");
            timer = setInterval(function(){
                //alert();
                num--;
                $("#getSms").val("重新发送(" + num + ")");
                if(num<=0){
                    clearInterval(timer);
                    $("#getSms").attr("disabled",false);
                    $("#getSms").val("获取验证码");
                }
            },1000);
            var param = {
                sinterface : SERVERCONF.USERS.GETSMS,
                data : {
                    "mobile": phonenumber
                }
            }
            ajaxCall(param, function(err, data){
                if(err){
                    if(err.code == ERRCODE.SMSCODE_TOOMANY.code){
                        setInfoDiv($("#err-msg"), "info", "验证码获取过于频繁");
                    }else{
                        setInfoDiv($("#err-msg"), "info", "验证码获取失败");
                    }
                    clearInterval(timer);
                    $("#getSms").attr("disabled",false);
                    $("#getSms").val("获取验证码");
                }else{
                }
            })
        } 
    })
})