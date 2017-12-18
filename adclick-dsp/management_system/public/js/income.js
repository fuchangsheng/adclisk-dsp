/*
 * @file  income.js
 * @description adx management_system income logic part
 * @copyright dmtec.cn reserved, 2016
 * @author Jiangtu
 * @date 2016.12.22
 * @version 0.0.1 
 */

'use strict';
!function(){
    var mAdxType = null;
    var mStartTime = null;
    var mEndTime = null;
    var mSearchAll = null;
    var mCost = null;
    var mDspCost = null;
    var mIncome = null;
    var mProfitRatio = null;
    var mCostDetail = null;
    var mOrder = null;
    
    
    function initPageStaticElements() {
        mAdxType = $('#adx-type');
        mStartTime = $('#input-starttime');
        mEndTime = $('#input-endtime');
        mSearchAll = $('#search-all');
        mCost = $('#cost');
        mDspCost = $('#dsp-cost');
        mIncome = $('#income');
        mProfitRatio = $('#profit-radio');
        mCostDetail = $('#cost-detail');
        mOrder = $('#order');
    }

    $(function() {
        initPageStaticElements();
        initAdxList(adxChoosedInit);
        initPlanFormDatetimePicker();
        var now = new Date();
        mEndTime.val(dataAdd("h", 1, now).format("yyyy-MM-dd hh:00:00"));
        mStartTime.val(dataAdd("d", -1, now).format("yyyy-MM-dd hh:00:00"));
    });

    function initOverallIncome(){
        var start_time = mStartTime.val();
        var end_time_true = new Date(mEndTime.val());
        var end_time = dataAdd("s", -1, end_time_true).format("yyyy-MM-dd hh:mm:ss");
        var param = {
            sinterface : SERVERCONF.COST.OVERVIEW,
            data : {
                adx_id: choosed_adx_id,
                start_time: start_time,
                end_time: end_time
            }
        };
        if(start_time >= end_time){
            alert("开始时间不能晚于结束时间");
            return;
        }
        ajaxCall(param, function(err, data){
            if(err){
                //console.log(err);
            }else{
                mCost.html(data.revenue);
                mDspCost.html(data.cost);
                mIncome.html((data.revenue - data.cost).toFixed(2));
                mProfitRatio.html((((data.revenue - data.cost)/data.cost)*100).toFixed(2) + "%");
            }
        })
    }
    
    function initDetailIncome(index, count, tid){
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
                            if(item.user_name == undefined){
                                row.append($("<td>" + "-" + "</td>"));
                            }else{
                                row.append($("<td>" + item.user_name + "</td>"));
                            }
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
                        row.append($("<td>" + item.revenue + "</td>"));
                        row.append($("<td>" + item.cost + "</td>"));
                        row.append($("<td>" + (item.revenue - item.cost).toFixed(2) + "</td>"));
                        row.append($("<td>" + (((item.revenue - item.cost)/item.cost)*100).toFixed(2) + "%</td>"));
                        
                        rows.push(row);
                    }
                    setTbody(tid, rows);
                    setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                        initDetailIncome(parseInt(t.hash.replace("#", "")), count, tid);
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
            sinterface : SERVERCONF.COST.DETAIL,
            data : {
                index: index,
                count: count,
                adx_id: choosed_adx_id,
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
    
    function adxChoosedInit(){
        if(choosed_adx_id == 0){
            mAdxType.html("BES 营收总览");
        }else if(choosed_adx_id == 1){
            mAdxType.html("BCH 营收总览");
        }else if(choosed_adx_id == 2){
            mAdxType.html("MEIZU 营收总览");
        }else if(choosed_adx_id == 3){
            mAdxType.html("DEMO 营收总览");
        }else if(choosed_adx_id == 4){
            mAdxType.html("CLOUD_ADX 营收总览");
        }else if(choosed_adx_id == 5){
            mAdxType.html("ADX_A5 营收总览");
        }else if(choosed_adx_id == 6){
            mAdxType.html("ADX_ADROI 营收总览");
        }else if(choosed_adx_id == 7){
            mAdxType.html("ADX_MGTV 营收总览");
        }else{}
        // var now = new Date();
        // mEndTime.val(now.format("yyyy-MM-dd hh:00:00"));
        // mStartTime.val(dataAdd("d", -1, now).format("yyyy-MM-dd hh:00:00"));
        
        mCostDetail.unbind("change");
        mCostDetail.change(function(){
            if(mCostDetail.val() == "day"){
                $("#cost-list").addClass("hidden");
                $("#cost-list-day").removeClass("hidden");
                initDetailIncome(0, 10, "#cost-list-day");
            }else{
                $("#cost-list-day").addClass("hidden");
                $("#cost-list").removeClass("hidden");
                initDetailIncome(0, 10, "#cost-list");
            }
            
        });
        
        mOrder.change(function(){
            if(mCostDetail.val() == "day"){
                initDetailIncome(0, 10, "#cost-list-day");
            }else{
                initDetailIncome(0, 10, "#cost-list");
            }
        });

        mSearchAll.unbind("click");
        mSearchAll.click(function(){
            initOverallIncome();
            mCostDetail.change();
        });
        mSearchAll.click();
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
    }
}();
