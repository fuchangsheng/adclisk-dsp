/**
 * @author fu
 */
'use strict';
var mtimezone = null; // 时间选项框
var mtimezone_idea = null; // idea时间选项框
var mli_main_menu = null; // 广告计划
var mtotal_imp = null; // 整体展示量
var mother_total_imp = null; // idea
var mtotal_click = null; // 整体点击量
var mother_total_click; //
var mave_rate = null; // 平均点击率
var mother_ave_rate = null;
var mtotal_cost = null; // 花费
var mother_total_cost = null;
var mother_idea_name = null; //标头名
var mother_status = null; //状态
var mother_view = null; //详情展现
var mtop5_imp = null; // top5展示
var mtop5_click = null; // top5点击量
var mtop5_rate = null; // top5点击率
var mtop5_imp_unit = null; // unittop5展示
var mtop5_click_unit = null; // unittop5点击量
var mtop5_rate_unit = null; // unittop5点击率
var mtop5_imp_plan = null; // plantop5展示
var mtop5_click_plan = null; // plantop5点击量
var mtop5_rate_plan = null; // plantop5点击率
var myChart = null;
var myCart_other = null;
var option = null;
var ml_con = null;
var mr_con = null;
//树状值
var plandatalist = null;
var plani = 0;
! function() {
  $(function() {
    var role = sessionStorage.getItem('_role');
    var r = window._role[role] || false;
    if (r) {
      if (r.ad.unit.enable) {
        $('#unit_div').css('display', '');
      } else {
        $('#unit_div').remove();
      }
      
      if (r.ad.idea.enable) {
        $('#idea_div').css('display', '');
      } else {
        $('#idea_div').remove();
      }
    }
    
    initPageStaticElement();
    initMainMenu(); // 左侧广告列表
    initTimeZone(); // 下拉时间
    initShowdata(ADCONSTANT.DASHBOARDCHOOSEID.ALLIDEA, ADCONSTANT.DASHBOARDCHOOSEID.ALLIDEA, 0);
    var arr = getTimeZone(0);
    initChart(myChart, 3, 5, arr[0], arr[1]);
    initTop5(0);
  });

  function initPageStaticElement() {
    mtimezone = $('#timezone');
    mli_main_menu = $('#li_main_menu');
    mtotal_imp = $('#total_imp');
    mtotal_click = $('#total_click');
    mave_rate = $('#ave_rate');
    mtotal_cost = $('#total_cost');
    mtop5_imp = $('#top5_imp');
    mtop5_click = $('#top5_click');
    mtop5_rate = $('#top5_rate');
    mtop5_imp_unit = $('#top5_imp_unit');
    mtop5_click_unit = $('#top5_click_unit');
    mtop5_rate_unit = $('#top5_rate_unit');
    mtop5_imp_plan = $('#top5_imp_plan');
    mtop5_click_plan = $('#top5_click_plan');
    mtop5_rate_plan = $('#top5_rate_plan');
    myChart = echarts.init(document.getElementById('user_overall'));
    ml_con = $('#l_con');
    mr_con = $('#r_con');
  }

  function initMainMenu() {
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

  function initTimeZone() {
    var time = moment().format("YYYY-MM-DD");
    mtimezone.append("<option value='0' selected='selected' >今天:" + time +
      "</option>")
  }

  $("[data-toggle='tooltip']").tooltip();
}();

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
            //index : 0,
            //count : 10,
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
    //alert(id);
    changeidea(id, type);
  }
}

function initTop5(timezone) {
  var arr = getTimeZone(timezone);

  var param = {
    sinterface: SERVERCONF.DASHBOARD.IDEATOP,
    data: {
      start_time: arr[0],
      end_time: arr[1],
      data_type: "展现,点击,点击率",
      top: 5
    }
  };

  ajaxCall(param, function(err, data) {
    if(err) {
      ecb(err);
    } else {
      scb(data);
    }
  });

  function ecb(err) {
    if(err.code == 40002) {
      mtop5_click.html("暂无数据");
      mtop5_imp.html("暂无数据");
      mtop5_rate.html("暂无数据");
    } else {
      console.log("ideatop失败");
    }
  }

  function scb(data) {
    var imp = data.imp;
    var click = data.click;
    var click_rate = data.click_rate;
    var imphtml = "<table>";
    var clickhtml = "<table>";
    var click_ratehtml = "<table>";
    for(var i = 0; i < imp.length; i++) {
      imphtml = imphtml + "<tr><td>" + imp[i].idea_name + "</td><td>" + imp[i].imp_total + "次</td></tr>";
    }
    imphtml = imphtml + "</table>";
    for(var i = 0; i < click.length; i++) {
      clickhtml = clickhtml + "<tr><td>" + click[i].idea_name + "</td><td>" + click[i].click_total + "次</td></tr>";
    }
    clickhtml = clickhtml + "</table>";
    for(var i = 0; i < click_rate.length; i++) {
      click_ratehtml = click_ratehtml + "<tr><td>" + click_rate[i].idea_name + "</td><td>" + (click_rate[i].click_rate * 100).toFixed(2) + "%</td></tr>";
    }
    click_ratehtml = click_ratehtml + "</table>";
    mtop5_click.html(clickhtml);
    mtop5_imp.html(imphtml);
    mtop5_rate.html(click_ratehtml);
  }

  var param_unit = {
    sinterface: SERVERCONF.DASHBOARD.UNITTOP,
    data: {
      start_time: arr[0],
      end_time: arr[1],
      data_type: "展现,点击,点击率",
      top: 5
    }
  };

  ajaxCall(param_unit, function(err, data) {
    if(err) {
      ecb_unit(err);
    } else {
      scb_unit(data);
    }
  });

  function ecb_unit(err) {
    if(err.code == 40002) {
      mtop5_click_unit.html("暂无数据");
      mtop5_imp_unit.html("暂无数据");
      mtop5_rate_unit.html("暂无数据");
    } else {
      console.log("ideatop失败_unit");
    }
  }

  function scb_unit(data) {
    var imp = data.imp;
    var click = data.click;
    var click_rate = data.click_rate;
    var imphtml = "<table>";
    var clickhtml = "<table>";
    var click_ratehtml = "<table>";
    for(var i = 0; i < imp.length; i++) {
      imphtml = imphtml + "<tr><td>" + imp[i].unit_name + "</td><td>" + imp[i].imp_total + "次</td></tr>";
    }
    imphtml = imphtml + "</table>";
    for(var i = 0; i < click.length; i++) {
      clickhtml = clickhtml + "<tr><td>" + click[i].unit_name + "</td><td>" + click[i].click_total + "次</td></tr>";
    }
    clickhtml = clickhtml + "</table>";
    for(var i = 0; i < click_rate.length; i++) {
      click_ratehtml = click_ratehtml + "<tr><td>" + click_rate[i].unit_name + "</td><td>" + (click_rate[i].click_rate * 100).toFixed(2) + "%</td></tr>";
    }
    click_ratehtml = click_ratehtml + "</table>";
    mtop5_click_unit.html(clickhtml);
    mtop5_imp_unit.html(imphtml);
    mtop5_rate_unit.html(click_ratehtml);
  }

  var param_plan = {
    sinterface: SERVERCONF.DASHBOARD.PLANTOP,
    data: {
      start_time: arr[0],
      end_time: arr[1],
      data_type: "展现,点击,点击率",
      top: 5
    }
  };

  ajaxCall(param_plan, function(err, data) {
    if(err) {
      ecb_plan(err);
    } else {
      scb_plan(data);
    }
  });

  function ecb_plan(err) {
    if(err.code == 40002) {
      mtop5_click_plan.html("暂无数据");
      mtop5_imp_plan.html("暂无数据");
      mtop5_rate_plan.html("暂无数据");
    } else {
      console.log("ideatop_plan失败");
    }
  }

  function scb_plan(data) {
    var imp = data.imp;
    var click = data.click;
    var click_rate = data.click_rate;
    var imphtml = "<table>";
    var clickhtml = "<table>";
    var click_ratehtml = "<table>";
    for(var i = 0; i < imp.length; i++) {
      imphtml = imphtml + "<tr><td>" + imp[i].plan_name + "</td><td>" + imp[i].imp_total + "次</td></tr>";
    }
    imphtml = imphtml + "</table>";
    for(var i = 0; i < click.length; i++) {
      clickhtml = clickhtml + "<tr><td>" + click[i].plan_name + "</td><td>" + click[i].click_total + "次</td></tr>";
    }
    clickhtml = clickhtml + "</table>";
    for(var i = 0; i < click_rate.length; i++) {
      click_ratehtml = click_ratehtml + "<tr><td>" + click_rate[i].plan_name + "</td><td>" + (click_rate[i].click_rate * 100).toFixed(2) + "%</td></tr>";
    }
    click_ratehtml = click_ratehtml + "</table>";
    mtop5_click_plan.html(clickhtml);
    mtop5_imp_plan.html(imphtml);
    mtop5_rate_plan.html(click_ratehtml);
  }

}

function selectchange() {
  var timezone = $('#timezone').val();
  var l_con = $('#l_con').val();
  var r_con = $('#r_con').val();
  initShowdata(ADCONSTANT.DASHBOARDCHOOSEID.ALLIDEA, ADCONSTANT.DASHBOARDCHOOSEID.ALLIDEA, timezone);
  var arr = getTimeZone(timezone);
  initChart(myChart, l_con, r_con, arr[0], arr[1]);
  initTop5(timezone);
}

function other_selectchange() {
  var timezone_idea = $('#timezone_idea').val();
  var other_l_con = $('#other_l_con').val();
  var other_r_con = $('#other_r_con').val();
  var other_id = $('#other_id').val();
  var other_type = $('#other_type').val();
  var arr = getTimeZone(timezone_idea);
  initChart(myCart_other, other_l_con, other_r_con, arr[0], arr[1], other_id, other_type);
  initShowdata(other_id, other_type, timezone_idea);
}

function changeidea(id, type) {
  if(id != ADCONSTANT.DASHBOARDCHOOSEID.ALLIDEA) {
    $('#other_panel').removeClass('hidden');
    $('#main_panel').addClass('hidden');
    initIdeaStaticElement();
    initIdea(id, type);
  } else {
    $('#other_panel').addClass('hidden');
    $('#main_panel').removeClass('hidden');
  }

}

function initIdeaStaticElement() {
  mtimezone_idea = $('#timezone_idea');
  mother_total_imp = $('#other_total_imp');
  mother_total_click = $('#other_total_click');
  mother_ave_rate = $('#other_ave_rate');
  mother_total_cost = $('#other_total_cost');
  mother_idea_name = $('#other_idea_name_0');
  mother_status = $('#other_status');
  mother_view = $('#other_view');
}

function initShowdata(id, type, timezone) {
  var param = null;
  var arr = getTimeZone(timezone);
  if(type == ADCONSTANT.DASHBOARDCHOOSEID.ALLIDEA) {
    param = {
      sinterface: SERVERCONF.DASHBOARD.SUMMARY,
      data: {
        start_time: arr[0],
        end_time: arr[1],
        data_type: '展现,点击,点击率,花费'
      }
    };
  } else if(type == ADCONSTANT.DASHBOARDCHOOSEID.IDEA) {
    param = {
      sinterface: SERVERCONF.DASHBOARD.IDEASUMMARY,
      data: {
        idea_id: id,
        start_time: arr[0],
        end_time: arr[1],
        data_type: '展现,点击,点击率,花费'
      }
    };
  } else if(type == ADCONSTANT.DASHBOARDCHOOSEID.UNIT) {
    param = {
      sinterface: SERVERCONF.DASHBOARD.UNITSUMMARY,
      data: {
        unit_id: id,
        start_time: arr[0],
        end_time: arr[1],
        data_type: '展现,点击,点击率,花费'
      }
    };
  } else if(type == ADCONSTANT.DASHBOARDCHOOSEID.PLAN) {
    param = {
      sinterface: SERVERCONF.DASHBOARD.PLANSUMMARY,
      data: {
        plan_id: id,
        start_time: arr[0],
        end_time: arr[1],
        data_type: '展现,点击,点击率,花费'
      }
    };
  }

  function ecb() {
    console.log("dashboardsummary获取失败");

  }

  function scb(data) {
    if(data.size == 0) {
      console.log("dashboardsummary数据为空");
    } else {
      if(id == ADCONSTANT.DASHBOARDCHOOSEID.ALLIDEA) {
        mtotal_imp.html(data.imp == null ? 0 : data.imp);
        mtotal_click.html(data.click == null ? 0 : data.click);
        mave_rate.html(data.click_rate == null ? 0 : (data.click_rate.toFixed(2) + "%"));
        mtotal_cost.html(data.cost == null ? 0 : data.cost);
      } else {
        mother_total_imp.html(data.imp == null ? 0 : data.imp);
        mother_total_click.html(data.click == null ? 0 : data.click);
        mother_ave_rate.html(data.click_rate == null ? 0 : (data.click_rate.toFixed(2) + "%"));
        mother_total_cost.html(data.cost == null ? 0 : data.cost);
      }

    }

  }

  ajaxCall(param, function(err, data) {
    if(err) {
      ecb();
    } else {
      scb(data);
    }
  });

}

function initIdeaCon(id, type) {
  var param = null;
  if(type == ADCONSTANT.DASHBOARDCHOOSEID.IDEA) {
    var param = {
      sinterface: SERVERCONF.ADS.IDEAVIEW,
      data: {
        idea_id: id
      }
    }
  } else if(type == ADCONSTANT.DASHBOARDCHOOSEID.UNIT) {
    var param = {
      sinterface: SERVERCONF.ADS.UNITVIEW,
      data: {
        unit_id: id
      }
    }
  } else if(type == ADCONSTANT.DASHBOARDCHOOSEID.PLAN) {
    var param = {
      sinterface: SERVERCONF.ADS.PLANVIEW,
      data: {
        plan_id: id
      }
    }
  }

  function ecb() {
    console.log(err.msg);
  }

  function scb(data) {
    if(type == ADCONSTANT.DASHBOARDCHOOSEID.IDEA) {
      mother_idea_name.text(data.idea_name);
      mother_status.html("投放状态：<span>" + data.idea_status + "</span>");
      var html = "<h4><strong>广告详情</strong></h4>";
      for(var i in data) {
        var temp = data[i];
        switch(i) {
          case "idea_id":
            html = html + "<input id='other_id' type='hidden' value='" + temp + "'>" +
              "<input id='other_type' type='hidden' value='idea_id'>";
            break;
          case "plan_name":
            html = html + "<div class='info'><span class='item'>所属计划名称：</span><span class='itemcon'>" + temp + "</span></div>";
            break;
          case "unit_name":
            html = html + "<div class='info'><span class='item'>所属单元名称：</span><span class='itemcon'>" + temp + "</span></div>";
            break;
          case "idea_name":
            html = html + "<div class='info'><span class='item'>创意名称：</span><span class='itemcon'>" + temp + "</span></div>";
            break;
          case "ide_type":
            html = html + "<div class='info'><span class='item'>创意类型：</span><span class='itemcon'>" + temp + "</span></div>";
            break;
          case "land_page":
            html = html + "<div class='info'><span class='item'>落地页：</span><span class='itemcon'>" + temp + "</span></div>";
            break;
          case "adview_type":
            html = html + "<div class='info'><span class='item'>流量类型：</span><span class='itemcon'>" + temp + "</span></div>";
            break;
          case "idea_slots":
            var idea_slotshtml = "<ul>";
            for(var j = 0; j < temp.length; j++) {
              idea_slotshtml = idea_slotshtml + "<li>" + temp[j].type + "</li>";
            }
            idea_slotshtml = idea_slotshtml + "</ul>";
            html = html + "<div class='info'><span class='item'>广告位置：</span><div class='itemcon'>" + idea_slotshtml + "</div></div>";
            break;
          case "imp_monitor_urls":
            var imp_monitor_urlshtml = "<ul>";
            for(var j = 0; j < temp.length; j++) {
              imp_monitor_urlshtml = imp_monitor_urlshtml + "<li>" + temp[j] + "</li>";
            }
            imp_monitor_urlshtml = imp_monitor_urlshtml + "</ul>";
            html = html + "<div class='info'><span class='item'>展现监控：</span><span class='itemcon'>" + imp_monitor_urlshtml + "</span></div>";
            break;
          case "click_monitor_urls":
            var click_monitor_urlshtml = "<ul>";
            for(var j = 0; j < temp.length; j++) {
              click_monitor_urlshtml = click_monitor_urlshtml + "<li>" + temp[j] + "</li>";
            }
            click_monitor_urlshtml = click_monitor_urlshtml + "</ul>";
            html = html + "<div class='info'><span class='item'>点击监控：</span><span class='itemcon'>" + click_monitor_urlshtml + "</span></div>";
            break;
        }
      }
      mother_view.html(html);
    } else if(type == ADCONSTANT.DASHBOARDCHOOSEID.UNIT) {
      mother_idea_name.text(data.unit_name);
      mother_status.html("投放状态：<span>" + data.unit_status + "</span>");
      var html = "<h4><strong>单元详情</strong></h4>";
      for(var i in data) {
        var temp = data[i];
        switch(i) {
          case "unit_id":
            html = html + "<input id='other_id' type='hidden' value='" + temp + "'>" +
              "<input id='other_type' type='hidden' value='unit_id'>";;
            break;
          case "plan_name":
            html = html + "<div class='info'><span class='item'>所属计划名称：</span><span class='itemcon'>" + temp + "</span></div>";
            break;
          case "unit_name":
            html = html + "<div class='info'><span class='item'>单元名称：</span><span class='itemcon'>" + temp + "</span></div>";
            break;
          case "bid":
            html = html + "<div class='info'><span class='item'>出价：</span><span class='itemcon'>" + temp + "元</span></div>";
            break;
          case "bid_type":
            html = html + "<div class='info'><span class='item'>出价类型：</span><span class='itemcon'>" + temp + "</span></div>";
            break;
        }
      }
      mother_view.html(html);
    } else if(type == ADCONSTANT.DASHBOARDCHOOSEID.PLAN) {
      mother_idea_name.text(data.plan_name);
      mother_status.html("投放状态：<span>" + data.plan_status + "</span>");
      var html = "<h4><strong>计划详情</strong></h4>";
      for(var i in data) {
        var temp = data[i];
        switch(i) {
          case "plan_id":
            html = html + "<input id='other_id' type='hidden' value='" + temp + "'>" +
              "<input id='other_type' type='hidden' value='plan_id'>";;
            break;
          case "plan_name":
            html = html + "<div class='info'><span class='item'>计划名称：</span><span class='itemcon'>" + temp + "</span></div>";
            break;
          case "start_time":
            html = html + "<div class='info'><span class='item'>开始时间：</span><span class='itemcon'>" + temp + "</span></div>";
            break;
          case "end_time":
            html = html + "<div class='info'><span class='item'>结束时间：</span><span class='itemcon'>" + temp + "</span></div>";
            break;
          case "budget":
            html = html + "<div class='info'><span class='item'>投放预算：</span><span class='itemcon'>" + temp + "元</span></div>";
            break;
        }
      }
      mother_view.html(html);
    }
  }
  ajaxCall(param, function(err, data) {
    if(err) {
      ecb(err);
    } else {
      scb(data);
    }
  });
}

function initIdea(id, type) {
  myCart_other = echarts.init(document.getElementById('user_overall_other'));
  var time = moment().format("YYYY-MM-DD");
  $("#timezone_idea option[value='0']").text('今天:' + time);
  var timezone = 0;
  if(type == ADCONSTANT.DASHBOARDCHOOSEID.ALLIDEA) {
    timezone = $('#timezone').val();
  } else {
    timezone = $('#timezone_idea').val();
  }
  initShowdata(id, type, timezone);
  initIdeaCon(id, type);
  var arr = getTimeZone(timezone);
  var other_l_con = $('#other_l_con').val();
  var other_r_con = $('#other_r_con').val();
  initChart(myCart_other, other_l_con, other_r_con, arr[0], arr[1], id, type);
}

function getTimeZone(timezone) {
  var arr = new Array();
  var start_time = "";
  var end_time = "";
  if(timezone == 0) {
    start_time = moment().format('YYYY-MM-DD 00:00:00');
    end_time = moment().format('YYYY-MM-DD HH:mm:ss');
    //start_time="2016-12-02 00:00:00";
    //end_time="2016-12-02 23:59:59";
  } else if(timezone == 1) {
    start_time = moment().subtract(timezone, 'days').format(
      'YYYY-MM-DD 00:00:00');
    end_time = moment().subtract(timezone, 'days').format(
      'YYYY-MM-DD 23:59:59');
  } else {
    start_time = moment().subtract(timezone, 'days').format(
      'YYYY-MM-DD 00:00:00');
    end_time = moment().format('YYYY-MM-DD HH:mm:ss');
  }
  arr.push(start_time);
  arr.push(end_time);
  return arr;
}