/*
 * @file  adx.js
 * @description adx data interface process
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.12.12
 * @version 0.0.1 
 */

'use strict';
var adxDataList = null;
!function(){   
    var mIdeaTable = null;
    var mUserTable = null;
    var mTab = null;
    var mIdeaAuditModal = null;
    var mUserAuditModal = null;
    var madxuser = null;
    var madxusertable = null;
    var madxindustry = null;
    var madxindustrytable=null;
    var madxidea = null;
    var madxideatable = null;
    var currenttab='adx_user';

    $(function() {
        var tabs_config = [
            {"name": "adx_user", "text": "用户信息"},
            {"name": "adx_idea", "text": "广告创意"}
        ];
        var current_tab = window.current_tab || "";
        initTabs(tabs_config, current_tab);
        initPageStaticElements()
        initAdxList(adxChoosedInit);
        mTab.click(function(){
            $(this).parent().addClass("active");
            $(this).parent().siblings().removeClass("active");
            mainDivInit($(this).attr("id"));
        });
        mTab[0].click();
        changeButtonStyle();
    });

    function initPageStaticElements() {
        mIdeaTable = $('#adx-idea-audit-list');
        mUserTable = $('#adx-user-audit-list');
        mIdeaAuditModal = $('#adx-idea-audit');
        mUserAuditModal = $('#adx-user-audit');
        
        mTab = $('#tabs a');
        madxuser = $('#adx-user');
        madxusertable = $('#adx-user-table');
        madxindustry = $('#adx-industry');
        madxindustrytable = $('#adx-industry-table');
        madxidea = $('#adx-idea');
        madxideatable = $('#adx-idea-table');
    }
    
    function mainDivInit(tab_id){
        if(tab_id == "adx_user"){
            madxuser.removeClass("hidden");
            madxuser.siblings().addClass("hidden");
            currenttab="adx_user";
            
        }else if(tab_id == "adx_industry"){
            madxindustry.removeClass("hidden");
            madxindustry.siblings().addClass("hidden");
            currenttab="adx_industry";
        }else if(tab_id == "adx_idea"){
            madxidea.removeClass("hidden");
            madxidea.siblings().addClass("hidden");
            currenttab="adx_idea";
            initIdeaTable();
        }
    }

    function changeButtonStyle(){
        $('.select-btn').click(function(){
            $(this).addClass("btn-primary");
            $(this).siblings().removeClass("btn-primary")
        });
    }

    function adxChoosedInit(){
        for(var i=0;i<mTab.length;i++){
            var item=mTab[i];
            if(item.id==currenttab){
                //mTab[i].click();
                if(item.id=="adx_idea"){
                    initIdeaTable();
                }
            }
        }
        //mTab[0].click();
    }
    
    function initIdeaTable(index,count){
        var tid = "#idea-list";
        emptyTbody(tid);
        setTfoot(tid, spinLoader("数据加载中，请稍候..."));
        var index = parseInt(index) || 0;
        var count = parseInt(count) || 10;
        var param = {
                sinterface : SERVERCONF.ADX.IDEALIST,
                data : {
                    adx_id : choosed_adx_id,
                    index : index,
                    count : count
                }
            }
                
        ajaxCall(param, function(err, data){
            if(err){
                ecb;
            }else{
                scb(data);
            }
        });
        
        function ecb(){
            console.log('adxidealist失败');
        }
        
        function scb(data){
            if (data.size == 0) {
                emptyTbody(madxideatable);
                setTfoot(madxideatable, stringLoadFail("没有数据"));
            } else {
                try {
                    emptyTfoot(madxideatable);
                    var total = data.total;
                    var list = data.list;
                    var pagenumber = Math.ceil(total / count);
                    var rows = [];
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        var row = $("<tr></tr>");
                        row.append($("<td>" + item.user_name + "</td>"));
                        row.append($("<td>" + item.idea_name+"</td>"));
                        row.append($("<td>" + item.unit_name + "</td>"));
                        row.append($("<td>" + item.plan_name + "</td>"));
                        row.append($("<td>" + item.audit_status + "</td>"));
                        row.append($("<td>" + item.failure_message + "</td>"));
                        var actions = $("<td></td>");
                        row.append(actions);
                        var edit = $("<button type='button' class='btn btn-xs btn-link'>提交创意</button>");
                        edit.attr("submit-id", item.id);
                        edit.click(function() {
                            var mgtv_id = $(this).attr("submit-id");
                            ideasubmit(mgtv_id);
                            }
                        );
                        actions.append(edit);
                        var search = $("<button type='button' class='btn btn-xs btn-link'>创意查询</button>");
                        search.attr("search-id",item.id);
                        search.click(function(){
                            var search_id=$(this).attr("search-id");
                            ideaquery(search_id);
                        });
                        //actions.append(search);
                        var update = $("<button type='button' class='btn btn-xs btn-link'>更新审核</button>");
                        update.attr("update-id",item.id);
                        update.click(function(){
                            var update_id=$(this).attr("update-id");
                            ideaupdate(update_id);
                        });
                        //actions.append(update);
                        rows.push(row);
                    }
                    setTbody(madxideatable, rows);
                    setTfoot(madxideatable, pagination(index, 5, pagenumber, function(t, e) {
                        initIdeaTable(parseInt(t.hash.replace("#", "")));
                    }));
                }catch(e){
                    ecb();
                }
            }
        }
    }
    
    function ideaupdate(id){
        //alert(id);
        function ecb() {
            
        }
        function scb(resData){
            
        }
        var param = {
                sinterface : SERVERCONF.ADX.IDEAQUERY,
                data : {
                    id:id
                }
            }
        
        ajaxCall(param, function(err, data){
            if(err){
                ecb;
            }else{
                scb(data);
            }
        });
    }
    
    function ideaquery(id){
        //alert(id);
        function ecb() {
            
        }
        function scb(resData){
            
        }
        var param = {
                sinterface : SERVERCONF.ADX.IDEAQUERY,
                data : {
                    id:id
                }
            }
        
        ajaxCall(param, function(err, data){
            if(err){
                ecb;
            }else{
                scb(data);
            }
        });
    }
    
    function ideasubmit(id){
        //alert(id);
        function ecb() {
            
        }
        function scb(resData){
            
        }
        var param = {
                sinterface : SERVERCONF.ADX.IDEASUBMIT,
                data : {
                    id:id
                }
            }
        
        ajaxCall(param, function(err, data){
            if(err){
                ecb;
            }else{
                scb(data);
            }
        });
    }
    
    function configTabs(node) {
        var adxId = node.tags[0];
        var flag = node.tags[1];
        var userTabsConfig = [
            {"name": "idea", "text": "ADX创意审核"},
            {"name": "user", "text": "ADX用户审核"}
        ];
        var noUserTabsConfig = [
            {"name": "idea", "text": "ADX创意审核"}
        ];
        var current_tab = window.current_tab || "";
        if (flag) {
            initTabs(userTabsConfig, current_tab);
            loadIdeaRecordList(adxId, 0, 10);
        } else {
            initTabs(noUserTabsConfig, current_tab);
            loadIdeaRecordList(adxId, 0, 10);
        }

        mTab.click(function() {
            $(this).parent().addClass("active");
            $(this).parent().siblings().removeClass("active");
            var tabName = $(this).attr("id");
            if(tabName === "idea") {
                emptyTbody(mIdeaTable);
                loadIdeaRecordList(adxId, index, count);
            } else {
                emptyTbody(mIdeaTable);
                loadUserRecordList(adxId, index, count);
            }
        });
    }
    
    function loadUserRecordList(adxId, index, count) {
        mIdeaAuditModal.modal('hide');
        mUserAuditModal.modal('show');
        console.log('To request the adx user audit record');
        setTfoot(mUserTable, spinLoader("数据加载中，请稍候..."));
        var index = index || 0;
        var count = count || 10;
        var adxId = id;
        if (true) {}
        function scb(data) {
            if (data.size == 0) {
                setTfoot(mUserTable, stringLoadFail("没有数据"));
            } else {
                try {
                    var total = data.total;
                    var list = data.list;
                    var pagenumber = Math.ceil(total / count);
                    var rows = [];
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        var row = $("#adx-user-audit-list <tr></tr>");
                        row.append($("<td>" + item.date + "</td>"));
                        row.append($("<td>" + item.title+"</td>"));
                        row.append($("<td>" + item.item + "</td>"));
                        row.append($("<td>" + item.amount + "</td>"));
                        row.append($("<td>" + item.status + "</td>"));
                        row.append($("<td>" + item.operator + "</td>"));
                        row.append($("<td>" + item.note + "</td>"));
                        var actions = $("<td></td>");
                        row.append(actions);
                        var edit = $("<button type=\"button\" class=\"btn btn-xs btn-link\">操作</button>");
                        edit.attr("edit-btn-id", i);
                        edit.click(function() {
                            var btn_id = $(this).attr("edit-btn-id");
                            }
                        );
                        actions.append(edit);
                        rows.push(row);
                    }
                    setTbody(mUserTable, rows);
                    setTfoot(mUserTable, pagination(index, 5, pagenumber, function(t, e) {
                        loadRecordList(adxId, parseInt(t.hash.replace("#", "")));
                    }));
                } catch(e) {
                    ecb();
                }
            }
        }
        function ecb() {
            emptyTbody(mUserTable);
            setTfoot(mUserTable, stringLoadFail());
        }
        var param = {
            adx_id: adxId,
            index: index,
            count: count
        };
        $.ajax({
            url: '',
            type: 'GET',
            data: param,
            success: function(resData) {
                if (resData.code === 0) {
                    scb(resData.data);
                } else {
                    ecb();
                }
            },
            error: function(resData) {
                ecb();
            }
        });
    }

    function loadIdeaRecordList(adxId, index, count) {
        mIdeaAuditModal.modal('show');
        mUserAuditModal.modal('hide');
        console.log('To request the adx idea audit record');
        setTfoot(mUserTable, spinLoader("数据加载中，请稍候..."));
        var index = index || 0;
        var count = count || 10;
        var adxId = id;
        if (true) {}
        function scb(data) {
            if (data.size == 0) {
                setTfoot(mUserTable, stringLoadFail("没有数据"));
            } else {
                try {
                    var total = data.total;
                    var list = data.list;
                    var pagenumber = Math.ceil(total / count);
                    var rows = [];
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        var row = $("#adx-idea-audit-list <tr></tr>");
                        row.append($("<td>" + item.date + "</td>"));
                        row.append($("<td>" + item.title+"</td>"));
                        row.append($("<td>" + item.item + "</td>"));
                        row.append($("<td>" + item.amount + "</td>"));
                        row.append($("<td>" + item.status + "</td>"));
                        row.append($("<td>" + item.operator + "</td>"));
                        row.append($("<td>" + item.note + "</td>"));
                        var actions = $("<td></td>");
                        row.append(actions);
                        var edit = $("<button type=\"button\" class=\"btn btn-xs btn-link\">操作</button>");
                        edit.attr("edit-btn-id", i);
                        edit.click(function() {
                            var btn_id = $(this).attr("edit-btn-id");
                            var record = list[btn_id];
                            
                        });
                        actions.append(edit);
                        rows.push(row);
                    }
                    setTbody(mUserTable, rows);
                    setTfoot(mUserTable, pagination(index, 5, pagenumber, function(t, e) {
                        loadRecordList(adxId, parseInt(t.hash.replace("#", "")));
                    }));
                } catch(e) {
                    ecb();
                }
            }
        }
        function ecb() {
            emptyTbody(mUserTable);
            setTfoot(mUserTable, stringLoadFail());
        }
        var param = {
            adx_id: adxId,
            index: index,
            count: count
        };
        $.ajax({
            url: '',
            type: 'GET',
            data: param,
            success: function(resData) {
                if (resData.code === 0) {
                    scb(resData.data);
                } else {
                    ecb();
                }
            },
            error: function(resData) {
                ecb();
            }
        });
    }
}();
