/*
 * @file  user_check2.js
 * @description user data check
 * @copyright dmtec.cn reserved, 2016
 * @author jiangtu
 * @date 2016.12.10
 * @version 0.0.1 
 */

'use strict';

!function(){   
    // page static elements
    var mUser = null;
    var mQualifition = null;
    var mInvoice = null;
    var mTag = null;
    var mSlotPrice = null;
    var mTabs = null;
    
    var mInvoiceModal = null;

    var mUserBtnGp = null;
    var mQualBtnGp = null;
    var mInvoiceBtnGp = null;
    
    //userpart
    var mUserName = null;
    var mCompany = null;
    var mCompanyLicense = null;
    var mPhone = null;
    var mAddress = null;
    var mContactName = null;
    var mContactMobile = null;
    var mContactEmail = null;
    var mQualType = null;
    var mLicenseNum = null;
    var mStartToEndTime = null;
    var mUserType = null;
    
    //qualification part
    var mSiteName = null;
    var mSiteUrl = null;
    var mCateAndSub = null;
    var mQualifitionUrl = null;
    var mQualName = null;
    var mQualNumber = null;
    var mQualValidTime = null;
    
    //invoice type
    var mInTitle = null;
    var mInTaxNo = null;
    var mInAddress = null;
    var mInPhone = null;
    var mInBank = null;
    var mInBankAcNO = null;
    var mInReceiverName = null;
    var mInReceiverAddress = null;
    var mInReceiverEmail = null;
    var mInReceiverMobile = null;
    var mInType = null;
    var mInQual = null;
    var mSort = null;

    //tag part
    var mTagName = null;
    var mMinWeight = null;
    var mQueryTagUserSumBtn = null;
    var mSearchResult = null;

    //slot price part
    var mAddSlot = null;
    var mAddSlotBtn = null;
    var mAddSlotForm = null;
    var mAdxName = null;
    var mSlotId = null;
    var mBottomPrice = null;
    var mErrMsg = null;
    
    var qual_type = ["", "大陆个体工商类客户", "大陆企业单位类客户", "香港主体类客户", "台湾主体类客户", "澳门主体类客户",
                         "大陆事业单位类客户", "民办企业类客户", "社会团体类客户", "学校类客户", "国外主体类客户"];
    
    // variable
    var verify_invoice_id = null;
    //var list = null;
    var ck_status = ["通过", "提交中", "审查中", "审查失败"];

    function queryTagUserSum(){
        var data = {
            tag: mTagName.val(),
            min_weight: mMinWeight.val()
        };

        var param = {
            sinterface : SERVERCONF.ADMIN.TAGUSERSUM,
            data: data
        };

        ajaxCall(param, function(err, data){
            if(err){
                mSearchResult.html("<span style='color:red;'>获取失败</span>");
            }else{
                mSearchResult.html("受众人数：<span style='color:red;'>" + data.user_sum + "</span>");
                mSearchResult.removeClass("hidden");
            }
        });
    }
    
    function infoAudit(info, audit, message){
        var page_number = $(".pagination>li[class=active]").children().html();
        if(audit == ADCONSTANT.AUDIT.FAILED && message == ""){
            alert("请输入失败原因");
            return;
        }
        
        var data = {
            user_id : choosed_user_id,
            audit : audit
        }
        dealAction(data, audit, message);
        if(info == "user-btn-group"){
            var param = {
                sinterface : SERVERCONF.ADMIN.ADUSERAUDIT,
                data: data
            }
        }else if(info == "qul-btn-group"){
            var param = {
                sinterface : SERVERCONF.ADMIN.ADUSERQUALIFITIONAUDIT,
                data : data
            }
        }else{
            data.invoice_id = verify_invoice_id;
            var param = {
                sinterface : SERVERCONF.ADMIN.ADUSERINVOICEAUDIT,
                data: data
            }
        }
        
        ajaxCall(param, function(err, data){
            if(err){
                alert("verify error");
            }else{
                switch(info){
                    case "user-btn-group":
                        initUserInfo();
                        break;
                    case "qul-btn-group":
                        initQualifitionInfo();
                        break;
                    case "invoice-btn-group":
                        initInvoiceInfo(page_number - 1);
                        break;
                }
            }
        })
        $(".modal").modal("hide");
    }
        
    function dealAction(data, audit, message){
        if(audit == ADCONSTANT.AUDIT.PASS){
            return data;
        }else{
            data.message = message;
            return data;
        }
    }
    
    //init main div when click on tabs
    function mainDivInit(tab_id){
        if(tab_id == "user"){
            mUser.removeClass("hidden");
            mUser.siblings().addClass("hidden");
            initUserInfo();
            initUserTypeInfo();
        }else if(tab_id == "qualification"){
            mQualifition.removeClass("hidden");
            mQualifition.siblings().addClass("hidden");
            initQualifitionInfo();
        }else if(tab_id == "invoice"){
            mInvoice.removeClass("hidden");
            mInvoice.siblings().addClass("hidden");
            initInvoiceInfo();
        }else if(tab_id == "tag"){
            mTagName.val("");
            mMinWeight.val("");
            mSearchResult.addClass("hidden");
            mTag.removeClass("hidden");
            mTag.siblings().addClass("hidden");
        }else if(tab_id == "slot-price"){
            mSlotPrice.removeClass("hidden");
            mSlotPrice.siblings().addClass("hidden");
            initSlotPriceInfo();
        }else{}
    }
    
    function userChoosedInit(){
        mTabs[0].click();
    }
    
    function toggleSlotPrice(id, toggle, scb, ecb){
        var param = {
            sinterface: SERVERCONF.ADMIN.ADUSERSLOTPRICECONTROL,
            data: {
                id: id,
                action: toggle ? "\u542f\u52a8" : "\u6682\u505c"
            }
        };
        ajaxCall(param, function(err, data){
            if(err){
                ecb(err);
            }else{
                scb(data);
            }
        });
    }

    //init info
    //init slot price info
    function initSlotPriceInfo(index, count){
        var tid = "#slot-price-list";
        emptyTbody(tid);
        setTfoot(tid, spinLoader("数据加载中，请稍候..."));
        var index = parseInt(index) || 0;
        var count = parseInt(count) || 10;
        function scb(data){
            if(data.size == 0){
                setTfoot(tid, stringLoadFail("没有数据"));
            }else{
                try{
                    var total = data.total;
                    var list = data.list;
                    var pagenumber = Math.ceil(total / count);
                    var rows = [];
                    for(var i = 0; i < list.length; i++){
                        var item = list[i];
                        var row = $("<tr></tr>");
                        row.attr("data-id", item.id);
                        row.append($("<td>" + item.adx_name + "</td>"));
                        row.append($("<td>" + item.slot_id + "</td>"));
                        // row.append($("<td>" + item.status + "</td>"));
                        var wrapper = $("<div class=\"switch\"></div>");
                        var status = $("<input type=\"checkbox\" data-size=\"mini\" data-on-color=\"success\" data-off-color=\"warning\"></input>");
                        if (item.status == "启用") {
                            status.attr("checked", true);
                        }
                        wrapper.append(status);
                        row.append($("<td></td>").append(wrapper));
                        row.append($("<td>" + item.bottom_price + "</td>"));
                        rows.push(row);
                    }
                    setTbody(tid, rows);
                    var cbs = $(tid).find("input[type=checkbox]");
                    cbs.bootstrapSwitch();
                    cbs.on('switchChange.bootstrapSwitch', function(event, state) {
                        function scb(r) {
                            console.log(r);
                        }
                        function ecb(r) {
                            console.log(r);
                        }
                        var slot_price_id = $(this).parents("tr").attr("data-id");
                        toggleSlotPrice(slot_price_id, state, scb, ecb);
                    });
                    setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                        initInvoiceInfo(parseInt(t.hash.replace("#", "")));
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

        var param = {
            sinterface : SERVERCONF.ADMIN.ADUSERSLOTPRICELIST,
            data : {
                user_id: choosed_user_id,
                index : index,
                count: count,
            }
        };

        ajaxCall(param, function(err, data){
            if(err){
                ecb();
            }else{
                scb(data);
            }
        });
    }

    //init user info
    function initUserInfo(){
        function ecb(){
            alert("error user info");
        }
        
        function scb(data){
            mUserName.html(data.user_name);
            mCompany.html(data.company_name);
            mCompanyLicense.attr("src", data.company_license);
            if(data.company_license != null){
                mCompanyLicense.css({"width":"420px", "height":"600px"});
            }
            mPhone.html(data.telephone);
            mAddress.html(data.address);
            mContactName.html(data.contacts_name);
            mContactMobile.html(data.contacts_mobile);
            mContactEmail.html(data.contacts_email);
            mQualType.html(qual_type[data.qualification_type]);
            mLicenseNum.html(data.license_number);
            mStartToEndTime.html(data.license_valid_date_begin + "至" + data.license_valid_date_end);
            initBtnGp(mUserBtnGp, data.user_audit_status);
        }
        
        var param = {
            sinterface : SERVERCONF.ADMIN.ADUSERVIEW,
            data : {
                user_id: choosed_user_id
            }
        };
        ajaxCall(param, function(err, data){
            if(err){
                ecb;
            }else{
                scb(data);
            }
        })
    }

    function initUserTypeInfo(){
        function ecb(){
            console.log("user type info init error");
        }

        function scb(data){
            mUserType.unbind('click');
            if(data.user_type === 0){
                mUserType.attr({"class":"normal-user", "title": "设置为vip用户"});
                mUserType.click(function(){
                    changeUserType(1);
                });
            }else if(data.user_type === 1){
                mUserType.attr({"class":"vip-user", "title": "设置为普通用户"});
                mUserType.click(function(){
                    changeUserType(0);
                });
            }else{
                console.log("未知类型用户");
            }
        }

        var param = {
            sinterface : SERVERCONF.ADMIN.ADUSERUSERTYPE,
            data : {
                user_id: choosed_user_id
            }
        };
        ajaxCall(param, function(err, data){
            if(err){
                ecb();
            }else{
                scb(data);
            }
        });
    }
    
    //init qualification info
    function initQualifitionInfo(){
        function ecb(){
            alert("error qualification info") 
        }
        
        function scb(data){
            mSiteName.html(data.site_name);
            mSiteUrl.html(data.site_url);
            mQualName.html(data.qualification_name);
            mQualNumber.html(data.qualification_number);
            mQualValidTime.html(data.valid_date_begin + "至" + data.valid_date_end);
            var fcate_no = null;
            var ccate_no = null;
            for(var i = 0; i < cate.length; i++){
                if(cate[i].value == data.categories){
                    fcate_no = i;
                    break;
                }
            }
            for(var j = 0; j < shis[fcate_no].length; j++){
                if(shis[fcate_no][j].value == data.subcategories){
                    ccate_no = j;
                    break;
                }
            }
            if(fcate_no == 0){
                mCateAndSub.html("");
            }else{
                mCateAndSub.html(cate[fcate_no].text +"——"+ shis[fcate_no][ccate_no].text);
            }
            mQualifitionUrl.attr("src", data.qualification);
            if(data.qualification != null){
                mQualifitionUrl.css({"width":"420px", "height":"600px"});
            }
            initBtnGp(mQualBtnGp, data.audit_status);
        }
        
        var param = {
            sinterface : SERVERCONF.ADMIN.ADUSERQUALIFITIONVIEW,
            data : {
                user_id: choosed_user_id
            }
        }
        ajaxCall(param, function(err, data){
            if(err){
                ecb;
            }else{
                scb(data);
            }
        })
    }
     
    //init invoice info
    function initInvoiceInfo(index, count){
        var tid = "#invoice-list";
        emptyTbody(tid);
        setTfoot(tid, spinLoader("数据加载中，请稍候..."));
        var index = parseInt(index) || 0;
        var count = parseInt(count) || 10;
        function scb(data){
            if(data.size == 0){
                setTfoot(tid, stringLoadFail("没有数据"));
            }else{
                try{
                    var total = data.total;
                    var list = data.list;
                    var pagenumber = Math.ceil(total / count);
                    var rows = [];
                    for(var i = 0; i < list.length; i++){
                        var item = list[i];
                        var row = $("<tr></tr>");
                        row.attr("data-invoice-id", item.id);
                        row.append($("<td>" + item.title + "</td>"));
                        row.append($("<td>" + item.tax_no + "</td>"));
                        row.append($("<td>" + item.address + "</td>"));
                        row.append($("<td>" + item.phone + "</td>"));
                        row.append($("<td>" + ck_status[item.audit_status] + "</td>"));
                        var action = $("<td></td>");
                        row.append(action);
                        var audit = $("<button class='btn btn-primary btn-xs'>审核发票</button>");
                        audit.attr("audit-btn-id", i);
                        audit.click(function(e){
                            mInvoiceModal.modal("show");
                            var btn_id = $(this).attr("audit-btn-id");
                            mInTitle.html(list[btn_id].title);
                            mInTaxNo.html(list[btn_id].tax_no);
                            mInAddress.html(list[btn_id].address);
                            mInPhone.html(list[btn_id].phone);
                            mInBank.html(list[btn_id].bank);
                            mInBankAcNO.html(list[btn_id].bank_account_no);
                            mInReceiverName.html(list[btn_id].receiver_name);
                            mInReceiverAddress.html(list[btn_id].receiver_address);
                            mInReceiverEmail.html(list[btn_id].receiver_email);
                            mInReceiverMobile.html(list[btn_id].receiver_mobile);
                            mInType.html(list[btn_id].type);
                            mInQual.attr("src",list[btn_id].qualification);
                            
                            mInQual.css({"width":"180px", "height":"270px"});;
                            initBtnGp(mInvoiceBtnGp, list[btn_id].audit_status);
                            verify_invoice_id = $(this).parents("tr").attr("data-invoice-id");
                        })
                        action.append(audit);
                        rows.push(row);
                    }
                    setTbody(tid, rows);
                    setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                        initInvoiceInfo(parseInt(t.hash.replace("#", "")));
                    }));
                }catch(e){
                    ecb;
                }
            }
        }
        
        function ecb(){
            emptyTbody(tid);
            setTfoot(tid, stringLoadFail());
        }
        var param = {
            sinterface : SERVERCONF.ADMIN.ADUSERINVOICELIST,
            data : {
                user_id: choosed_user_id,
                index : index,
                count: count,
                sort: mSort.val()
            }
        }
        ajaxCall(param, function(err, data){
            if(err){
                ecb;
            }else{
                scb(data);
            }
        })
    }
    
    function changeUserType(user_type){
        var data = {
            user_id: choosed_user_id,
            user_type: user_type
        };
        var param = {
            sinterface : SERVERCONF.ADMIN.ADUSERUSERTYPEUPDATE,
            data: data
        };
        ajaxCall(param, function(err, data){
            if(err){
                alert("用户类型修改失败");
            }else{
                initUserTypeInfo();
            }
        });
    }

    function initPageStaticElements() {
        mTabs = $("#tabs a");
        
        mUser = $("#user-main");
        mQualifition = $("#qualifition-main");
        mInvoice = $("#invoice-main");
        mTag = $("#tag-main");
        mSlotPrice = $("#slot-price-main");
        
        mInTitle = $("#in-title");
        mInTaxNo = $("#in-tax-no");
        mInAddress = $("#in-address");
        mInPhone = $("#in-phone");
        mInBank = $("#in-bank");
        mInBankAcNO = $("#in-bank-account-no");
        mInReceiverName = $("#in-receiver-name");
        mInReceiverAddress = $("#in-receiver-address");
        mInReceiverEmail = $("#in-receiver-email");
        mInReceiverMobile = $("#in-receiver-mobile");
        mInType = $("#in-type");
        mInQual = $("#in-qualification");
        mUserType = $("#user-type");
        
        mInvoiceModal = $("#invoice-modal");
        
        mUserBtnGp = $("#user-btn-group");
        mQualBtnGp = $("#qul-btn-group");
        mInvoiceBtnGp = $("#invoice-btn-group");
        
        mSiteName = $("#site-name");
        mSiteUrl = $("#site-url");
        mCateAndSub = $("#cate-subcate");
        mQualifitionUrl = $("#qualification-img");
        mQualName = $("#qualification_name");
        mQualNumber = $("#qualification_number");
        mQualValidTime = $("#qual-valid-time");
        
        mUserName = $("#user-name");
        mCompany = $("#company-name");
        mCompanyLicense = $("#company-license");
        mPhone = $("#phone");
        mAddress = $("#address");
        mContactName = $("#contact-name");
        mContactMobile = $("#contact-mobile");
        mContactEmail = $("#contact-email");
        mQualType = $("#qualification-type");
        mLicenseNum = $("#license-number");
        mStartToEndTime = $("#start-to-end-time");
        mSort = $('#sort');

        mTagName = $('#tag-name');
        mMinWeight = $('#min-weight');
        mQueryTagUserSumBtn = $('#query-tag-user-sum');
        mSearchResult = $('#tag-search-result');

        mAddSlot = $('#add-slot-price');
        mAddSlotBtn = $('#add-slot-price-btn');
        mAddSlotForm = $('#modal-slot-price-form');
        mAdxName = $('#adx-name');
        mSlotId = $('#slot-id');
        mBottomPrice = $('#bottom-price');
        mErrMsg = $('#err-msg');
    }
    
    function initBtnGp(mBtnGp, audit){
        if(audit == ADCONSTANT.AUDIT.PASS || audit == 0){
            mBtnGp.html("<div class='alert alert-success alert-dismissible' role='alert'>" +
                          "<button type='button' class='close' data-dismiss='alert'>" +
                            "<span aria-hidden='true'>×</span><span class='sr-only'>Close</span>" +
                          "</button>" +
                          "<strong>Success!</strong><span>信息已通过审核</span>" +
                        "</div>");
        }else if(audit == ADCONSTANT.AUDIT.FAILED || audit == 3){
            mBtnGp.html("<div class='alert alert-danger alert-dismissible' role='alert'>" +
                          "<button type='button' class='close' data-dismiss='alert'>" +
                            "<span aria-hidden='true'>×</span><span class='sr-only'>Close</span>" +
                          "</button>" +
                          "<strong>Error!</strong><span>信息审核失败</span>" +
                        "</div>");
        }else{
            mBtnGp.html("<button type='button' class='btn btn-primary btn-sm audit-btn' audit-type='审核通过'>审核通过</button>" +
                        "<button type='button' class='btn btn-danger btn-sm audit-btn' audit-type='审核失败'>审核失败</button> " +
                        "<input type='text' placeholder='若审核失败，请注明原因'>");
            var AuditButton = $(".audit-btn");
            AuditButton.click(function(){
                var fail_message =  $(this).parent().children("input").val();
                var audit_type = $(this).attr("audit-type");
                var info_type = $(this).parent().attr("id");
                infoAudit(info_type, audit_type, fail_message);
            })        
        }
    }

    function submitNewSlotPrice(){
        var adx_name = mAdxName.val();
        var slot_id = mSlotId.val();
        var bottom_price = mBottomPrice.val();

        var param = {
            sinterface: SERVERCONF.ADMIN.ADUSERSLOTPRICEADD,
            data: {
                user_id: choosed_user_id,
                adx_name: adx_name,
                slot_id: parseInt(slot_id),
                bottom_price: parseFloat(bottom_price).toFixed(2),
            }
        };

        ajaxCall(param, function(err, data){
            if(err){
                setInfoDiv(mErrMsg, 'error', '添加失败');
            }else{
                mAddSlotForm.modal('hide');
                initSlotPriceInfo();
            }
        });
    }

    function initAdxList(){
        mAdxName.html("");
        var adx_list = [];
        for(var k in ADCONSTANT.ADXLIST){
            adx_list.push(k);
        }
        for(var i = 0; i < adx_list.length; i++){
            var option = $("<option value='" + adx_list[i] + "'>" + adx_list[i] + "</option>");
            mAdxName.append(option);
        }
    }

    $(function() {
        var tabs_config = [
            {"name": "user", "text": "用户信息"},
            {"name": "qualification", "text": "资质文件"},
            {"name": "invoice", "text": "发票信息"},
            {"name": "tag", "text": "优选标签"},
            {"name": "slot-price", "text": "广告位底价"}
        ];
        var current_tab = window.current_tab || "";
        initTabs(tabs_config, current_tab);
        initUserList(userChoosedInit);
        initPageStaticElements();
        
        mTabs.click(function(){
            $(this).parent().addClass("active");
            $(this).parent().siblings().removeClass("active");
            mainDivInit($(this).attr("id"));
        });
            
        mSort.change(initInvoiceInfo);

        mQueryTagUserSumBtn.click(function(){
            queryTagUserSum();
        });

        mAddSlot.click(function(){
            initAdxList();
            mAddSlotForm.find("input[type='text']").val("");
            mErrMsg.html("");
            mAddSlotForm.modal("show");
            mAddSlotBtn.unbind("click");
            mAddSlotBtn.click(submitNewSlotPrice);
        });
        
    });
}();


 
