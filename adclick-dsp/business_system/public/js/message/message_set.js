
/*@file  message_set.js
 * @description set message html page js logic
 * @copyright dmtec.cn reserved, 2016
 * @date 2016.11.22
 * @version 0.0.1
 * @requires message/set.html
 * @requires js/constants.js
 * @requires js/tool.js
 * @requires js/component.js
 */
'use strict'

!function(){
    var mEmail=null;//电子邮箱列表框
    var mTelNum=null;//手机号码列表框
    var mAddEmailbtn=null;//添加电子邮箱
    var mAddTelbtn=null;//添加手机号码
    var mEditMsgConf=null;//编辑消息设置按钮
    var mAddEmailText=null;//添加邮箱输入框
    var mAddTelText=null;//添加手机号码输入框
    var tid=null;//消息设置table
    var editMsgDismiss=null;//消息设置取消按钮
    var editMsgSave=null;//消息设置保存按钮
    var editChangeDis=null;
    var editChangeSave=null;
    var msgInfo=null;//消息列表配置参数
    var editSetFoot=null;
    var editInfoFoot=null;
    var timer = null;
    $(function () {
        var role = sessionStorage.getItem('_role');
        var r = window._role[role] || false;
        if (r && r.message.enable) {
          if (r.message.contact.enable && r.message.contact.read) {
            $('#contact_panel').css('display', '');
          } else {
            $('#contact_panel').remove();
          }
          
          if (!r.message.contact.write) {
            $('#add-email-button').remove();
            $('#add-tel-button').remove();
            $('#new-email').remove();
            $('#new-tel').remove();
          }
          
          if (r.message.channel.enable && r.message.channel.read) {
            $('#channel_panel').css('display', '');
          } else {
            $('#channel_panel').remove();
          }
          
          if (!r.message.channel.write) {
            $('#edit-set').remove();
            $('#edit-info').remove();
          }
        } else {
          $('#contact_panel').remove();
          $('#channel_panel').remove();
        }
        
        if(current_tab == "set") {
            initPageStaticElement();
            loadMsgConfInfo();//初始化消息设置配置
            loadReceiverList();//获取联系人列表
            addContact();//添加联系人
            addBtnEvent();
            deleteContact();
        }
    });
    
    //初始化消息设置配置
    function loadMsgConfInfo(){//初始化消息设置配置
        function scb(data) {
            if(data.size!=0){
                try{
                    initMsgEdit(data);
                }catch(e){
                    ecb();
                }
            }else{
                loadTab();
            }
        }
        //if ajax request failed
        function ecb() {
            loadTab();
        }
        //ajaxCall begin
        var param={
            sinterface: SERVERCONF.MESSAGE.SETMSG,
            data:{}
        };
        ajaxCall(param,function(err,data){
            if (err) {
                alert(getErrMsg(err));
                ecb();
            }else {
                scb(data);
            }
        });
    };
    
    function initMsgEdit(data){
        var setSuccess="<span class='glyphicon glyphicon-ok' style='color: #5cb85c'></span>";
        var list=data.list;
        for(var i=0;i<list.length;i++){
            var item=list[i];
            var cat=item.categories;
            var subcat=item.subcategories;
            var channel=item.channel;
            if(channel.indexOf("手机短信")!=-1){
                msgInfo[cat][subcat]["手机短信"]=setSuccess;
            }else{
                msgInfo[cat][subcat]["手机短信"]="-";
            }
            if(channel.indexOf("邮件")!=-1){
                msgInfo[cat][subcat]["邮件"]=setSuccess;
            }else{
                msgInfo[cat][subcat]["邮件"]="-";
            }
        }
        loadTab();
    }
    
    //利用变量msgInfo加载table状态
    function loadTab(){
        var num=0;
        for(var keys in msgInfo){
            var item=msgInfo[keys];
            for(var subkey in item){
                var subitem=item[subkey];
                $(tid+" tbody tr:eq("+num+")").children("td:eq(3)").html(subitem["手机短信"]);
                $(tid+" tbody tr:eq("+num+")").children("td:eq(4)").html(subitem["邮件"]);
                num++;
            }
        }
    }
    
    function setStatus(num){
    $(tid+" tbody tr").each(
        function(){
            var smsEle=$(this).children("td:eq("+num+")");
            var status=$.trim(smsEle.html());
            var check=$("<input type=\"checkbox\">");
            if(status!="-"){
                check.attr("checked",true);
            }                          
            smsEle.html("").append(check);
            check.click(function(){
                if($(this).attr("checked")){
                    $(this).attr("checked",false);
                }else{
                    $(this).attr("checked",true);
                }
            });
        })
    };
    
    function addBtnEvent(){
        mEditMsgConf.click(function(){
            setStatus(3);
            setStatus(4);
            editSetFoot.hide();
            editInfoFoot.show();
        });
        editChangeDis.click(function(){
            loadTab();
            editSetFoot.show();
            editInfoFoot.hide();
        });
        editChangeSave.click(function(){
            obtainTabData();
            editMsgConf();
            editSetFoot.show();
            editInfoFoot.hide();
        });
    }
    
    //获取消息配置列表数据
    function obtainTabData () {
        var list=[];
        $(tid+" tbody tr").each(function(){
            var item={};
            item.categories=$(this).children("td:eq(0)").html();
            item.subcategories=$(this).children("td:eq(1)").html();
            var smsVal=$(this).children("td:eq(3)").children("input").attr("checked");
            var emailVal=$(this).children("td:eq(4)").children("input").attr("checked");
            var channel="";
            if(smsVal=="checked"){
                channel+="手机短信";
            }
            if(emailVal=="checked"){
                channel==""?channel+="邮件":channel+="，邮件";
            }
            item.channel=channel;
            list.push(item);
        });
        return list;
    }
    
    //编辑消息设置配置列表
    function editMsgConf(){
        var param={
            sinterface: SERVERCONF.MESSAGE.EDITMSG,
             data:{
                list:obtainTabData()
            }
        };
        ajaxCall(param,function(err,data){
            if(err){
                loadTab();
                alert(getErrMsg(err))
            }else{
                loadMsgConfInfo();
            }
        });
    }

    //联系人列表获取，动态添加
    function loadReceiverList(){
        function scb(data){
            if(data.size==0){
            $("#email p,#tel-num p").text("没有联系人");
            }else{
                try{
                    var emailDivEle=$("#email .form-group");
                    if(emailDivEle.length>1){
                        for(var i=1;i<emailDivEle.length;i++){
                           emailDivEle[i].remove();
                        }
                    }
                    var telDivEle=$("#tel-num .form-group");
                    if(telDivEle.length>1){
                        for(var i=1;i<telDivEle.length;i++){
                            telDivEle[i].remove();
                        }
                    }
                    var list=data.list;
                    var emaillist=[];
                    var emailList=[];//邮件联系人信息列表
                    var tellist=[];
                    var telNumList=[];//手机联系人信息列表
                    var emailId=[];
                    var telId=[];
                    //获取邮件和手机联系人列表
                    for(var i=0;i<list.length;i++){
                        var item=list[i];
                        if(item.type == ADCONSTANT.MESSAGECHANNEL.EMAIL){
                            emailList.push(item.receiver+"("+item.audit_status+") ");
                            emaillist.push(item);
                            emailId.push(item.id);
                        }else if(item.type == ADCONSTANT.MESSAGECHANNEL.SMS){
                            telNumList.push(item.receiver+"("+item.audit_status+") ");
                            tellist.push(item);
                            telId.push(item.id);
                        }
                    }
                    var emailDiv=[];
                    var telDiv=[];
                    if(emailList.length>0){
                        $("#email>.form-group:eq(0)").attr("data-eamil", emailList[0].split("(",1)[0]);
                        $("#email p:eq(0)").text(emailList[0]);
                        $("#email p:eq(0)").attr("id",emailId[0]);
                        $("#email .delete-email").attr("disabled",false);
                        if(emaillist[0].audit_status == "审核中"){
                            var oReceiveBtn = $("<button class='btn btn-link btn-sm'>重新获取验证链接</button>");
                            oReceiveBtn.click(function(e){
                                var data_email = $(this).parents(".form-group").attr("data-eamil");
                                confirm("是否重新发送验证链接至该邮箱？(邮件有效时间为1分钟)", function(){
                                    reSendEmail(data_email);
                                })
                            })
                            $("#email .col-md-2").html(oReceiveBtn);
                        }
                    }
                    
                    if(emailList.length>1){
                        for(var i=1;i<emailList.length;i++){
                            var oDivWrap=$("<div class='form-group'></div>");
                            oDivWrap.attr("data-email", emailList[i].split("(",1)[0]);
                            var oDivEle=$("<div class='col-md-4 col-lg-4 input-group'>")
                            var oP=$("<p class='form-control'></p>");
                            oP.attr("id",emailId[i]);
                            var oLabel=$("<label class='col-md-1 col-lg-1 control-label'></label>");
                            var oBtnSpan=$("<span class='input-group-btn'></span>");
                            var oBtnEmail=$("<button class='btn btn-default delete-email' data-toggle='modal' data-target='#delete-contact-modal'>X</button>");
                            oDivWrap.append(oLabel);
                            oDivWrap.append(oDivEle);
                            oDivEle.append(oP);
                            oDivEle.append(oBtnSpan);
                            oBtnSpan.append(oBtnEmail);
                            oP.text(emailList[i]);
                            emailDiv.push(oDivWrap);
                            if(emaillist[i].audit_status == "审核中"){
                                var oReceiveEle = $("<div class='col-md-2 col-lg-2'></div>");
                                oDivWrap.append(oReceiveEle);
                                var oReceiveBtn = $("<button class='btn btn-link btn-sm'>重新获取验证链接</button>");
                                oReceiveBtn.click(function(e){
                                    var data_email = $(this).parents(".form-group").attr("data-email");
                                    confirm("是否重新发送验证链接至该邮箱？(邮件有效时间为1分钟)", function(){
                                        reSendEmail(data_email);
                                    })
                                })
                                oReceiveEle.append(oReceiveBtn);
                            }
                        }
                        $("#email").append(emailDiv);
                    }
                    
                    if(telNumList.length>0){
                        $("#tel-num>.form-group:eq(0)").attr("data-tel", telNumList[0].split("(",1)[0]);
                        $("#tel-num>.form-group:eq(0)").attr("data-id", telId[0]);
                        $("#tel-num p:eq(0)").text(telNumList[0]);
                        $("#tel-num p:eq(0)").attr("id",telId[0]);
                        $("#tel-num .delete-tel").attr("disabled",false);
                        if(tellist[0].audit_status == "审核中" || tellist[0].audit_status == "审核失败"){
                            var oReceiveBtn = $("<button class='btn btn-link btn-sm'>重新获取短信验证码</button>");
                            oReceiveBtn.click(function(e){
                                clearInterval(timer);
                                $("#resend-tel-verify").attr("disabled",false);
                                $("#resend-tel-verify").text("获取验证码");
                                $("#resend-tel-sms").modal("show");
                                $("input[type=text]").val("");
                                $("#re-verify").prop("disabled", true);
                                var tel = $(this).parents(".form-group").attr("data-tel");
                                $("#mobile").val(tel);
                                var user_id = $(this).parents(".form-group").attr("data-id");
                                //oReceiveBtn.unbind("click");
                                reVerifyTel(tel, user_id);
                            })
                            $("#tel-num .col-md-2").html(oReceiveBtn);
                        }else{
                            $("#tel-num .col-md-2").html("");
                        }
                    }
                    
                    if(telNumList.length>1){
                        for(var i=1;i<telNumList.length;i++){
                            var oDivWrap=$("<div class='form-group'></div>");
                            oDivWrap.attr("data-tel", telNumList[i].split("(",1)[0]);
                            oDivWrap.attr("data-id", telId[i]);
                            var oDivEle=$("<div class='col-md-4 col-lg-4 input-group'>")
                            var oP=$("<p class='form-control'></p>");
                            oP.attr("id",telId[i]);
                            var oLabel=$("<label class='col-md-1 col-lg-1 control-label'></label>");
                            var oBtnSpan=$("<span class='input-group-btn'></span>");
                            var oBtnTel=$("<button class='btn btn-default delete-tel' data-toggle='modal' data-target='#delete-contact-modal'>X</button>");
                            oDivWrap.append(oLabel);
                            oDivWrap.append(oDivEle);
                            oDivEle.append(oP);
                            oDivEle.append(oBtnSpan);
                            oBtnSpan.append(oBtnTel);
                            oP.text(telNumList[i]);
                            telDiv.push(oDivWrap);
                            if(tellist[i].audit_status == "审核中" || tellist[i].audit_status == "审核失败"){
                                var oReceiveEle = $("<div class='col-md-2 col-lg-2'></div>");
                                oDivWrap.append(oReceiveEle);
                                var oReceiveBtn = $("<button class='btn btn-link btn-sm'>重新获取短信验证码</button>");
                                oReceiveBtn.click(function(e){
                                    clearInterval(timer);
                                    $("#resend-tel-verify").attr("disabled",false);
                                    $("#resend-tel-verify").text("获取验证码");
                                    $("#resend-tel-sms").modal("show");
                                    $("input[type=text]").val("");
                                    $("#re-verify").prop("disabled", true);
                                    var tel = $(this).parents(".form-group").attr("data-tel");
                                    $("#mobile").val(tel);
                                    var user_id = $(this).parents(".form-group").attr("data-id");
                                    //oReceiveBtn.unbind("click");
                                    reVerifyTel(tel, user_id);
                                })
                                oReceiveEle.append(oReceiveBtn);
                            }else{
                                oDivWrap.children(".col-md-2").remove();
                            }
                        }
                        $("#tel-num").append(telDiv);
                    }
                }catch(e){
                    ecb();
                }
            }
        }
        function ecb() {
            alert("获取联系人失败！");
            $("#email p").text("");
            $("#tel-num p").text("");
        }
        var param={
            sinterface: SERVERCONF.MESSAGE.ReceiverList,
             data:{}};
        ajaxCall(param,function(err,data){
        if (err) {
            ecb();
        }else {
            scb(data);
            deleteContactInfo();
        }});
    };
    
    //删除联系人
    function deleteContactInfo(){
        $("#email .delete-email").each(function(index){
            $(this).click(function(){
            var contactInfo=$("#email p:eq("+index+")").text();
            var contactId=$("#email p:eq("+index+")").attr("id");
            console.log(contactId);
            $("#delete-contact-info").text("邮箱："+contactInfo);
            $("#contant-id").text(contactId);})
        });
        $("#tel-num .delete-tel").each(function(index){
            $(this).click(function(){
            var contactInfo=$("#tel-num p:eq("+index+")").text();
            var contactId=$("#tel-num p:eq("+index+")").attr("id");
            console.log(contactId);
            $("#delete-contact-info").text("手机："+contactInfo);
            $("#contant-id").text(contactId);})
        });
    }  
    
    function deleteContact(){
        $("#delete-contact").click(function(){
            var receiverId=$("#contant-id").text();
            function cb(){
                var emailLen=$("#email p").length;
                var telLen=$("#tel-num p").length;
                if(emailLen==1){
                  $("#email .delete-email:eq(0)").attr("disabled",true);
                  $("#email p").text("");
                  $(".col-md-2").html("");
                }
                if(telLen==1){
                  $("#tel-num .delete-tel:eq(0)").attr("disabled",true);
                  $("#tel-num p").text("");
                  $(".col-md-2").html("");
                }
                loadReceiverList();
            }
            var param={
                sinterface: SERVERCONF.MESSAGE.DELCONTACT,
                data:{
                    id:receiverId
                }
            }
            ajaxCall(param,function(err,data){
                if(err){
                    alert(getErrMsg(err));
                }else{
                    cb();
                }
            })
        });
    }  
  
    //添加联系人
    function addContact(){
        //点击取消按钮撤销默认值
        $("button[name='dismiss'],.close").click(function(){
            $("input").val("");
            $(".tip").text("");
            clearInterval(timer);
            $("#tel-verify").text("获取验证码");
            $("#tel-verify").attr("disabled",true);
            $("#add-email,#new-tel input[name='sms'],#add-tel").attr("disabled",true);
        });
        
        //验证邮箱格式是否合法
        mAddEmailText.bind('input propertychange', function() {
            /* Act on the event */
            var email=$(this).val();
            var reg=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
            if(!reg.test(email)){
                $("#email-tip").text("请输入正确邮箱格式");
                mAddEmailbtn.attr("disabled",true);
            }else{
                $("#email-tip").text("");
                mAddEmailbtn.attr("disabled",false);
            }
        });
    
        //验证手机号码
        mAddTelText.bind('input propertychange',function(){
            var telNum=$(this).val();
            var reg=/^1[34578]\d{9}$/;
            if(!reg.test(telNum)){
                $("#tel-tip").text("请输入正确手机号码");
                $("#tel-verify").attr("disabled",true);
            }else{
                $("#tel-tip").text("");
                $("#tel-verify").attr("disabled",false);
            }
        });
    
        $("#new-tel input[name='sms']").bind('input propertychange',function(){
            mAddTelbtn.attr("disabled",false);
        });
    
        //添加邮箱联系人
        mAddEmailbtn.click(function() {
            var $this=$(this);
            $this.attr("disabled",true);
            var emailVal = $("#new-email input[name='email']").val();
            var param = {
                sinterface: SERVERCONF.MESSAGE.ADDCONTACT,
                data: {
                    type: "邮件",
                    receiver: emailVal
                }
            };
            ajaxCall(param, function (err, data) {
                if (err) {
                    $this.attr("disabled",false);
                    alert(getErrMsg(err));
                } else {
                    //loadReceiverList();
                    $("#add-email-panel").hide();
                    $("#add-email-info").show();
                    $("#add-email-next").hide();
                    $("#add-email-sure").show();
                }
            });
        });
    
        $("#new-email button[name='add-email-sure']").click(function(){
            $("#add-email-panel").show();
            $("#add-email-info").hide();
            $("#add-email-next").show();
            $("#add-email-sure").hide();
            mAddEmailbtn.attr("disabled",true);
            mAddEmailText.val("");
            loadReceiverList();
        });

        //获取验证码按钮
        var timer=null;//定时器
        var receiverId=null;
        $("#tel-verify").click(function(){
            var $this=$(this);
            var num=60;
            $(this).attr("disabled",true).text(num+"s后重新获取");
            timer=setInterval(function(){
                num--;
                $this.text(num+"s后重新获取");
                if(num<=0){
                    clearInterval(timer);
                    $this.attr("disabled",false);
                    $this.text("获取验证码");
                }
            },1000);
            var telVal = $("#new-tel input[type='tel']").val();
            var param = {
                sinterface: SERVERCONF.MESSAGE.ADDCONTACT,
                data: {
                    type: "手机短信",
                    receiver: telVal
                }
            };
            ajaxCall(param, function (err, data) {
                if (err) {
                    clearInterval(timer);
                    $this.attr("disabled",false);
                    $this.text("获取验证码");
                    alert(getErrMsg(err));
                } else {
                    $("#new-tel input[name='sms']").attr("disabled",false);
                    receiverId=data.id;
                    $("#cancel-verify").click(function(){
                        loadReceiverList();
                    })
                }
            });
        });
    
        $("#add-tel").click(function(){
            var smsCode=$("#new-tel input[name='sms']").val();
            function cb(){
                clearInterval(timer);
                $("#tel-verify").text("获取验证码");
                $("#tel-verify").attr("disabled",true);
                $("#new-tel input[name='sms']").attr("disabled",true);
                $("#new-tel input").val("");
            }
            var param = {
                sinterface: SERVERCONF.MESSAGE.SMSVERIFY,
                data: {
                    id:receiverId,
                    smscode:smsCode
                }
            };
            ajaxCall(param, function (err, data) {
                if (err) {
                    alert(getErrMsg(err));
                } else {
                    loadReceiverList();
                }
                mAddTelbtn.attr("disabled",true);
                cb();
            });
        });
    
    }
  
    //重新发送邮箱验证链接
    function reSendEmail(email){
        var param = {
            sinterface: SERVERCONF.MESSAGE.RESENDEMAIL,
            data: {
                receiver: email
            }
        };
        ajaxCall(param, function(err){
            if(err){
                alert("获取验证链接失败");
            }else{
                alert("成功获取邮箱验证链接，请前往邮箱进行验证");
            }
        })
    }
    
    //重新发送短信验证
    function reVerifyTel(mobile, id){
        $("#resend-tel-verify").unbind("click");
        $("#resend-tel-verify").click(function(){
            var num = 60;
            $(this).attr("disabled",true).text("重新发送(" + num + ")");
            timer = setInterval(function(){
                //alert();
                num--;
                $("#resend-tel-verify").text("重新发送(" + num + ")");
                if(num<=0){
                    clearInterval(timer);
                    $("#resend-tel-verify").attr("disabled",false);
                    $("#resend-tel-verify").text("获取验证码");
                }
            },1000);
            var param = {
                sinterface : SERVERCONF.USERS.GETSMS,
                data : {
                    "mobile": mobile
                }
            };
            ajaxCall(param, function(err, data){
                if(err){
                    if(err.code == ERRCODE.SMSCODE_TOOMANY.code){
                        alert("短信验证码获取过于频繁");
                    }else{
                        alert("短信验证码获取失败");
                    }
                    clearInterval(timer);
                    $("#resend-tel-verify").attr("disabled",false);
                    $("#resend-tel-verify").text("获取验证码");
                }else{
                }
            });
        })
            
        $("#sms-code").bind('input propertychange',function(){
            $("#re-verify").attr("disabled",false);
        });
        
        $("#re-verify").click(function(){
            var smsCode = $("#sms-code").val();
            var param = {
                sinterface: SERVERCONF.MESSAGE.SMSVERIFY,
                data: {
                    id: id,
                    smscode:smsCode
                }
            };
            ajaxCall(param, function (err, data) {
                if (err) {
                } else {
                    loadReceiverList();
                }
            });
        })
    }
    
    //初始化参数
    function initPageStaticElement(){
        mEmail=$("#email");
        mTelNum=$("#tel-num");
        mAddEmailbtn=$("#add-email");
        mAddTelbtn=$("#add-tel");
        mAddEmailText=$("input[name='email']");
        mAddTelText=$("input[type='tel']");
        tid="#msgConInfo";
        mEditMsgConf=$("#edit-btn");
        editMsgDismiss=$("#edit-dismiss");
        editMsgSave=$("#edit-save");
        editSetFoot=$("#edit-set");
        editInfoFoot=$("#edit-info");
        editChangeDis=$("#edit-change-dismiss");
        editChangeSave=$("#edit-change-save");
        msgInfo={
            "系统消息":{"系统通知":{"手机短信":"-","邮件":"-"}},
            "审核消息":{"广告审核不通过":{"手机短信":"-","邮件":"-"}} ,
            "账户消息":{
                "账户消耗达到日限额":{"手机短信":"-","邮件":"-"},
                "推广计划消耗达到日限额":{"手机短信":"-","邮件":"-"},
                "创意定制完成通知":{"手机短信":"-","邮件":"-"},
                "广告投放到期预警":{"手机短信":"-","邮件":"-"}},
            "财务消息":{
                "账户余额为零提醒":{"手机短信":"-","邮件":"-"},
                "账户余额不足500元预警":{"手机短信":"-","邮件":"-"},
                "账户余额不足3日消耗预警":{"手机短信":"-","邮件":"-"},
                "资金到账提醒":{"手机短信":"-","邮件":"-"}}
        };
    }
}();
