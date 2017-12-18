'use strict';

!function(){
    // page static elements
    var mOpName = null;
    var mOpPass = null;
    var mOpMobile = null;
    var mOpEmail = null;
    //edit
    var mEditOpName = null;
    var mEditOpMobile = null;
    var mEditOpEmail = null;
    var mSubmitBtn = null;
    var madd_operator=null;
    var mswitchtable=null;
    var mOpModal = null;
    var rowEle = null;
    var rowId = null;
    var Crole= ADCONSTANT.ROLE;
    var list = null;
    var mErrMsg = null;
    var initialRole = null;
    
    var tid="#operator-list";
    $(function(){        
        initPageStaticElement();
        var current_tab = window.current_tab || "";
        initTabs(user_tabs_config, current_tab);
        initContentOfOperator(checkstatus);
    });
     
    function initPageStaticElement(){
        mOpName = $('#op-name');
        mOpPass = $('#op-passwd');
        mOpMobile = $('#op-mobile');
        mOpEmail = $('#op-email');
        mEditOpName = $('#edit-op-name');
        mEditOpMobile = $('#edit-op-mobile');
        mEditOpEmail = $('#edit-op-eamil');
        mSubmitBtn = $('#submit-operator-form');
        madd_operator = $('#add_operator');
        mswitchtable=$("input[name='switchtable']:checked").val();
        mOpModal = $('#operator-modal');
        mErrMsg = $("#err-msg");
    }
     
    $("[data-toggle='tooltip']").tooltip();
    
    function initContentOfOperator(checkstatus) {
        loadOperatorList(checkstatus);
    }
    function loadOperatorList(checkstatus, index, count){
        var tids = ["#inviting-operator-list", "#invited-operator-list"];
        if(checkstatus == "审核中"){
            var tid = tids[0];
        }else{
            var tid = tids[1];
        }
        
        emptyTbody(tid);
        setTfoot(tid, spinLoader("数据加载中，请稍候..."));
        var index = parseInt(index) || 0;
        var count = parseInt(count) || 10;
        function ecb() {
            emptyTbody(tid);
            setTfoot(tid, stringLoadFail());
        }
        function scb(data){
            if (data.size == 0) {
                setTfoot(tid, stringLoadFail("没有数据"));
            } else {
                try{
                    var total = data.total;
                    list = data.list;
                    var pagenumber = Math.ceil(total / count);
                    var rows = [];
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        var row = $("<tr></tr>");
                        row.attr("data-id", i);
                        var role = new Array(Crole.CREATOR, Crole.ADMIN, Crole.OPERATOR, Crole.VIWER, Crole.FINANCIAL);
                        row.attr("data-operator-id", item.oper_id);
                        row.append($("<td>" + (i+1) + "</td>"));
                        row.append($("<td>" + item.name + "</td>"));
                        row.append($("<td>" + role[item.role] + "</td>"));
                        row.append($("<td>" + item.audit_status + "</td>"));
                        var actions = $("<td></td>");
                        row.append(actions);
                        var edit = $("<button type=\"button\" class=\"btn btn-xs btn-link\">编辑</button>");
                        edit.click(function(e){
                            mErrMsg.html("");
                            mOpModal.modal("show");
                            var choosed_data_id = $(this).parents("tr").attr("data-id");
                            mEditOpName.val(list[choosed_data_id].name);
                            mEditOpMobile.val(list[choosed_data_id].mobile);
                            mEditOpEmail.val(list[choosed_data_id].email);
                            $("input[name='role'][value='" + role[list[choosed_data_id].role] +"']").prop("checked", true);
                            initialRole = role[list[choosed_data_id].role];
                            mSubmitBtn.click(function(e){
                                submitEditForm(list[choosed_data_id].oper_id);
                            });
                        })
                        actions.append(edit);
                        if(checkstatus == "审核中"){
                            var authorize = $("<button type=\"button\" class=\"btn btn-xs btn-link\">授权</button>");
                            authorize.click(function(e){
                                var target_oper_id = $(this).parents("tr").attr("data-operator-id");
                                confirm("确定要授权该协作者吗？", function(){
                                    var page_number = $(".pagination>li[class=active]").children().html();
                                    var param = {
                                        sinterface : SERVERCONF.USERS.OPERATORVERIFY,
                                        data : {
                                            target_oper_id: target_oper_id,
                                            operation: "授权"
                                        }
                                    }
                                    ajaxCall(param, function(err, data){
                                        if(err){
                                            alert("您当前角色不允许此次操作！");
                                        }else{
                                            loadOperatorList(checkstatus, page_number - 1);
                                        }
                                    })
                                })
                            })
                            actions.append(authorize);
                            var refuse = $("<button type=\"button\" class=\"btn btn-xs btn-link\">拒绝</button>");
                            refuse.click(function(e){
                                var target_oper_id = $(this).parents("tr").attr("data-operator-id");
                                confirm("确定拒绝授权该协作者吗？", function(){
                                    var page_number = $(".pagination>li[class=active]").children().html();
                                    var param = {
                                        sinterface : SERVERCONF.USERS.OPERATORVERIFY,
                                        data : {
                                            target_oper_id: target_oper_id,
                                            operation: "拒绝"
                                        }
                                    }
                                    ajaxCall(param, function(err, data){
                                        if(err){
                                            alert("您当前角色不允许此次操作！");
                                        }else{
                                            loadOperatorList(checkstatus, page_number - 1);
                                        }
                                    })
                                })
                            })
                            actions.append(refuse);
                        }else if(checkstatus == "审核通过"){
                            if(item.role == 0){
                                actions.html("");
                            }else{
                                var del = $("<button type=\"button\" class=\"btn btn-xs btn-link\">删除</button>");
                                del.click(function(e){
                                    var target_oper_id = $(this).parents("tr").attr("data-operator-id");
                                    confirm("确认删除该协作者？", function(){
                                        var page_number = $(".pagination>li[class=active]").children().html();
                                        var list_length = $("#invited-operator-list tbody>tr").length;
                                        var param = {
                                            sinterface : SERVERCONF.USERS.DELOPERATOR,
                                            data : {
                                                target_oper_id: target_oper_id
                                            }
                                        }
                                        ajaxCall(param, function(err, data){
                                            if(err){
                                                alert("您当前角色不允许此次操作！");
                                            }else{
                                                if(page_number > 1 && list_length == 1){
                                                    loadOperatorList(checkstatus, page_number - 2);
                                                }else{
                                                    loadOperatorList(checkstatus, page_number - 1);
                                                } 
                                            }
                                        })
                                    })
                                })
                                actions.append(del);
                            }
                        }
                        
                        rows.push(row);
                    }
                    setTbody(tid, rows);
                    setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                        loadOperatorList(checkstatus, parseInt(t.hash.replace("#", "")));
                    }));
                }catch(e) {
                    ecb();
                }
            }
            
        }
        var param = {
            sinterface: SERVERCONF.USERS.OPERATORLIST,
            data : {
                audit_status : checkstatus,
                index: index,
                count: count
            }
        };
        
        ajaxCall(param, function(err, data) {
            if (err) {
                ecb();
            }else {
                scb(data);
                
            }
        });
    }
    
    function submitEditForm(target_oper_id){
        var name = mEditOpName.val();
        var mobile = mEditOpMobile.val();
        var email = mEditOpEmail.val();
        var edit_role = $("input[name='role']:checked").val();
        if(name == ""){
            setInfoDiv(mErrMsg, "error", "请输入协作人员姓名");
        }else if(!isMobile(mobile)){
            setInfoDiv(mErrMsg, "error", "请输入合法的手机号码");
        }else if(!isEmail(email)){
            setInfoDiv(mErrMsg, "error", "请输入合法的邮箱");
        }else{
            var data = {
               target_oper_id: target_oper_id,
               name: name,
               mobile: mobile,
               email: email
            }
            if(edit_role == initialRole){     
            }else{
                data.edit_role = edit_role;
            }
            var param = {
                sinterface: SERVERCONF.USERS.OPERATOREDIT,
                data : data
            }
            ajaxCall(param,function(err,data){
                if(err){
                    setInfoDiv(mErrMsg, "info", "您当前角色不允许此次操作！");
                }else{
                    mOpModal.modal("hide");
                    loadOperatorList(checkstatus);
                }
            });
        }
    }
    
    $('#add_operator').click(function(){
        var name = mOpName.val();
        var password = mOpPass.val();
        var mobile = mOpMobile.val();
        var email = mOpEmail.val();
        var edit_role = $("input[name='permission']:checked").val();
        if(name == ""){
            alert("请输入协作人员姓名");
        }else if(!isPassword(password)){
            alert("密码格式错误！必须包含数字，大小字母，长度6-16位");
        }else if(!isMobile(mobile)){
            alert("请输入合法的手机号码");
        }else if(!isEmail(email)){
            alert("请输入合法的邮箱");
        }else{
            var param = {
                sinterface: SERVERCONF.USERS.OPERATORADD,
                data : {
                   name: name,
                   password: hex_sha1(password + SYSTEM.SALT),
                   mobile: mobile,
                   email: email,
                   edit_role: edit_role,
                }
            }
            ajaxCall(param,function(err,data){
                if(err){
                    if(err.code == ERRCODE.DB_DATADUPLICATED.code){
                        alert("协作者姓名重复");
                    }else{
                        alert("您当前角色不允许此次操作！");
                    }
                }else{
                    mOpName.val("");
                    mOpPass.val("");
                    mOpMobile.val("");
                    mOpEmail.val("");
                    alert("添加成功！")
                    loadOperatorList(checkstatus);
                }
            });
        }
         
    });
     
    $(".choiceline :radio").click(function(){
        var choosed = $(this).val();
        if(choosed == "current_list"){
            $("#inviting-operator-list").addClass("hidden");
            $("#invited-operator-list").removeClass("hidden");
            checkstatus = ADCONSTANT.CHECK.PASS;
            loadOperatorList(checkstatus);
        }else{
            $("#inviting-operator-list").removeClass("hidden");
            $("#invited-operator-list").addClass("hidden");
            checkstatus = ADCONSTANT.CHECK.VERIFYING;
            loadOperatorList(checkstatus);
        }
    });
     

     
}();
var checkstatus = ADCONSTANT.CHECK.VERIFYING;