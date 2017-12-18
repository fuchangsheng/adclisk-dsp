/*
 * @file  task.js
 * @description dsp management task page js logic
 * @copyright dmtec.cn reserved, 2016
 * @author Jiangtu
 * @date 2017.02.23
 * @version 0.0.1 
 */
'use strict';
!function(){
    var mTaskType = null;
    var mTaskStatus = null;
    var mSort = null;
    var mOrder = null;
    var mStartTime = null;
    var mEndTime = null;
    var mTaskListBtn = null;
    
    function initPageStaticElements(){
        mTaskType = $('#task-type');
        mTaskStatus = $('#task-status');
        mSort = $('#sort');
        mOrder = $('#order');
        mStartTime = $('#input-starttime');
        mEndTime = $('#input-endtime');
        mTaskListBtn = $('#task-list-btn');
    }
    
    $(function(){
        initPageStaticElements();
        initPlanFormDatetimePicker();
        mTaskListBtn.click(function(){
            loadTaskList();
        })
        pageInit();
        
    })
        
    function loadTaskList(index, count){
        var tid = "#task-list";
        emptyTbody(tid);
        setTfoot(tid, spinLoader("数据加载中，请稍候..."));
        var index = parseInt(index) || 0;
        var count = parseInt(count) || 20;
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
                        row.attr("data-id", item.id);
                        row.append($("<td>" + item.id + "</td>"));
                        row.append($("<td>" + item.task_type + "</td>"));
                        row.append($("<td>" + item.process_time + "</td>"));
                        row.append($("<td>" + item.status + "</td>"));
                        row.append($("<td>" + item.job_id + "</td>"));
                        row.append($("<td>" + item.retry_times + "</td>"));
                        row.append($("<td>" + item.create_time + "</td>"));
                        row.append($("<td>" + item.update_time + "</td>"));
                        var actions = $("<td></td>");
                        row.append(actions);
                        if(item.status == "FAILED"){
                            var restart = $("<button type=\"button\" class=\"btn btn-xs btn-link\">重新启动</button>");
                            restart.click(function(e){
                                var id = $(this).parents("tr").attr("data-id");
                                confirm("确认重新启动该项任务？", function(){
                                    var page_number = $(".pagination>li[class=active]").children().html();
                                    var param = {
                                        sinterface : SERVERCONF.TASK.TASKRESTART,
                                        data: {
                                            id: id
                                        }
                                    };
                                    ajaxCall(param, function(err, data){
                                        if(err){
                                            alert("重启失败");
                                        }else{
                                            loadTaskList(page_number - 1);
                                        }
                                    });
                                });
                            });
                            actions.append(restart);
                        }
                        rows.push(row);
                    }
                    setTbody(tid, rows);
                    setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                        loadTaskList(parseInt(t.hash.replace("#", "")));
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
        var start_time = mStartTime.val();
        var end_time_true = new Date(mEndTime.val());
        var end_time = dataAdd("s", -1, end_time_true).format("yyyy-MM-dd hh:mm:ss");
        var task_type = mTaskType.val();
        var status = mTaskStatus.val();
        var sort = mSort.val();
        var order = mOrder.val();
        var data = {
            index: index,
            count: count,
            start_time: start_time,
            end_time: end_time,
        }
        if(task_type != 0){
            data.task_type = task_type;
        }
        if(status != 0){
            data.status = status;
        }
        if(sort != 0){
            data.sort = sort;
        }
        if(order != 0){
            data.order = order;
        }
        var param = {
            sinterface : SERVERCONF.TASK.TASKLIST,
            data : data
        };
        
        ajaxCall(param, function(err, data){
            if(err){
                ecb();
            }else{
                scb(data);
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
    }
    
    function pageInit(){
        var now = new Date();
        mEndTime.val(dataAdd("h", 1, now).format("yyyy-MM-dd hh:00:00"));
        mStartTime.val(dataAdd("d", -1, now).format("yyyy-MM-dd hh:00:00"));
        mTaskListBtn.click();
    }
}();