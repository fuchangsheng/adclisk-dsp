/*
 * @file  resetPass.js
 * @description resetPass page js logic
 * @copyright dmtec.cn reserved, 2016
 * @author jiangtu
 * @date 2016.11.19
 * @version 0.0.1 
 */

$(function() {
    var current_tab = window.current_tab || "";
    initTabs(user_tabs_config, current_tab);
    
    $("#resetPass").click(function() {
        var oldpassword = $("#inputOldPassword").val();
        var pwd = $("#inputPassword").val();
        var repwd = $("#inputRePassword").val();
        if(oldpassword == "" || pwd == "" || repwd == ""){
            alert("数据不能为空");
        }else if(pwd != repwd){
            alert("两次密码不一致");
        }else if(!isPassword(pwd)){
            alert("密码格式错误！必须包含数字，大小字母，长度6-16位");
        }else{
            var data ={
                "password": hex_sha1(pwd + SYSTEM.SALT),
                "oldpassword": hex_sha1(oldpassword + SYSTEM.SALT)
            };
            
            var param = {
                sinterface : SERVERCONF.USERS.RESETPASS,
                data : data
            };
        
            ajaxCall(param, function(err, data){
                if(err){
                    alert("原密码有误！");
                }else{
                    alert("修改成功！");
                    $("#inputOldPassword").val('');
                    $("#inputPassword").val('');
                    $("#inputRePassword").val('');
                }
            });
        }
        

    })
});