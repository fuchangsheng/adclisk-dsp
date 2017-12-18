var mideas_type = null;
var mStartTime = null;
var mEndTime = null;
var mSearchBtn = null;
var myChart = null;
var mOrder = null;
var arr = null;
var l_con = 3;
var r_con = 5;
var report_id = null;
var report_type = null;
var others = 'realtime';//param needed in function initChart
var checkedarr = ['时间', '展现(次)', '点击(次)', '点击率', 'CPC(元)', 'CPM(元)', '花费(元)'];

$(function() {
  var tabs_config = [{
    "name": "effect_data",
    "text": "效果数据",
    "url": "/dashboard/report.html"
  }];
  var current_tab = window.current_tab || "";
  //initTabs(tabs_config, current_tab);
  initTree();
  initStaticElement();
  initPlanFormDatetimePicker();
  arr = getDate();
  initChart(myChart, l_con, r_con, arr[0], arr[1], null, null, others);
  initTableth(checkedarr);
  initTable(0, 10, arr[0], arr[1]);

  mOrder.change(function() {
    initTable(0, 10, arr[0], arr[1], report_id, report_type);
  });

  mSearchBtn.click(function() {
    var start_time = mStartTime.val();
    var end_time = mEndTime.val();
    if(start_time > end_time) {
      alert("开始时间不能晚于结束时间");
    } else {
      selectchange();
      initTable(0, 10, arr[0], arr[1], report_id, report_type);
    }
  });
});

/**
 *left tree 
 * @returns
 */
function initTree() {
  function ecb() {
    console.log("idea_list获取失败");
  }

  function scb(data) {
    plandatalist = new Array();
    //allidea
    var allidea = new Object();
    allidea.text = "整体情况";
    allidea.href = ADCONSTANT.DASHBOARDCHOOSEID.ALLIDEA;
    allidea.tags = [ADCONSTANT.DASHBOARDCHOOSEID.ALLIDEA];
    plandatalist.push(allidea);
    //plan_id
    for(var i = 0; i < data.size; i++) {
      var plan = data.list[i];
      var plandata = new Object();
      var text = plan.plan_name;
      text = limitstr(text, 20);
      plandata.text = text;
      plandata.href = ADCONSTANT.DASHBOARDCHOOSEID.PLAN;
      plandata.tags = [plan.plan_id];
      plandatalist.push(plandata);
    }
    $('#treeview').treeview({
      data: plandatalist
    });
    flushtree();
  }
  var param = {
    sinterface: SERVERCONF.ADS.PLANLIST,
    data: {
      //index : 0,
      //count : 10,
      sort: ADCONSTANT.DATASORT.UPDATETIME_DESC
    }
  };

  ajaxCall(param, function(err, data) {
    if(err) {
      ecb();
    } else {
      scb(data);
    }
  });
}

function flushtree() {
  $('#treeview').on('nodeSelected', function(event, node) {
    doii(node);
  });

  function doii(node) {
    var id = node.tags[0];
    var type = node.href;
    if(node.nodes == undefined) {
      if(type == ADCONSTANT.DASHBOARDCHOOSEID.PLAN) {
        var param = {
          sinterface: SERVERCONF.ADS.UNITLIST,
          data: {
            plan_id: id,
            sort: ADCONSTANT.DATASORT.UPDATETIME_DESC
          }
        };
        ajaxCall(param, function(err, data) {
          if(err) {
            console.log('unitlist失败了');
          } else {
            for(var i = 0; i < data.size; i++) {
              var unit = data.list[i];
              var text = unit.unit_name;
              text = limitstr(text, 20);
              $('#treeview').treeview("addNode", [node.nodeId, {
                node: {
                  text: text,
                  href: ADCONSTANT.DASHBOARDCHOOSEID.UNIT,
                  tags: [unit.unit_id],
                }
              }]);
            }
          }
        });
      } else if(type == ADCONSTANT.DASHBOARDCHOOSEID.UNIT) {
        var param = {
          sinterface: SERVERCONF.ADS.IDEALIST,
          data: {
            unit_id: id,
            //index : 0,
            //count : 10,
            sort: ADCONSTANT.DATASORT.UPDATETIME_DESC
          }
        };
        ajaxCall(param, function(err, data) {
          if(err) {
            console.log('idealist失败了');
          } else {
            for(var i = 0; i < data.size; i++) {
              var idea = data.list[i];
              var text = idea.idea_name;
              text = limitstr(text, 20);
              $('#treeview').treeview("addNode", [node.nodeId, {
                node: {
                  text: text,
                  href: ADCONSTANT.DASHBOARDCHOOSEID.IDEA,
                  tags: [idea.idea_id],
                }
              }]);
            }
          }
        });
      }
    }
    report_id = id;
    report_type = type;
    changeidea(id, type);
  }
}

function changeidea(id, type) {
  initChart(myChart, l_con, r_con, arr[0], arr[1], id, type, others);
  initTableth(checkedarr);
  initTable(0, 10, arr[0], arr[1], id, type);
}

function initStaticElement() {
  mideas_type = $('#ideas-type');
  mStartTime = $('#input-starttime');
  mEndTime = $('#input-endtime');
  mSearchBtn = $('#search-all');
  myChart = echarts.init(document.getElementById('user_report'));
  mOrder = $('#sort');
}

function getDate() {
  var times = new Array();
  var now = new Date();
  times[1] = now.format("yyyy-MM-dd hh") + ':59:59';//mEndTime.val() + ' 23:59:59';
  times[0] = dataAdd("h", -23, now).format("yyyy-MM-dd hh:00:00");//mStartTime.val() + ' 00:00:00';
  return times;
}

function selectchange() {
  arr = getDate();
  l_con = $('#l_con').val();
  r_con = $('#r_con').val();
  initChart(myChart, l_con, r_con, arr[0], arr[1], report_id, report_type, others);
}

function initTable(index, count, start_time, end_time, id, type) {
  var tid = "#plan-list";

  var data_type = checkedarr.join(',').substring(3);
  data_type = data_type.replace(/\([\u4e00-\u9fa5]\)/g, "");
  var order = mOrder.val();
  setTfoot(tid, spinLoader("数据加载中，请稍候..."));
  var index = parseInt(index) || 0;
  var count = parseInt(count) || 10;
  var param = null;
  var unit = null;
  var start_timedate = moment(start_time);
  var end_timedate = moment(end_time);
  var len = end_timedate.diff(start_timedate, 'days');
  if(len == 0) {
    unit = "小时";
  } else {
    unit = "小时";
  }

  function scb(r) {
    if(r.size == 0) {
      emptyTbody(tid);
      setTfoot(tid, stringLoadFail("没有数据"));
    } else {
      try {
        var total = r.total;
        var list = r.list;
        var pagenumber = Math.ceil(total / count);
        var rows = [];
        for(var i = 0; i < list.length; i++) {
          var item = list[i];
          var row = $("<tr></tr>");
          if(unit == "天") {
            row.append($("<td>" + moment(item.date_time).format("YYYY-MM-DD") + "</td>"));
          } else {
            row.append($("<td>" + moment(item.date_time).format("MM-DD HH:00") + "</td>"));
          }
          if(checkedarr.indexOf('竞价(次)') > -1) {
            row.append($("<td>" + item.bid + "</td>"));
          }
          if(checkedarr.indexOf('展现(次)') > -1) {
            row.append($("<td>" + item.imp + "</td>"));
          }
          if(checkedarr.indexOf('点击(次)') > -1) {
            row.append($("<td>" + item.click + "</td>"));
          }
          if(checkedarr.indexOf('点击率') > -1) {
            row.append($("<td>" + (item.ctr * 100).toFixed(3) + "%</td>"));
          }
          if(checkedarr.indexOf('CPC(元)') > -1) {
            row.append($("<td>" + item.cpc + "</td>"));
          }
          if(checkedarr.indexOf('CPM(元)') > -1) {
            row.append($("<td>" + item.cpm + "</td>"));
          }
          if(checkedarr.indexOf('花费(元)') > -1) {
            row.append($("<td>" + item.cost + "</td>"));
          }
          rows.push(row);
        }
        setTbody(tid, rows);
        setTfoot(tid, pagination(index, 5, pagenumber, function(t,
          e) {
          initTable(parseInt(t.hash.replace("#", "")), 10, arr[0], arr[1], report_id, report_type);
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
  if(type == ADCONSTANT.DASHBOARDCHOOSEID.PLAN) {
    param = {
      sinterface: SERVERCONF.DASHBOARD.REALTIMEPLANVIEW,
      data: {
        plan_id: id,
        index: index,
        count: count,
        start_time: start_time,
        end_time: end_time,
        unit: unit,
        data_type: data_type,
        order: order
      }
    };
  } else if(type == ADCONSTANT.DASHBOARDCHOOSEID.UNIT) {
    param = {
      sinterface: SERVERCONF.DASHBOARD.REALTIMEUNITVIEW,
      data: {
        unit_id: id,
        index: index,
        count: count,
        start_time: start_time,
        end_time: end_time,
        unit: unit,
        data_type: data_type,
        order: order
      }
    };
  } else if(type == ADCONSTANT.DASHBOARDCHOOSEID.IDEA) {
    param = {
      sinterface: SERVERCONF.DASHBOARD.REALTIMEIDEAVIEW,
      data: {
        idea_id: id,
        index: index,
        count: count,
        start_time: start_time,
        end_time: end_time,
        unit: unit,
        data_type: data_type,
        order: order
      }
    };
  } else {
    param = {
      sinterface: SERVERCONF.DASHBOARD.REALTIMEADUSERVIEW,
      data: {
        index: index,
        count: count,
        start_time: start_time,
        end_time: end_time,
        unit: unit,
        data_type: data_type,
        order: order
      }
    };
  }

  ajaxCall(param, function(err, data) {
    if(err) {
      ecb(err);
    } else {
      scb(data);
    }
  });
}

function initPlanFormDatetimePicker() {
  var now = new Date();
  $(".form_datetime").datetimepicker({
    format: "yyyy-mm-dd",
    weekStart: 1,
    endDate: now.format("yyyy-MM-dd"),
    autoclose: 1,
    startView: 2,
    minView: 2,
    maxView: 3,
    todayBtn: 1,
    todayHighlight: 1,
    language: "zh-CN",
    forceParse: 0,
  });
  mEndTime.val(now.format("yyyy-MM-dd"));
  mStartTime.val(now.format("yyyy-MM-dd"));
}

/**
 * custom
 */
$('#custom').webuiPopover({
  title: '自定义列',
  content: Context(),
  placement: 'right',
  closeable: true,
  width: '350px'
});

function Context() {
  var data = "<div><label class='checkbox-inline'><input type='checkbox'  value='date_time' checked='checked'disabled='true' >时间</label>" +
    "<label class='checkbox-inline'><input type='checkbox' name='checkbox' value='展现(次)' checked='checked'> 展现(次)</label>" +
    "<label class='checkbox-inline'><input type='checkbox' name='checkbox' value='点击(次)' checked='checked'> 点击(次)</label>" +
    "<label class='checkbox-inline'><input type='checkbox' name='checkbox' value='点击率' checked='checked'> 点击率</label>" +
    "<label class='checkbox-inline'><input type='checkbox' name='checkbox' value='CPC(元)' checked='checked'> CPC(元)</label>" +
    "<label class='checkbox-inline'><input type='checkbox' name='checkbox' value='CPM(元)' checked='checked'> CPM(元)</label>" +
    "<label class='checkbox-inline'><input type='checkbox' name='checkbox' value='花费(元)' checked='checked'>花费(元)</label>" +
    "</div>" +
    "<div class='btn-group' style='float:right'><button type='button' class='btn btn-primary btn-sm' id='canclebtn'>取消</button>" +
    "<button type='button' class='btn btn-primary btn-sm' style='margin-left: 10px' id='affirm'>确定</button>" +
    "</div>";
  return data;
}

$(document.body).on("click", "#canclebtn", function() {
  $('#custom').webuiPopover('hide');
});
/**
 *  createthread
 * @param arr
 * @returns
 */
function initTableth(arr) {
  var html = "";
  for(var i = 0; i < arr.length; i++) {
    var aa = arr[i];
    html = html + "<th>" + aa + "</th>";
  }
  $('thead .text-muted').html(html);
}
$(document.body).on("click", "#affirm", function() {
  var a = ['时间'];

  $("input[name='checkbox']:checkbox:checked").each(function() {
    var aa = $(this).val();
    a.push(aa);

  })
  checkedarr = a;
  initTableth(checkedarr);
  initTable(0, 10, arr[0], arr[1], report_id, report_type);
  $('#custom').webuiPopover('hide');
});