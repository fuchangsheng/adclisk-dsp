/*
 * @file  idea_check.js
 * @description idea check logic
 * @copyright dmtec.cn reserved, 2016
 * @author jiangtu
 * @date 2016.12.15
 * @version 0.0.1 
 */

'use strict';

!function(){
    //page static elements
    var mIdeaModal = null;
    var mUnitModal = null;
    var mIdeaBtnGp = null;
    
    var mIdeaName = null;
    var mPlanName = null;
    var mUnitName = null;
    var mAdviewType = null;
    var mIdeaType = null;
    var mIdeaSlot = null;
    var mIdeaTrade = null;
    var mIdeaLandingPage = null;
    var mIdeaImpMonitorUrl = null;
    var mIdeaClickMonitorUrl = null;
    var mAssets = null;
    var mSort = null;

    var mBid = null;
    var mBidType = null;
    var mUnitTargetContent = null;
    
    
    //vari
    var verify_idea_id = null;
    
    function initPageStaticElements(){
        mIdeaModal = $("#idea-modal");
        mUnitModal = $("#unit-modal");
        mIdeaBtnGp = $("#idea-btn-group");
        
        mIdeaName = $("#idea-name");
        mPlanName = $("#plan-name");
        mUnitName = $("#unit-name");
        mAdviewType = $("#adview-type");
        mIdeaType = $("#idea-type");
        mIdeaSlot = $("#idea-slots");
        mIdeaTrade = $("#idea-trade");
        mIdeaLandingPage = $("#landing-page");
        mIdeaImpMonitorUrl = $("#imp-monitor-url");
        mIdeaClickMonitorUrl = $("#click-monitor-url");
        mAssets = $("#assets");
        mSort = $('#sort');

        mBid = $('#bid');
        mBidType = $('#bid-type');
        mUnitTargetContent = $('#unit-target-content');
    }
    
    $(function(){
        initUserList(userChoosedInit);
        initPageStaticElements();
        mSort.change(initIdeaInfo);
    });
        
    //init invoice info
    function initIdeaInfo(index, count){
        var tid = "#idea-list";
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
                        row.attr("data-idea-id", item.idea_id);
                        row.attr("data-unit-id", item.unit_id);
                        row.append($("<td>" + item.idea_name + "</td>"));
                        row.append($("<td>" + item.idea_status + "</td>"));
                        row.append($("<td>" + item.unit_name + "</td>"));
                        row.append($("<td>" + item.plan_name + "</td>"));
                        row.append($("<td>" + item.idea_type + "</td>"));
                        row.append($("<td>" + item.adview_type + "</td>"));
                        row.append($("<td>" + item.audit_status + "</td>"));
                        var action = $("<td></td>");
                        row.append(action);
                        var audit = $("<button class='btn btn-primary btn-xs'>审核创意</button>");
                        audit.attr("audit-btn-id", i);
                        if(item.audit_status == ADCONSTANT.AUDIT.UNSUBMIT){
                            audit.attr("disabled", true);
                            audit.addClass("btn-danger");
                        }else{
                            audit.attr("disabled", false);
                            audit.removeClass("btn-danger");
                        }
                        audit.click(function(e){
                            mIdeaModal.modal("show");
                            var btn_id = $(this).attr("audit-btn-id");
                            //set value
                            mIdeaName.html(list[btn_id].idea_name);
                            mPlanName.html(list[btn_id].plan_name);
                            mUnitName.html(list[btn_id].unit_name);
                            mAdviewType.html(list[btn_id].adview_type);
                            mIdeaType.html(list[btn_id].idea_type);
                            var s_idea_slot = "";
                            for(var i = 0; i < list[btn_id].idea_slots.length; i++){
                                s_idea_slot += (list[btn_id].idea_slots[i].type + ";");
                            }
                            mIdeaSlot.html(s_idea_slot);
                            mIdeaTrade.html(list[btn_id].idea_trade);
                            mIdeaLandingPage.html("<a href='" + list[btn_id].landing_page + "' target='_blank'>查看</a>");
                            //mIdeaLandingPage.attr("title", list[btn_id].landing_page);
                            var s_imp_url = "";
                            if(list[btn_id].imp_monitor_urls == undefined){ 
                            }else{
                                for(var i = 0; i < list[btn_id].imp_monitor_urls.length; i++){
                                    s_imp_url += (list[btn_id].imp_monitor_urls[i] + ";");
                                }
                            }
                            mIdeaImpMonitorUrl.html(s_imp_url);
                            var s_click_url = "";
                            if(list[btn_id].click_monitor_urls == undefined){ 
                            }else{
                                for(var i = 0; i < list[btn_id].click_monitor_urls.length; i++){
                                    s_click_url += (list[btn_id].click_monitor_urls[i] + ";");
                                }
                            }
                            mIdeaClickMonitorUrl.html(s_click_url);
                            
                            var s_assets = "";
                            if(list[btn_id].idea_type == ADCONSTANT.IDEATYPE.TEXT){
                                s_assets = "标题：" + list[btn_id].assets.title + "<br>" + "内容：" + list[btn_id].assets.desc;
                            }else if(list[btn_id].idea_type == ADCONSTANT.IDEATYPE.IMAGE){
                                s_assets = "宽度：" + list[btn_id].assets.main_img.w + "px 高度：" + list[btn_id].assets.main_img.h + "px<br>" +
                                           "图片：" + "<a href='" + list[btn_id].assets.main_img.url + "' target='_blank'>查看</a>";
                            }else if(list[btn_id].idea_type == ADCONSTANT.IDEATYPE.FLASH){
                                s_assets = "宽度：" + list[btn_id].assets.flash.w + "px 高度：" + list[btn_id].assets.flash.h + "px<br>" + 
                                           "flash："  + "<a href='" + list[btn_id].assets.flash.url + "' target='_blank'>查看</a>";
                            }else if(list[btn_id].idea_type == ADCONSTANT.IDEATYPE.VIDEO){
                                s_assets = "宽度：" + list[btn_id].assets.video.w + "px 高度：" + list[btn_id].assets.video.h + "px 时长：" + list[btn_id].assets.video.duration + "秒<br>" +
                                           "视频：" + "<a href='" + list[btn_id].assets.video.url + "' target='_blank'>查看</a>";
                            }else if(list[btn_id].idea_type == ADCONSTANT.IDEATYPE.NATIVE){
                                s_assets = "标题：" + list[btn_id].assets.title + "<br>" + "内容：" + list[btn_id].assets.desc + "<br>" + "补充说明：" + list[btn_id].assets.desc2 + "<br>" +
                                           "原始价格：" + list[btn_id].assets.price + "（元） 折后价格：" + list[btn_id].assets.sale_price + "（元）<br>" +
                                           "联系电话：" + list[btn_id].assets.phone + "联系地址：" + list[btn_id].assets.address + "<br>" +
                                           "广告链接：" + list[btn_id].assets.display_url;
                            }else if(list[btn_id].idea_type == ADCONSTANT.IDEATYPE.IMAGETEXT){
                                s_assets = "标题：" + list[btn_id].assets.title + "<br>" + "内容：" + list[btn_id].assets.desc + "<br>" +
                                           "宽度：" + list[btn_id].assets.main_img.w + "px 高度：" + list[btn_id].assets.main_img.h + "px<br>" +
                                           "图片：" + "<a href='" + list[btn_id].assets.main_img.url + "' target='_blank'>查看</a>";
                            }
                            
                            mAssets.html(s_assets);
                            //set end
                            initBtnGp(mIdeaBtnGp, list[btn_id].audit_status);
                            verify_idea_id = $(this).parents("tr").attr("data-idea-id");
                        })
                        action.append(audit);
                        var detail = $("<button class='btn btn-primary btn-xs' style='margin-left:10px;'>单元详情</button>");
                        detail.click(function(){
                            var choosed_unit_id = $(this).parents("tr").attr("data-unit-id");
                            initUnitInfo(choosed_unit_id);
                            initUnitTargetInfo(choosed_unit_id);
                            mUnitModal.modal("show");
                        });
                        action.append(detail);
                        rows.push(row);
                    }
                    setTbody(tid, rows);
                    setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                        initIdeaInfo(parseInt(t.hash.replace("#", "")));
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
            sinterface : SERVERCONF.ADMIN.ADUSERIDEALIST,
            data : {
                user_id : choosed_user_id,
                index : index,
                count : count,
                sort : mSort.val()
            }
        };
        ajaxCall(param, function(err, data){
            if(err){
                ecb;
            }else{
                scb(data);
            }
        });
    }
    
    function dealAction(data, audit, message){
        if(audit == ADCONSTANT.AUDIT.PASS){
            return data;
        }else{
            data.message = message;
            return data;
        }
    }
    
    function userChoosedInit(){
        initIdeaInfo();
    }

    function initUnitInfo(unit_id){
        mBid.html("");
        mBidType.html("");
        var param = {
            sinterface : SERVERCONF.ADMIN.ADUSERUNITVIEW,
            data : {
                user_id : choosed_user_id,
                unit_id : unit_id
            }
        };
        ajaxCall(param, function(err, data){
            if(err){
                console.log("failed to get unit info");
            }else{
                mBid.html(data.bid);
                mBidType.html(data.bid_type);
            }
        });
    }

    function initUnitTargetInfo(unit_id){
        mUnitTargetContent.html("");
        var param = {
            sinterface : SERVERCONF.ADMIN.ADUSERUNITTARGETDETAIL,
            data : {
                user_id : choosed_user_id,
                unit_id : unit_id
            }
        };
        ajaxCall(param, function(err, data){
            if(err){
                console.log("failed to get unit info");
            }else{
                var target_list = data.list;
                for(var i = 0; i < target_list.length; i++){
                    if(target_list[i].status == '启用'){
                        var target_item = $("<div class='form-group'>" + 
                                                "<label class='control-label col-sm-3'>"+ target_list[i].type +"</label>" +
                                                "<div class='col-sm-9 audit-content'>" +
                                                    "<span>" + target_list[i].content + "</span>" +
                                                "</div>" +
                                            "</div>");
                        mUnitTargetContent.append(target_item);
                    }
                }
            }
        });
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
                infoAudit(audit_type, fail_message);
            })        
        }
    }
    
    function infoAudit(audit, message){
        var page_number = $(".pagination>li[class=active]").children().html();
        if(audit == ADCONSTANT.AUDIT.FAILED && message == ""){
            alert("请输入失败原因");
            return;
        }
        
        var data = {
            user_id : choosed_user_id,
            audit : audit,
            idea_id : verify_idea_id
        }
        dealAction(data, audit, message);

        var param = {
            sinterface : SERVERCONF.ADMIN.ADUSERIDEAAUDIT,
            data: data
        }
        
        ajaxCall(param, function(err, data){
            if(err){
                alert("verify error");
            }else{
                initIdeaInfo(page_number - 1);
            }
        })
        $(".modal").modal("hide");
    }
}();