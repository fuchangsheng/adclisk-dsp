
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
  $(function () {
    var tabs_config = [
      {"name": "set", "text": "消息设置", "url": "/msg_set.html"},
      {"name": "msgList", "text": "查看消息", "url": "/msg_list.html"},
      {"name": "opLog", "text": "操作日志", "url": "/opLog.html"}
    ];
    var current_tab = window.current_tab || "";
    initTabs(tabs_config, current_tab);
    if (current_tab == "set") {
      initPageStaticElement();
      loadReceiverList();//获取联系人列表
      addContact();//添加联系人
      deleteContact();
    }
  });
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
                    var emailList=[];//邮件联系人信息列表
                    var telNumList=[];//手机联系人信息列表
                    var emailId=[];
                    var telId=[];
                    //获取邮件和手机联系人列表
                    for(var i=0;i<list.length;i++){
                        var item=list[i];
                        if(item.type=="邮件"){
                            emailList.push(item.receiver+"("+item.audit_status+") ");
                            emailId.push(item.id);
                        }else if(item.type=="手机短信"){
                            telNumList.push(item.receiver+"("+item.audit_status+") ");
                            telId.push(item.id);
                        }
                    }
                    var emailDiv=[];
                    var telDiv=[];
                    if(emailList.length>0){
                        $("#email p:eq(0)").text(emailList[0]);
                        $("#email p:eq(0)").attr("id",emailId[0]);
                        $("#email .delete-email").attr("disabled",false);
                    }
                    if(emailList.length>1){
                        for(var i=1;i<emailList.length;i++){
                            var oDivWrap=$("<div class='form-group'></div>");
                            var oDivEle=$("<div class='col-md-4 col-lg-4 input-group'>")
                            var oP=$("<p class='form-control'></p>");
                            oP.attr("id",emailId[i]);
                            var oLabel=$("<label class='col-sm-1 control-label'></label>");
                            var oBtnSpan=$("<span class='input-group-btn'></span>");
                            var oBtnEmail=$("<button class='btn btn-default delete-email' data-toggle='modal' data-target='#delete-contact-modal'>X</button>");
                            oDivWrap.append(oLabel);
                            oDivWrap.append(oDivEle);
                            oDivEle.append(oP);
                            oDivEle.append(oBtnSpan);
                            oBtnSpan.append(oBtnEmail);
                            oP.text(emailList[i]);
                            emailDiv.push(oDivWrap);
                        }
                        $("#email").append(emailDiv);
                    }
                    if(telNumList.length>0){
                        $("#tel-num p:eq(0)").text(telNumList[0]);
                        $("#tel-num p:eq(0)").attr("id",telId[0]);
                        $("#tel-num .delete-tel").attr("disabled",false);
                    }
                    if(telNumList.length>1){
                        for(var i=1;i<telNumList.length;i++){
                            var oDivWrap=$("<div class='form-group'></div>");
                            var oDivEle=$("<div class='col-md-4 col-lg-4 input-group'>")
                            var oP=$("<p class='form-control'></p>");
                            oP.attr("id",telId[i]);
                            var oLabel=$("<label class='col-sm-1 control-label'></label>");
                            var oBtnSpan=$("<span class='input-group-btn'></span>");
                            var oBtnTel=$("<button class='btn btn-default delete-tel' data-toggle='modal' data-target='#delete-contact-modal'>X</button>");
                            oDivWrap.append(oLabel);
                            oDivWrap.append(oDivEle);
                            oDivEle.append(oP);
                            oDivEle.append(oBtnSpan);
                            oBtnSpan.append(oBtnTel);
                            oP.text(telNumList[i]);
                            telDiv.push(oDivWrap);
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
            $("#delete-contact-info").text("邮箱："+contactInfo);
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
                }
                if(telLen==1){
                  $("#tel-num .delete-tel:eq(0)").attr("disabled",true);
                  $("#tel-num p").text("");
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
                    cb();
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

  //初始化参数
  function initPageStaticElement(){
    mEmail=$("#email");
    mTelNum=$("#tel-num");
    mAddEmailbtn=$("#add-email");
    mAddTelbtn=$("#add-tel");
    mAddEmailText=$("input[name='email']");
    mAddTelText=$("input[type='tel']");
  }
}();
