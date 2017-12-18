/*
 * @file  invoice.js
 * @description invoice data process
 * @copyright dmtec.cn reserved, 2016
 * @author LiXingxin
 * @date 2016.11.28
 * @version 0.0.1 
 */

'use strict';
var userDataList = null;
!function(){   
    var tid = "#finvoice-list";

    $(function() {
        initUserList(loadRecordList);
        changeButtonStyle();
        $('#sort').change(loadRecordList);
    });

    function changeButtonStyle(){
        $('.select-btn').click(function(){
            $(this).addClass("btn-primary");
            $(this).siblings().removeClass("btn-primary")
        });
    }

    function loadRecordList(index, count) {
        emptyTbody(tid);
        setTfoot(tid, spinLoader("数据加载中，请稍候..."));
        var index = parseInt(index) || 0;
        var count = parseInt(count) || 10;
        var userId = choosed_user_id;
        if (true) {}
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
                        row.append($("<td>" + item.date + "</td>"));
                        row.append($("<td>" + item.title+"</td>"));
                        row.append($("<td>" + item.item + "</td>"));
                        row.append($("<td>" + item.amount + "</td>"));
                        row.append($("<td>" + item.status + "</td>"));
                        row.append($("<td>" + item.operator + "</td>"));
                        row.append($("<td>" + item.notes + "</td>"));
                        var actions = $("<td></td>");
                        row.append(actions);
                        if (item.status === "提交中" || item.status === "处理中" || item.status === "已开票") {
                            var edit = $("<button type=\"button\" class=\"btn btn-xs btn-link\">操作</button>");
                            edit.attr("edit-btn-id", i);
                            edit.click(function() {
                                var btn_id = $(this).attr("edit-btn-id");
                                var record = list[btn_id];
                                var st = record.status;
                                if (st === "提交中") {
                                    invoiceAudit(record, userId);
                                } else if (st === "处理中") {
                                    invoiceProcess(record, userId);
                                } else if (st === "已开票") {
                                    invoiceDeliver(record, userId);
                                }
                            });
                            actions.append(edit);
                        }
                        if (item.status === "已签收") {
                            var finish = $("<button type=\"button\" class=\"btn btn-xs btn-link\">完成</button>");
                            finish.attr("fin-btn-id", i);
                            finish.click(function() {
                                var btn_id = $(this).attr("fin-btn-id");
                                var record = list[btn_id];
                                invoiceFinish(record, userId);
                            });
                            actions.append(finish);
                        }
                        rows.push(row);
                    }
                    setTbody(tid, rows);
                    setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                        loadRecordList(parseInt(t.hash.replace("#", "")));
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
        var invoiceData = {
            user_id: userId,
            index: index,
            count: count,
            sort: $('#sort').val()
        };
        var param = {
            sinterface: SERVERCONF.ACCOUNT.INVOICERECORDS,
            data: invoiceData
        };
        ajaxCall(param, function(err, data) {
            if (err) {
                ecb();
            } else {
                scb(data);
            }
        });
    }

    function invoiceFinish(record, userId) {
        var data = {
            ticket_id: [record.ticket_id]
        };
        var param = {
            sinterface: SERVERCONF.ACCOUNT.INVOICEFINISH,
            data: data
        };
        ajaxCall(param, function(err, data) {
            if (err) {
                alert('完成开票失败!');
            } else {
                loadRecordList();
            }
        });
    }

    function invoiceAudit(record, userId) {
        $(".alert").remove();
        $("#audit-form-label").html("开票审核");
        $("#modal-audit-form").modal("show");
        $("#audit-not-pass").click(function() {
            $("#note-panel").show();
        });
        $("#audit-pass").click(function() {
            $("#note-panel").hide();
        });
        $("#submit-audit-form").unbind("click");
        $("#submit-audit-form").click(function(){
            var auditResult = $("#audit-form-modal-body input[class*=btn-primary]").val();
            var note = $("#input-note").val();
            if (auditResult === "审核通过") {
                note = '';
            }else if(auditResult === "审核失败" && note == ""){
                alert("请输入失败原因");
                return;
            }
            var data = {
                ticket_id: [record.ticket_id],
                audit: auditResult,
                message: note
            }
            var param = {
                sinterface: SERVERCONF.ACCOUNT.INVOICEAUDIT,
                data: data
            };
            ajaxCall(param, function(err, data) {
                if (err) {
                    alert('审核结果提交失败');
                } else {
                    $("#modal-audit-form").modal("hide");
                    loadRecordList();
                }
            })
        });
    }

    function invoiceProcess(record, userId) {
        $(".alert").remove();
        $("#process-form-label").html("开具发票");
        $("#modal-process-form").modal("show");
        $("#submit-process-form").unbind("click");
        $("#submit-process-form").click(function(){
            var taxInfoTicket = $("#input-ticket-id").val();
            var data = {
                ticket_id: record.ticket_id,
                tax_info_ticket: taxInfoTicket
            };
            if(taxInfoTicket == ""){
                alert("请填入发票号");
                return;
            }
            var param = {
                sinterface: SERVERCONF.ACCOUNT.INVOICEPROCESS,
                data: data
            };
            ajaxCall(param, function(err, data) {
                if (err) {
                     alert('开票失败');
                } else {
                    $("#modal-process-form").modal("hide");
                    loadRecordList();
                } 
            });
        });
    }

    function invoiceDeliver(record, userId) {
        $(".alert").remove();
        $("#deliver-form-label").html("发票快递");
        $("#modal-deliver-form").modal("show");
        $("#submit-deliver-form").unbind("click");
        $("#submit-deliver-form").click(function(){
            var postName = $('#input-deliver-name').val();
            var postId = $('#input-deliver-id').val();
            var data = {
                ticket_id: record.ticket_id,
                post_name: postName,
                post_id: postId
            };
            if(postName == "" || postId == ""){
               alert("快递名称和快递单号不能为空");
               return;
            }
            var param = {
                sinterface: SERVERCONF.ACCOUNT.INVOICEDELIVER,
                data: data
            };
            ajaxCall(param, function(err, data) {
                if (err) {
                    alert('发票快递信息提交失败');
                } else {
                    $("#modal-deliver-form").modal("hide");
                    loadRecordList();
                }
            });
        });
    }
}();
