!function(){
    function initContentOfPlan() {
        loadPlanList();
    }

    function loadPlanList(index, count) {
        var tid = "#plan-list";
        emptyTbody(tid);
        setTfoot(tid, spinLoader("数据加载中，请稍候..."));
        var index = parseInt(index) || 0;
        var count = parseInt(count) || 10;
        function scb(data) {
            if (data.size == 0) {
                setTfoot(tid, stringLoadFail("没有数据"));
            } else {
                try {
                    var total = data.total;
                    var list = data.list;
                    var pagenumber = Math.ceil(total / count);
                    var rows = [];
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        var row = $("<tr></tr>");
                        row.append($("<td>" + item.plan_name + "</td>"));
                        var wrapper = $("<div class=\"switch\"></div>");
                        var status = $("<input type=\"checkbox\" data-size=\"mini\" data-on-color=\"success\" data-off-color=\"warning\"></input>");
                        row.attr("data-id", i);
                        row.attr("data-plan-id", item.plan_id);
                        row.attr("data-plan-name", item.plan_name);
                        row.attr("data-plan-cycle", item.plan_cycle);
                        if (item.plan_status == "启用") {
                            status.attr("checked", true);
                        }
                        wrapper.append(status);
                        row.append($("<td></td>").append(wrapper));
                        row.append($("<td>" + item.budget + "</td>"));
                        row.append($("<td>" + item.start_time + "</td>"));
                        row.append($("<td>" + item.end_time + "</td>"));
                        row.append($("<td>" + item.create_time + "</td>"));
                        row.append($("<td>" + item.update_time + "</td>"));
                        var actions = $("<td></td>");
                        row.append(actions);
                        var edit = $("<button type=\"button\" class=\"btn btn-xs btn-link\">编辑</button>");
                        edit.attr("edit-btn-id", i);
                        edit.click(function(e) {
                            $(".alert").remove();
                            var btn_id = $(this).attr("edit-btn-id");
                            $("#input-plan-name").val(list[btn_id].plan_name);
                            $("#input-starttime").val(list[btn_id].start_time);
                            $("#input-endtime").val(list[btn_id].end_time);
                            $("#input-budget").val(list[btn_id].budget);
                            initPlanFormSchedule($(this).parents("tr").attr("data-plan-cycle"));
                            $("#plan-form-label").html("编辑广告计划");
                            $("#modal-plan-form").modal("show");
                            $("#submit-plan-form").unbind("click");
                            $("#submit-plan-form").click(function(e) {
                                submitEditPlanForm(list[btn_id].plan_id);
                            });
                        });
                        actions.append(edit);
                        var del = $("<button type=\"button\" class=\"btn btn-xs btn-link\">删除</button>");
                        del.click(function(e) {
                            var arr=parseInt($(this).parents("tr").attr("data-plan-id"));
                            confirm("确定要删除这条记录吗？", function(){
                                confirmarr(arr);
                            })
                        });
                        actions.append(del);
                        rows.push(row);
                    }
                    setTbody(tid, rows);
                    var cbs = $(tid).find("input[type=checkbox]");
                    cbs.bootstrapSwitch();
                    cbs.on('switchChange.bootstrapSwitch', function(event, state) {
                        function scb(r) {
                            console.log(r);
                        }
                        function ecb(r) {
                            console.log(r);
                        }
                        var plan_id = $(this).parents("tr").attr("data-plan-id");
                        var plan_name = $(this).parents("tr").attr("data-plan-name");
                        var btn_id = $(this).parents("tr").attr("data-id");
                        togglePlan(plan_id, state, scb, ecb, btn_id, plan_name);
                    });
                    setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                        loadPlanList(parseInt(t.hash.replace("#", "")));
                    }));
                } catch(e) {
                    ecb();
                }
            }
        }
        function ecb() {
            emptyTbody(tid);
            setTfoot(tid, stringLoadFail());
        }
        var param = {
            sinterface: SERVERCONF.ADS.PLANLIST,
            data: {
                index: index,
                count: count,
                sort: $("#data-sort").val(),
                status: $("#plan-status").val()
            }
        }
        ajaxCall(param, function(err, data){
            if(err){
                ecb();
            }else{
                scb(data);
            }
        });
    }

    function confirmarr(arr){
        var page_number = $(".pagination>li[class=active]").children().html();
        var list_length = $("#plan-list tbody>tr").length;
        function ecb(err){
            console.log(err);
        }
        function scb(data){
            if(page_number > 1 && list_length == 1){
                loadPlanList(page_number - 2);
            }else{
                loadPlanList(page_number - 1);
            } 
        }

        var param = {
            sinterface: SERVERCONF.ADS.PLANDEL,
            data: {
                plan_id : arr
            }
        };

        ajaxCall(param, function(err, data){
            if(err){
                ecb(err);
            }else{
                scb(data);
            }
        });
    }

    function togglePlan(plan_id, toggle, scb, ecb, i, plan_name) {
        var param = {
            sinterface: SERVERCONF.ADS.PLANCONTROL,
            data: {
                plan_id: plan_id,
                action: toggle ? "\u542f\u52a8" : "\u6682\u505c"
            }
        };
        ajaxCall(param, function(err, data){
            if(err){
                ecb(err);
                if(err.code == ERRCODE.BUDGET_OVERFLOW.code){
                    alert("广告计划预算总额超出余额，广告计划\"" + plan_name + "\"启动失败");
                    $("input[type=checkbox]").eq(i).bootstrapSwitch("state", false);
                }
            }else{
                scb(data);
            }
        });
    }

    function initPlanFormDatetimePicker() {
        var now = new Date();
        $("#modal-plan-form .form_datetime").datetimepicker({
            format:         "yyyy-mm-dd hh:00:00",
            weekStart:      1,
            startDate:      now.format("yyyy-MM-dd hh:00:00"),
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

    function initPlanFormSchedule(cycle) {
        var schedule = $("#modal-plan-form .schedule");
        schedule.empty();
        var head = $("<div></div>");
        schedule.append(head);
        var timeline = $("<div></div>");
        timeline.css("padding-left", "45px");
        head.append(timeline);
        for (var i = 0; i < 13; i++) {
            var point = $("<div></div>");
            point.css("width", "50px");
            point.css("border", "0");
            point.css("text-align", "center");
            point.css("display", "inline-block");
            point.css("line-height", "23px");
            point.html(i * 2 + ":00");
            timeline.append(point);
        }
        var body = $("<div></div>");
        body.css("height", "175px");
        schedule.append(body);
        var weekdays = ["一", "二", "三", "四", "五", "六", "日"];
        var blocks = $("<div></div>");
        blocks.css("display", "inline-block");
        body.append(blocks);
        for (var i = 0; i < 7; i++) {
            var line = $("<div></div>");
            line.css("height", "25px");
            blocks.append(line);
            var picker = $("<div></div>");
            picker.css("width", "60px");
            picker.css("height", "25px");
            picker.css("line-height", "25px");
            picker.css("text-align", "right");
            picker.css("display", "inline-block");
            picker.css("margin-right", "10px");
            line.append(picker);
            var id = "line-picker-" + i;
            var check = $("<input type=\"checkbox\" id=\"" + id + "\">");
            if(cycle){
                if(cycle.substr(6*(6-i), 6) == "ffffff"){
                    check.prop("checked", true);
                }
            }
            check.css("height", "25px");
            check.css("margin", "0");
            picker.append(check);
            var label = $("<label for=\"" + id + "\">&nbsp;星期" + weekdays[i] + "</label>");
            label.css("font-weight", "normal");
            label.css("margin", "0");
            label.css("vertical-align", "top");
            picker.append(label);
            var schedule_chosing = {
                state: 0,
                index: -1
            };
            for (var j = 0; j < 24; j++) {
                var block = $("<div></div>");
                block.css("display", "inline-block");
                block.css("width", "25px");
                block.css("height", "25px");
                block.css("border", "1px solid #eee");
                block.css("box-sizing", "border-box");
                block.addClass("schedule-block");
                block.addClass("schedule-off");
                if (cycle) {
                    var byte = parseInt(cycle[41 - i * 6 - Math.floor(j / 4)], 16);
                    var bit = byte & (1 << (j % 4));
                    if (bit) {
                        block.removeClass("schedule-off");
                        block.addClass("schedule-on");
                    }
                }
                line.append(block);
                block.mousedown(function(e) {
                    schedule_chosing.state = 1;
                    schedule_chosing.index = schedule.find(".schedule-block").index($(this));
                    $(this).addClass("schedule-chosen");
                });
                block.mouseup(function(e) {
                    schedule_chosing.state = 0;
                    schedule_chosing.index = -1;
                    var chosen = schedule.find(".schedule-chosen");
                    for (var i = 0; i < chosen.length; i++) {
                        var item = $(chosen[i]);
                        if (item.hasClass("schedule-off")) {
                            item.removeClass("schedule-off");
                            item.removeClass("schedule-chosen");
                            item.addClass("schedule-on");
                        } else {
                            item.removeClass("schedule-on");
                            item.removeClass("schedule-chosen");
                            item.addClass("schedule-off");
                        }
                    }
                    var blocks = schedule.find(".schedule-block");
                    for (var i = 0; i < 7; i++) {
                        var linecount = 0
                        for (var j = 0; j < 24; j++) {
                            var block = blocks[i * 24 + j]; 
                            if (block.className.indexOf("schedule-on") > -1) {
                                linecount++;
                            }
                        }
                        if (linecount == 24) {
                            $(schedule.find(":checkbox")[i]).prop("checked", true);
                        } else {
                            $(schedule.find(":checkbox")[i]).prop("checked", false);
                        }
                    }
                });
                block.mouseover(function(e) {
                    var sx, sy, ex, ey, t;
                    if (schedule_chosing.state) {
                        sx = schedule_chosing.index % 24;
                        sy = Math.floor(schedule_chosing.index / 24);
                        var index = schedule.find(".schedule-block").index($(this));
                        t = index % 24;
                        if (t < sx) {
                            ex = sx;
                            sx = t;
                        } else {
                            ex = t;
                        }
                        t = Math.floor(index / 24);
                        if (t < sy) {
                            ey = sy;
                            sy = t;
                        } else {
                            ey = t;
                        }
                        var blocks = schedule.find(".schedule-block");
                        for (var i = 0; i < blocks.length; i++) {
                            var block = $(blocks[i]);
                            var x = i % 24;
                            var y = Math.floor(i / 24);
                            if (x >= sx && x <= ex && y >= sy && y <= ey) {
                                block.addClass("schedule-chosen");
                            } else {
                                block.removeClass("schedule-chosen");
                            }
                        }
                    }
                });
            }
            check.click(function(e) {
                if ($(this).prop("checked")) {
                    $(this).parent().siblings(".schedule-block").removeClass("schedule-off");
                    $(this).parent().siblings(".schedule-block").addClass("schedule-on");
                } else {
                    $(this).parent().siblings(".schedule-block").removeClass("schedule-on");
                    $(this).parent().siblings(".schedule-block").addClass("schedule-off");
                }
            });
        }
        var tail = $("<div></div>");
        tail.css("line-height", "28px");
        tail.css("padding-top", "10px");
        schedule.append(tail);
        var shortcut = $("<div></div>");
        tail.append(shortcut);
        var note = $("<div style=\"line-height:22px;display:inline-block;\">快捷设定:</div>");
        shortcut.append(note);
        var btnallweek = $("<button type=\"button\" class=\"btn btn-info btn-xs\">&nbsp;全周投放&nbsp;</button>");
        shortcut.append(btnallweek);
        btnallweek.click(function(e) {
            schedule.find(".schedule-block").removeClass("schedule-off");
            schedule.find(".schedule-block").addClass("schedule-on");
            schedule.find(":checkbox").prop("checked", true);
            this.blur();
        });
        var btnweekday = $("<button type=\"button\" class=\"btn btn-info btn-xs\">&nbsp;工作日投放&nbsp;</button>");
        shortcut.append(btnweekday);
        btnweekday.click(function(e) {
            schedule.find(".schedule-block:lt(120)").removeClass("schedule-off");
            schedule.find(".schedule-block:lt(120)").addClass("schedule-on");
            schedule.find(".schedule-block:gt(119)").removeClass("schedule-on");
            schedule.find(".schedule-block:gt(119)").addClass("schedule-off");
            schedule.find(":checkbox:lt(5)").prop("checked", true);
            schedule.find(":checkbox:gt(4)").prop("checked", false);
            this.blur();
        });
        var btnweekend = $("<button type=\"button\" class=\"btn btn-info btn-xs\">&nbsp;周末投放&nbsp;</button>");
        shortcut.append(btnweekend);
        btnweekend.click(function(e) {
            schedule.find(".schedule-block:lt(120)").removeClass("schedule-on");
            schedule.find(".schedule-block:lt(120)").addClass("schedule-off");
            schedule.find(".schedule-block:gt(119)").removeClass("schedule-off");
            schedule.find(".schedule-block:gt(119)").addClass("schedule-on");
            schedule.find(":checkbox:lt(5)").prop("checked", false);
            schedule.find(":checkbox:gt(4)").prop("checked", true);
            this.blur();
        });
        shortcut.children().css("margin", "5px");
    }

    function blockToCycle() {
        var cycle = "";
        var blocks = $("#modal-plan-form .schedule-block");
        var byte = 0;
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            if (block.className.indexOf("schedule-on") > -1) {
                byte += 1 << i % 4;
            }
            if (i % 4 == 3) {
                cycle = byte.toString(16) + cycle;
                byte = 0;
            }
        }
        return cycle;
    }

    function submitNewPlanForm() {
        var plan_name = $("#input-plan-name").val();
        var start_time = $("#input-starttime").val();
        var end_time = $("#input-endtime").val();
        var budget = $("#input-budget").val();
        var plan_cycle = blockToCycle();
        if(plan_name == ""){
            setInfoDiv($('#err-msg'), "error", "广告计划名称不能为空");
        }else if(start_time == "" || end_time ==""){
            setInfoDiv($('#err-msg'), "error", "起止时间不能为空");
        }else if(start_time >= end_time){
            setInfoDiv($('#err-msg'), "error","结束时间必须晚于开始时间");
        }else if(budget == 0 || !isMoney(budget)){
            setInfoDiv($('#err-msg'), "error","预算格式错误，必须大于0元,最高精确到0.01");
        }else{
            var param = {
                sinterface: SERVERCONF.ADS.PLANCREATE,
                data: {
                    plan_name: plan_name,
                    start_time: start_time,
                    end_time: end_time,
                    budget: budget,
                    plan_cycle: plan_cycle
                }
            };

            ajaxCall(param, function(err, data){
                if(err){
                    if(err.code == ERRCODE.DB_DATADUPLICATED.code){
                        setInfoDiv($('#err-msg'), "info","广告计划重名，请重新设置广告计划名称");
                    }else{
                        setInfoDiv($('#err-msg'), "info","添加推广计划失败");
                    }
                    
                }else{
                    $("#modal-plan-form").modal("hide");
                    loadPlanList();
                }
            });
        }
    }

    function submitEditPlanForm(plan_id) {
        var page_number = $(".pagination>li[class=active]").children().html();
        var plan_name = $("#input-plan-name").val();
        var start_time = $("#input-starttime").val();
        var end_time = $("#input-endtime").val();
        var budget = $("#input-budget").val();
        var plan_cycle = blockToCycle();
        if(plan_name == ""){
            setInfoDiv($('#err-msg'), "error", "广告计划名称不能为空");
        }else if(start_time == "" || end_time ==""){
            setInfoDiv($('#err-msg'), "error", "起止时间不能为空");
        }else if(start_time >= end_time){
            setInfoDiv($('#err-msg'), "error","结束时间必须晚于开始时间");
        }else if(budget == 0 || !isMoney(budget)){
            setInfoDiv($('#err-msg'), "error","预算格式错误，必须大于0元,最高精确到0.01");
        }else{
            var param = {
                sinterface: SERVERCONF.ADS.PLANEDIT,
                data: {
                    plan_id: plan_id,
                    plan_name: plan_name,
                    start_time: start_time,
                    end_time: end_time,
                    budget: budget,
                    plan_cycle: plan_cycle
                }
            };

            ajaxCall(param, function(err, data){
                if(err){
                    if(err.code == ERRCODE.DB_DATADUPLICATED.code){
                        setInfoDiv($('#err-msg'), "info","广告计划重名，请重新编辑广告计划名称");
                    }else{
                        setInfoDiv($('#err-msg'), "info","添加推广计划失败");
                    }
                }else{
                    $("#modal-plan-form").modal("hide");
                    loadPlanList(page_number - 1);
                }
            });
        }
        
    }

    $(function(){
        var current_tab = window.current_tab || "";
        initTabs(ad_tabs_config, current_tab);
        if (current_tab == "plan") {
            initContentOfPlan();
            initPlanFormDatetimePicker();
            $("#create-plan").click(function(e) {
                $(".alert").remove();
                $("#modal-plan-form :text").val("");
                $("#modal-plan-form :hidden").val("");
                initPlanFormSchedule();
                $(".schedule button").eq(0).click();
                $("#plan-form-label").html("新建广告计划");
                $("#modal-plan-form").modal("show");
                $("#submit-plan-form").unbind("click");
                $("#submit-plan-form").click(submitNewPlanForm);
            });
            
            $("#data-sort").change(function(e){
                loadPlanList();
            });

            $("#plan-status").change(function(e){
                loadPlanList();
            });
        }
    });
}();
