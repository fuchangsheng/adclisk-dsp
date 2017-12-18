/*
 * @file  admin.js
 * @description dsp management admin page js logic
 * @copyright dmtec.cn reserved, 2016
 * @author Jiangtu
 * @date 2016.12.15
 * @version 0.0.1 
 */
'use strict';
!function(){
    var mUserName = null;
    var mPassword = null;
    var mPhone = null;
    var mEmail = null;
    var mRole = null;
    var mAddBtn = null;
    var mAddManagerBtn = null;
    var mManagerForm = null;
    var mErrMsg = null;
    var passReg = /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,16}$/;
    function initPageStaticElements(){
        mUserName = $('#username');
        mPassword = $('#password');
        mPhone = $('#phone');
        mEmail = $('#email');
        mRole = $('#manager-role');
        mAddBtn = $('#create-manager');
        mAddManagerBtn = $('#add-manager');
        mManagerForm = $('#modal-manager-form');
        mErrMsg = $('#err-msg');
    }
    
    $(function(){
        initPageStaticElements();
        mAddBtn.click(function(e){
            mManagerForm.modal("show");
            mAddManagerBtn.click(submitAddMangerForm);
        })
        loadManagerList();
    })
        
    function loadManagerList(index, count){
        var tid = "#manager-list";
        emptyTbody(tid);
        setTfoot(tid, spinLoader("数据加载中，请稍候..."));
        var index = parseInt(index) || 0;
        var count = parseInt(count) || 10;
        function scb(data){
            if (data.size == 0) {
                setTfoot(tid, stringLoadFail("没有数据"));
            }else{
                try{
                    var total = data.total;
                    var list = data.list;
                    var pagenumber = Math.ceil(total / count);
                    var rows = [];
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        var row = $("<tr></tr>");
                        row.attr("data-manager-id", item.id);
                        row.attr("data-role-type", item.role);
                        row.append($("<td>" + item.name + "</td>"));
                        row.append($("<td>" + item.phone + "</td>"));
                        row.append($("<td>" + item.email + "</td>"));
                        row.append($("<td>" + item.role + "</td>"));
                        var actions = $("<td></td>");
                        row.append(actions);
                        var op = $("<button type=\"button\" class=\"btn btn-xs btn-link\">修改权限</button>");
                        op.click(function(e){
                            var man_id = $(this).parents("tr").attr("data-manager-id");
                            var role = $(this).parents("tr").attr("data-role-type");
                            confirm("确认修改权限", function(){
                                var page_number = $(".pagination>li[class=active]").children().html();
                                var data = {target_mgr_id: man_id}
                                if(role == ADCONSTANT.ROLE.ADMIN){data.role = 2;}
                                else{data.role = 1;}
                                var param = {
                                    sinterface : SERVERCONF.ADMIN.ADMINUPDATE,
                                    data: data
                                };
                                ajaxCall(param, function(err, data){
                                    if(err){
                                        alert("修改失败");
                                    }else{
                                        loadManagerList(page_number - 1);
                                    }
                                });
                            });
                        });
                        actions.append(op);
                        var del = $("<button type=\"button\" class=\"btn btn-xs btn-link\">删除</button>");
                        del.click(function(e){
                            var man_id = $(this).parents("tr").attr("data-manager-id");
                            confirm("确认删除这条记录？", function(){
                                var page_number = $(".pagination>li[class=active]").children().html();
                                var list_length = $("#manager-list tbody>tr").length;
                                var param = {
                                    sinterface : SERVERCONF.ADMIN.ADMINDEL,
                                    data: {
                                        target_mgr_id: man_id
                                    }
                                };
                                ajaxCall(param, function(err, data){
                                    if(err){
                                        alert("删除失败");
                                    }else{
                                        if(page_number > 1 && list_length == 1){
                                            loadManagerList(page_number - 2);
                                        }else{
                                            loadManagerList(page_number - 1);
                                        }
                                    }
                                });
                            });                          
                        });
                        actions.append(del);
                        rows.push(row);
                    }
                    setTbody(tid, rows);
                    setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                        loadManagerList(parseInt(t.hash.replace("#", "")));
                    }));
                }catch(e){
                    ecb();
                }
            }
        }
        
        function ecb() {
            emptyTbody(tid);
            setTfoot(tid, stringLoadFail());
        }
        
        var param = {
            sinterface : SERVERCONF.ADMIN.ADMINLIST,
            data : {
                index: index,
                count: count
            }
        };
        
        ajaxCall(param, function(err, data){
            if(err){
                ecb();
            }else{
                scb(data);
            }
        })
    }
    
    function submitAddMangerForm(){
        var userName = mUserName.val();
        var pass = mPassword.val();
        var phone = mPhone.val();
        var email = mEmail.val();
        var role = mRole.find("input:checked").val();
        if(userName == "" || pass == "" || phone == "" || email == ""){
            errMsg("表单数据有误");
            return;
        }else if(!passReg.test(pass)){
            errMsg("密码强度不够！必须包含数字，大小字母，长度6-16位");
            return;
        }
        var param = {
            sinterface : SERVERCONF.ADMIN.ADMINADD,
            data : {
                name: userName,
                password: hex_sha1(pass + SYSTEM.SALT),
                phone: phone,
                email: email,
                role: role
            }
        }
        
        ajaxCall(param, function(err, data){
            if(err){
                errMsg("添加失败");
            }else{
                mManagerForm.modal("hide");
                loadManagerList();
            }
        })
    }
    
    function errMsg(msg){
        mErrMsg.html("<div class='alert alert-danger alert-dismissible' role='alert'>" +
                             "<button type='button' class='close' data-dismiss='alert'>" +
                               "<span aria-hidden='true'>×</span><span class='sr-only'>Close</span>" +
                             "</button>" +
                             "<strong>Error!</strong><span>" + msg + "</span>" +
                           "</div>");
    }
}();