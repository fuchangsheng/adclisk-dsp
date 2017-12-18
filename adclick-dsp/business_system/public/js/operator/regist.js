/*
 * @file  regist.js
 * @description regist page js logic
 * @copyright dmtec.cn reserved, 2016
 * @author jiangtu
 * @date 2016.11.19
 * @version 0.0.1 
 */

!function(){
    var mUserName = null;
    var mCompanyName = null;
    var mMobile = null;
    var mSmsCode = null;
    var mPassword = null;
    var mRePassword = null;
    var mUserAgree = null;
    var mRegistBtn = null;
    var mErrMsg = null;
        
    function initPageStaticElements(){
        mUserName = $("#reg-username");
        mCompanyName = $("#reg-companyName");
        mMobile = $("#reg-mobile");
        mSmsCode = $("#reg-smsCode");
        mPassword = $("#reg-password");
        mRePassword = $("#reg-repassword");
        mUserAgree = $("#user-agree-chk");
        mRegistBtn = $("#regist");
        mErrMsg = $("#err-msg");
    }
    
    $(function(){
        initPageStaticElements();
        
        mUserAgree.change(function(){
            if($(this).prop("checked") == false){
                $("#regist").attr("disabled", true); 
            }else{
                $("#regist").attr("disabled", false);
            }
        })
            
        mRegistBtn.click(function(){
            var name = mUserName.val();
            var company_name = mCompanyName.val();
            var mobile = mMobile.val();
            var smscode = mSmsCode.val();
            var passwd = mPassword.val();
            var repasswd = mRePassword.val();
            if(name == "" || name.length > 32){
                setInfoDiv(mErrMsg, "error", "用户名不能为空，长度不长于32位");
                return;
            }else if(passwd == ""){
                setInfoDiv(mErrMsg, "error", "密码不能为空");
                return;
            }else if(passwd != repasswd){
                setInfoDiv(mErrMsg, "error", "两次密码不一致");
                return;
            }else if(!isPassword(passwd)){
                setInfoDiv(mErrMsg, "error", "密码格式错误！必须包含数字，大小字母，长度6-16位");
                return;
            }else if(company_name == "" || company_name.length > 32){
                setInfoDiv(mErrMsg, "error", "公司名不能为空，长度不长于32位");
                return;
            }else if(mobile == ""){
                setInfoDiv(mErrMsg, "error", "手机号码不能为空");
                return;
            }else if(!isMobile(mobile)){
                setInfoDiv(mErrMsg, "error", "手机号码格式有误");
                return;
            }else if(smscode == ""){
                setInfoDiv(mErrMsg, "error", "验证码不能为空");
                return;
            }
            
            var param = {
                sinterface : SERVERCONF.USERS.REGIST,
                data : {
                    "name": name,
                    "company_name": company_name,
                    "mobile": mobile,
                    "smscode": smscode,
                    "password": hex_sha1(passwd + SYSTEM.SALT),
                }
            }
            ajaxCall(param, function(err,data){
                if(err){
                    if(err.code == ERRCODE.DB_DATADUPLICATED.code){
                        setInfoDiv(mErrMsg, "info", "用户名已存在，请修改用户名");
                    }else if(err.code == ERRCODE.SMSCODE_INVALID.code){
                        setInfoDiv(mErrMsg, "info", "短信验证码错误或该验证码已经使用过");
                    }else if(err.code == ERRCODE.SMSCODE_OUTOFDATE.code){
                        setInfoDiv(mErrMsg, "info", "短信验证码过期");
                    }else{
                        setInfoDiv(mErrMsg, "info", "注册失败！");
                    }
                    
                }else{
                    alert("注册成功，请返回登录");
                    window.location.href = '/index.html#resgit_success';
                }
            })
        })
    })
    
}();