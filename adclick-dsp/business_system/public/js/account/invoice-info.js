/*
 * @file  invoice-info.js
 * @description invoice manage page js logic
 * @copyright dmtec.cn reserved, 2016
 * @author jiangtu
 * @date 2016.11.26
 * @version 0.0.1 
 */

'use strict';

!function(){
    var mTitle = null;
    var mTaxNo = null;
    var mAddress = null;
    var mTelephone = null;
    var mBank = null;
    var mBankNo = null;
    var mReceiverName = null;
    var mReceiverAddress = null;
    var mReceiverEmail = null;
    var mReceiverTelephone = null;
    var mInvoiceType = null;
    var mSort = null;
    
    var mErrMsg = null;
    // user role control
    var canOperate = false;
    
    var ck_status = ["通过", "提交中", "审查中", "审查失败"];
    function initStaticElement(){
        mTitle = $("#title");
        mTaxNo = $("#tax-no");
        mAddress = $("#address");
        mTelephone = $("#phone");
        mBank = $("#bank");
        mBankNo = $("#bank-account-no");
        mReceiverName = $("#receiver-name");
        mReceiverAddress = $("#receiver-address");
        mReceiverEmail = $("#receiver-email");
        mReceiverTelephone = $("#receiver-mobile");
        mInvoiceType = $("#invoice-type");
        mSort = $("#sort");
        
        mErrMsg = $('#err-msg');
    }
        
    function initContentOfInvoice() {
        loadInvoiceList();
    }

    function loadInvoiceList(index, count){
        var tid = "#invoice-list";
        emptyTbody(tid);
        setTfoot(tid, spinLoader("数据加载中，请稍候..."));
        var index = parseInt(index) || 0;
        var count = parseInt(count) || 10; 
        function ecb() {
           emptyTbody(tid);
           setTfoot(tid, stringLoadFail());
        }
        
        function scb(data){
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
                        row.attr("data-invoice-id", item.id);
                        row.append($("<td>" + item.title + "</td>"));
                        row.append($("<td>" + item.tax_no + "</td>"));
                        row.append($("<td>" + item.address + "</td>"));
                        row.append($("<td>" + item.phone + "</td>"));
                        row.append($("<td>" + ck_status[item.audit_status] + "</td>"));
                        if(item.audit_status == 3){
                            row.append($("<td>" + item.audit_message + "</td>"));
                        }else{
                            row.append($("<td>-</td>"));
                        }
                        
                        if (canOperate) {
                            var actions = $("<td></td>");
                            row.append(actions);
                            var edit = $("<button type=\"button\" class=\"btn btn-xs btn-link\">编辑</button>");
                            edit.attr("edit-btn-id", i);
                            edit.click(function(e) {
                                mErrMsg.html("");
                                $("#modal-invoice-form :text").val("");
                                $("#invoice-form-label").html("编辑发票信息");
                                var btn_id = $(this).attr("edit-btn-id");
                                mTitle.val(list[btn_id].title);
                                mTaxNo.val(list[btn_id].tax_no);
                                mAddress.val(list[btn_id].address);
                                mTelephone.val(list[btn_id].phone);
                                mBank.val(list[btn_id].bank);
                                mBankNo.val(list[btn_id].bank_account_no);
                                mReceiverName.val(list[btn_id].receiver_name);
                                mReceiverAddress.val(list[btn_id].receiver_address);
                                mReceiverEmail.val(list[btn_id].receiver_email);
                                mReceiverTelephone.val(list[btn_id].receiver_mobile);
                                mInvoiceType.val(list[btn_id].type);
                                mInvoiceType.prop("disabled", true);
                                
                                $("#modal-invoice-form").modal("show");
                                $("#submit-invoice-form").unbind("click");
                                $("#submit-invoice-form").click(function(e) {
                                    submitEditInvoiceForm(list[btn_id].id);
                                });
                            });
                            actions.append(edit);
                            var del = $("<button type=\"button\" class=\"btn btn-xs btn-link\">删除</button>");
                            del.click(function(e) {
                                var page_number = $(".pagination>li[class=active]").children().html();
                                var list_length = $("#invoice-list tbody>tr").length;
                                var id = $(this).parents("tr").attr("data-invoice-id")
                                confirm("确定要删除这条记录吗？", function(){
                                    var param = {
                                        sinterface : SERVERCONF.USERS.INVOICEDEL,
                                        data : {
                                            id: id
                                        }
                                    }
                                    ajaxCall(param, function(err, data){
                                        if(err){
                                            alert("未能成功删除");
                                        }else{
                                            if(page_number > 1 && list_length == 1){
                                                loadInvoiceList(page_number - 2);
                                            }else{
                                                loadInvoiceList(page_number - 1);
                                            }
                                        }
                                    })
                                })
                            });
                            actions.append(del);
                        }
                        rows.push(row);
                    }
                    setTbody(tid, rows);
                    setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                        loadInvoiceList(parseInt(t.hash.replace("#", "")));
                    }));
                } catch(e) {
                    ecb();
                }
           }        
            
        }
        var param = {
            sinterface: SERVERCONF.USERS.INVOICELIST,
            data : {
                index: index,
                count: count,
                sort: mSort.val()
            }
        };
        
        ajaxCall(param, function(err, data) {
            if (err) {
                ecb();
            }else {
                scb(data);      
            }
        });
    }

    function submitNewInvoiceForm() {
        var page_number = $(".pagination>li[class=active]").children().html();
        var title = mTitle.val();
        var tax_no = mTaxNo.val();
        var address = mAddress.val();
        var phone = mTelephone.val();
        var bank = mBank.val();
        var bank_account_no = mBankNo.val();
        var receiver_name = mReceiverName.val();
        var receiver_address = mReceiverAddress.val();
        var receiver_email = mReceiverEmail.val();
        var receiver_mobile = mReceiverTelephone.val();
        var type = mInvoiceType.val();
        if(title == ""){
            setInfoDiv(mErrMsg, "error","请输入发票抬头");
        }else if(tax_no == "" && type == "增值税专票"){
            setInfoDiv(mErrMsg, "error","增值税专票请输入发票税号");
        }else if(phone != "" && !isPhone(phone)){
            setInfoDiv(mErrMsg, "error", "公司电话有误，格式为区号+号码，如01088888888,010-88888888");
        }else if(bank == "" && type == "增值税专票"){
            setInfoDiv(mErrMsg, "error","增值税专票请输入银行");
        }else if(bank_account_no == "" && type == "增值税专票"){
            setInfoDiv(mErrMsg, "error","增值税专票请输入卡号");
        }else if(receiver_name == ""){
            setInfoDiv(mErrMsg, "error","请输入收票人姓名");
        }else if(receiver_address == ""){
            setInfoDiv(mErrMsg, "error","请输入收票地址");
        }else if(!isEmail(receiver_email)){
            setInfoDiv(mErrMsg, "error", "请输入正确邮箱");
        }else if(!isMobile(receiver_mobile)){
            setInfoDiv(mErrMsg, "error", "请输入正确收票联系电话");
        }else{
            var param = {
                sinterface : SERVERCONF.USERS.INVOICEADD,
                data: {
                    title: title,
                    tax_no: tax_no,
                    address: address,
                    phone: phone,
                    bank: bank,
                    bank_account_no: bank_account_no,
                    receiver_name: receiver_name,
                    receiver_address: receiver_address,
                    receiver_email: receiver_email,
                    receiver_mobile: receiver_mobile,
                    type: type
                }
            }
            
            ajaxCall(param, function(err, data){
                if(err){
                    setInfoDiv(mErrMsg, "info","发票添加失败");
                }else{
                    loadInvoiceList();
                    $("#modal-invoice-form").modal("hide");
                }
            });
        }

    }

    function submitEditInvoiceForm(invoice_id) {
        var page_number = $(".pagination>li[class=active]").children().html();
        
        var title = mTitle.val();
        var tax_no = mTaxNo.val();
        var address = mAddress.val();
        var phone = mTelephone.val();
        var bank = mBank.val();
        var bank_account_no = mBankNo.val();
        var receiver_name = mReceiverName.val();
        var receiver_address = mReceiverAddress.val();
        var receiver_email = mReceiverEmail.val();
        var receiver_mobile = mReceiverTelephone.val();
        var type = mInvoiceType.val();
        
        if(title == ""){
            setInfoDiv(mErrMsg, "error","请输入发票抬头");
        }else if(tax_no == "" && type == "增值税专票"){
            setInfoDiv(mErrMsg, "error","增值税专票请输入发票税号");
        }else if(phone != "" && !isPhone(phone)){
            setInfoDiv(mErrMsg, "error", "公司电话有误，格式为区号+号码，如01088888888,010-88888888");
        }else if(bank == "" && type == "增值税专票"){
            setInfoDiv(mErrMsg, "error","增值税专票请输入银行");
        }else if(bank_account_no == "" && type == "增值税专票"){
            setInfoDiv(mErrMsg, "error","增值税专票请输入卡号");
        }else if(receiver_name == ""){
            setInfoDiv(mErrMsg, "error","请输入收票人姓名");
        }else if(receiver_address == ""){
            setInfoDiv(mErrMsg, "error","请输入收票地址");
        }else if(!isEmail(receiver_email)){
            setInfoDiv(mErrMsg, "error", "请输入正确邮箱");
        }else if(!isMobile(receiver_mobile)){
            setInfoDiv(mErrMsg, "error", "请输入正确收票联系电话");
        }else{
            var param = {
                sinterface : SERVERCONF.USERS.INVOICEEDIT,
                data: {
                    id: invoice_id,
                    title: title,
                    tax_no: tax_no,
                    address: address,
                    phone: phone,
                    bank: bank,
                    bank_account_no: bank_account_no,
                    receiver_name: receiver_name,
                    receiver_address: receiver_address,
                    receiver_email: receiver_email,
                    receiver_mobile: receiver_mobile,
                }
            };
            
            ajaxCall(param, function(err, data){
                if(err){
                    alert("修改失败");
                }else{
                    loadInvoiceList(page_number - 1);
                    $("#modal-invoice-form").modal("hide");
                }
            });
        }  
    }

    $(function(){
        var role = sessionStorage.getItem('_role');
        var r = window._role[role] || false;
        if (r) {
          if (r.finance.invoice.enable && r.finance.invoice.write) {
            canOperate = true;
            $('#create-invoice').css('display', '');
            $('table tr').find('th:eq(6)').css('display', '');
          } else {
            $('#create-invoice').remove();
            $('table tr').find('th:eq(6)').remove(); // remove operate column
            $('#modal-invoice-form').remove();
          }
        }

        var current_tab = window.current_tab || "";
        if (current_tab == "userinvoice") {
            initStaticElement();
            initContentOfInvoice();
            $("#create-invoice").click(function(e) {
                mErrMsg.html("");
                $("#modal-invoice-form :text").val("");
                mInvoiceType.prop("disabled", false);
                $("#invoice-url").attr("href", "javascript:volid(0);")
                $("#invoice-form-label").html("新建发票信息");
                $("#modal-invoice-form").modal("show");
                $("#submit-invoice-form").unbind("click");
                $("#submit-invoice-form").click(submitNewInvoiceForm);
            });
            
            mSort.change(loadInvoiceList);
        }
    });

}();
