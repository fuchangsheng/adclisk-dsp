/*
 * @file  account_invoice.js
 * @description account invoice html page js logic
 * @copyright dmtec.cn reserved, 2016
 * @author Andy.zhou
 * @date 2016.11.17
 * @version 0.0.1 
 * @requires account/invoice.html
 * @requires js/constants.js
 * @requires js/tool.js
 * @requires js/component.js
 */
'use strict';

!function () {
    // page static elements
    var mInvoiceSelect = null;
    var mAddInvoiceBtn = null;
    var mEditInvoiceBtn = null;
    var mInvoiceTitleIpt = null;
    var mGeneralTypeRadio = null;
    var mSpecialTypeRadio = null;
    var mInvoiceItemList = null;
    var mInvoiceAmountInput = null;
    var mUnInvoiceAmountSpn = null;
    var mContactorName = null;
    var mContactorEmail = null;
    var mContactorAddr = null;
    var mContactorTel = null;
    var mAlert = null;
    var mSubmitBtn = null;
    var mSpeTax = null;
    var mSort = null;

    //page variables
    var mInvoiceList = [];
    var mSelectInvoice = null;
    var mUnInvoiceAmount = 0;

    // user role control
    var canOperate = false;

    /////////////////////////////////////////////////////////////////
    // on page load
    ////////////////////////////////////////////////////////////////
    
    $(function(){
        var role = sessionStorage.getItem('_role');
        var r = window._role[role] || false;
        if (r) {
          if (r.finance.draw.enable && r.finance.draw.write) {
            canOperate = true;
            $('table tr').find('th:eq(7)').css('display', '');
            $('#billing').css('display', '');
          } else {
            $('#billing').remove();
            $('table tr').find('th:eq(7)').remove(); // remove operate column
          }
        }

        initPageStaticElements();

        registerCB();

        onPageload();
        
        mSort.change(loadRecordList);
        
        $('[data-toggle="tooltip"]').tooltip();
    });

    /** @description init the page static element ids
     *  @memberOf module: account
    */
    function initPageStaticElements() {
        mInvoiceSelect = $('#invoice-list');
        mAddInvoiceBtn = $('#addInvoice');
        mEditInvoiceBtn = $('#editInvoice');
        mInvoiceTitleIpt = $('#invoice-title');
        mGeneralTypeRadio = $('#genTax');
        mSpecialTypeRadio = $('#speTax');
        mInvoiceItemList = $('#item-list');
        mInvoiceAmountInput = $('#invoice-amount');
        mUnInvoiceAmountSpn = $('#uninvoiced-amount');
        mContactorName = $('#contactor-name');
        mContactorEmail = $('#contactor-email');
        mContactorAddr = $('#contactor-address');
        mContactorTel = $('#contactor-tel');
        mAlert = $('#alert');
        mSubmitBtn = $('#submit');
        mSpeTax = $('#speTax');
        mSort = $('#sort');

    }

    /** @description do some work on page load
     *  @memberOf module:account/records.html
     *
    */
    function onPageload() {
        loadRecordList();
        loadInvoiceInfo();
        loadUnInvoiceAmount();
    }

    /** @description register the callbacks of elements
     *  @memberOf module:account/records.html
     *
    */
    function registerCB() {
        mInvoiceSelect.change(invoiceSelectChangeCallback);
        mSubmitBtn.click(invoiceRequestSubmit);
    }

    /////////////////////////////////////////////////////////////////
    // local functions
    ////////////////////////////////////////////////////////////////
    /** @description get the finacial invoice records and render the page
     *  @memberOf module:account/invoice.html
     *  @param {int} index - page index; 
     *  @param {int} page item counts
    */
    function loadRecordList(index, count) {
        console.log('To request the invoice log');
        var tid = "#finvoice-list";
        setTfoot(tid, spinLoader("数据加载中，请稍候..."));
        var index = parseInt(index) || 0;
        var count = parseInt(count) || 10;
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
                        row.attr("data-id", item.id);
                        row.append($("<td>" + item.date + "</td>"));
                        row.append($("<td>" + item.title+"</td>"));
                        row.append($("<td>" + item.type + "</td>"));
                        row.append($("<td>" + item.amount + "</td>"));
                        row.append($("<td>" + item.operator + "</td>"));
                        row.append($("<td>" + item.status + "</td>"));
                        row.append($("<td>" + item.message + "</td>"));
                        if (canOperate) {
                            var action = $("<td></td>");
                            row.append(action);
                            if(item.status == "已发送"){
                                var sign = $("<button type=\"button\" class=\"btn btn-xs btn-link\">签收</button>");
                                sign.click(function(e){
                                    var data_id = $(this).parents("tr").attr("data-id");
                                    confirm("确认已签收该发票", function(){
                                        var param = {
                                            sinterface: SERVERCONF.USERS.INVOICESIGN,
                                            data : {
                                                id: data_id
                                            }
                                        };
                                        ajaxCall(param, function(err,data){
                                            if(err){
                                                alert("签收失败");
                                            }else{
                                                alert("签收成功");
                                                loadRecordList();
                                            }
                                        })
                                    })
                                })
                                action.append(sign);
                            }
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
        var sinterface = SERVERCONF.ACCOUNT.INVOICERECORDS;
        var param = {
            sinterface: sinterface,
            data : {
                index: index,
                count: count,
                sort:  mSort.val()
            },
        };
        ajaxCall(param, function(err, data) {
            if (err) {
                ecb();
            }else {
                scb(data);
            }
        });
    }

    /** @description read the invoice list and render the page
     *  @memberOf module:account/invoice.html
     *  @param {int} index - page index; 
     *  @param {int} page item counts
    */
    function loadInvoiceInfo() {

        function scb(data) {
            mInvoiceSelect.empty();
            var list = data.list;
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if(list[i].audit_status == 0){
                    var option = '<option value="' + i;
                    option +='">'+item.title+'</option>';
                    mInvoiceSelect.append(option);
                }
            }
            mInvoiceList = data.list;
           
            invoiceSelectChangeCallback();
        }

        function ecb() {

        }

        var sinterface = SERVERCONF.USERS.INVOICELIST;
        var param = {
            sinterface: sinterface,
            data: {
                index: 0,
                count: 100, //FIX me 
            },
        };
        ajaxCall(param, function(err, data){
            if (err) {
                ecb();
            }else {
                scb(data);
            }
        });
    }

    ////////////////////////////////////////////////////////////////
    // callbacks
    ///////////////////////////////////////////////////////////////
    function invoiceSelectChangeCallback() {
        var select = $( "#invoice-list option:selected" ).val();
        console.log('selected:'+select);

        mSelectInvoice = null;
        if (select>=0 && select<mInvoiceList.length) {
            mSelectInvoice = mInvoiceList[select];
        }

        if (!mInvoiceSelect || (mSelectInvoice === null)) {
            return;
        }
        if(mSelectInvoice.type == "增值税普票"){
            mSpeTax.attr("disabled", true);
        }else{
            mSpeTax.attr("disabled", false);
        }
        //update the page
        mInvoiceTitleIpt.val(mSelectInvoice.title);
        mContactorName.text(mSelectInvoice.receiver_name);
        mContactorEmail.text(mSelectInvoice.receiver_email);
        mContactorAddr.text(mSelectInvoice.receiver_address);
        mContactorTel.text(mSelectInvoice.receiver_mobile);
    }

    function getInvoiceType() {
        if (mGeneralTypeRadio.is(':checked')) {
            return '增值税普票';
        }else {
            return '增值税专票';
        }
    }

    function getItemType() {
        return mInvoiceItemList.val();
    }

    function getAmount() {
        return Number(mInvoiceAmountInput.val());
    }

    function invoiceRequestSubmit(){
       
        if (mSelectInvoice==null) {
            ecb('还未有通过审核的发票信息.');
            return;
        }else if (!isMoney(mInvoiceAmountInput.val())){
            ecb('发票金额有误，最高精确到0.01元');
            return;
        }else if(mInvoiceAmountInput.val() == 0){
            ecb('发票金额有误，金额不能为0');
            return;
        }else if (parseFloat(mInvoiceAmountInput.val()) > parseFloat(mUnInvoiceAmount)){
            ecb('发票金额不能大于可开票金额');
            return;
        }

        var sinterface = SERVERCONF.ACCOUNT.INVOICEREQUEST;
        var data = {
            invoice_id: mSelectInvoice.id,
            title: mSelectInvoice.title,           
            invoice_type: getInvoiceType(),
            item_type: getItemType(),
            amount: getAmount(),
        };
        console.log(JSON.stringify(data));
        var param = {
            sinterface: sinterface,
            data: data
        };
        function scb() {
            mAlert.empty();
            var html = '<div class="alert alert-success">' ;
            html += '成功提交申请'
            html += '</div>';
            mAlert.html(html);
            loadRecordList();
            loadUnInvoiceAmount();
        }
        function ecb(msg, err) {
            mAlert.empty();
            var html = '<div class="alert ';
            if(err) {
                html += 'alert-danger">' ;
            }else {
                html +='alert-warning">';
                html += '<button type="button" class="close" data-dismiss="alert">' +
                       '<span aria-hidden="true">×</span><span class="sr-only">Close</span>' +
                    '</button>';
            }
            html += msg;
            html += '</div>';
            mAlert.html(html);
        }
        ajaxCall(param, function(err, data){
            if (err) {
                ecb('提交申请失败.', true);
            }else {
                scb();
            }
        });
    }

    function loadUnInvoiceAmount() {
        var param = {
            sinterface: SERVERCONF.ACCOUNT.INVOICEBALANCE,
            data:{},
        };
        function scb(amount) {
            mUnInvoiceAmountSpn.empty();
            mUnInvoiceAmountSpn.html('<strong>'+amount+' 元'+'</strong>');
        }
        function ecb(msg, err) {
           mUnInvoiceAmountSpn.empty();
        }
        ajaxCall(param, function(err, data){
            if (err) {
                ecb();
            }else {
                mUnInvoiceAmount = data.uninvoice_amount;
                console.log(data.uninvoice_amount);
                scb(data.uninvoice_amount)
            }
        });
    }

}();