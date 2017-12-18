/*
 * @file  opLog.js
 * @description operation log html page js logic
 * @copyright dmtec.cn reserved, 2016
 * @date 2016.11.22
 * @version 0.0.1
 * @requires js/constants.js
 * @requires js/tool.js
 * @requires js/component.js
 */
!function(){
    var mStartTime = null;
    var mEndTime = null;
    var mSearchBtn = null;
    var mSort = null;
    
    $(function() {
        var tabs_config = [
            {"name": "set", "text": "消息设置", "url": "/msg_set.html"},
            {"name": "msgList", "text": "查看消息", "url": "/msg_list.html"},
            {"name": "opLog", "text": "操作日志", "url": "/opLog.html"}
        ];
        var current_tab = window.current_tab || "";
        initTabs(tabs_config, current_tab);
        initPageStaticElements();
        initPlanFormDatetimePicker();
        initOplog();
        
        mSearchBtn.click(function(){
            var start_time = mStartTime.val();
            var end_time = mEndTime.val();
            if(start_time > end_time){
                alert("开始时间不能晚于结束时间");
            }else{
                initOplog();
            }
        });
        
        mSort.change(function(){
            initOplog();
        });
    });
  
    function initPageStaticElements(){
        mStartTime = $('#input-starttime');
        mEndTime = $('#input-endtime');
        mSearchBtn = $('#search');
        mSort = $('#sort');
    }

    function initOplog(index, count){
        var tid = "#opLogList";
        emptyTbody(tid);
        setTfoot(tid, spinLoader("数据加载中，请稍候..."));
        var index = parseInt(index) || 0;
        var count = parseInt(count) || 10;
        function scb(data){
            if(data.size == 0) {
                setTfoot(tid, stringLoadFail("没有数据"));
            } else {
                try {
                    var total = data.total;
                    var pagenumber = Math.ceil(total / count);
                    var list = data.list;
                    var rows = [];
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        var row = $("<tr></tr>");
                        row.append($("<td>"+item.create_time+"</td>"));
                        row.append($("<td>"+item.mgr_name+"</td>"));
                        row.append($("<td>"+item.role+"</td>"));
                        row.append($("<td>"+item.content+"</td>"));
                        rows.push(row);
                    }
                    setTbody(tid, rows);
                    setTfoot(tid, pagination(index,5,pagenumber, function(t, e) {
                        initOplog(parseInt(t.hash.replace("#", "")));
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

        var param={
            sinterface: SERVERCONF.AUDITLOG.OPLOG,
            data:{
                index: index,
                count: count,
                sort: mSort.val(),
                start_time: mStartTime.val(),
                end_time: mEndTime.val(),
            }
        };
        ajaxCall(param,function(err,data){
            if (err) {
                ecb();
            }else {
                scb(data);
            }
        });
    }//init end

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