function loadConversionList(index, count) {
    emptyTbody("#conversion-detail");
    $("#choosed-idea-name").html("");
    var tid = "#conversion";
    emptyTbody(tid);
    setTfoot(tid, spinLoader("数据加载中，请稍候..."));
    var index = parseInt(index) || 0;
    var count = parseInt(count) || 200;
    function ecb() {
        emptyTbody(tid);
        setTfoot(tid, stringLoadFail());
    }
    function scb(data) {
        if (data.size === 0) {
            setTfoot(tid, stringLoadFail("没有数据"));
        } else {
            try {
                var total = data.total;
                var list = data.list;
                dsp_data = data.list;
                var pagenumber = Math.ceil(total / count);
                var rows = [];
                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
                    var row = $("<tr></tr>");
                    row.attr("data-idea-id", item.idea_id);
                    row.attr("data-idea-name", item.idea_name);
                    row.append($("<td>" + item.user_name + "</td>"));
                    row.append($("<td>" + item.idea_name + "</td>"));
                    if(item.os === 1){
                        row.append($("<td>IOS</td>"));
                    }else if(item.os === 2){
                        row.append($("<td>ANDROID</td>"));
                    }else{
                        row.append($("<td>-</td>"));
                    }
                    if(item.position === 1){
                        row.append($("<td>首页通栏</td>"));
                    }else if(item.position === 2){
                        row.append($("<td>播放页底层</td>"));
                    }else if(item.position === 3){
                        row.append($("<td>移动前贴片</td>"));
                    }else{
                        row.append($("<td>-</td>"));
                    }
                    row.append($("<td>" + item.imp + "</td>"));
                    row.append($("<td>" + item.click + "</td>"));
                    row.append($("<td>" + ((item.click/item.imp)*100).toFixed(2) + "%</td>"));
                    row.append($("<td>" + item.conversion + "</td>"));
                    row.append($("<td>" + ((item.conversion/item.click)*100).toFixed(2) + "%</td>"));
                    row.append($("<td>" + ((item.imp/1000)/item.conversion).toFixed(2) + "</td>"));
                    if(item.price_type === 1){
                        row.append($("<td>" + (item.imp/1000*item.price).toFixed(2) + "</td>"));
                        row.append($("<td>" + item.price + "</td>"));
                    }else{
                        row.append($("<td>" + item.conversion*item.price + "</td>"));
                        row.append($("<td>" + (item.conversion*item.price/item.imp*1000).toFixed(2) + "</td>"));
                    }
                    var action = $("<td></td>");
                    row.append(action);
                    var detail = $("<button type='button' class='btn btn-xs btn-link'>查看分时数据</button>");
                    detail.click(function(){
                        choosed_idea_id = parseInt($(this).parents("tr").attr("data-idea-id"));
                        $("#choosed-idea-name").html($(this).parents("tr").attr("data-idea-name"));
                        loadConversionListDetail();
                    });
                    action.append(detail);
                    var price = null;
                    if(item.price_type === 1){
                        price = $("<td>" + item.price + "(CPM) </td>");
                    }else{
                        price = $("<td>" + item.price + "(CPA) </td>");
                    }
                    row.append(price);
                    var set = $("<a class='price-edit'>设置</a>");
                    set.click(function(){
                        $("#price-modal").modal("show");
                        $("#price").val("");
                        setPrice(parseInt($(this).parents("tr").attr("data-idea-id")));
                    });
                    price.append(set);
                    rows.push(row);
                }
                setTbody(tid, rows);
                setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                    loadConversionList(parseInt(t.hash.replace("#", "")));
                }));
            } catch (e) {
                ecb();
            }
        }
    }

    var data = {
        index : index,
        count : count,
        date: $('#date').val()
    };
    var price_type = parseInt($("#f-price-type").val());
    var os = parseInt($("#f-os").val());
    var position = parseInt($("#f-position").val());
    if(price_type){
        data.price_type = price_type;
    }
    if(os){
        data.os = os;
    }
    if(position){
        data.position = position;
    }

    var param = {
        sinterface : {
            path: '/v1/ad/conversion/listall2',
            method: 'GET'
        },
        data : data
    };

    ajaxCall(param, function(err, data) {
        if (err) {
            ecb();
        } else {
            scb(data);
        }
    });
}

function loadConversionListDetail(index, count) {
    var tid = "#conversion-detail";
    emptyTbody(tid);
    setTfoot(tid, spinLoader("数据加载中，请稍候..."));
    var index = parseInt(index) || 0;
    var count = parseInt(count) || 24;
    function ecb() {
        emptyTbody(tid);
        setTfoot(tid, stringLoadFail());
    }
    function scb(data) {
        if (data.size === 0) {
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
                    row.attr("data-idea-id", item.idea_id);
                    row.append($("<td>" + (new Date(item.date_hour)).format("YYYY-MM-dd hh:00:00") + "</td>"));
                    row.append($("<td>" + item.imp + "</td>"));
                    row.append($("<td>" + item.click + "</td>"));
                    row.append($("<td>" + ((item.click/item.imp)*100).toFixed(2) + "%</td>"));
                    row.append($("<td>" + item.conversion + "</td>"));
                    row.append($("<td>" + ((item.conversion/item.click)*100).toFixed(2) + "%</td>"));
                    row.append($("<td>" + ((item.imp/1000)/item.conversion).toFixed(2) + "</td>"));
                    rows.push(row);
                }
                setTbody(tid, rows);
                setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                    loadConversionList(parseInt(t.hash.replace("#", "")));
                }));
            } catch (e) {
                ecb();
            }
        }
    }

    var param = {
        sinterface : {
            path: '/v1/ad/conversion/listall2/detail',
            method: 'GET'
        },
        data : {
            index : index,
            count : count,
            date: $('#date').val(),
            idea_id: choosed_idea_id,
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

function download(){
    var param = {
        sinterface : {
            path: '/v1/ad/conversion/listall2/download',
            method: 'GET'
        },
        data : {
            dsp_data: dsp_data
        }
    };

    ajaxCall(param, function(err, data) {
        if (err) {
            alert("下载失败");
        } else {
            try {
              var elemIF = document.createElement("a");
              elemIF.download = '';
              elemIF.href = data.filename;
              elemIF.style.display = "none";
              //document.body.appendChild(elemIF);
              elemIF.click();
            } catch(e) {

            }
        }
    });
}

function setPrice(idea_id){
    $("#price-submit-btn").unbind("click");
    $("#price-submit-btn").click(function(){
        var param = {
            sinterface : {
                path: '/v1/ad/conversion/setprice',
                method: 'POST'
            },
            data : {
                idea_id: idea_id,
                type: parseInt($("#price-type").val()),
                price: parseInt(parseFloat($("#price").val())*100)
            }
        };

        ajaxCall(param, function(err, data) {
            if (err) {
                console.log("fail to set price for " + idea_id);
            } else {
                $("#price-modal").modal("hide");
                loadConversionList();
            }
        });
    });
}

// /////////////////////////////////////////////////////////////////////////////////

function loadAdxDataList(index, count) {
    emptyTbody("#adx-data-detail");
    $("#choosed-adx-name").html("");
    var tid = "#adx-data-list";
    emptyTbody(tid);
    setTfoot(tid, spinLoader("数据加载中，请稍候..."));
    var index = parseInt(index) || 0;
    var count = parseInt(count) || 200;
    function ecb() {
        emptyTbody(tid);
        setTfoot(tid, stringLoadFail());
    }

    function scb(data){
        if (data.size === 0) {
            setTfoot(tid, stringLoadFail("没有数据"));
        } else {
            try {
                var total = data.total;
                var list = data.list;
                var pagenumber = Math.ceil(total / count);
                var rows = [];
                for(var i = 0; i < list.length; i++){
                    var item = list[i];
                    var row = $("<tr></tr>");
                    row.attr("data-dsp-id", item.dsp_id);
                    row.attr("data-dsp-name", item.name);
                    row.append($("<td>" + item.dsp_id + "</td>"));
                    row.append($("<td>" + item.name + "</td>"));
                    row.append($("<td>" + item.imp + "</td>"));
                    row.append($("<td>" + item.click + "</td>"));
                    row.append($("<td>" + (item.click/item.imp*100).toFixed(2) + "%</td>"));
                    row.append($("<td>" + item.cost + "</td>"));
                    row.append($("<td>" + item.revenue + "</td>"));
                    var action = $("<td></td>");
                    row.append(action);
                    var detail = $("<button type='button' class='btn btn-xs btn-link'>查看分时数据</button>");
                    detail.click(function(){
                        choosed_dsp_id = parseInt($(this).parents("tr").attr("data-dsp-id"));
                        $("#choosed-adx-name").html($(this).parents("tr").attr("data-dsp-name"));
                        loadAdxDataDetailList();
                    });
                    action.append(detail);
                    rows.push(row);
                }
                setTbody(tid, rows);
                setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                    loadConversionList(parseInt(t.hash.replace("#", "")));
                }));
            }catch (e) {
                ecb();
            }
        }
    }

    var data = {
        index : index,
        count : count,
        start_time: $('#adx-date').val() + " 00:00:00",
        end_time: $('#adx-date').val() + " 23:59:59"
    };

    var param = {
        sinterface : {
            path: '/v1/adx/conversion/list',
            method: 'GET'
        },
        data : data
    };

    ajaxCall(param, function(err, data) {
        if (err) {
            ecb();
        } else {
            scb(data);
        }
    });
}

function loadAdxDataDetailList(index, count) {
    var tid = "#adx-data-detail";
    emptyTbody(tid);
    setTfoot(tid, spinLoader("数据加载中，请稍候..."));
    var index = parseInt(index) || 0;
    var count = parseInt(count) || 24;
    function ecb() {
        emptyTbody(tid);
        setTfoot(tid, stringLoadFail());
    }

    function scb(data) {
        if (data.size === 0) {
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
                    row.append($("<td>" + item.date + "</td>"));
                    row.append($("<td>" + item.imp + "</td>"));
                    row.append($("<td>" + item.click + "</td>"));
                    row.append($("<td>" + ((item.click/item.imp)*100).toFixed(2) + "</td>"));
                    row.append($("<td>" + item.cost + "</td>"));
                    row.append($("<td>" + item.revenue + "</td>"));
                    rows.push(row);
                }
                setTbody(tid, rows);
                setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                    loadConversionList(parseInt(t.hash.replace("#", "")));
                }));
            } catch (e) {
                ecb();
            }
        }
    }

    var param = {
        sinterface : {
            path: '/v1/adx/conversion/detail',
            method: 'GET'
        },
        data : {
            index : index,
            count : count,
            start_time: $('#adx-date').val() + " 00:00:00",
            end_time: $('#adx-date').val() + " 23:59:59",
            dsp_id: choosed_dsp_id,
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

var choosed_idea_id = null;
var choosed_dsp_id = null;
var dsp_data = [];
$(function(){
    $("#show-dsp-data").click(function(){
        $("#dsp-data").removeClass("hidden");
        $("#adx-data").addClass("hidden");
        $(this).addClass("active").siblings().removeClass("active");
    });
    $("#show-adx-data").click(function(){
        $("#adx-data").removeClass("hidden");
        $("#dsp-data").addClass("hidden");
        $(this).addClass("active").siblings().removeClass("active");
    });
    var date = new Date();
    $('#date').val(date.format('YYYY-MM-dd'));
    $("#adx-date").val(date.format('YYYY-MM-dd'));

    //dsp
    $('#conversion-btn').click(function(){
        loadConversionList();
    });
    loadConversionList();
    $("#download").click(function(){
        download();
    });

    //adx-dsp
    $('#adx-data-btn').click(function(){
        loadAdxDataList();
    });
});
