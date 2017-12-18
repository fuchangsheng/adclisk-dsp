/*
 * @file  recharge.js
 * @description recharge
 * @copyright dmtec.cn reserved, 2016
 * @author GuoXuemin
 * @date 2016.11.27
 * @version 0.0.1 
 */

'use strict'

!function(){   
    // page static elements
    var tab_id=null;
    var pUserId = null;
    var pRechargeAmount = null;
    var pRechargeSubmitBtn = null;
    var pOperId = null;
    var pChargeInfo=null;
    //change pannel
    var pTabs=null;
    var pRecharge=null;
    var pay_verify=null;
    //records list
    var pRAccountRadioBtn = null;
    var pVAccountRadioBtn = null;
    var pRecordList = null;
    var pAccountType=null;
    var pPayModal=null;
    var payDoneUser=null;
    var payDoneAmount=null;
    var payDoneTicketNo=null;
    var payDoneChargeId=null;
    var mSort = null;

    $(function() {
        var tabs_config = [
            {"name": "recharge", "text": "后台充值"},
            {"name": "pay_verify", "text": "充值确认"}
        ];
        var current_tab = window.current_tab || "";
        initTabs(tabs_config, current_tab);
        initPageStaticElements();
        initUserList(accountInfo);
        //initRecordsList();
        registerCB();
        pTabs.each(function(){
            $(this).click(function(){
                $(this).parent().addClass("active");
                $(this).parent().siblings().removeClass("active");
                tab_id=$(this).attr("id");
                mainDivInit();
            });
        })
        
        mSort.change(initRecordsList);
    });



    //initUserList callback
    function accountInfo(){
        if(tab_id=="recharge"){
            pUserId.val(choosed_user_id);
        }else{
            initRecordsList();
        }
    }

    /** @description init the page static element variables
     *  @memberOf module:views/user_check.jade
     *
    */
    function initPageStaticElements() {
        pUserId = $('#user_id');
        pRechargeAmount = $('#recharge_amount');
        pRechargeSubmitBtn = $('#recharge_submit');
        pTabs=$("#tabs a");
        pRecharge=$("#rechage-pannel");
        pay_verify=$("#pay_done_verify");
        pRAccountRadioBtn = $('#rAccount');
        pVAccountRadioBtn = $('#vAccount');
        pRecordList = $('#oprecords');
        pChargeInfo=$("#rechargeInfo");
        pPayModal=$("#pay-done-modal");
        payDoneUser=$("#pay-done-user");
        payDoneAmount=$("#pay-done-amount");
        payDoneTicketNo=$("#pay-done-ticketNo");
        payDoneChargeId=$("#pay-done-chargeID");
        tab_id="recharge";
        mSort = $('#sort');
    } 

    function mainDivInit(){
        if(tab_id == "recharge"){
            pRecharge.removeClass("hidden");
            pay_verify.addClass("hidden");
            pUserId.val(choosed_user_id);  
        }else{
            pay_verify.removeClass("hidden");
            pRecharge.addClass("hidden");
            pChargeInfo.children('div').remove();
            initRecordsList();
        }
    }

    /** @description register the callbacks of elements
     *  @memberOf module:views/user_check.jade
     *
    */
    function registerCB() {
        pRechargeSubmitBtn.click(submit);
        pRAccountRadioBtn.click(reloadRecords);
        pVAccountRadioBtn.click(reloadRecords);
        payDoneVerify();
    }

    /** @description submit check result
     *  @memberOf module:views/user_check.jade
     *
    */
    function isPInt(num){
        var re = /^[0-9]*[1-9][0-9]*$/;
        return re.test(num);
    }
    function submit(){
        pChargeInfo.children('div').remove();
        $("#main .alert").css("display","none");
        var userId=choosed_user_id;
        var amount = Number(pRechargeAmount.val());
        if(!isPInt(amount)){
            alert("充值金额格式有误");
            return;
        }else if(amount < 500){
            alert("充值金额不少于500");
            return;
        }
        var param={
            sinterface : SERVERCONF.ACCOUNT.VRECHARGE,
            data:{
                user_id:choosed_user_id,
                amount:amount
            }
        };
        ajaxCall(param,function(err,data){
            if(err){
                pChargeInfo.append($("<div class='alert alert-danger alert-dismissible' role='alert'><button class='close' data-dismiss='alert'><span aria-hidden='true'>×</span><span class='sr-only'>Close</span></button><strong>Error!</strong> 充值失败</div>"));
            }else{
                pChargeInfo.append($("<div class='alert alert-success alert-dismissible' role='alert'><button class='close' data-dismiss='alert'><span aria-hidden='true'>×</span><span class='sr-only'>Close</span></button><strong>Success!</strong> 充值成功</div>"));
                pUserId.val();
            }
        });
    }



    function initRecordsList(index,count){
        var tid = "#oprecords";
        emptyTbody(tid);
        setTfoot(tid, spinLoader("数据加载中，请稍候..."));
        var index = parseInt(index) || 0;
        var count = parseInt(count) || 10;
        var type=getAccountType();
        function scb(data){
            if (data.size == 0) {
                setTfoot(tid, stringLoadFail("没有数据"));
            }else{
                try{
                    var total = data.total;
                    var list = data.list;
                    var pagenumber = Math.ceil(total / count);
                    var rows = [];
                    for(var i=0;i<list.length;i++){
                        var item=list[i];
                        var row = $("<tr></tr>");
                        var ticketNo=item.notes.split("：")[1];
                        row.attr("pay-ticketNo",ticketNo);
                        row.attr("pay-chargeId",item.charge_id);
                        row.append($("<td>" + item.date + "</td>"));
                        if (item.type==0) {
                            row.append($("<td>" + item.amount + "</td>"));
                            row.append($("<td>" + '-' + "</td>"));
                        }else {
                            row.append($("<td>" + '-' + "</td>"));
                            row.append($("<td>" + item.amount + "</td>"));
                        }
                        if (item.charge_type==0) {
                            row.append($("<td>" + '网银充值' + "</td>"));
                        }else if(item.charge_type==1) {
                            row.append($("<td>" + '支付宝充值' + "</td>"));
                        }else if(item.charge_type==2) {
                            row.append($("<td>" + '微信充值' + "</td>"));
                        }else if(item.charge_type==3) {
                            row.append($("<td>" + '后台充值' + "</td>"));
                        }
                        if (item.charge_status==0) {
                            row.append($("<td>" + '充值成功' + "</td>"));
                        }else if(item.charge_status==1) {
                            row.append($("<td>" + '充值中' + "</td>"));
                        }else if(item.charge_status==2) {
                            row.append($("<td>" + '充值审核中' + "</td>"));
                        }else if(item.charge_status==3) {
                            row.append($("<td>" + '充值失败' + "</td>"));
                        }
                        if(item.account_type==1 && (item.charge_status==0 || item.charge_status==3)){
                            $("#recharge_ope").css("display","block");
                            var action = $("<td></td>");
                            var verify = $("<button class='btn btn-primary btn-xs'>支付确认</button>");
                            verify.attr("verify-btn-id", i).attr("verify-btn-status", item.charge_status);
                            verify.click(function(e) {
                                var num=$(this).attr("verify-btn-id");
                                var stat = $(this).attr("verify-btn-status");
                                if(stat == 0){
                                    $(".invoice-verify-btn[verify-type=充值失败]").prop("disabled", false);
                                    $(".invoice-verify-btn[verify-type=充值成功]").prop("disabled", true);
                                }else if(stat == 3){
                                    $(".invoice-verify-btn[verify-type=充值失败]").prop("disabled", true);
                                    $(".invoice-verify-btn[verify-type=充值成功]").prop("disabled", false);
                                }
                                pPayModal.modal("show");
                                payDoneUser.text(choosed_user_name);
                                var oTr=$("#oprecords tbody tr:eq("+num+")");
                                var oTd=oTr.children('td').eq(1);
                                payDoneAmount.text(oTd.text());
                                payDoneTicketNo.text(oTr.attr("pay-ticketNo"));
                                payDoneChargeId.text(oTr.attr("pay-chargeId"));
                            });
                            action.append(verify);
                            row.append(action); 
                        }else{
                            var action = $("<td></td>");
                            row.append(action);
                        }
                        rows.push(row);
                    }
                    setTbody(tid, rows);
                    setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                        initRecordsList(parseInt(t.hash.replace("#", "")));
                    }));
                }catch(e){
                    ecb();
                }
            }
        }

        function ecb(){
            emptyTbody(tid);
            setTfoot(tid, stringLoadFail());
        }

        var param={
            sinterface:SERVERCONF.ACCOUNT.OPRECORDS,
            data:{
                user_id:choosed_user_id,
                type:type,
                index:index,
                count:count,
                sort: mSort.val()
            }
        };
        ajaxCall(param,function(err,data){
            if(err){
                ecb();
            }else{
                scb(data);
            }
        })
    }

    function getAccountType(){
        if(pRAccountRadioBtn.is(':checked')){
            return '现金账户';
        }else {
            return '虚拟账户';
        }
    }

    function reloadRecords() {
        var newType = getAccountType();
        if (!pAccountType || pAccountType!=newType) {
            initRecordsList();
        }
        pAccountType=newType;
    }


    function payDoneVerify(){
        function clearModal(){
            payDoneUser.text("");
            payDoneAmount.text("");
            payDoneTicketNo.text("");
            payDoneChargeId.text("");
        }
        $("#pay-done-modal .close").click(function(){
            clearModal();
        })
        $("#pay-done-modal .invoice-verify-btn").click(function(){
            var rechargeStatus=$(this).attr("verify-type");
            function scb(){
                var tt=$("#oprecords tfoot .pagination .active a").attr("href");
                initRecordsList(parseInt(tt.replace("#","")));
            }
            var param={
                sinterface:SERVERCONF.ACCOUNT.RECHARGEUPDATE,
                data:{
                    user_id:choosed_user_id,
                    charge_id:payDoneChargeId.text(),
                    ticket_no:payDoneTicketNo.text(),
                    status:rechargeStatus
                }
            };
            ajaxCall(param,function(err,data){
                if(err){
                    alert(getErrMsg(err));
                }else{
                    scb();
                }
                clearModal();
            })
        })
    }
}();
