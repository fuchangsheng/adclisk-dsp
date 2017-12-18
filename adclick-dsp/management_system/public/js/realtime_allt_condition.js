/**
 * @author fu
 */
var myChart = null;
var arr = null;
var l_con = '';
var r_con = '';
var timezone = '';
var alldata=new Object();
var intime=null;

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
        initStaticElement();
        initRTChart();
        initdata('l_con',0);
        initdata('r_con',1);
    }
});



function initStaticElement() {
    myChart = echarts.init(document.getElementById('user_report'));
    l_con = $('#l_con').val();
    r_con = $('#r_con').val();
    intime=moment();
    timezone = $('#timezone').val();
    arr=getarr(timezone);
}

function getname(arg){
    var name="";
    if(arg==ADCONSTANT.REALTIMECHOOSE.BIDREQ.name){
       name=ADCONSTANT.REALTIMECHOOSE.BIDREQ.name
    }else if(arg==ADCONSTANT.REALTIMECHOOSE.BID.name){
        name=ADCONSTANT.REALTIMECHOOSE.BID.name
    }else if(arg==ADCONSTANT.REALTIMECHOOSE.IMP.name){
        name=ADCONSTANT.REALTIMECHOOSE.IMP.name
    }else if(arg==ADCONSTANT.REALTIMECHOOSE.CLICK.name){
        name=ADCONSTANT.REALTIMECHOOSE.CLICK.name
    }else if(arg==ADCONSTANT.REALTIMECHOOSE.COST.name){
        name=ADCONSTANT.REALTIMECHOOSE.COST.name
    }else if(arg==ADCONSTANT.REALTIMECHOOSE.COSTCPM.name){
        name=ADCONSTANT.REALTIMECHOOSE.COSTCPM.name
    }else if(arg==ADCONSTANT.REALTIMECHOOSE.COSTCPC.name){
       name=ADCONSTANT.REALTIMECHOOSE.COSTCPC.name
    }else if(arg==ADCONSTANT.REALTIMECHOOSE.COSTCPD.name){
        name=ADCONSTANT.REALTIMECHOOSE.COSTCPD.name
    }
    return name;
}

function choosename(arg){
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

function getarr(arg){
    var arr=[];
    if(arg=="all"){
        arr=[0,173];
    }else if(arg=="mouth"){
        arr=[0,30];
    }else if(arg=="day"){
        arr=[30,54];
    }else if(arg=="hour"){
        arr=[54,114];
    }else if(arg=="minute"){
        arr=[114,174];
    }
    return arr;
}


function selectchange(arg,lr) {
    timezone=$('#timezone').val();
    arr=getarr(timezone);
    l_con = $('#l_con').val();
    r_con = $('#r_con').val();
    initdata(arg,lr);
}

function initdata(arg,lr){
    var data={prefix:ADCONSTANT.REALTIMECHOOSE.BIDREQ.prefix};
    var temp;
    if(arg=="l_con"){
        temp=l_con;
        data.name=getname(l_con);
    }else if(arg="r_con"){
        temp=r_con;
        data.name=getname(r_con);
    }
    param = {
            sinterface : SERVERCONF.DASHBOARD.QUERY,
            data :data
        };
    if(lr<2){
        ajaxCall(param, function(err, data) {
            if (err) {
                ecb(err);
            } else {
                scb(data);
            }
        });
    }else{
        
        var option=myChart.getOption();
        option.xAxis.data=getaxis();
        option.series[0].data=JSON.parse(alldata[l_con]).data.slice(arr[0],arr[1]);
        option.series[1].data=JSON.parse(alldata[r_con]).data.slice(arr[0],arr[1]);
        myChart.setOption(option);
    }
    
    function ecb(err){
        console.log(err);
    }
    function scb(data){
        alldata[temp]=data;
        var res = [];
        var resdata=JSON.parse(data).data.slice(arr[0],arr[1]);
        for(var i=0;i<resdata.length;i++){
            var d=resdata[i];
            res.push(d);
        }
        var option=myChart.getOption();
        myChart.clear();
        //option.xAxis[0].data=getaxis();
        option.series[lr].name=choosename(temp);
        option.series[lr].data=res;
        option.legend[0].data[lr]=choosename(temp);
        option.yAxis[lr].name=choosename(temp);
        myChart.setOption(option);
        alldata[temp]=data;
    }
    

}

function getaxis(){
    var res = [];
    if(timezone==ADCONSTANT.REALTIMEDATE.ALL){
        var days=[];
        for(var i=30;i>=1;i--){
            days.push(intime.subtract(1, 'days').format('MM月DD日'));
        }
        res=res.concat(days.reverse());
        var hours=[];
        for(var i=24;i>=1;i--){
            hours.push(intime.subtract(1, 'hours').format('DD日hh时'));
        }
        res=res.concat(hours.reverse());
        var minutes=[];
        for(var i=60;i>=1;i--){
            minutes.push(intime.subtract(1, 'minutes').format('hh时mm分'));
        }
        res=res.concat(minutes.reverse());
        var seconds=[];
        for(var i=60;i>=1;i--){
            seconds.push(intime.subtract(1, 'seconds').format('mm分ss秒'));
        }
        res=res.concat(seconds.reverse());
        
    }else if(timezone==ADCONSTANT.REALTIMEDATE.MOUTH){
        for(var i=30;i>=1;i--){
            res.push(intime.subtract(1, 'days').format('MM月DD日'));
        }
        res=res.reverse();
    }else if(timezone==ADCONSTANT.REALTIMEDATE.DAY){
        for(var i=24;i>=1;i--){
            res.push(intime.subtract(1, 'hours').format('DD日hh时'));
        }
        res=res.reverse();
    }else if(timezone==ADCONSTANT.REALTIMEDATE.HOUR){
        for(var i=60;i>=1;i--){
            res.push(intime.subtract(1, 'minutes').format('hh时mm分'));
        }
        res=res.reverse();
    }else if(timezone==ADCONSTANT.REALTIMEDATE.MINUTE){
        for(var i=60;i>=1;i--){
            res.push(intime.subtract(1, 'seconds').format('mm分ss秒'));
        }
        res=res.reverse();
    }
    return res
} 


function initRTChart(){
    option = {
            color : [ '#444444', '#c23531' ],
            title : {},
            tooltip : {
                trigger : 'axis',
                formatter : function(params, ticket, callback) {
                   var content=""; 
                   content = content || params[0].name + "<br>";
                   for(var i=0;i<params.length;i++){
                       var key=params[i].seriesName;
                       var val=params[i].value[1];
                       content=content+key+":"+val+"<br>";
                   }
                   return content;
                }
            },
            legend : {
                zlevel : 5,
                itemWidth : 26,
                itemGap : 15,
                padding : 8,
                data : [ l_con, r_con ]
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
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                data : getaxis(),
            } ],
            yAxis : [ {
                type : 'value',
                scale : true,
                name : l_con,
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

            }, {
                type : 'value',
                name : r_con,
                splitLine : {
                    show : false
                },
                boundaryGap : [ 0.2, 0.2 ],
                axisLabel : {
                    formatter : function(value, index) {
                        return value;
                    }
                },
                min : 0,
                scale : true,
            } ],
            series : [ {
                name : l_con,
                type : 'line',
                yAxisIndex : 0,
                data : []
            }, {
                name : r_con,
                type : 'line',
                yAxisIndex : 1,
                data : []
            } ]
        };
    myChart.setOption(option);
    
    //自适应
    window.onresize = myChart.resize;
}    

