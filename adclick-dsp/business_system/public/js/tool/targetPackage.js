//step 1:初始化启动定向与不限制内容切换
//清空原始内容 0:checkbox 1:text 2:cycle 3: label-list 4:lbs 5:house
function initph(element,type){
    $("#"+element+"-on").on('click',function(){
        $("#"+element+"-panel").removeClass('hidden');
    });
    $("#"+element+"-off").on('click',function(){
        $("#"+element+"-panel").addClass('hidden');
    });
    $("#"+element+"-on").removeClass('btn-primary');
    $("#"+element+"-off").addClass('btn-primary');
    $("#"+element+"-panel").addClass('hidden');
    if(type==0){
        $("#"+element+"-panel input[type=checkbox]").attr("checked",false);
    }else if(type==1){
        $("#"+element+"-context").val("");
    }
}
function initPanelHidden(){
    //valid-adx
    initph('valid-adx',0);
    //regions
    initph('regions',0);
    //blocked-regions
    initph('blocked-regions',0);
    //ad-select
    initph('ad-select',3);
    //cycle
    initph('cycle',2);
    //cookies
    initph('cookies',1);
    //blocked-cookies
    initph('blocked-cookies',1);
    //sites
    initph('sites',1);
    //blocked-sites
    initph('blocked-sites',1);
    //ip
    initph('ip',1);
    //blocked-ip
    initph('blocked-ip',1);
    //os
    initph('os',0);
    //carrier
    initph('carrier',0);
    //connection-type
    initph('connection-type',0);
    //start-time
    initph('start-time');
    //end-time
    initph('end-time');
    //adslot
    initph('adslot',1);
    //experiment
    initph('exper',1);
    //browser
    initph('browser',0);
    //lbs
    initph('lbs', 4);
    //sex
    initph('sex', 0);
    //education
    initph('education', 0);
    //marriage
    initph('marriage', 0);
    //work
    initph('work', 0);
    //business-interest
    initph('business-interest', 0);
    //house
    initph('house', 5);
    //age
    initph('age', 0);
    //house-price
    initph('house-price', 0);
    //retarget
    initph('retarget', 0);
    //phone-model
    initph('phone-model', 0);
    //channel
    initph('channel', 0);
    //category
    initph('category', 0);

    $('.select-btn').click(function(){
        $(this).addClass("btn-primary");
        $(this).siblings().removeClass("btn-primary");
    });
}

//step 2:ADX列表
function initadx(){
    var adxlist=ADCONSTANT.ADXLIST;
    var html="";
    for (var adx in adxlist){     
        html=html+"<label class=\"checkbox-inline\"><input type=\"checkbox\" name=\"valid-adx\" value=\""+adxlist[adx]+"\">"+adx+"</label>";
    }
    $('#valid-adx-panel div').html(html);
}

//step 3:初始化地域
function initregions(){
    $('#regions-panel>div').html("");
    $('#blocked-regions-panel>div').html("");
    function ecb(){
        console.log("regijons load失败了");
    }
    function scb(data){
        var regions_list_f = $("<ul></ul>");
        var regions_list_c = $("<div class='regions-c'></div>");
        for(var i=0;i<data.total;i++){
            var item=data.list[i];
            //add region province
            var li = $("<li data-target='" + item.name + "'><span class='regions-addon'></span>" + item.name + "</li>");
            li.click(function(){
                $(this).parent().siblings().find("[data-name='" + $(this).attr("data-target") + "']").css("z-index", 3);
            });
            regions_list_f.append(li);

            //add region city
            var div = $("<div class='region-city' data-name='" + item.name + "'></div>");
            var citys = item.city;
            for(var k = 0; k < citys.length; k++){
                var city = citys[k];
                var label = null;
                if(city.type == 0){
                    label = $("<label class='checkbox-inline'><input type='checkbox' name='regions' value='" + city.name + "'>" + city.name + "(全省)</label>");
                    label.find("input").click(function(){
                        if($(this).prop("checked") == true){
                            $(this).parent().siblings().children("input").prop("checked", false).prop("disabled", true);
                        }else{
                            $(this).parent().siblings().children("input").prop("disabled", false);
                        }
                    });
                }else{
                    label = $("<label class='checkbox-inline'><input type='checkbox' name='regions' value='" + city.name + "'>" + city.name + "</label>");
                }
                div.append(label);
            }
            var add_btn = $("<a class='checkbox-inline'><span class='region-add'></span>确认</a>");
            add_btn.click(function(){
                $(this).parents("div.region-city").css("z-index", -1);
            });
            div.append(add_btn);
            regions_list_c.append(div);
        }
        var checkall = $("<li><span class='regions-check'></span>查看已选择</li>");
        regions_list_f.append(checkall);
        checkall.click(function(){
            var all = $(this).parent().siblings('.regions-c').children(".regionsall");
            all.css("z-index", 3);
            var html = "";
            html += "已选择地域 ";
            $(this).parent().siblings(".regions-c").children(".region-city").each(function(){
                var name = $(this).attr("data-name");
                if($(this).find("input:checked").length){
                    html += ("<label>" + name + "：</label>");
                    $(this).find("input:checked").each(function(){
                        html += ($(this).val() + "&nbsp");
                    });
                }
            });
            html += "<a class='close-btn'>x</a>";
            all.html(html);
            all.find("a.close-btn").click(function(){
                all.css("z-index", -1);
            });
        });

        var regionsall = $("<div class='regionsall'></div>");
        regions_list_c.append(regionsall);

        //add to view
        $('#regions-panel>div').append(regions_list_f);
        $('#regions-panel>div').append(regions_list_c);
        $('#blocked-regions-panel>div').append(regions_list_f.clone(true));
        var regions_list_c_blocked = regions_list_c.clone(true);
        regions_list_c_blocked.find("input").attr("name", "blocked-regions");
        $('#blocked-regions-panel>div').append(regions_list_c_blocked);
    }

    var region_data = JSON.parse(sessionStorage.getItem("region_data"));
    if(region_data){
        scb(region_data);
    }else{
        var param = {
            sinterface : SERVERCONF.ADS.COMMONQUERY,
            data :{
                query_id:ADCONSTANT.ADTARGETTYPE.REGIONS
            }
        };
        ajaxCall(param, function(err, data) {
            if (err) {
                ecb();
            } else {
                scb(data);
                sessionStorage.setItem("region_data", JSON.stringify(data));
            }
        });
    }
}

//step 4:投放时段
function initPlanFormSchedule(cycle) {
    var schedule = $("#modal-target-form .schedule");
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

//step 5:优选标签(关键词)
//label del process func
function labelDel(obj){
    //console.log(obj.attr("data-value"));
    if(obj.attr("data-l1")){
        $("input[value='" + obj.attr("data-value") + "']").prop("checked", false);
        obj.remove();
    }else{
        obj.remove();
    }
}
function initPerferedLabel(list){
    $(".prefered-list").html("");
    $(".prefer-list").html("");
    function scb(data){
        if(data.total == 0){
            console.log("无可用标签");
        }else{
            var label_list_f = $("<ul></ul>");
            var label_list_c = $("<div class='label-c'></div>");
            for(var i = 0; i < data.total; i++){
                var item = data.list[i];
                //add label level1
                var li = $("<li data-target='" + item.label_name + "'><span class='regions-addon'></span>" + item.label_name + "</li>");
                li.click(function(e){
                    $(this).parent().siblings().find("[data-name='" + $(this).attr("data-target") + "']").css("z-index", 3);
                })
                label_list_f.append(li);

                //add label level2
                var div = $("<div class='label_l2' data-name='" + item.label_name + "'></div>");
                var labels_l2 = item.l2_label_list;
                for(var k = 0; k < labels_l2.length; k++){
                    var label = $("<label class='checkbox-inline'><input type='checkbox' name='regions' value='" + labels_l2[k].label_name + "'>" + labels_l2[k].label_name + "</label>");
                    div.append(label);
                }
                //选中后添加对应标签
                var add_btn = $("<a class='checkbox-inline'><span class='label-add'></span>确认</a>");
                add_btn.click(function(e){
                    $(this).parents("div.label_l2").css("z-index", -1);
                    $(this).parents("div.label_l2").find("input").each(function(){
                        var value = $(this).val();
                        if($(this).prop("checked") == true){
                            if(!$(".prefered-list label[data-value='" + value + "']").length){
                                var label_l1_name = $(this).parents(".label_l2").attr("data-name");
                                var label = $("<label name='ad-select' data-value='" + value + "' data-l1='" + label_l1_name + "'>" + value + "<span title='删除' class='label-remove'>X</span></label>");
                                label.find("span.label-remove").click(function(){labelDel($(this).parents("label"))});
                                $(".prefered-list").append(label);
                            }
                        }else{
                            if($(".prefered-list label[data-value='" + value + "']").length){
                                $(".prefered-list label[data-value='" + value + "'] span.label-remove").click();
                            }
                        }
                    })
                })
                div.append(add_btn);
                label_list_c.append(div);
            }

            $(".prefer-list").append(label_list_f);
            $(".prefer-list").append(label_list_c);
        }
    }

    function ecb(){
        console.log("加载标签列表失败");
    }

    function initLabel(){
        //console.log(list);
        var prefered_list = $(".prefered-list");
        prefered_list.html("");
        for(var i = 0; i < list.length; i++){
            var item =list[i];
            var prefered_item = $(".label_l2 input[value='" + item + "']");
            if(prefered_item.length == 1){
                prefered_item.prop("checked", true);
                var label_l1_name = prefered_item.parents(".label_l2").attr("data-name");
                var label = $("<label name='ad-select' data-value='" + item + "' data-l1='" + label_l1_name + "'>" + item + "<span title='删除' class='label-remove'>X</span></label>");
                label.find("span.label-remove").click(function(){labelDel($(this).parents("label"))});
            }else{
                var label = $("<label name='ad-select' data-value='" + item + "'>" + item + "<span title='删除' class='label-remove'>X</span></label>");
                label.find("span.label-remove").click(function(){labelDel($(this).parents("label"))});
            }
            prefered_list.append(label);
        }
    }

    //用户自定义标签区域
    function initUserDefinedArea(){
        $(".user-defined").html("");
        var user_defined = $(".user-defined");
        var input = $("<input type='text'>");
        user_defined.append(input);
        var btn = $("<button>添加自定义标签</button>");
        btn.click(function(e){
            e.preventDefault();
            var value = input.val().replace(/(^\s*)|(\s*$)/g, "");;
            if(value){
                if($("label[name='ad-select'][data-value='" + value + "']").length){
                    alert("该标签已存在");
                }else{
                    if($(".label_l2 input[value='" + value + "']").length){
                        $(".label_l2 input[value='" + value + "']").prop("checked", true);
                        var label_l1_name = $(".label_l2 input[value='" + value + "']").parents(".label_l2").attr("data-name");
                        var label = $("<label name='ad-select' data-value='" + value + "' data-l1='" + label_l1_name + "'>" + value + "<span title='删除' class='label-remove'>X</span></label>");
                        label.find("span.label-remove").click(function(){labelDel($(this).parents("label"))});
                    }else{
                        var label = $("<label name='ad-select' data-value='" + value + "'>" + value + "<span title='删除' class='label-remove'>X</span></label>");
                        label.find("span.label-remove").click(function(){labelDel($(this).parents("label"))});
                    }
                    $(".prefered-list").append(label);
                    input.val("");
                }
            }
        })
        user_defined.append(btn);
    }
    initUserDefinedArea();

    var preferlabel_data = JSON.parse(sessionStorage.getItem("preferlabel_data"));
    if(preferlabel_data){
        scb(preferlabel_data);
        if(list){
            initLabel();
        }
    }else{
        var param = {
            sinterface : SERVERCONF.ADS.LABELQUERY,
            data :{}
        }
        ajaxCall(param, function(err, data) {
            if (err) {
                ecb();
            } else {
                scb(data);
                sessionStorage.setItem("preferlabel_data", JSON.stringify(data))
                if(list){
                    initLabel();
                }
            }
        });
    }
}

//step 6:手机型号
function initPhoneModel(){
    $('#phone-model-panel>div').html("");
    function ecb(){
        console.log("phone-model load失败了");
    }
    function scb(data){
        var phone_model_list_f = $("<ul></ul>");
        var phone_model_list_c = $("<div class='regions-c'></div>");
        for(var i=0;i<data.total;i++){
            var item=data.list[i];
            //add phone  brand
            var li = $("<li data-target='" + item.model_name + "'><span class='regions-addon'></span>" + item.model_name + "</li>");
            li.click(function(e){
                $(this).parent().siblings().find("[data-name='" + $(this).attr("data-target") + "']").css("z-index", 3).removeClass("hidden");
            })
            phone_model_list_f.append(li);

            //add region city
            var div = $("<div class='region-city hidden' data-name='" + item.model_name + "'></div>");
            var model_list = item.l2_model_list;
            for(var k = 0; k < model_list.length; k++){
                var model = model_list[k];
                if(model.type == 0){
                    var label = $("<label class='checkbox-inline'><input type='checkbox' name='phone-model' data-name='" + model.model_name + "(全部)' value='" + model.model_id + "'>" + model.model_name + "(全部)</label>");
                    label.find("input").click(function(e){
                        if($(this).prop("checked") == true){
                            $(this).parent().siblings().children("input").prop("checked", false).prop("disabled", true);
                        }else{
                            $(this).parent().siblings().children("input").prop("disabled", false);
                        }
                    })
                }else{
                    var label = $("<label class='checkbox-inline'><input type='checkbox' name='phone-model' data-name='" + model.model_name + "' value='" + model.model_id + "'>" + model.model_name + "</label>");
                }
                div.append(label);
            }
            var add_btn = $("<a class='checkbox-inline'><span class='region-add'></span>确认</a>");
            add_btn.click(function(e){
                $(this).parents("div.region-city").css("z-index", -1).addClass("hidden");
            })
            div.append(add_btn);
            phone_model_list_c.append(div);
        }
        var checkall = $("<li><span class='regions-check'></span>查看已选择</li>");
        phone_model_list_f.append(checkall);
        checkall.click(function(e){
            var all = $(this).parent().siblings('.regions-c').children(".regionsall");
            all.css("z-index", 3);
            var checked_arr = [];
            var html = "";
            html += "已选择 ";
            $(this).parent().siblings(".regions-c").children(".region-city").each(function(){
                var name = $(this).attr("data-name");
                if($(this).find("input:checked").length){
                    html += ("<label>" + name + "：</label>");
                    $(this).find("input:checked").each(function(){
                        html += ($(this).attr("data-name") + "&nbsp");
                    })
                }
            })
            html += "<a class='close-btn'>x</a>"
            all.html(html);
            all.find("a.close-btn").click(function(){
                all.css("z-index", -1);
            })
        })

        var modelall = $("<div class='regionsall'></div>");
        phone_model_list_c.append(modelall);

        //add to view
        $('#phone-model-panel>div').append(phone_model_list_f);
        $('#phone-model-panel>div').append(phone_model_list_c);
    }

    var phone_model_data = JSON.parse(sessionStorage.getItem("phone_model_data"));
    if(phone_model_data){
        scb(phone_model_data);
    }else{
        var param = {
            sinterface : SERVERCONF.ADS.PHONEMODEL,
            data :{}
        }
        ajaxCall(param, function(err, data) {
            if (err) {
                ecb();
            } else {
                scb(data);
                sessionStorage.setItem("phone_model_data", JSON.stringify(data));
            }
        });
    }
}

//step 7:用户重定向
function initRetarget(){
    $('#retarget-panel>div').html("");
    function ecb(){
        console.log("retarget load失败了");
    }
    function scb(data){
        var retarget_list_f = $("<ul></ul>");
        var retarget_list_c = $("<div class='regions-c'></div>");
        for(var i=0;i<data.total;i++){
            var item=data.list[i];
            //add phone  brand
            var li = $("<li data-target='" + item.retarget_name + "'><span class='regions-addon'></span>" + item.retarget_name + "</li>");
            li.click(function(e){
                $(this).parent().siblings().find("[data-name='" + $(this).attr("data-target") + "']").css("z-index", 3);
            })
            retarget_list_f.append(li);

            //add region city
            var div = $("<div class='region-city' data-name='" + item.retarget_name + "'></div>");
            var retarget_list = item.l2_retarget_list;
            for(var k = 0; k < retarget_list.length; k++){
                var retarget = retarget_list[k];
                if(retarget.type == 0){
                    var label = $("<label class='checkbox-inline'><input type='checkbox' name='retarget' data-name='" + retarget.retarget_name + "(全部)' value='" + retarget.retarget_id + "'>" + retarget.retarget_name + "(全部)</label>");
                    label.find("input").click(function(e){
                        if($(this).prop("checked") == true){
                            $(this).parent().siblings().children("input").prop("checked", false).prop("disabled", true);
                        }else{
                            $(this).parent().siblings().children("input").prop("disabled", false);
                        }
                    })
                }else{
                    var label = $("<label class='checkbox-inline'><input type='checkbox' name='retarget' data-name='" + retarget.retarget_name + "' value='" + retarget.retarget_id + "'>" + retarget.retarget_name + "</label>");
                }
                div.append(label);
            }
            var add_btn = $("<a class='checkbox-inline'><span class='region-add'></span>确认</a>");
            add_btn.click(function(e){
                $(this).parents("div.region-city").css("z-index", -1);
            })
            div.append(add_btn);
            retarget_list_c.append(div);
        }
        var checkall = $("<li><span class='regions-check'></span>查看已选择</li>");
        retarget_list_f.append(checkall);
        checkall.click(function(e){
            var all = $(this).parent().siblings('.regions-c').children(".regionsall");
            all.css("z-index", 3);
            var checked_arr = [];
            var html = "";
            html += "已选择 ";
            $(this).parent().siblings(".regions-c").children(".region-city").each(function(){
                var name = $(this).attr("data-name");
                if($(this).find("input:checked").length){
                    html += ("<label>" + name + "：</label>");
                    $(this).find("input:checked").each(function(){
                        html += ($(this).attr("data-name") + "&nbsp");
                    })
                }
            })
            html += "<a class='close-btn'>x</a>"
            all.html(html);
            all.find("a.close-btn").click(function(){
                all.css("z-index", -1);
            })
        })

        var modelall = $("<div class='regionsall'></div>");
        retarget_list_c.append(modelall);

        //add to view
        $('#retarget-panel>div').append(retarget_list_f);
        $('#retarget-panel>div').append(retarget_list_c);
    }

    var retarget_data = JSON.parse(sessionStorage.getItem("retarget_data"));
    if(retarget_data){
        scb(retarget_data);
    }else{
        var param = {
            sinterface : SERVERCONF.ADS.RETARGET,
            data :{}
        }
        ajaxCall(param, function(err, data) {
            if (err) {
                ecb();
            } else {
                scb(data);
                sessionStorage.setItem("retarget_data", JSON.stringify(data));
            }
        });
    } 
}

//step 8:频道
function initMgtvChannel(){
    function ecb(){
        console.log("channel load失败了");
    }
    function scb(data){
        var channel_list = data.list;
        var html = '';
        for(var i = 0; i < channel_list.length; i++) {
            html += "<label class='checkbox-inline'><input type='checkbox' name='channel' value='" + channel_list[i].index_number + "'> " + channel_list[i].keyword + "</label>";
        }
        $('#channel-panel div').html(html);
    }
    
    var mgtv_channel_data = JSON.parse(sessionStorage.getItem("mgtv_channel_data"));
    if(mgtv_channel_data){
        scb(mgtv_channel_data);
    }else{
        var param = {
            sinterface : SERVERCONF.ADS.CHANNELQUERY,
            data :{}
        };
        ajaxCall(param, function(err, data) {
            if (err) {
                ecb();
            } else {
                scb(data);
                sessionStorage.setItem("mgtv_channel_data", JSON.stringify(data));
            }
        });
    }
}

//step 9:类别
function initMgtvCategory(){
    function ecb(){
        console.log("category load失败了");
    }
    function scb(data){
        var category_list = data.list;
        var html = '';
        for(var i = 0; i < category_list.length; i++) {
            html += "<label class='checkbox-inline'><input type='checkbox' name='category' value='" + category_list[i].index_number + "'> " + category_list[i].keyword + "</label>";
        }
        $('#category-panel div').html(html);
    }
    
    var mgtv_category_data = JSON.parse(sessionStorage.getItem("mgtv_category_data"));
    if(mgtv_category_data){
        scb(mgtv_category_data);
    }else{
        var param = {
            sinterface : SERVERCONF.ADS.CATEGORYQUERY,
            data :{}
        }
        ajaxCall(param, function(err, data) {
            if (err) {
                ecb();
            } else {
                scb(data);
                sessionStorage.setItem("mgtv_category_data", JSON.stringify(data));
            }
        });
    }
}


//商业兴趣
function initBusinessInterest(){
    $('#business-interest-panel>div').html("");
    function ecb(){
        console.log("business-interest load失败了");
    }
    function scb(data){
        var business_interest_list_f = $("<ul></ul>");
        var business_interest_list_c = $("<div class='regions-c'></div>");
        for(var i=0;i<data.total;i++){
            var item=data.list[i];
            //add region province
            var li = $("<li data-target='" + item.name + "'><span class='regions-addon'></span>" + item.name + "</li>");
            li.click(function(e){
                $(this).parent().siblings().find("[data-name='" + $(this).attr("data-target") + "']").css("z-index", 3);
            })
            business_interest_list_f.append(li);

            //add region city
            var div = $("<div class='region-city' data-name='" + item.name + "'></div>");
            var interests = item.interest;
            for(var k = 0; k < interests.length; k++){
                var interest = interests[k];
                if(interest.type == 0){
                    var label = $("<label class='checkbox-inline'><input type='checkbox' name='business-interest' value='" + interest.name + "'>" + interest.name + "(全部)</label>");
                    label.find("input").click(function(e){
                        if($(this).prop("checked") == true){
                            $(this).parent().siblings().children("input").prop("checked", false).prop("disabled", true);
                        }else{
                            $(this).parent().siblings().children("input").prop("disabled", false);
                        }
                    })
                }else{
                    var label = $("<label class='checkbox-inline'><input type='checkbox' name='business-interest' value='" + interest.name + "'>" + interest.name + "</label>");
                }
                div.append(label);
            }
            var add_btn = $("<a class='checkbox-inline'><span class='region-add'></span>确认</a>");
            add_btn.click(function(e){
                $(this).parents("div.region-city").css("z-index", -1);
            })
            div.append(add_btn);
            business_interest_list_c.append(div);
        }
        var checkall = $("<li><span class='regions-check'></span>查看已选择</li>");
        business_interest_list_f.append(checkall);
        checkall.click(function(e){
            var all = $(this).parent().siblings('.regions-c').children(".regionsall");
            all.css("z-index", 3);
            var checked_arr = [];
            var html = "";
            html += "已选择 ";
            $(this).parent().siblings(".regions-c").children(".region-city").each(function(){
                var name = $(this).attr("data-name");
                if($(this).find("input:checked").length){
                    html += ("<label>" + name + "：</label>");
                    $(this).find("input:checked").each(function(){
                        html += ($(this).val() + "&nbsp");
                    })
                }
            })
            html += "<a class='close-btn'>x</a>"
            all.html(html);
            all.find("a.close-btn").click(function(){
                all.css("z-index", -1);
            })
        })

        var interestall = $("<div class='regionsall'></div>");
        business_interest_list_c.append(interestall);

        //add to view
        $('#business-interest-panel>div').append(business_interest_list_f);
        $('#business-interest-panel>div').append(business_interest_list_c);
    }
    var param = {
            sinterface : SERVERCONF.ADS.BUSINESSINTEREST,
            data :{
            }
    }
    ajaxCall(param, function(err, data) {
        if (err) {
            ecb();
        } else {
            scb(data);
        }
    });
}

//定向内容初始化
function contentInit(){
    initPanelHidden();
    initadx();
    initregions();
    initPlanFormSchedule();
    initPerferedLabel();
    initPhoneModel();
    initRetarget();
    //initBusinessInterest();
    initMgtvChannel();
    initMgtvCategory();
}


//target list
function loadTargetList(index, count) {
    var tid = "#target-list";
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
                    row.attr("data-template-id", item.template_id);
                    row.attr("data-template-name", item.template_name);
                    row.attr("data-template-tag", item.tag);
                    row.append($("<td>" + item.template_name + "</td>"));
                    row.append($("<td>" + item.tag + "</td>"));
                    var actions = $("<td></td>");
                    row.append(actions);
                    //var edit = $("<button type='button' class='btn btn-xs btn-link' onclick='editTarget(this.id)' id='"
                    //        + item.template_id + "'>编辑</button>");
                    var edit = $("<button type=\"button\" class=\"btn btn-xs btn-link\">编辑</button>");
                    edit.click(function(e){
                        var id = parseInt($(this).parents("tr").attr("data-template-id"));
                        var name = ($(this).parents("tr").attr("data-template-name"));
                        var tag = ($(this).parents("tr").attr("data-template-tag"));
                        editTarget(id,name,tag);
                    });
                    actions.append(edit);
                    //var del = $("<button type='button' class='btn btn-xs btn-link' onclick='deleteTarget(this.id)' id='"
                    //        + item.template_id + "'>删除</button>");
                    var del = $("<button type=\"button\" class=\"btn btn-xs btn-link\">删除</button>");
                    del.click(function(e){
                        var id = parseInt($(this).parents("tr").attr("data-template-id"));
                        deleteTarget(id);
                    });
                    actions.append(del);
                    rows.push(row);
                }
                setTbody(tid, rows);
                setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                    loadTargetList(parseInt(t.hash.replace("#", "")));
                }));
            } catch (e) {
                ecb();
            }
        }
    }
    function ecb() {
        emptyTbody(tid);
        setTfoot(tid, stringLoadFail());
    }

    var param = {
        sinterface : SERVERCONF.ADS.TARGETLIST,
        data : {
            index : index,
            count : count,
            sort : $("#sort").val() 
        }
    };

    ajaxCall(param, function(err, data) {
        if (err) {
            ecb();
        } else {
            scb(data);
        }
    });
}

//target delete
function deleteTarget(element) {
    confirm("确定要删除这条记录吗？", function(){
        var page_number = $(".pagination>li[class=active]").children().html();
        var list_length = $("#target-list tbody>tr").length;
        function ecb() {
            alert("记录删除失败");
        }
        function scb(data) {
            if(page_number > 1 && list_length == 1){
                loadTargetList(page_number - 2);
            }else{
                loadTargetList(page_number - 1);
            }
        }
        var param = {
            sinterface : SERVERCONF.ADS.TARGETDEL,
            data : {
                template_id : element
            }
        };
        ajaxCall(param, function(err, data) {
            if (err) {
                ecb();
            } else {
                scb(data);
            }
        });
    })
}

//target edit
function editTarget(id, name, tag){
    $("#modal-target-form :text").val("");
    $("#target-form-label").html("定向设置");
    $("#modal-target-form").modal("show");
    $(".alert").remove();
    contentInit();

    $("#submit-target-form").unbind("click");
    $("#submit-target-form").click(function(){
        submitTargetForm(id);
    });
    
    function ecb(){
        console.log("数据获取失败");
    }
    function scb(data){
        $("#target-name-context").val(name);
        $("#target-tag-context").val(tag);
        for(var i=0;i<data.size;i++){
            var item=data.list[i];
            var status=item.status;
            var content=item.content;
            if(status=="启用"){
                var type=gettype(item.type);
                if(type=="adview-type"){
                    $("#"+type+" input").each(function(){
                        if($(this).attr('value') == content){
                            $(this).click();
                        }
                    })
                }else{
                    var typeon=$("#"+type+"-on");
                    typeon.addClass("btn-primary");
                    typeon.siblings().removeClass("btn-primary");
                    $("#"+type+"-panel").removeClass("hidden");
                    if(ischeck(item.type)){
                        content=content.split(",");
                        for (var j=0;j<content.length;j++){
                            $("#"+type+"-panel input:checkbox[value='"+content[j]+"']").click();
                        }
                    }else if(type=="cycle"){
                        initPlanFormSchedule(content);
                    }else if(type == "ad-select"){
                        content=content.split(",");
                        initPerferedLabel(content);
                    }else if(type == 'lbs'){
                        content = content.split(",");
                        $("#lbs-lat-lng").val(content[0] + ',' + content[1]);
                        $("#lbs-radius").val(content[2]);
                    }else if(type == 'house'){
                        content = content.split(",");
                        $("#house-lat-lng").val(content[0] + ',' + content[1]);
                        $("#house-city").val(content[2]);
                        $("#house-name").val(content[3]);
                    }else{
                        $("#"+type+"-context").val(content);
                    }
                }
            }
        }
    }
    var param = {
        sinterface : SERVERCONF.ADS.TARGETVIEW,
        data :{
            template_id:id
        }
    }
    var checkInitStatus = setInterval(function(){
        if($("#retarget-panel div ul").length && 
            $("#phone-model-panel div ul").length && 
            //$("#business-interest-panel div ul").length && 
            $("#regions-panel div ul").length && 
            $("#blocked-regions-panel div ul").length &&
            $("#channel-panel div label").length &&
            $("#category-panel div label").length){
            ajaxCall(param, function(err, data) {
                if (err) {
                    ecb();
                } else {
                    scb(data);
                    clearInterval(checkInitStatus);
                }
            });
        }
    }, 1000);
}

//target list item type:checkbox
function ischeck(type){
    if(type==ADCONSTANT.ADTARGETTYPE.ADX||
            type==ADCONSTANT.ADTARGETTYPE.REGIONS||
            type==ADCONSTANT.ADTARGETTYPE.BLOCKEDREGIONS||
            type==ADCONSTANT.ADTARGETTYPE.OS||
            type==ADCONSTANT.ADTARGETTYPE.CARRIER||
            type==ADCONSTANT.ADTARGETTYPE.CONNECTIONTYPE||
            type==ADCONSTANT.ADTARGETTYPE.BROWSER||
            type==ADCONSTANT.ADTARGETTYPE.EDUCATION||
            type==ADCONSTANT.ADTARGETTYPE.MARRIAGE||
            type==ADCONSTANT.ADTARGETTYPE.WORK||
            type==ADCONSTANT.ADTARGETTYPE.BUSINESSINTEREST||
            type==ADCONSTANT.ADTARGETTYPE.RETARGET||
            type==ADCONSTANT.ADTARGETTYPE.PHONEMODEL||
            type==ADCONSTANT.ADTARGETTYPE.SEX||
            type==ADCONSTANT.ADTARGETTYPE.AGE||
            type==ADCONSTANT.ADTARGETTYPE.HOUSEPRICE||
            type==ADCONSTANT.ADTARGETTYPE.CHANNEL||
            type==ADCONSTANT.ADTARGETTYPE.CATEGORY){
        return true;
    }
    return false;
}

function blockToCycle() {
    var cycle = "";
    var blocks = $("#modal-target-form .schedule-block");
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

function gettype(element){
    var type="";
    switch(element){
        case "adx":
            type="valid-adx";
            break;
        case "流量类型":
            type="adview-type";
            break;
        case "地域":
            type="regions";
            break;
        case "地域黑名单":
            type="blocked-regions";
            break;
        case "广告优选":
            type="ad-select";
            break;
        case "投放时段":
            type="cycle";
            break;
        case "cookie":
            type="cookies";
            break;
        case "cookie黑名单":
            type="blocked-cookies";
            break;
        case "站点":
            type="sites";
            break;
        case "站点黑名单":
            type="blocked-sites";
            break;
        case "IP":
            type="ip";
            break;
        case "IP黑名单":
            type="blocked-ip";
            break;
        case "操作系统":
            type="os";
            break;
        case "运营商":
            type="carrier";
            break;
        case "连网类型":
            type="connection-type";
            break;
        case "开始投放时间":
            type="start-time";
            break;
        case "结束投放时间":
            type="end-time";
            break;
        case "广告位":
            type="adslot";
            break;
        case "浏览器":
            type="browser";
            break;
        case "实验":
            type="exper";
            break;
        case "LBS":
            type="lbs";
            break;
        case "性别":
            type="sex";
            break;
        case "用户学历":
            type="education";
            break;
        case "婚姻状态":
            type="marriage";
            break;
        case "工作状态":
            type="work";
            break;
        case "商业兴趣":
            type="business-interest";
            break;
        case "楼盘兴趣":
            type="house";
            break;
        case "年龄":
            type="age";
            break;
        case "居住社区价格":
            type="house-price";
            break;
        case "用户重定向":
            type="retarget";
            break;
        case "手机型号":
            type="phone-model";
            break;
        case "频道":
            type="channel";
            break;
        case "类别":
            type="category";
            break;
    }
    return type;
}

var PI = 3.14159265;
// 根据提供的经度和纬度、以及半径，取得此半径内的最大最小经纬度
function getAround(lon, lat, radius){
    var latitude = lat;
    var longitude = lon;

    var degree = (24901 * 1609) / 360.0;
    var raidus_mile = radius;
    
    var dpm_lat = 1 / degree;
    var radius_lat = dpm_lat * raidus_mile;
    var min_lat = latitude - radius_lat;
    var max_lat = latitude + radius_lat;
 
    var mpd_lng = degree * Math.cos(latitude * (PI / 180));
    var dpm_lng = 1 / mpd_lng;
    var radius_lng = dpm_lng * raidus_mile;
    var min_lng = longitude - radius_lng;
    var max_lng = longitude + radius_lng;
    return [min_lng, max_lng, min_lat, max_lat];
}

//0:checkbox 1:text 2:cycle 3:label-list 4:lbs 5:house
function getarr(id, name, type){
    var fo = $("#"+id+" input[class*=btn-primary]").attr('id');
    var fo_list = [];
    var foarr = {
        type: name, 
        content: '', 
        status: '未启用'
    };
    if(type == 0){//checkbox
        if(fo.indexOf("-on")>=0){
            $('input[name='+id+']:checked').each(function(){
                fo_list.push($(this).val()); 
            });
            fo_list = fo_list.join(",");
        }
    }else if (type == 1){// textarea
        if(fo.indexOf("-on")>=0){
            fo_list = $("#"+id+"-context").val();
        }
    }else if (type == 2){// cycle
        if(fo.indexOf("-on")>=0){
            fo_list = blockToCycle();
        }
    }else if(type == 3){// prefer label list
        if(fo.indexOf("-on")>=0){
            $("label[name='" + id + "']").each(function(){
                fo_list.push($(this).attr("data-value"));
            });
            fo_list = fo_list.join(",");
        }
    }else if(type == 4){// lbs
        if(fo.indexOf("-on")>=0){
            fo_list.push($("#lbs-lat-lng").val());
            fo_list.push($("#lbs-radius").val());
            var lng = parseFloat($("#lbs-lat-lng").val().split(",")[0]);
            var lat = parseFloat($("#lbs-lat-lng").val().split(",")[1]);
            var radius = parseInt($("#lbs-radius").val())*1000;
            var result = getAround(lng, lat, radius);
            var lng_range = result[0] + "*" + result[1];
            fo_list.push(lng_range);
            var lat_range = result[2] + "*" + result[3]
            fo_list.push(lat_range);
            fo_list = fo_list.join(",");
        }
    }else if(type == 5){//house
        if(fo.indexOf("-on")>=0){
            fo_list.push($("#house-lat-lng").val());
            fo_list.push($("#house-city").val());
            fo_list.push($("#house-name").val());
            fo_list = fo_list.join(",");
        }
    }else{
    }
    if(fo_list!=""){
        foarr.status = "启用";
        foarr.content = fo_list;
    }
    return foarr;
}

function getlist(){
    var arr=new Array();
    //valid-adx
    var valid_adx=getarr('valid-adx','adx',0);
    arr.push(valid_adx);
    //regions
    var regions=getarr('regions','地域',0);
    arr.push(regions);
    //blocked-regions
    var blocked_regions=getarr('blocked-regions','地域黑名单',0);
    arr.push(blocked_regions);
    //ad-select
    var ad_select=getarr('ad-select','广告优选',3);
    arr.push(ad_select);
    //cycle
    var cycle=getarr('cycle','投放时段',2);
    arr.push(cycle);
    //cookies
    var cookies=getarr('cookies','cookie',1);
    arr.push(cookies);
    //blocked_cookies
    var blocked_cookies=getarr('blocked-cookies','cookie黑名单',1);
    arr.push(blocked_cookies);
    //sites
    var sites=getarr('sites','站点',1);
    arr.push(sites);
    //blocked-sites
    var blocked_sites=getarr('blocked-sites','站点黑名单',1);
    arr.push(blocked_sites);
    //ip
    var ip=getarr('ip','IP',1);
    arr.push(ip);
    //blocked-sites
    var blocked_ip=getarr('blocked-ip','IP黑名单',1);
    arr.push(blocked_ip);
    //os
    var os=getarr('os','操作系统',0);
    arr.push(os);
    //carrier
    var carrier=getarr('carrier','运营商',0);
    arr.push(carrier);
    //connection-type
    var connection_type=getarr('connection-type','连网类型',0);
    arr.push(connection_type);
    //start-time
    var start_time=getarr('start-time','开始投放时间',1);
    arr.push(start_time);
    //end-time
    var end_time=getarr('end-time','结束投放时间',1);
    arr.push(end_time);
    //adslot
    var adslot=getarr('adslot','广告位',1);
    arr.push(adslot);
    //experiment
    var experiment = getarr('exper', '实验', 1);
    arr.push(experiment);
    //browser
    var browser=getarr('browser','浏览器',0);
    arr.push(browser);
    //lbs
    var lbs = getarr('lbs', 'LBS', 4);
    arr.push(lbs);
    //sex
    var sex = getarr('sex', '性别', 0);
    arr.push(sex);
    //education
    // var education = getarr('education', '用户学历', 0);
    // arr.push(education);
    //marriage
    // var marriage = getarr('marriage', '婚姻状态', 0);
    // arr.push(marriage);
    //work
    // var work = getarr('work', '工作状态', 0);
    // arr.push(work);
    //business-interest
    // var business_interest = getarr('business-interest', '商业兴趣', 0);
    // arr.push(business_interest);
    //house
    // var house = getarr('house', '楼盘兴趣', 5);
    // arr.push(house);
    //age
    var age = getarr('age', '年龄', 0);
    arr.push(age);
    //house price
    // var house = getarr('house-price', '居住社区价格', 0);
    // arr.push(house);
    //retarget
    var retarget = getarr('retarget', '用户重定向', 0);
    arr.push(retarget);
    //phone-model
    var phone_model = getarr('phone-model', '手机型号', 0);
    arr.push(phone_model);
    //channel
    var channel = getarr('channel', '频道', 0);
    arr.push(channel);
    //category
    var category = getarr('category', '类别', 0);
    arr.push(category);
    return arr;
}

function targetverify(arr){
    var issubmit = true;
    var msg=new Array();
    var Div=$('#target-form-modal-body-con');
    //regions
    var regions=arr[1].content.split(',');
    var blocked_regions=arr[2].content.split(',');
    var sameregions=samearr(regions, blocked_regions);
    //cookie
    var cookie=arr[5].content.split(',');
    var blocked_cookie=arr[6].content.split(',');
    var samecookie=samearr(cookie,blocked_cookie);
    //sites
    var sites=arr[7].content.split(',');
    var blocked_sites=arr[8].content.split(',');
    var samesites=samearr(sites,blocked_sites);
    //ip
    var ip=arr[9].content.split(',');
    var blocked_ip=arr[10].content.split(',');
    var sameip=samearr(ip,blocked_ip);
    //starttime
    var starttime=arr[14].content;
    var endtime=arr[15].content;
    var st=moment(endtime).isAfter(starttime);
    //target-name
    var template_name=$("#target-name-context").val();
    var tag=$("#target-tag-context").val();
    if(template_name==""){
        issubmit = false;
        msg.push("定向名称为空");
    }
    if(tag==""){
        issubmit = false;
        msg.push("定向标签为空");
    }
    //targets
    if (!st&&starttime!=""&&endtime!=""){
        issubmit = false;
        msg.push("结束时间大于开始时间");
    }
    if(sameregions.length>0&&sameregions[0]!=""){
        issubmit = false;
        msg.push("地域名单与黑名单重复");
    }
    if(samecookie.length>0&&samecookie[0]!=""){
        issubmit = false;
        msg.push("cookie名单与cookie黑名单重复");
    }
    if(samesites.length>0&&samesites[0]!=""){
        issubmit = false;
        msg.push("站点名单与站点黑名单重复");
    }
    if(sameip.length>0&&sameip[0]!=""){
        issubmit = false;
        msg.push("IP与IP黑名单重复");
    }
    msg=msg.join(',');
    if(!issubmit){
            setInfoDiv(Div,'error',msg)     
    }
    return issubmit;
}

function submitTargetForm(template_id){
    var issubmit = true;
    var param;
    var targets=getlist();
    issubmit=targetverify(targets);
    var template_name=$("#target-name-context").val();
    var tag=$("#target-tag-context").val();
    function ecb(){
        alert("提交请求失败");
    }
    function scb(data){
        $("#modal-target-form").modal("hide");
        loadTargetList();
    }
    if(template_id==undefined){
        param = {
            sinterface : SERVERCONF.ADS.TARGETCREATE,
            data :{
                template_name:template_name,
                targets:targets,
                tag:tag
            }
        }
    }else{
        param = {
            sinterface : SERVERCONF.ADS.TARGETEDIT,
            data :{
                template_id:template_id,
                template_name:template_name,
                targets:targets,
                tag:tag
            }
       }
    }
    
    if(issubmit){
        ajaxCall(param, function(err, data) {
            if (err) {
                ecb();
            } else {
                scb(data);
            }
        });
    }
}

function initPlanFormDatetimePicker() {
    var now = new Date();
    $("#modal-target-form .form_datetime").datetimepicker({
        format : "yyyy-mm-dd hh:00:00",
        weekStart : 1,
        startDate : now.format("yyyy-MM-dd hh:00:00"),
        autoclose : 1,
        startView : 2,
        minView : 1,
        maxView : 3,
        todayBtn : 1,
        todayHighlight : 1,
        language : "zh-CN",
        forceParse : 0,
    });
}

//LBS定向
function initLBS(){
    window.open('lbs.html', 'newwindow');
    var getlbs = setInterval(function(){
        if(localStorage.getItem("lng") != "" && localStorage.getItem("lat") != ""){
            $("#lbs-lat-lng").val(localStorage.getItem("lng") + ', ' + localStorage.getItem("lat"));
            clearInterval(getlbs);
            localStorage.setItem("lat", "");
            localStorage.setItem("lng", "");
        }
    }, 1000);
}

//楼盘兴趣定向
function initHouse(){
    window.open('house.html', 'newwindow');
    var gethouse = setInterval(function(){
        if(localStorage.getItem("house_lng") != "" && localStorage.getItem("house_lat") != "" && localStorage.getItem("city") != ""&& localStorage.getItem("name") != ""){
            $("#house-lat-lng").val(localStorage.getItem("house_lng") + ', ' + localStorage.getItem("house_lat"));
            $("#house-city").val(localStorage.getItem("house_city"));
            $("#house-name").val(localStorage.getItem("house_name"));
            clearInterval(gethouse);
            localStorage.setItem("house_lat", "");
            localStorage.setItem("house_lng", "");
            localStorage.setItem("house_city", "");
            localStorage.setItem("house_name", "");
        }
    }, 1000);
}

$(function(){
    var current_tab = window.current_tab || "";
    initTabs(tool_tabs_config, current_tab);
    if (current_tab == "targetPackage") {
        initPlanFormDatetimePicker();
        loadTargetList();
    }
    
    $("#sort").change(loadTargetList);
    $("#choose-lbs").click(function(e){
        e.preventDefault();
        initLBS();
    });
    // $("#choose-house").click(function(e){
    //     e.preventDefault();
    //     initHouse();
    // });

    $("#create-target").click(function() {
        //clear
        $("#modal-target-form :text").val("");
        $("#target-form-label").html("新建定向设置");
        $("#modal-target-form").modal("show");
        $(".alert").remove();
        contentInit();
        $("#submit-target-form").unbind("click");
        $("#submit-target-form").click(function(){
            submitTargetForm();
        });
    });
});