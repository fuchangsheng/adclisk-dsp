/**
 * @author fu
 */
var myChart = null;
var mOrder = null;
var mStartTime = null;
var mEndTime = null;
var mSearchBtn = null;
var arr = null;
var l_con = 3;
var r_con = 5;
var type = ADCONSTANT.OVERVIEWTYPE.ADX;

$(function() {
    var tabs_config = [ 
        {
            "name" : "realtime_all",
            "text" : "Overview",
            "url" : "/realtime_all.html"
       },
       {
           "name" : "realtime_adx",
           "text" : "ADX数据",
           "url" : "/realtime_adx.html"
       }, {
           "name" : "realtime_user",
           "text" : "广告主数据",
           "url" : "/realtime_user.html"
       },
       {
           "name" : "realtime_allt",
           "text" : "多粒度数据",
           "url" : "/realtime_allt.html"
       }];
    var current_tab = window.current_tab || "";
    initTabs(tabs_config, current_tab);
    if (current_tab == "realtime_adx") {
        initAdxList(adxChoosedInit);
        initStaticElement();
        initPlanFormDatetimePicker();
        arr = getDate();
    }
    
    mOrder.change(function(){
        initTable(0,10,arr[0],arr[1]);
    });
    
    mSearchBtn.click(function(){
        var start_time = mStartTime.val();
        var end_time = mEndTime.val();
        if(start_time > end_time){
            alert("开始时间不能晚于结束时间");
        }else{
            selectchange();
            initTable(0,10,arr[0],arr[1]);
        }
    });
});
function adxChoosedInit() {
    selectchange();
    initTable(0, 10, arr[0], arr[1]);
}

function initStaticElement() {
    mStartTime = $('#input-starttime');
    mEndTime = $('#input-endtime');
    mSearchBtn = $('#search-all');
    myChart = echarts.init(document.getElementById('user_report'));
    mOrder = $('#sort');
}

function getDate() {
    var times = new Array();
    times[0] = mStartTime.val() + ' 00:00:00';
    times[1] = mEndTime.val() + ' 23:59:59';
    return times;
}

function selectchange() {
    arr = getDate();
    l_con = $('#l_con').val();
    r_con = $('#r_con').val();
    initRealTimeChart(myChart, l_con, r_con, arr[0], arr[1], choosed_adx_id, type);
}

function initTable(index, count, start_time, end_time) {
    var tid = "#realtime_table";

    var data_type = '竞价,展现,点击,点击率,CPC,CPM,花费';
    var order = mOrder.val();
    setTfoot(tid, spinLoader("数据加载中，请稍候..."));
    var index = parseInt(index) || 0;
    var count = parseInt(count) || 10;
    var param = null;
    var unit = null;
    var start_timedate = moment(start_time);
    var end_timedate = moment(end_time);
    var len = end_timedate.diff(start_timedate, 'days');
    if (len == 0) {
        unit = "小时";
    } else {
        unit = "天";
    }
    function scb(r) {
        if (r.size == 0) {
            emptyTbody(tid);
            setTfoot(tid, stringLoadFail("没有数据"));
        } else {
            try {
                var total = r.total;
                var list = r.list;
                var pagenumber = Math.ceil(total / count);
                var rows = [];
                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
                    var row = $("<tr></tr>");
                    if (unit == "天") {
                        row.append($("<td>"
                                + moment(item.date_time).format("YYYY-MM-DD")
                                + "</td>"));
                    } else {
                        row.append($("<td>"
                                + moment(item.date_time).format("MM-DD HH:00")
                                + "</td>"));
                    }
                    row.append($("<td>" + item.bid + "</td>"));
                    row.append($("<td>" + item.imp + "</td>"));
                    row.append($("<td>" + item.click + "</td>"));
                    row.append($("<td>" + (item.ctr * 100).toFixed(3)
                            + "%</td>"));
                    row.append($("<td>" + item.cpc.toFixed(3) + "</td>"));
                    row.append($("<td>" + item.cpm.toFixed(3) + "</td>"));
                    row.append($("<td>" + item.cost + "</td>"));
                    rows.push(row);
                }
                setTbody(tid, rows);
                setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                    initTable(parseInt(t.hash.replace("#", "")), 10, arr[0],
                            arr[1]);
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

    param = {
        sinterface : SERVERCONF.DASHBOARD.REALTIMEADX,
        data : {
            adx_id : choosed_adx_id,
            index : index,
            count : count,
            start_time : start_time,
            end_time : end_time,
            unit : unit,
            data_type : data_type,
            order: order
        }
    };

    ajaxCall(param, function(err, data) {
        if (err) {
            ecb(err);
        } else {
            scb(data);
        }
    });
}

function initPlanFormDatetimePicker() {
    var now = new Date();
    $(".form_datetime").datetimepicker({
        format:         "yyyy-mm-dd",
        weekStart:      1,
        endDate:        now.format("yyyy-MM-dd"),
        autoclose:      1,
        startView:      2,
        minView:        2,
        maxView:        3,
        todayBtn:       1,
        todayHighlight: 1,
        language:       "zh-CN",
        forceParse:     0,
    });
    mEndTime.val(now.format("yyyy-MM-dd"));
    mStartTime.val(now.format("yyyy-MM-dd"));
}

$('#downloadcsv').click(function() {
    var start_timedate = moment(arr[0]);
    var end_timedate = moment(arr[1]);
    var len = end_timedate.diff(start_timedate, 'days');
    var unit = null;
    var data_type = '竞价,展现,点击,点击率,CPC,CPM,花费';
    if (len == 0) {
        unit = "小时";
    } else {
        unit = "天";
    }
    var param = null;
    function ecb() {
        console.log('获取失败');
    }
    function scb(data) {
        if (data.filename == undefined) {
            console.log("数据获取异常");
        } else {
            downloadFile(data.filename);
        }
    }
    function downloadFile(url) {
        try {
            var elemIF = document.createElement("a");
            elemIF.download = 'file';
            elemIF.href = url;
            elemIF.style.display = "none";
            elemIF.click();
        } catch (e) {
            ecb();
        }
    }
    param = {
        sinterface : SERVERCONF.DASHBOARD.REALTIMEADXDOWNLOAD,
        data : {
            adx_id : choosed_adx_id,
            start_time : arr[0],
            end_time : arr[1],
            unit : unit,
            data_type : data_type
        }
    };
    ajaxCall(param, function(err, data) {
        if (err) {
            ecb();
        } else {
            scb(data);
        }
    });
});