/*
 * @file  component.js
 * @description basic components
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.06
 * @version 0.0.1 
 */
 'use strict';

/*
config: [{"name": "a", "text": "b", "url": "/c"}, ...]
current: name of one of the items in config
*/
function initTabs(config, current) {
    var tabs = $("#tabs");
    var ul = $("<ul class=\"nav nav-tabs\"></ul>");
    tabs.append(ul);
    for (var i = 0; i < config.length; i++) {
        var item = config[i];
        if (item.text==''||item.text==null){
            var li = $("<li><a href=\"" + (item.url || "#") + "\">" + "<img src=\""+(item.src)+"\">"+ "</a></li>");
        }else{
            var li = $("<li><a id='" + item.name +"' href=\"" + (item.url || "#") + "\">" + (item.text || "")+ "</a></li>");
        }
        if (current == item.name) {
            li.addClass("active");
        }
        ul.append(li);
    }
}

function spinLoader(text) {
    return $("<div class=\"spin-loader\"><div><img src=\"/img/ripple.gif\"></div><div class=\"small text-muted\">" + (text || "") + "</div></div>");
}

function stringLoadFail(text) {
    return $("<div style=\"text-align:center;\" class=\"small text-muted\">" + (text || "数据加载失败, 请尝试刷新页面。") + "</div>");
}

/* table helpers */
function emptyTbody(id) {
    $(id).find("tbody").empty();
}

function emptyTfoot(id) {
    $(id).find("tfoot").empty();
}

function getTableCloumnNumber(id) {
    return $(id).find("thead>tr:first>th").length;
}

function setTbody(id, element) {
    emptyTbody(id);
    $(id).find("tbody").append(element);
}

function setTfoot(id, element) {
    emptyTfoot(id);
    var columns = getTableCloumnNumber(id);
    $(id).find("tfoot").append($("<tr><td colspan=\"" + columns + "\"></td></tr>"));
    $(id).find("tfoot>tr>td:first").append(element);
}

function pagination(index, range, total, callback) {
    var index = parseInt(index);
    var range = parseInt(range);
    var total = parseInt(total);
    var callback = callback || function(t, e) {console.log(t);};
    var pagination = $("<nav class=\"pull-right\"><ul class=\"pagination\"></ul> <ul class=\"pagination\"></ul></nav>");
    var first = index - Math.floor((range - 1) / 2);
    first = total - range < first ? total - range : first;
    first = first < 0 ? 0 : first;
    var last = first + range;
    last = last > total ? total : last;
    var items = [];
    items.push({text: "&laquo;", index: 0});
    items.push({text: "&lsaquo;", index: index - 1 < 0 ? 0 : index - 1});
    if (index == 0) {
        items[0].style = "disabled";
        items[1].style = "disabled";
    }
    for (var i = first; i < last; i++) {
        items.push({text: i + 1, index: i});
        if (i == index) {
            items[items.length - 1].style = "active";
        }
    }
    items.push({text: "&rsaquo;", index: index + 1 > last ? last : index + 1});
    items.push({text: "&raquo;", index: total - 1});
    if (index == total - 1) {
        items[items.length - 2].style = "disabled";
        items[items.length - 1].style = "disabled";
    }
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var li = $("<li><a href=\"#" + item.index + "\">" + item.text + "</a></li>");
        if (item.style) {
            li.addClass(item.style);
        } else {
            li.find("a").click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                callback(this, e);
            });
        }
        pagination.find("ul").eq(0).append(li);
    }
    
    var span = $("<span>共" + total +"页/第<input type='text' value='"+ (index+1) +"'>页<a href='#" + index + "' class='btn btn-primary btn-xs'>确定</a></span>");
    span.find("input").keyup(function(e){
        span.find("a").attr("href", "#" + ($(this).val()-1));
    });
    span.find("input").keydown(function(e){
        if(e.keyCode == 13){//enter key
           span.find("a").click();
        }
    })
  
    span.find("a").click(function(e){
        var page = parseInt(span.find("input").val());
        console.log(isPageNum(page, total));
        if(isPageNum(page, total) == 1){
            span.find("input").val(total);
            span.find("a").attr("href", "#" + (total-1));
            callback(this, e);
        }else if(isPageNum(page, total) == -1){
            span.find("input").val("1");
            span.find("a").attr("href", "#0");
            callback(this, e);
        }else{
            callback(this, e);
        }
    })
    pagination.find("ul").eq(1).append(span);

    return pagination;
}

function isPageNum(num, max_num){
    var re = /^[0-9]*[1-9][0-9]*$/;
    if(num > max_num){
        return 1;
    }else if(num <= 0){
        return -1;
    }else if(re.test(num) == true){
        return 0;
    }else{
        return -1;
    }
}
