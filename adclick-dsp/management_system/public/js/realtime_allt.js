/**
 * @author fu
 */
var bid_req_chart = null;
var bid_chart = null;
var imp_chart = null;
var click_chart = null;
var cost_chart = null;
var cost_cpm_chart = null;
var cost_cpc_chart = null;
var cost_cpd_chart = null;
var arr = null;
var timezone = '';
var stat = '';
var intime = null;

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
    if (current_tab == "realtime_allt") {
        initAddress();
        initStaticElement();
        initAllData();
    }
});

function initAddress() {
    
    var html = "<option value=''>所有服务器</option>";
    
    param = {
        sinterface : SERVERCONF.DASHBOARD.ADDRESSLIST,
    };
    ajaxCall(param, function(err, data) {
        if (err) {
            ecb(err);
        } else {
            scb(data);
        }
    });
    function ecb(err) {
        $('#address').html(html);
        console.log(err);
    }
    function scb(data) {
        for(var i=0;i<data.total;i++){
            html=html+"<option value=\""+data.list[i].id+"\">服务器"+data.list[i].id+"</option>";
        }
        $('#address').html(html);
    }

}

function initStaticElement() {
    bid_req_chart = echarts.init(document.getElementById('bid_req'));
    bid_chart = echarts.init(document.getElementById('bid'));
    imp_chart = echarts.init(document.getElementById('imp'));
    click_chart = echarts.init(document.getElementById('click'));
    cost_chart = echarts.init(document.getElementById('cost'));
    cost_cpm_chart = echarts.init(document.getElementById('cost_cpm'));
    cost_cpc_chart = echarts.init(document.getElementById('cost_cpc'));
    cost_cpd_chart = echarts.init(document.getElementById('cost_cpd'));
    intime = moment();
    timezone = $('#timezone').val();
    arr = getarr(timezone);
    stat = $('#series').val();
}

function getdata(arg) {
    var data;
    if (stat == "totalstat") {
        if (arg == ADCONSTANT.REALTIMECHOOSE.BIDREQ.name) {
            data = ADCONSTANT.REALTIMECHOOSE.BIDREQ
        } else if (arg == ADCONSTANT.REALTIMECHOOSE.BID.name) {
            data = ADCONSTANT.REALTIMECHOOSE.BID
        } else if (arg == ADCONSTANT.REALTIMECHOOSE.IMP.name) {
            data = ADCONSTANT.REALTIMECHOOSE.IMP
        } else if (arg == ADCONSTANT.REALTIMECHOOSE.CLICK.name) {
            data = ADCONSTANT.REALTIMECHOOSE.CLICK
        } else if (arg == ADCONSTANT.REALTIMECHOOSE.COST.name) {
            data = ADCONSTANT.REALTIMECHOOSE.COST
        } else if (arg == ADCONSTANT.REALTIMECHOOSE.COSTCPM.name) {
            data = ADCONSTANT.REALTIMECHOOSE.COSTCPM
        } else if (arg == ADCONSTANT.REALTIMECHOOSE.COSTCPC.name) {
            data = ADCONSTANT.REALTIMECHOOSE.COSTCPC
        } else if (arg == ADCONSTANT.REALTIMECHOOSE.COSTCPD.name) {
            data = ADCONSTANT.REALTIMECHOOSE.COSTCPD
        }
    } else {
        if (arg == ADCONSTANT.REALTIMECHOOSE.BIDREQ.name) {
            data = ADCONSTANT.REALTIMECHOOSEPERSECOND.BIDREQ
        } else if (arg == ADCONSTANT.REALTIMECHOOSE.BID.name) {
            data = ADCONSTANT.REALTIMECHOOSEPERSECOND.BID
        } else if (arg == ADCONSTANT.REALTIMECHOOSE.IMP.name) {
            data = ADCONSTANT.REALTIMECHOOSEPERSECOND.IMP
        } else if (arg == ADCONSTANT.REALTIMECHOOSE.CLICK.name) {
            data = ADCONSTANT.REALTIMECHOOSEPERSECOND.CLICK
        } else if (arg == ADCONSTANT.REALTIMECHOOSE.COST.name) {
            data = ADCONSTANT.REALTIMECHOOSEPERSECOND.COST
        } else if (arg == ADCONSTANT.REALTIMECHOOSE.COSTCPM.name) {
            data = ADCONSTANT.REALTIMECHOOSEPERSECOND.COSTCPM
        } else if (arg == ADCONSTANT.REALTIMECHOOSE.COSTCPC.name) {
            data = ADCONSTANT.REALTIMECHOOSEPERSECOND.COSTCPC
        } else if (arg == ADCONSTANT.REALTIMECHOOSE.COSTCPD.name) {
            data = ADCONSTANT.REALTIMECHOOSEPERSECOND.COSTCPD
        }
    }
    return data;
}

function choosename(arg) {
    var str = "";
    switch (arg) {
    case 'bid_req':
        str = "竞价请求";
        break;
    case 'bid':
        str = "参与竞价";
        break;
    case 'imp':
        str = "展现数";
        break;
    case 'click':
        str = "点击数";
        break;
    case 'cost':
        str = "总消费数";
        break;
    case 'cost_cpm':
        str = "CPM消费数";
        break;
    case 'cost_cpc':
        str = "CPC消费数";
        break;
    case 'cost_cpd':
        str = "CPD消费数";
        break;
    }
    return str;
}

function getarr(arg) {
    var arr = [];
    if (arg == "all") {
        arr = [ 0, 174 ];
    } else if (arg == "mouth") {
        arr = [ 0, 30 ];
    } else if (arg == "day") {
        arr = [ 30, 54 ];
    } else if (arg == "hour") {
        arr = [ 54, 114 ];
    } else if (arg == "minute") {
        arr = [ 114, 174 ];
    }
    return arr;
}

function selectchange() {
    timezone = $('#timezone').val();
    arr = getarr(timezone);
    stat = $('#series').val();
    initAllData();
}

function initAllData() {
    initdata('bid_req', bid_req_chart);

    initdata('bid', bid_chart);
    initdata('imp', imp_chart);
    initdata('click', click_chart);
    initdata('cost', cost_chart);
    initdata('cost_cpm', cost_cpm_chart);
    initdata('cost_cpc', cost_cpc_chart);
    initdata('cost_cpd', cost_cpd_chart);

}

function initdata(arg, chart) {
    var data = getdata(arg);
    var id=$('#address').val();
    if(id!=null&&id!=""){
        data.id=id;
    }else{
        delete data['id'];
    }
    param = {
        sinterface : SERVERCONF.DASHBOARD.QUERY,
        data : data
    };
    ajaxCall(param, function(err, data) {
        if (err) {
            ecb(err);
        } else {
            scb(data);
        }
    });
    function ecb(err) {
        console.log(err);
    }
    function scb(data) {
        var res = [];
        var resdata = JSON.parse(data).data.slice(arr[0], arr[1]);
        for (var i = 0; i < resdata.length; i++) {
            var d = resdata[i];
            res.push(d[1]);
        }
        initRTChart(chart, choosename(arg), res)
    }

}

/*
 * old function getaxis(){ var temp=moment().format("YYYY-MM-DD HH:mm:ss"); var
 * res = []; if(timezone==ADCONSTANT.REALTIMEDATE.ALL){ var days=[]; for(var
 * i=30;i>=1;i--){ days.push(intime.subtract(1, 'days').format('MM月DD日')); }
 * res=res.concat(days.reverse()); var hours=[]; for(var i=24;i>=1;i--){
 * hours.push(intime.subtract(1, 'hours').format('DD日hh时')); }
 * res=res.concat(hours.reverse()); var minutes=[]; for(var i=60;i>=1;i--){
 * minutes.push(intime.subtract(1, 'minutes').format('hh时mm分')); }
 * res=res.concat(minutes.reverse()); var seconds=[]; for(var i=60;i>=1;i--){
 * seconds.push(intime.subtract(1, 'seconds').format('mm分ss秒')); }
 * res=res.concat(seconds.reverse());
 * 
 * }else if(timezone==ADCONSTANT.REALTIMEDATE.MOUTH){ for(var i=30;i>=1;i--){
 * res.push(intime.subtract(1, 'days').format('MM月DD日')); } res=res.reverse();
 * }else if(timezone==ADCONSTANT.REALTIMEDATE.DAY){ for(var i=24;i>=1;i--){
 * res.push(intime.subtract(1, 'hours').format('DD日hh时')); } res=res.reverse();
 * }else if(timezone==ADCONSTANT.REALTIMEDATE.HOUR){ for(var i=60;i>=1;i--){
 * res.push(intime.subtract(1, 'minutes').format('hh时mm分')); }
 * res=res.reverse(); }else if(timezone==ADCONSTANT.REALTIMEDATE.MINUTE){
 * for(var i=60;i>=1;i--){ res.push(intime.subtract(1,
 * 'seconds').format('mm分ss秒')); } res=res.reverse(); }
 * intime=moment(temp,'YYYY-MM-DD HH:mm:ss'); return res }
 */

function getaxis() {
    var res = [];
    if (timezone == ADCONSTANT.REALTIMEDATE.ALL) {
        var days = [];
        for (var i = 1; i <= 30; i++) {
            days.push('前' + i + '天');
        }
        res = res.concat(days.reverse());
        var hours = [];
        for (var i = 1; i <= 24; i++) {
            hours.push('前' + i + '时');
        }
        res = res.concat(hours.reverse());
        var minutes = [];
        for (var i = 1; i <= 60; i++) {
            minutes.push('前' + i + '分');
        }
        res = res.concat(minutes.reverse());
        var seconds = [];
        for (var i = 1; i <= 60; i++) {
            seconds.push('前' + i + '秒');
        }
        res = res.concat(seconds.reverse());

    } else if (timezone == ADCONSTANT.REALTIMEDATE.MOUTH) {
        for (var i = 1; i <= 30; i++) {
            res.push('前' + i + '天');
        }
        res = res.reverse();
    } else if (timezone == ADCONSTANT.REALTIMEDATE.DAY) {
        for (var i = 1; i <= 24; i++) {
            res.push('前' + i + '时');
        }
        res = res.reverse();
    } else if (timezone == ADCONSTANT.REALTIMEDATE.HOUR) {
        for (var i = 1; i <= 60; i++) {
            res.push('前' + i + '分');
        }
        res = res.reverse();
    } else if (timezone == ADCONSTANT.REALTIMEDATE.MINUTE) {
        for (var i = 1; i <= 60; i++) {
            res.push('前' + i + '秒');
        }
        res = res.reverse();
    }
    return res
}

function initRTChart(charts, condition, data) {

    option = {
        color : [ '#444444', '#c23531' ],
        title : {},
        tooltip : {
            trigger : 'axis',
            formatter : function(params, ticket, callback) {
                var content = "";
                content = content || params[0].name + "<br>";
                for (var i = 0; i < params.length; i++) {
                    var key = params[i].seriesName;
                    var val = params[i].value;
                    content = content + key + ":" + val + "<br>";
                }
                return content;
            }
        },
        legend : {
            zlevel : 5,
            itemWidth : 26,
            itemGap : 15,
            padding : 8,
            data : [ condition ]
        },
        grid : {
            left : '8%',
            right : '8%',
        },
        toolbox : {
            show : true,
            feature : {
                dataView : {
                    readOnly : false
                },
                restore : {},
                saveAsImage : {}
            },
            right : 15
        },
        dataZoom : {
            show : true,

        },
        xAxis : [ {
            type : 'category',
            axisTick : {
                show : false
            },
            axisLine : {
                show : false
            },
            axisLabel : {
                interval : function(e, t) {

                    if (0 === e || 29 === e || 53 === e || 113 === e
                            || 173 === e)
                        return !0;
                    else
                        return !1
                },
            },
            splitLine : {
                show : true
            },
            data : getaxis(),
        } ],
        yAxis : [ {
            type : 'value',
            scale : true,
            name : condition,
            min : 0,
            boundaryGap : [ 0.2, 0.2 ],
            axisLabel : {
                formatter : function(value, index) {
                    if(value>=1000){
                        value=Math.round(value/1000)+"k";
                    }
                    return value;
                }
            },
            splitLine : {
                show : false
            },

        } ],
        series : [ {
            name : condition,
            type : 'line',
            yAxisIndex : 0,
            data : data
        } ]
    };
    if (timezone != ADCONSTANT.REALTIMEDATE.ALL) {
        option.xAxis = [ {
            type : 'category',
            axisLabel : {
                interval : 'auto',
            },
            axisTick : {
                show : false
            },
            splitLine : {
                show : false
            },
            data : getaxis(),
        } ];
        option.yAxis = [ {
            type : 'value',
            scale : true,
            name : condition,
            min : 0,
            boundaryGap : [ 0.2, 0.2 ],
            axisLabel : {
                formatter : function(value, index) {
                    return value;
                }
            },
            splitLine : {
                show : true
            },

        } ]
    }
    charts.setOption(option);

    // 自适应
    window.onresize = charts.resize;
}
