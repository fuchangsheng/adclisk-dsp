/*
 * @file  msg_list.js
 * @description message list html page js logic
 * @copyright dmtec.cn reserved, 2016
 * @date 2016.11.22
 * @version 0.0.1
 * @requires message/msgList.html
 * @requires js/constants.js
 * @requires js/tool.js
 * @requires js/component.js
 */
!function(){
    var uid = null;//消息列表id
    var msgList = null;
    var msgHead = null;
    var mStartTime = null;
    var mEndTime = null;
    var mSearchBtn = null;
    $(function(){
        if(current_tab == "msgList") {
            initPageStaticElement();
            initPlanFormDatetimePicker();
            initMsgList();//获取消息列表
            queryList();

            mSearchBtn.click(function(){
                var start_time = mStartTime.val();
                var end_time = mEndTime.val();
                if(start_time > end_time){
                    alert("开始时间不能晚于结束时间");
                }else{
                    var status = $("#pHead>li:last()>a").text();
                    status = $.trim(status)=="全部"?"":$.trim(status);
                    var categories = $("#pHead .active").text();
                    var sort = "";
                    if($("#time-sort span").hasClass("glyphicon-arrow-down")){
                        sort = "创建时间减序";
                    }else{
                        sort = "创建时间增序";
                    }
                    initMsgList(sort,categories,status);
                }
            });
        }
    });
  
    function initMsgList(sort,categories,notify_status,index,count){
        var index = parseInt(index) || 0;
        var count = parseInt(count) || 10;
        var sort = sort || "创建时间减序";
        var notify_status = notify_status || "";
        categories = categories || "所有消息";
        
        function scb(data){
            msgList.append(spinLoader("数据加载中，请稍候..."));
            if(data.size == 0){
                emptyUl(uid);
                msgList.html("没有消息");
            }else{
                try{
                    emptyUl(uid);
                    var total=data.total;
                    var pagenumber=Math.ceil(total / count);
                    var list=data.list;
                    loadUl(list);
                    //添加分页
                    msgList.append(pagination(index,5,pagenumber, function(t, e) {
                        var index = parseInt(t.hash.replace("#", ""));
                        initMsgList(sort,categories,notify_status,index);
                    }));
                    clickEvent();
                }catch(e){
                    ecb();
                }
            }
        }
    
        function ecb() {
            emptyUl(uid);
            msgList.append(stringLoadFail());
        }
    
        var param={
            sinterface: SERVERCONF.MESSAGE.MSGLIST,
            data:{
                index: index,
                count: count,
                sort: sort,
                start_time: mStartTime.val(),
                end_time: mEndTime.val(),
                categories: categories
            }
        };
        if(notify_status!=""){
            param.data.notify_status=notify_status;
        }
        ajaxCall(param,function(err,data){
            if (err) {
                ecb();
            }else {
                console.log(data);
                scb(data);
            }
        });  
    };

    function loadUl(list){
        for(var i=0;i<list.length;i++){
            var item=list[i];
            var status=item.notify_status;
            var oLi=$("<li class='list-group-item' id='"+item.msg_id+"'></li>");
            var oDivHead=$("<div class='row list-group-item-heading'>");
            var badget=$("<i class='glyphicon glyphicon-envelope'></i>");
            oDivHead.append($("<div class='col-sm-1 col-md-1'></div>").append(badget));
            var cate = null;
            if(item.categories == 1){
                cate = ADCONSTANT.MESSAGECATEGORIES.SYSTEM;
            }else if(item.categories == 2){
                cate = ADCONSTANT.MESSAGECATEGORIES.AUDIT;
            }else if(item.categories == 3){
                cate = ADCONSTANT.MESSAGECATEGORIES.ACCOUNT;
            }else if(item.categories == 4){
                cate = ADCONSTANT.MESSAGECATEGORIES.FINANCIAL;
            }else{
                cate = "类别未知";
            }
            oDivHead.append("<div class='col-sm-3 col-md-2'>"+cate+"</div><div class='col-sm-4 col-md-6'>"+item.title+"</div><div class='col-sm-4 col-md-2'>"+item.create_time+"</div>");
            oLi.append(oDivHead);
            var oDivText=$("<div class='list-group-item-text' style='display: none'></div>");
            oDivText.append($("<p>"+item.content+"</p>"));
            oLi.append(oDivText);
            if(status=="未读"){
                badget.css("color","#FFCC33");
                oLi.addClass("unread");
            }
            msgList.append(oLi);
        }
    }
  
    function emptyUl(uid){
        $(uid).empty();
    }

    function clickEvent(){
        $("#msg-list .list-group-item").each(function(index){
            var $this=$(this);
            $this.click(function(){
                var className=$this.attr("class");
                if(className.indexOf("unread")!=-1){
                    $this.removeClass("unread");
                    $("#msg-list i").eq(index).css("color","#000");
                    var msgId=$this.attr("id");
                    var param={
                        sinterface: SERVERCONF.MESSAGE.MSGSTATUS,
                        data:{
                            msg_id:msgId
                        }
                    };
                    ajaxCall(param,function(err,data){
                        console.log(data);
                    });
                }
                $("#msg-list .list-group-item-text").each(function(num){
                    if(num!=index){
                        $("#msg-list .list-group-item-text").eq(num).hide();
                    }
                });
                $("#msg-list .list-group-item-text").eq(index).toggle();
            });
        });
    }

    function queryList(){
        $("#pHead li:lt(5)").each(function(){
            var $this=$(this);
            $this.click(function(){
                $("#pHead li:lt(5)").removeClass("active");
                $this.addClass("active");
                var status=$("#pHead>li:last()>a").text();
                status=$.trim(status)=="全部"?"":$.trim(status);
                var sort=time_sort_status==0?"创建时间减序":"创建时间增序";
                initMsgList(sort,$this.text(),status);
            });
        });

        $("#msg-status li").each(function(){
            var $this=$(this);
            $this.click(function(){
                var status=$this.text();
                //console.log($.type(status));
                $("#pHead>li:last()>a").html(status+"<span class='caret'>");
                status=$.trim(status)=="全部"?"":$.trim(status);
                var categories=$("#pHead .active").text();
                console.log(categories)
                var sort=time_sort_status==0?"创建时间减序":"创建时间增序";
                initMsgList(sort,categories,status);
            });
        });
    }
  
    var time_sort_status=0;
    $("#time-sort").bind('click',function(){
        time_sort_status = ++time_sort_status%2;
        var status = $("#pHead>li:last()>a").text();
        status = $.trim(status)=="全部"?"":$.trim(status);
        var categories = $("#pHead .active").text();
        var sort = "";
        if(time_sort_status == 1){
            sort = "创建时间增序";
            $("#time-sort a span").removeClass('glyphicon-arrow-down').addClass('glyphicon-arrow-up');
        }else{
            sort = "创建时间减序";
            $("#time-sort a span").removeClass('glyphicon-arrow-up').addClass('glyphicon-arrow-down');
        }
        initMsgList(sort,categories,status);
    });
    
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

    function initPageStaticElement(){
        uid="#msg-list";
        msgList=$("#msg-list");
        msgHead=$("#msg-head");
        mStartTime = $('#input-starttime');
        mEndTime = $('#input-endtime');
        mSearchBtn = $('#search');
    };
}();