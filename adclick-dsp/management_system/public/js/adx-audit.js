/*
 * @file  adx-audit.js
 * @description adx data interface process
 * @copyright dmtec.cn reserved, 2016
 * @author Jiangtu
 * @date 2016.12.17
 * @version 0.0.1 
 */

'use strict';
!function(){
    var mTabs = null;
    var mAdxSet = null;
    var mAdxUser = null;
    var mAdxIdea = null;

    var mSubmitSetBtn = null;
    var mAdxConfigDiv = null;
    var mAdxConfigTitle = null;
    
    var mId = null;
    var mAdxId = null;
    var mAdxStatus = null;
    var mAdxIdeaEdit = null;
    
    var mUserSort = null;
    var mIdeaSort = null;
    var mErrMsg = null;
    
    //table of user
    var mUserTableBes = null;
    var mUserTableMgtv = null;
    var mUserTableAdSwitch = null;
    var mUserTableOther = null;
    
    //table of idea
    var mIdeaTableBes = null;
    var mIdeaTableMgtv = null;
    var mIdeaTableAdSwitch = null;
    var mIdeaTableOther = null;
    
    
    var mConfigResultInfo = null; 
    var idea_list = null;
    function initPageStaticElements() {
        mTabs = $('#tabs a');
        mAdxSet = $('#adx-set');
        mAdxUser = $('#adx-user');
        mAdxIdea = $('#adx-idea');

        mSubmitSetBtn = $('#submit-set');
        mAdxConfigDiv = $('#adx-config');
        mAdxConfigTitle = $('#adx-config-title');
        
        mId = $('#id');
        mAdxId = $('#adx-id');
        mAdxStatus = $('#adx-idea-status');
        mAdxIdeaEdit = $('#edit-adx-idea');
        mErrMsg = $('#err-msg');
        mConfigResultInfo = $('#config-result-info');
        
        //table of user
        mUserTableBes = $('#user-list-bes');
        mUserTableMgtv = $('#user-list-mgtv');
        mUserTableAdSwitch = $('#user-list-adswitch');
        mUserTableOther = $('#user-list-other');
    
        //table of idea
        mIdeaTableBes = $('#idea-list-bes');
        mIdeaTableMgtv = $('#idea-list-mgtv');
        mIdeaTableAdSwitch = $('#idea-list-adswitch');
        mIdeaTableOther = $('#idea-list-other');
        
        mUserSort = $('#user-sort');
        mIdeaSort = $('#idea-sort');
    }

    $(function() {
        var tabs_config = [
            {"name": "adx_set", "text": "设置"},
            {"name": "adx_user", "text": "用户信息"},
            {"name": "adx_idea", "text": "广告创意"}
        ];
        var current_tab = window.current_tab || "";
        initTabs(tabs_config, current_tab);
        initPageStaticElements();
        initAdxList(adxChoosedInit);

        mTabs.click(function(){
            $(this).parent().addClass("active");
            $(this).parent().siblings().removeClass("active");
            mainDivInit($(this).attr("id"));
        });

        mSubmitSetBtn.click(function(){
            adxConfig();
        });
        
        mAdxStatus.find("input").click(function(){
            $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        });
        
        mUserSort.change(initAdxUserInfo);
        mIdeaSort.change(initAdxIdeaInfo);
    });

    function mainDivInit(tab_id){
        if(tab_id == "adx_set"){
            mAdxSet.removeClass("hidden");
            mAdxSet.siblings().addClass("hidden");
        }else if(tab_id == "adx_user"){
            mAdxUser.removeClass("hidden");
            mAdxUser.siblings().addClass("hidden");
            initAdxUserInfo();
        }else if(tab_id == "adx_idea"){
            mAdxIdea.removeClass("hidden");
            mAdxIdea.siblings().addClass("hidden");
            initAdxIdeaInfo();
        }
    }

    function adxChoosedInit(){
        mTabs.eq(1).removeClass("hidden");
        mTabs.eq(2).removeClass("hidden");
        mAdxConfigDiv.html("");
        mTabs[0].click();
        mConfigResultInfo.html("");
        $("input[type=text]").val("");
        //init adx config div due to different adx
        if(choosed_adx_id == 0){
            mAdxConfigTitle.html("BES-API设置");
            var bes_config = [
                {"name": "*dsp id", "id": "dsp-id", "info": "请输入符合要求的dsp id"},
                {"name": "*token", "id": "token", "info": "请输入符合要求的dsp id"},
            ];
            initConfigDiv(bes_config);
        }else if(choosed_adx_id == 1){
            mAdxConfigTitle.html("BCH-API设置");
        }else if(choosed_adx_id == 2){
            mAdxConfigTitle.html("MEIZU-API设置");
        }else if(choosed_adx_id == 3){
            mAdxConfigTitle.html("DEMO-API设置");
        }else if(choosed_adx_id == 4){
            mAdxConfigTitle.html("CLOUD_ADX-API设置");
        }else if(choosed_adx_id == 5){
            mAdxConfigTitle.html("ADX_A5-API设置");
        }else if(choosed_adx_id == 6){
            mAdxConfigTitle.html("ADX_ADROI-API设置");
        }else if(choosed_adx_id == 7){
            mAdxConfigTitle.html("ADX_MGTV-API设置");
            var mgtv_config = [
                {"name": "*dsp id", "id": "dsp-id", "info": "请输入符合要求的dsp id"},
                {"name": "*token", "id": "token", "info": "请输入符合要求的token"},
            ];
            initConfigDiv(mgtv_config);
            mTabs.eq(1).addClass("hidden");
        }else if(choosed_adx_id == 8){
            mAdxConfigTitle.html("AD_SWITCH设置");
            var adswitch_config = [
                {"name": "*dsp id", "id": "dsp-id", "info": "请输入符合要求的dsp id"},
                {"name": "*token", "id": "token", "info": "请输入符合要求的token"},
            ];
            initConfigDiv(adswitch_config);
        }else{
            
        }
    }
    
    //change input due to diff adx
    function initConfigDiv(config){
        var inputConfig = "";
        for(var i = 0; i < config.length; i++){
            var item = config[i];
            inputConfig += "<div class='form-group'>" + 
                             "<label class='control-label col-sm-1'>" + item.name + "</label>" +
                             "<div class='col-sm-3'>" +
                               "<input type='text' id='" + item.id + "' class='form-control' placeholder='" + item.info + "'>" +
                             "</div>" +          
                           "</div>";
        }
        mAdxConfigDiv.html(inputConfig);
    }

    function initAdxUserInfo(index, count){
        var tid = "";
        if(choosed_adx_id == 0){
            tid = "#user-list-bes";
            mUserTableBes.removeClass("hidden").siblings().addClass("hidden");
        }else if(choosed_adx_id == 8){
            tid = "#user-list-adswitch";
            mUserTableAdSwitch.removeClass("hidden").siblings().addClass("hidden");
        }else if(choosed_adx_id == 100){
            tid = "#user-list-adswitch";
            mUserTableAdSwitch.removeClass("hidden").siblings().addClass("hidden"); 
        }else if(choosed_adx_id == 101){
            tid = "#user-list-adswitch";
            mUserTableAdSwitch.removeClass("hidden").siblings().addClass("hidden");
        }else{
            mUserTableOther.removeClass("hidden").siblings().addClass("hidden");
            return;
        }
        
        emptyTbody(tid);
        setTfoot(tid, spinLoader("数据加载中，请稍候..."));
        var index = parseInt(index) || 0;
        var count = parseInt(count) || 10;
        function scb(data){
            if(data.size == 0){
                setTfoot(tid, stringLoadFail("没有数据"));
            }else{
                try{
                    var total = data.total;
                    var list = data.list;
                    var pagenumber = Math.ceil(total / count);
                    var rows = [];
                    for(var i = 0; i < list.length; i++){
                        var item = list[i];
                        var row = $("<tr></tr>");
                        row.attr("data-id", item.id);
                        row.append($("<td>" + item.user_id + "</td>"));
                        row.append($("<td>" + item.user_name + "</td>"));
                        if(item.audit_status == ADCONSTANT.AUDIT.FAILED){
                            row.append($("<td><a data-toggle='tooltip' data-placement='right' title='" + item.failure_message + "' style='cursor:pointer;text-decoration:none;'>审核失败</a></td>"))
                        }else{
                            row.append($("<td>" + item.audit_status + "</td>"));
                        }
                        if(choosed_adx_id == 0 || choosed_adx_id == 8 || choosed_adx_id == 100 || choosed_adx_id == 101){
                            row.append($("<td>" + item.qualification_name + "</td>"));
                            row.append($("<td>" + item.site_name + "</td>"));
                            row.append($("<td>" + item.site_url + "</td>"));
                        }
                        
                        var action = $("<td></td>");
                        row.append(action);
                        var audit = $("<button class='btn btn-primary btn-xs'>提交审核</button>");
                        if(item.audit_status == ADCONSTANT.AUDIT.PASS){
                            audit.attr("disabled", true);
                            audit.addClass("btn-danger");
                        }else{
                            audit.click(function(e){
                                var id = parseInt($(this).parents("tr").attr("data-id"));
                                confirm("确认提交审核？", function(){
                                    var page_number = $(".pagination>li[class=active]").children().html();
                                    var param = {
                                        sinterface : SERVERCONF.ADX.USERSUBMIT,
                                        data : {
                                            id: id
                                        }
                                    };
                                    ajaxCall(param, function(err, data){
                                        if(err){
                                            alert("提交失败");
                                        }else{
                                            initAdxUserInfo(page_number - 1);
                                        }
                                    });
                                });
                            });
                        }
                        action.append(audit);
                        var query = $("<button class='btn btn-primary btn-xs' style='margin-left:10px;'>查询</button>");
                        query.click(function(e){
                            var page_number = $(".pagination>li[class=active]").children().html();
                            var param = {
                                sinterface : SERVERCONF.ADX.USERQUERY,
                                data : {
                                    id: parseInt($(this).parents("tr").attr("data-id"))
                                }
                            }
                            ajaxCall(param, function(err, data){
                                if(err){
                                    alert("未查询到结果！");
                                }else{
                                    initAdxUserInfo(page_number - 1);
                                }
                            })
                        });
                        action.append(query);
                        if(choosed_adx_id == 0){
                            var upload = $("<button class='btn btn-primary btn-xs' style='margin-left:10px;'>上传资质</button>");
                            upload.click(function(){
                                var page_number = $(".pagination>li[class=active]").children().html();
                                var param = {
                                    sinterface : SERVERCONF.ADX.LICENSESUBMIT,
                                    data : {
                                        id: parseInt($(this).parents("tr").attr("data-id"))
                                    }
                                }
                                ajaxCall(param, function(err, data){
                                    if(err){
                                        alert("上传失败");
                                    }else{
                                        initAdxUserInfo(page_number - 1);
                                    }
                                })
                            });
                            action.append(upload);
                        }
                        rows.push(row);
                    }
                    setTbody(tid, rows);
                    setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                        initAdxUserInfo(parseInt(t.hash.replace("#", "")));
                    }));
                }catch(e){
                    ecb();
                }
            }
        }

        function ecb(){
            emptyTbody(tid);
            setTfoot(tid, stringLoadFail());
        }
        var param = {
            sinterface : SERVERCONF.ADX.USERLIST,
            data : {
                adx_id : choosed_adx_id,
                index : index,
                count: count,
                sort: mUserSort.val(),
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

    function initAdxIdeaInfo(index, count){
        var tid = "";
        if(choosed_adx_id == 0){
            tid = "#idea-list-bes";
            mIdeaTableBes.removeClass("hidden").siblings().addClass("hidden");
        }else if(choosed_adx_id == 7){
            tid = "#idea-list-mgtv";
            mIdeaTableMgtv.removeClass("hidden").siblings().addClass("hidden");
        }else if(choosed_adx_id == 8){
            tid = "#idea-list-adswitch";
            mIdeaTableAdSwitch.removeClass("hidden").siblings().addClass("hidden");
        }else if(choosed_adx_id == 100){
            tid = "#idea-list-adswitch";
            mIdeaTableAdSwitch.removeClass("hidden").siblings().addClass("hidden");
        }else if(choosed_adx_id == 101){
            tid = "#idea-list-adswitch";
            mIdeaTableAdSwitch.removeClass("hidden").siblings().addClass("hidden");
        }else{
            mIdeaTableOther.removeClass("hidden").siblings().addClass("hidden");
            return;
        }
        emptyTbody(tid);
        setTfoot(tid, spinLoader("数据加载中，请稍候..."));
        var index = parseInt(index) || 0;
        var count = parseInt(count) || 10;
        function scb(data){
            if(data.size == 0){
                setTfoot(tid, stringLoadFail("没有数据"));
            }else{
                try{
                    var total = data.total;
                    idea_list = data.list;
                    var pagenumber = Math.ceil(total / count);
                    var rows = [];
                    for(var i = 0; i < idea_list.length; i++){
                        var item = idea_list[i];
                        var row = $("<tr></tr>");
                        row.attr("data-idea-id", item.id);
                        row.attr("data-id", i);
                        row.append($("<td>" + item.id + "</td>"));
                        row.append($("<td>" + item.idea_name + "</td>"));
                        row.append($("<td>" + item.idea_type + "</td>"));
                        // row.append($("<td>" + item.unit_name + "</td>"));
                        // row.append($("<td>" + item.plan_name + "</td>"));
                        row.append($("<td>" + item.user_name + "</td>"));
                        row.append($("<td>" + item.adview_type + "</td>"));
                        row.append($("<td><a href='" + item.idea_url + "' target='_blank'>查看</a></td>"));
                        row.append($("<td title='" + item.landing_page + "'style='white-space:nowrap;max-width:200px;overflow:hidden;text-overflow:ellipsis;cursor:pointer;'>" + item.landing_page + "</td>"));
                        if(choosed_adx_id == 7 || choosed_adx_id == 8 || choosed_adx_id == 100 || choosed_adx_id == 101){
                            row.append($("<td>" + item.adx_idea_id + "</td>"));
                        }
                        if(item.audit_status == ADCONSTANT.AUDIT.FAILED){
                            row.append($("<td><a data-toggle='tooltip' data-placement='right' title='" + item.failure_message + "' style='cursor:pointer;text-decoration:none;'>审核失败</a></td>"))
                        }else{
                            row.append($("<td>" + item.audit_status + "</td>"));
                        }
                        var action = $("<td></td>");
                        row.append(action);
                        var audit = $("<button class='btn btn-primary btn-xs'>提交审核</button>");
                        if(item.audit_status == ADCONSTANT.AUDIT.PASS){
                            audit.attr("disabled", true);
                            audit.addClass("btn-danger");
                        }else{
                            audit.click(function(e){
                                var id = parseInt($(this).parents("tr").attr("data-idea-id"));
                                confirm("确认提交审核？", function(){
                                    var page_number = $(".pagination>li[class=active]").children().html();
                                    var param = {
                                        sinterface : SERVERCONF.ADX.IDEASUBMIT,
                                        data : {
                                            id: id
                                        }
                                    };
                                    ajaxCall(param, function(err, data){
                                        if(err){
                                            alert("提交失败");
                                        }else{
                                            initAdxIdeaInfo(page_number - 1);
                                        }
                                    });
                                });
                            });
                        }
                        action.append(audit);
                        if(choosed_adx_id == 7){
                            var edit = $("<button class='btn btn-primary btn-xs' style='margin-left:10px;'>编辑</button>");
                            edit.attr("eidt-btn-id", i);
                            edit.click(function(){
                                $("#modal-idea-form").modal("show");
                                var data_id = $(this).parents("tr").attr("data-id");
                                mId.val(idea_list[data_id].id);
                                mAdxId.val(idea_list[data_id].adx_idea_id);
                                mAdxStatus.find("input[value='"+ idea_list[data_id].audit_status +"']").click();
                                mAdxIdeaEdit.unbind("click");
                                mAdxIdeaEdit.click(submitAdxIdea);
                            })
                            action.append(edit);
                        }
                        var query = $("<button class='btn btn-primary btn-xs' style='margin-left:10px;'>查询</button>");
                        query.click(function(e){
                            var page_number = $(".pagination>li[class=active]").children().html();
                            var param = {
                                sinterface : SERVERCONF.ADX.IDEAQUERY,
                                data : {
                                    id: parseInt($(this).parents("tr").attr("data-idea-id"))
                                }
                            }
                            ajaxCall(param, function(err, data){
                                if(err){
                                    alert("未查询到结果！");
                                }else{
                                    initAdxIdeaInfo(page_number - 1);
                                }
                            })
                        })
                        action.append(query);
                        rows.push(row);
                    }
                    setTbody(tid, rows);
                    setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                        initAdxIdeaInfo(parseInt(t.hash.replace("#", "")));
                    }));
                }catch(e){
                    ecb();
                }
            }
        }

        function ecb(){
            emptyTbody(tid);
            setTfoot(tid, stringLoadFail());
        }
        var param = {
            sinterface : SERVERCONF.ADX.IDEALIST,
            data : {
                adx_id : choosed_adx_id,
                index : index,
                count: count,
                sort: mIdeaSort.val()
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

    function adxConfig(){
        if(choosed_adx_id == 0){
            var dsp_id = $('#dsp-id').val();
            var token = $('#token').val();
            if(dsp_id == "" || token == ""){
                resultInfo("input-error");
                return;
            }
            var param = {
                sinterface : SERVERCONF.ADX.CONFIG,
                data : {
                    adx_id : choosed_adx_id,
                    dsp_id : dsp_id,
                    token : token
                }
            }
        }else if(choosed_adx_id == 1){    
        }else if(choosed_adx_id == 2){    
        }else if(choosed_adx_id == 3){
        }else if(choosed_adx_id == 4){
        }else if(choosed_adx_id == 5){   
        }else if(choosed_adx_id == 6){
        }else if(choosed_adx_id == 7){
            var dsp_id = $('#dsp-id').val();
            var token = $('#token').val();
            if(dsp_id == "" || token == ""){
                resultInfo("input-error");
                return;
            }
            var param = {
                sinterface : SERVERCONF.ADX.CONFIG,
                data : {
                    adx_id : choosed_adx_id,
                    dsp_id : dsp_id,
                    token : token
                }
            }
        }else if(choosed_adx_id == 8){
            var dsp_id = $('#dsp-id').val();
            var token = $('#token').val();
            if(dsp_id == "" || token == ""){
                resultInfo("input-error");
                return;
            }
            var param = {
                sinterface : SERVERCONF.ADX.CONFIG,
                data : {
                    adx_id : choosed_adx_id,
                    dsp_id : dsp_id,
                    token : token
                }
            }
        }else if(choosed_adx_id == 10){
            var dsp_id = $('#dsp-id').val();
            var token = $('#token').val();
            if(dsp_id == "" || token == ""){
                resultInfo("input-error");
                return;
            }
            var param = {
                sinterface : SERVERCONF.ADX.CONFIG,
                data : {
                    adx_id : choosed_adx_id,
                    dsp_id : dsp_id,
                    token : token
                }
            }
        }else{
        }
        ajaxCall(param, function(err, data){
            if(err){
                resultInfo("fail");
            }else{
                $("input").val();
                resultInfo("success");
            }
        })
        
    }
    
    function resultInfo(msg){
        if(msg =="success"){
            mConfigResultInfo.html("<div class='alert alert-success alert-dismissible' role='alert'>" +
                                     "<button type='button' class='close' data-dismiss='alert'>" +
                                       "<span aria-hidden='true'>×</span><span class='sr-only'>Close</span>" +
                                     "</button>" +
                                     "<strong>Success!</strong><span>ADX配置成功</span>" +
                                   "</div>");
        }else if(msg == "fail"){
            mConfigResultInfo.html("<div class='alert alert-danger alert-dismissible' role='alert'>" +
                                     "<button type='button' class='close' data-dismiss='alert'>" +
                                       "<span aria-hidden='true'>×</span><span class='sr-only'>Close</span>" +
                                     "</button>" +
                                     "<strong>Error!</strong><span>ADX配置失败</span>" +
                                   "</div>");
        }else if(msg == "input-error"){
            mConfigResultInfo.html("<div class='alert alert-danger alert-dismissible' role='alert'>" +
                                     "<button type='button' class='close' data-dismiss='alert'>" +
                                       "<span aria-hidden='true'>×</span><span class='sr-only'>Close</span>" +
                                     "</button>" +
                                     "<strong>Error!</strong><span>请补全ADX配置信息</span>" +
                                   "</div>");
        }else{
            
        }
    }

    function submitAdxIdea(){
        var page_number = $(".pagination>li[class=active]").children().html();
        var id = mId.val();
        var adx_idea_id = mAdxId.val();
        var audit_status = mAdxStatus.find("input[class*=btn-primary]").val();
        var param = {
            sinterface : SERVERCONF.ADX.IDEAAUDITEDIT,
            data : {
                id : id,
                adx_idea_id : adx_idea_id,
                audit_status: audit_status
            }
        };
        
        ajaxCall(param, function(err, data){
            if(err){
                setInfoDiv(mErrMsg, "info", "编辑失败");
            }else{
                $("#modal-idea-form").modal("hide");
                initAdxIdeaInfo(page_number - 1);
            }
        })
    }
}();
