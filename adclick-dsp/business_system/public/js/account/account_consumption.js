/*
 * @file  account_consumption.js
 * @description user account consumption logic part
 * @copyright dmtec.cn reserved, 2016
 * @author Jiangtu
 * @date 2016.12.28
 * @version 0.0.1 
 */
 
'use strict';
!function(){
    var mCost = null;
    var mImp = null;
    var mClick = null;
    var mStartTime = null;
    var mEndTime = null;
    var mSearchBtn = null;
    var mCostDetail = null;
    var mOrder = null;
    
    function initPageStaticElements(){
        mImp = $('#imp');
        mClick = $('#click');
        mCost = $('#cost');
        mStartTime = $('#input-starttime');
        mEndTime = $('#input-endtime');
        mSearchBtn = $('#search-all');
        mCostDetail = $('#cost-detail');
        mOrder = $("#order");
    }
    
    $(function(){
        initPageStaticElements();
        initPlanFormDatetimePicker();
        
        mCostDetail.change(function(){
            if(mCostDetail.val() == "day"){
                $("#cost-list").addClass("hidden");
                $("#cost-list-day").removeClass("hidden");
                initDetailCost(0, 10, "#cost-list-day");
            }else{
                $("#cost-list-day").addClass("hidden");
                $("#cost-list").removeClass("hidden");
                initDetailCost(0, 10, "#cost-list");
            }
        });
        
        mOrder.change(function(){
            if(mCostDetail.val() == "day"){
                initDetailCost(0, 10, "#cost-list-day");
            }else{
                initDetailCost(0, 10, "#cost-list");
            }
        })
        
        mSearchBtn.click(function(){
            initOverAllCost();
            mCostDetail.change();
        });
        mSearchBtn.click();
    })
     
    function initDetailCost(index, count, tid){
        //var tid = "#cost-list";
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
                        if(tid == "#cost-list"){
                            if(item.plan_name == undefined){
                                row.append($("<td>" + "-" + "</td>"));
                            }else{
                                row.append($("<td>" + item.plan_name + "</td>"));
                            }
                            if(item.unit_name == undefined){
                                row.append($("<td>" + "-" + "</td>"));
                            }else{
                                row.append($("<td>" + item.unit_name + "</td>"));
                            }
                            if(item.idea_name == undefined){
                                row.append($("<td>" + "-" + "</td>"));
                            }else{
                                row.append($("<td>" + item.idea_name + "</td>"));
                            }
                        }else{
                            row.append($("<td>" + item.date_time + "</td>"));
                        }
                        row.append($("<td>" + item.imp + "</td>"));
                        row.append($("<td>" + item.click + "</td>"));
                        row.append($("<td>" + item.cost + "</td>"));
                        
                        rows.push(row);
                    }
                    setTbody(tid, rows);
                    setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                        initDetailCost(parseInt(t.hash.replace("#", "")), count , tid);
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
        
        var start_time = mStartTime.val();
        var end_time_true = new Date(mEndTime.val());
        var end_time = dataAdd("s", -1, end_time_true).format("yyyy-MM-dd hh:mm:ss");
        var dimension = mCostDetail.val();
        
        if(start_time >= end_time){
            return;
        }
        
        var param = {
            sinterface : SERVERCONF.ACCOUNT.COSTDETAIL,
            data : {
                index: index,
                count: count,
                start_time: start_time,
                end_time: end_time,
                dimension: dimension,
                order: mOrder.val()
            }
        }
        
        ajaxCall(param, function(err, data){
            if(err){
                ecb();
            }else{
                scb(data);
            }
        })
    }
    
    function initOverAllCost(){
        var start_time = mStartTime.val();
        var end_time_true = new Date(mEndTime.val());
        var end_time = dataAdd("s", -1, end_time_true).format("yyyy-MM-dd hh:mm:ss");
        if(start_time >= end_time){
            alert("结束时间必须晚于开始时间");
            return;
        }
        var param = {
            sinterface : SERVERCONF.ACCOUNT.COSTALL,
            data : {
                start_time: start_time,
                end_time: end_time
            }
        }
        
        ajaxCall(param, function(err, data){
            if(err){
                alert("获取数据失败");
            }else{
                mCost.html(data.cost);
                mImp.html(data.imp);
                mClick.html(data.click);
            }
        })
    }
    
    function initPlanFormDatetimePicker() {
        var now = new Date();
        $(".form_datetime").datetimepicker({
            format:         "yyyy-mm-dd hh:00:00",
            weekStart:      1,
            endDate:        dataAdd("h", 1, now).format("yyyy-MM-dd hh:00:00"),
            autoclose:      1,
            startView:      2,
            minView:        1,
            maxView:        3,
            todayBtn:       1,
            todayHighlight: 1,
            language:       "zh-CN",
            forceParse:     0,
        });
        mEndTime.val(now.format("yyyy-MM-dd hh:00:00"));
        mStartTime.val(dataAdd("d", -7, now).format("yyyy-MM-dd hh:00:00"));
    }
}();