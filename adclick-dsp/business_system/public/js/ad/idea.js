/*
 * @file idea.js
 * @description idea page js logic fix version
 * @copyright dmtec.cn reserved, 2016
 * @author jiangtu
 * @date 2016.12.13
 * @version 1.0.1
 */
'use strict';
!function(){
    var mCreateIdea = null;
    var mIdeaModalForm = null;
    var mConversionModal = null;
    var mIdeaFormLabel = null;
    var mSubmitBtn = null;
    var mAssets = null;
    var mImpUrlDiv = null;
    var mClickUrlDiv = null;
    var mSourceView = null;
    var mErrMsg = null;
    var mSearchUnitBtn = null;
    var mDataSort = null;
    var mDataStatus = null;

    var mImgUrlDisplay = null;
    var mFlashUrlDisplay = null;
    var mVideoUrlDisplay = null;
    var mWordsImgUrlDisplay = null;

    //form value part
    var mIdeaName = null;
    var mUnitName = null;
    var mUnitId = null;
    var mPlanName = null;
    var mPlanId = null;
    var mViewTypeBtnGp = null;
    var mIdeaTypeBtnGp = null;
    var mOpenTypeBtnGp = null;
    var mSelectBtn = null;
    var mSlot = null;
    var mNotSlot = null;
    var mIdeaSlot = null;
    var mAdStyle = null;
    var mIdeaTradeFa = null;
    var mIdeaTrade = null;
    var mImpAddBtn = null;
    var mClickAddBtn = null;
    var mLandingPage = null;
    //assets
    var mATextTitle = null; //words
    var mATextDesc = null;
    var mAImgW = null; //img
    var mAImgH = null;
    var mAImgTitle = null;
    var mImgSource = null;
    var mAFlashW = null; //flash
    var mAFlashH = null;
    var mAFlashTitle = null;
    var mFlashSource = null;
    var mAVideoW = null; //video
    var mAVideoH = null;
    var mAVideoDura = null;
    var mAVideoXyRadio = null;
    var mAVideoTitle = null;
    var mVideoSource = null;
    var mANativeTitle = null; //native
    var mANativeDesc = null;
    var mANativeDescSup = null;
    var mANativePrice = null;
    var mANativeSalePrice = null;
    var mANativePhone = null;
    var mANativeAddress = null;
    var mANativeDisplayUrl = null;
    var mAImgTextTitle = null; //imgtext
    var mAImgTextDesc = null;
    var mAImgTextW = null;
    var mAImgTextH = null;
    var mImgTextSource = null;
    var mAH5 = null;//h5
    
    var mMaterialLibShowBtn = null;
    var mMaterialChooseCancelBtn = null;
    var mMaterialChooseBtn = null;
    var mMaterialLib = null;
    var mMaterialMain = null;
    var mMaterialMainBody = null;
    var mMaterialMainFooter = null;

    //conversion input
    var mConvTypeBtnGp = null;
    var mConvDate = null;
    var mConvAmount = null;
    var mConvSubmitBtn = null;
    var mConvQueryBtn = null;
    var mConvQueryRes = null;
    var mConvErrMsg = null;

    //variable
    var path_img = SERVERCONF.ADS.IDEAPIC.path;
    var path_flash = SERVERCONF.ADS.IDEAFLASH.path;
    var path_video = SERVERCONF.ADS.IDEAVIDEO.path;
    var choosed_idea_id = null;
    var list = null;
    var imp_url_count = 1;
    var click_url_count = 1;
    var user_type = 0; //0-normal user 1-vip user

    function initPageStaticElements(){
        mCreateIdea = $('#create-idea');
        mIdeaModalForm = $('#modal-idea-form');
        mConversionModal = $('#modal-conversion-form');
        mIdeaFormLabel = $('#idea-form-label');
        mSubmitBtn = $('#submit-idea-form');
        mAssets = $('#assets');
        mImpUrlDiv = $('#imp-url-part');
        mClickUrlDiv = $('#click-url-part');
        mSourceView = $('.source-view');
        mErrMsg = $('#err-msg');
        mSearchUnitBtn = $('#search-unit-list');
        mDataSort = $('#data-sort');
        mDataStatus = $('#idea-status');

        mImgUrlDisplay = $('#img-url-display');
        mFlashUrlDisplay = $('#flash-url-display');
        mVideoUrlDisplay = $('#video-url-display');
        mWordsImgUrlDisplay = $('#wordsImg-url-display');

        mIdeaName = $('#input-idea-name');
        mUnitName = $('#input-unit-name');
        mUnitId = $('#input-unit-id');
        mPlanName = $('#input-plan-name');
        mPlanId = $('#input-plan-id');
        mViewTypeBtnGp = $('#view-type-btn-group');
        mIdeaTypeBtnGp = $('#idea-type-btn-group');
        mOpenTypeBtnGp = $('#open-type-btn-group');
        mSelectBtn = $('.select-btn');
        mSlot = $('#slot');
        mNotSlot = $('#not-slot');
        mIdeaSlot = $('.input-idea-slots');
        mAdStyle = $('#ad-style');
        mIdeaTradeFa = $('#input-idea-trade-father');
        mIdeaTrade = $('#input-idea-trade');
        mImpAddBtn = $('#imp-monitor-url-btn');
        mClickAddBtn = $('#click-monitor-url-btn');
        mLandingPage = $('#input-landing-page');
        //assets
        mATextTitle = $('#input-assets-words-title'); //words
        mATextDesc = $('#input-assets-words-desc');
        mAImgW = $('#input-assets-img-width'); //img
        mAImgH = $('#input-assets-img-height');
        mAImgTitle = $('#input-assets-img-title');
        mImgSource = $('#input-assets-img-url');
        mAFlashW = $('#input-assets-flash-width'); //flash
        mAFlashH = $('#input-assets-flash-height');
        mAFlashTitle = $('#input-assets-flash-title');
        mFlashSource = $('#input-assets-flash-url');
        mAVideoW = $('#input-assets-video-width'); //video
        mAVideoH = $('#input-assets-video-height');
        mAVideoDura = $('#input-assets-video-duration');
        mAVideoXyRadio = $('#input-assets-video-xyradio');
        mAVideoTitle = $('#input-assets-video-title');
        mVideoSource = $('#input-assets-video-url');
        mANativeTitle = $('#input-assets-native-title'); //native
        mANativeDesc = $('#input-assets-native-desc');
        mANativeDescSup = $('#input-assets-native-desc2');
        mANativePrice = $('#input-assets-native-price');
        mANativeSalePrice = $('#input-assets-native-sale-price');
        mANativePhone = $('#input-assets-native-phone');
        mANativeAddress = $('#input-assets-native-address');
        mANativeDisplayUrl = $('#input-assets-native-display-url');
        mAImgTextTitle = $('#input-assets-wordsImg-title'); //imgtext
        mAImgTextDesc = $('#input-assets-wordsImg-desc');
        mAImgTextW = $('#input-assets-wordsImg-width');
        mAImgTextH = $('#input-assets-wordsImg-height');
        mImgTextSource = $('#input-assets-wordsImg-url');
        mAH5 = $('#input-assets-h5');
        
        mMaterialLibShowBtn = $('.material-lib-btn');
        mMaterialChooseCancelBtn = $('#material-choose-cancel');
        mMaterialChooseBtn = $('#material-choose');
        mMaterialLib = $('#material-lib');
        mMaterialMain = $('#material-main');
        mMaterialMainBody = $('#material-main-body');
        mMaterialMainFooter = $('#material-main-footer');

        mConvTypeBtnGp = $('#conversion-type-btn-group');
        mConvDate = $('#conversion-date');
        mConvAmount = $('#conversion-amount');
        mConvSubmitBtn = $('#submit-conversion-form');
        mConvQueryBtn = $('#conversion-query');
        mConvQueryRes = $('#conversion-result');
        mConvErrMsg = $('#conversion-err-msg');
    }

    $(function(){
        var current_tab = window.current_tab || "";
        initTabs(ad_tabs_config, current_tab);
        initPageStaticElements();
        if (current_tab == "idea") {
            initContentOfIdea();
            initIdeaTradeFa();
            initIdeaTrade();
        }

        initUserType();

        mCreateIdea.click(function(e){
            mSearchUnitBtn.removeClass("hidden");
            mErrMsg.html("");
            initForm();
            mSourceView.addClass("hidden");
            mIdeaModalForm.find("input[type=text]").val("");
            mIdeaFormLabel.html("新建广告创意");
            mIdeaName.prop("disabled", false);
            $("#input-unit-name").prop("disabled", false);
            mViewTypeBtnGp.find("input:first").click();
            mIdeaTypeBtnGp.find("input:first").click();
            mNotSlot.click();
            mIdeaSlot.prop("checked", false);
            mIdeaModalForm.modal("show");
            mSubmitBtn.unbind("click");
            mSubmitBtn.click(submitNewIdeaForm);
               
        });
        
        mDataSort.change(function(e){
            LoadIdeaList();
        });

        mDataStatus.change(function(e){
            LoadIdeaList();
        });

        mSelectBtn.click(function(e){
            $(this).addClass("btn-primary");
            $(this).siblings().removeClass("btn-primary");
            if(mNotSlot.hasClass("btn-primary")){
                mIdeaSlot.prop("disabled", true);
                mIdeaSlot.prop("checked", false);
                mIdeaSlot.parents(".form-group").addClass("hidden");
            }
            if(mSlot.hasClass("btn-primary")){
                mIdeaSlot.prop("disabled", false);
                mIdeaSlot.parents(".form-group").removeClass("hidden");
            }
        });

        mIdeaTypeBtnGp.children("input").click(function(){
            var type = $(this).val();
            mAssets.children("div").addClass("hidden");
            mAssets.children("div").each(function(){
                if($(this).hasClass(type)){
                $(this).removeClass("hidden");
                }
            });
        });

        mImpAddBtn.click(function(e){
            addImpUrl();
        });

        mImpUrlDiv.on("click", ".del-url-input", function(){
            imp_url_count --;
            $(this).parent().parent().remove();
            mImpAddBtn.attr("disabled", false);
        });

        mClickAddBtn.click(function(e){
            addClickUrl();
        });

        mClickUrlDiv.on("click", ".del-url-input", function(){
            click_url_count --;
            $(this).parent().parent().remove();
            mClickAddBtn.attr("disabled", false);
        });

        mSearchUnitBtn.click(function(){
            mPlanId.val("");
            mPlanName.val("");
            mUnitId.val("");
            mUnitName.val("");
            initUnitList($("#input-unit-name").val());
        });
        initUnitList("");
        //mSearchUnitBtn.click();

        mIdeaModalForm.on('mousedown','.es-list li',function(){
            var data_id = $(this).attr("data-id");
            var unit_id = selectUnitData.list[data_id].unit_id;
            var plan_id = selectUnitData.list[data_id].plan_id;
            var plan_name = selectUnitData.list[data_id].plan_name;
            mUnitId.val(unit_id);
            mPlanId.val(plan_id);
            mPlanName.val(plan_name);
        });
        
        //material library
        mMaterialLibShowBtn.click(function(){
            var idea_type = mIdeaTypeBtnGp.find("input[class*=btn-primary]").val();
            if(idea_type == ADCONSTANT.IDEATYPE.IMAGE || idea_type == ADCONSTANT.IDEATYPE.IMAGETEXT){
                if(idea_type == ADCONSTANT.IDEATYPE.IMAGE){
                    var img_width = mAImgW.val();
                    var img_height = mAImgH.val();
                }else if(idea_type == ADCONSTANT.IDEATYPE.IMAGETEXT){
                    var img_width = mAImgTextW.val();
                    var img_height = mAImgTextH.val();
                }
                
                if(!isPInt(img_width) || !isPInt(img_height)){
                    alert("图片宽，高必须为正整数！");
                }else{
                    mMaterialLib.removeClass("hidden");
                    if(mMaterialMainBody.html() == "" || mMaterialMainBody.attr("data-type") != ADCONSTANT.IDEATYPE.IMAGE 
                        || mMaterialMainBody.attr("data-width") != img_width || mMaterialMainBody.attr("data-height") != img_height){
                        initMaterialLib(ADCONSTANT.IDEATYPE.IMAGE, img_width, img_height);
                    }
                }
            }else if(idea_type == ADCONSTANT.IDEATYPE.FLASH){
                var flash_width = mAFlashW.val();
                var flash_height = mAFlashH.val();
                if(!isPInt(flash_width) || !isPInt(flash_height)){
                    alert("flash宽，高必须为正整数！");
                }else{
                    mMaterialLib.removeClass("hidden");
                    if(mMaterialMainBody.html() == "" || mMaterialMainBody.attr("data-type") != ADCONSTANT.IDEATYPE.FLASH 
                        || mMaterialMainBody.attr("data-width") != flash_width || mMaterialMainBody.attr("data-height") != flash_height){
                        initMaterialLib(ADCONSTANT.IDEATYPE.FLASH, flash_width, flash_height);
                    }
                }
            }else{
                var video_width = mAVideoW.val();
                var video_height = mAVideoH.val();
                var video_dura = mAVideoDura.val();
                var video_radio = mAVideoXyRadio.val();
                if(!isPInt(video_width) || !isPInt(video_height) || !isPInt(video_dura)){
                    alert("视屏宽，高，时长必须为正整数！");
                }else{
                    mMaterialLib.removeClass("hidden");
                    if(mMaterialMainBody.html() == "" || mMaterialMainBody.attr("data-type") != ADCONSTANT.IDEATYPE.VIDEO 
                        || mMaterialMainBody.attr("data-width") != video_width || mMaterialMainBody.attr("data-height") != video_height
                        || mMaterialMainBody.attr("data-dura") != video_dura || mMaterialMainBody.attr("data-ratio") != video_radio){
                        initMaterialLib(ADCONSTANT.IDEATYPE.VIDEO, video_width, video_height, 0,10,video_dura, video_radio);
                    }
                }
            }
        });
        
        mMaterialChooseCancelBtn.click(function(){
            mMaterialLib.addClass("hidden");
            mMaterialMainBody.html("");
            temp_fileUrl = null;
        });
        
        mMaterialChooseBtn.click(function(){
            if(mMaterialMainBody.children(".material-item-choosed").length == 0){
                alert("请选择素材");
            }else{
                if(mIdeaFormLabel.html() == "新建广告创意"){
                    fileUrl = temp_fileUrl;
                    mMaterialLib.addClass("hidden");
                }else if(mIdeaFormLabel.html() == "编辑广告创意"){
                    confirm("确认替换素材？", function(){
                        fileUrl = temp_fileUrl;
                        mMaterialLib.addClass("hidden");
                        var idea_type = mIdeaTypeBtnGp.find("input[class*=btn-primary]").val();
                        if(idea_type == ADCONSTANT.IDEATYPE.IMAGE){
                            mImgUrlDisplay.html(fileUrl);
                            mImgSource.attr("href", fileUrl);
                        }else if(idea_type == ADCONSTANT.IDEATYPE.FLASH){
                            mFlashUrlDisplay.html(fileUrl);
                            mFlashSource.attr("href", fileUrl);
                        }else if(idea_type == ADCONSTANT.IDEATYPE.VIDEO){
                            mVideoUrlDisplay.html(fileUrl);
                            mVideoSource.attr("href", fileUrl);
                        }else if(idea_type == ADCONSTANT.IDEATYPE.IMAGETEXT){
                            mWordsImgUrlDisplay.html(fileUrl);
                            mImgTextSource.attr("href", fileUrl);
                        }else{}
                    })
                }
                
            }
        });
    });
    
    function initUserType(){
        var param = {
            sinterface : SERVERCONF.USERS.USERTYPE,
            data : {}
        };
        ajaxCall(param, function(err, data){
            if(err){
                console.log("用户类型获取失败");
            }else{
                user_type = data.user_type;
            }
        });
    }

    //function init material library due to idea_type and other param
    function initMaterialLib(type, width, height, index, count, duration, ratio){
        mMaterialMainBody.attr("data-type", type);
        mMaterialMainBody.attr("data-width", width);
        mMaterialMainBody.attr("data-height", height);
        if(duration){
            mMaterialMainBody.attr("data-dura", duration);
        }
        if(ratio){
            mMaterialMainBody.attr("data-ratio", ratio);
        }
        var index = parseInt(index) || 0;
        var count = parseInt(count) || 10;
        function scb(data){
            if(data.size == 0){
                mMaterialMainBody.html("");
                mMaterialMainFooter.html("该尺寸素材在素材库中不存在！");
                mMaterialChooseBtn.prop("disabled", true);
            }else{
                mMaterialChooseBtn.prop("disabled", false);
                try{
                    var total = data.total;
                    var list = data.list;
                    var pagenumber = Math.ceil(total / count);
                    var material_list = [];
                    for(var i = 0; i < list.length; i++){
                        var item = list[i];
                        var wrap = $("<div class='material-item' style='position: relative;'></div>");
                        wrap.click(function(e){
                            $(this).toggleClass("material-item-choosed");
                            $(this).siblings().removeClass("material-item-choosed");
                            temp_fileUrl = $(this).children("img").attr("data-src");
                        });
                        material_list.push(wrap);
                        if(type == ADCONSTANT.IDEATYPE.IMAGE || type == ADCONSTANT.IDEATYPE.IMAGETEXT){
                            var img = $("<img src='" + item.url + "' class='pimg' title='" + item.asset_name + "'>");
                        }else{
                            var img = $("<img src='" + item.thumbnail + "' class='pimg' title='" + item.asset_name + "'>");
                        }
                        img.attr("data-src", item.url);
                        imgDisplay(img, width, height);
                        wrap.append(img);
                        var big_icon = $("<span class='glyphicon glyphicon-search' title='查看大图' aria-hidden='true' " +
                                           "style='position: absolute;right:2px;cursor:pointer;'></span>");
                        big_icon.click(function(e){
                            var show_img = $(this).siblings("img");
                            imgShow("#outerdiv", "#innerdiv", "#bigimg", show_img);
                            e.stopPropagation();
                        });
                        wrap.append(big_icon);
                        if(type == ADCONSTANT.IDEATYPE.FLASH || type == ADCONSTANT.IDEATYPE.VIDEO){
                            var play = $("<a target='_blank' href='" + item.url + "'style='font-size:20px;'><span class='glyphicon glyphicon-play-circle'" +
                                            "title='播放' aria-hidden='true' style='position: absolute;right:38px;top:38px;cursor:pointer;'></span></a>");
                            play.click(function(e){
                                e.stopPropagation();
                            })
                            wrap.append(play);
                        }
                        
                    }
                    mMaterialMainBody.html("");
                    mMaterialMainBody.append(material_list);
                    
                    setMaterialFoot(pagination(index, 5, pagenumber, function(t, e) {
                        initMaterialLib(type, width, height, parseInt(t.hash.replace("#", "")));
                    }));
                }catch(e){
                    ecb();
                }
            }
        }
        
        function ecb(data){
            
        }
        var data = {
            asset_type: type,
            width: width,
            height: height,
            index: index,
            count: count,
        }
        if(type == ADCONSTANT.IDEATYPE.VIDEO){
            data.duration = duration;
            data.ratio = ratio;
        }
        var param = {
            sinterface : SERVERCONF.ADS.ASSERTLIST,
            data : data
        };
        ajaxCall(param, function(err, data){
            if(err){
                ecb();
            }else{
                scb(data);
            }
        });
    }

    function imgShow(outerdiv, innerdiv, bigimg, _this){  
        var src = _this.attr("src");//获取当前点击的pimg元素中的src属性  
        $(bigimg).attr("src", src);//设置#bigimg元素的src属性  

        /*获取当前点击图片的真实大小，并显示弹出层及大图*/  
        $("<img/>").attr("src", src).load(function(){  
            var windowW = $("#outerdiv").width();//获取当前窗口宽度  
            var windowH = $("#outerdiv").height();//获取当前窗口高度  
            var realWidth = this.width;//获取图片真实宽度  
            var realHeight = this.height;//获取图片真实高度  
            var imgWidth, imgHeight;  
            var scale = 0.8;//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放  

            if(realHeight>windowH*scale) {//判断图片高度  
                imgHeight = windowH*scale;//如大于窗口高度，图片高度进行缩放  
                imgWidth = imgHeight/realHeight*realWidth;//等比例缩放宽度  
                if(imgWidth>windowW*scale) {//如宽度扔大于窗口宽度  
                    imgWidth = windowW*scale;//再对宽度进行缩放  
                }  
            }else if(realWidth>windowW*scale) {//如图片高度合适，判断图片宽度  
                imgWidth = windowW*scale;//如大于窗口宽度，图片宽度进行缩放  
                imgHeight = imgWidth/realWidth*realHeight;//等比例缩放高度  
            }else{//如果图片真实高度和宽度都符合要求，高宽不变  
                imgWidth = realWidth;  
                imgHeight = realHeight;  
            }  
            $(bigimg).css("width",imgWidth);//以最终的宽度对图片缩放  

            var w = (windowW-imgWidth)/2;//计算图片与窗口左边距  
            var h = (windowH-imgWidth*realHeight/realWidth)/2;//计算图片与窗口上边距  
            $(innerdiv).css({"top":h, "left":w});//设置#innerdiv的top和left属性  
            $(outerdiv).fadeIn("fast");//淡入显示#outerdiv及.pimg  
        });  

        $(outerdiv).click(function(){//再次点击淡出消失弹出层  
            $(this).fadeOut("fast");  
        });  
    } 
    
    function setMaterialFoot(element){
        mMaterialMainFooter.html("");
        mMaterialMainFooter.append(element);
    }
    
    function imgDisplay(image, width, height){
        if(width/height >= 1){
            image.css("width", "88px");
            var img_margin_top = (88 - 88*height/width)/2;
            image.css("margin-top", img_margin_top);
        }else{
            image.css("height", "88px");
            var img_margin_left = (88 - 88*width/height)/2;
            image.css("margin-left", img_margin_left);
        } 
    }
    
    function initContentOfIdea(){
        LoadIdeaList();
    }

    function LoadIdeaList(index, count){
        var tid = "#idea-list";
        emptyTbody(tid);
        setTfoot(tid, spinLoader("数据加载中，请稍候..."));
        var index = parseInt(index) || 0;
        var count = parseInt(count) || 10;
        function scb(data) {
            if(data.size == 0){
                setTfoot(tid, stringLoadFail("没有数据"));
            }else{
                try{
                    var total = data.total;
                    list = data.list;
                    var pagenumber = Math.ceil(total / count);
                    var rows = [];
                    for(var i = 0;i < list.length; i++){
                        var item = list[i];
                        var row = $("<tr></tr>");
                        row.attr("data-id", i);
                        row.attr("data-idea-id", item.idea_id);
                        row.attr("data-plan-id", item.plan_id);
                        row.attr("data-unit-id", item.unit_id);
                        row.append($("<td>" + item.idea_name + "</td>"));
                        var wrapper = $("<div class=\"switch\"></div>");
                        var status = $("<input type=\"checkbox\" data-size=\"mini\" data-on-color=\"success\" data-off-color=\"warning\"></input>");
                        if (item.idea_status == "启用") {
                            status.attr("checked", true);
                        }
                        wrapper.append(status);
                        row.append($("<td></td>").append(wrapper));
                        row.append($("<td>" + item.unit_name + "</td>"));
                        row.append($("<td>" + item.plan_name + "</td>"));
                        row.append($("<td>" + item.idea_type + "</td>"));
                        row.append($("<td>" + item.adview_type + "</td>"));
                        row.append($("<td>" + item.audit_status + "</td>"));
                        if(item.audit_status == ADCONSTANT.CHECK.FAILED){
                            row.append($("<td>" + item.failure_message + "</td>"));
                        }else{
                            row.append($("<td>-</td>"));
                        }
                        row.append($("<td>" + item.create_time + "</td>"));
                        row.append($("<td>" + item.update_time + "</td>"));
                        var actions = $("<td></td>");
                        row.append(actions);
                        var edit = $("<button type=\"button\" class=\"btn btn-xs btn-link\">编辑</button>");
                        edit.click(function(e){
                            mSearchUnitBtn.addClass("hidden");
                            mErrMsg.html("");
                            initForm(); 
                            choosed_idea_id = parseInt($(this).parents("tr").attr("data-idea-id"));
                            var choosed_data_id = parseInt($(this).parents("tr").attr("data-id"));
                            var idea_type = list[choosed_data_id].idea_type;
                            //mSourceView.removeClass("hidden");
                            mSourceView.each(function(){
                                if($(this).parent().hasClass(idea_type)){
                                    $(this).removeClass("hidden");
                                }else{
                                    $(this).addClass("hidden");
                                }
                            })
                            editIdea(choosed_idea_id, choosed_data_id);
                        });
                        actions.append(edit);  
                        var del = $("<button type=\"button\" class=\"btn btn-xs btn-link\">删除</button>");
                        del.click(function(e){
                            choosed_idea_id = parseInt($(this).parents("tr").attr("data-idea-id"));
                            delIdea(choosed_idea_id);
                        })
                        actions.append(del);
                        var audit = $("<button type=\"button\" class=\"btn btn-xs btn-link\">提交审核</button>");
                        if(item.audit_status == ADCONSTANT.CHECK.UNSUBMIT){
                            audit.click(function(e){
                                var choosed_data_id = parseInt($(this).parents("tr").attr("data-id"));
                                choosed_idea_id = parseInt($(this).parents("tr").attr("data-idea-id"));
                                var idea_plan_id = parseInt($(this).parents("tr").attr("data-plan-id"));
                                var idea_unit_id = parseInt($(this).parents("tr").attr("data-unit-id"));
                                auditIdea(choosed_idea_id, idea_plan_id, idea_unit_id);
                            })
                        }else if(item.audit_status == ADCONSTANT.CHECK.FAILED){
                            audit.click(function(e){
                                alert("审核失败！请根据失败原因重新修改创意并提交");
                            });
                        }else if(item.audit_status == ADCONSTANT.CHECK.VERIFYING){
                            audit.click(function(e){
                                alert("审核中！请耐心等待");
                            });
                        }else if(item.audit_status == ADCONSTANT.CHECK.PASS){
                            audit.click(function(e){
                                alert("恭喜您，该创意审核通过！");
                            });
                        }
                        actions.append(audit);

                        // var conversion = $("<button type=\"button\" class=\"btn btn-xs btn-link\">转化录入</button>");
                        // conversion.click(function(){
                        //     var choosed_data_id = parseInt($(this).parents("tr").attr("data-id"));
                        //     choosed_idea_id = parseInt($(this).parents("tr").attr("data-idea-id"));
                        //     var idea_plan_id = parseInt($(this).parents("tr").attr("data-plan-id"));
                        //     var idea_unit_id = parseInt($(this).parents("tr").attr("data-unit-id"));
                        //     eidtConversion(choosed_idea_id, idea_unit_id, idea_plan_id, choosed_data_id);
                        // });
                        // actions.append(conversion);

                        if(user_type == 1 && item.bid_type == "CPT"){
                            if(item.assets.primer == 1){
                                var primer = $("<button type=\"button\" class=\"btn btn-xs btn-link\">取消打底</button>");
                                primer.click(function(e){
                                    choosed_idea_id = parseInt($(this).parents("tr").attr("data-idea-id"));
                                    primerUpdate(0);
                                })
                            }else{
                                var primer = $("<button type=\"button\" class=\"btn btn-xs btn-link\">设为打底</button>");
                                primer.click(function(e){
                                    choosed_idea_id = parseInt($(this).parents("tr").attr("data-idea-id"));
                                    primerUpdate(1);
                                })
                            }
                            actions.append(primer);
                        }
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
                        var idea_id = $(this).parents("tr").attr("data-idea-id");
                        toggleIdea(idea_id, state, scb, ecb);
                    });
                    setTfoot(tid, pagination(index, 5, pagenumber, function(t, e) {
                        LoadIdeaList(parseInt(t.hash.replace("#", "")));
                    }));

                }catch(e) {
                    ecb();
                }
            }
        }

        function ecb(r){
            emptyTbody(tid);
            setTfoot(tid, stringLoadFail());            
        }

        var param = {
            sinterface : SERVERCONF.ADS.IDEALIST,
            data: {
                index: index,
                count: count,
                sort: mDataSort.val(),
                status: mDataStatus.val(),
            }
        }
        ajaxCall(param, function(err, data){
            if(err){
                ecb();
            }else{
                scb(data);
            }
        })

    }

    function primerUpdate(val){
        var page_number = $(".pagination>li[class=active]").children().html();
        var param = {
            sinterface : SERVERCONF.ADS.IDEAPRIMERUPDATE,
            data: {
                idea_id: choosed_idea_id,
                primer: val
            }
        }
        ajaxCall(param, function(err, data){
            if(err){
                alert("设置失败");
            }else{
                LoadIdeaList(page_number - 1);
            }
        })
    }

    function initConverseFormDatetimePicker() {
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
        mConvDate.val(dataAdd("d", -1, now).format("yyyy-MM-dd"));
    }

    function submitConversion(idea_id, unit_id, plan_id){
        if(mConvDate.val() == ""){
           setInfoDiv(mConvErrMsg, "error", "日期不能为空");
        }else if(!isPInt(mConvAmount.val())){
           setInfoDiv(mConvErrMsg, "error", "转化量应为正整数");
        }else{
            var type = mConvTypeBtnGp.find("input").eq(0).hasClass("btn-primary")?0:1;
            var data = {
                type: type,
                idea_id: idea_id,
                unit_id: unit_id,
                plan_id: plan_id,
                date: mConvDate.val(),
                conversion: parseInt(mConvAmount.val())
            };
            var param = {
                sinterface: SERVERCONF.ADS.CONVERSIONADD,
                data: data
            };

            ajaxCall(param, function(err, data){
                if(err){
                }else{
                    mConversionModal.modal("hide");
                }
            });
        }
    }

    function queryConversion(idea_id){
        if(mConvDate.val() == ""){
           setInfoDiv(mConvErrMsg, "error", "日期不能为空");
        }else{
            var data = {
                idea_id: idea_id,
                date: mConvDate.val()
            };

            var param = {
                sinterface: SERVERCONF.ADS.CONVERSIONQUERY,
                data: data
            };

            ajaxCall(param, function(err, data){
                if(err){
                    mConvQueryRes.html("暂未录入");
                }else{
                    mConvQueryRes.html(data.conversion);
                }
            });
        }
    }

    function eidtConversion(idea_id, unit_id, plan_id, data_id){
        mConversionModal.find(".modal-header h4").html("转化数据录入<i>（" + list[data_id].idea_name + "）</i>");
        initConverseFormDatetimePicker();
        mConvQueryRes.html("");
        mConvAmount.val("");
        mConversionModal.modal("show");

        mConvSubmitBtn.unbind("click");
        mConvQueryBtn.unbind("click");
        mConvSubmitBtn.click(function(){
            submitConversion(idea_id, unit_id, plan_id);
        });
        mConvQueryBtn.click(function(){
            queryConversion(idea_id);
        });
    }

    function editIdea(idea_id, data_id){
        mIdeaModalForm.modal("show");
        mIdeaModalForm.find("input[type=text]").val("");
        mIdeaFormLabel.html("编辑广告创意");
        //set form value
        mIdeaName.val(list[data_id].idea_name);
        mIdeaName.prop("disabled", true);
        $("#input-unit-name").val(list[data_id].unit_name);
        $("#input-unit-name").prop("disabled", true);

        mUnitId.val(list[data_id].unit_id);
        mPlanId.val(list[data_id].plan_id);
        mPlanName.val(list[data_id].plan_name);
        mViewTypeBtnGp.find("input[value=" + list[data_id].adview_type + "]").click();
        mIdeaTypeBtnGp.find("input[value=" + list[data_id].idea_type + "]").click();
        var open_type = list[data_id].assets.open_type?list[data_id].assets.open_type: '站内';
        var style = list[data_id].assets.style?list[data_id].assets.style: '默认';
        var h5 = list[data_id].assets.h5?list[data_id].assets.h5: '';
        mOpenTypeBtnGp.find("input[value=" + open_type + "]").click();
        mAdStyle.val(style);
        mAH5.val(h5);
        //set slots
        if(list[data_id].idea_slots.length == 0){
            mNotSlot.click();
        }else{
            mSlot.click();
        }
        mIdeaSlot.prop("checked", false);
        for(var i = 0; i < list[data_id].idea_slots.length; i++){
            mIdeaSlot.filter("input[value=" + list[data_id].idea_slots[i].type + "]").prop("checked", true);
        }
        //set trade
        //var number = list[data_id].idea_trade.split('-')[0].replace("IAB", '');
        var number = list[data_id].idea_trade.substring(0, 2);
        mIdeaTradeFa.val(number);
        mIdeaTradeFa.change();
        mIdeaTrade.val(list[data_id].idea_trade);

        mLandingPage.val(list[data_id].landing_page);

        //set imp and click url
        if(list[data_id].imp_monitor_urls == undefined){                                    
        }else{
            $('.imp-url').eq(0).val(list[data_id].imp_monitor_urls[0]);
            var imp_length = list[data_id].imp_monitor_urls.length;
            for(var i = 0; i < imp_length - 1 ; i++){
                mImpAddBtn.click();
                $('.imp-url').eq(i+1).val(list[data_id].imp_monitor_urls[i+1]);
            }                         
        } 
        if(list[data_id].click_monitor_urls == undefined){                                    
            }else{
            $('.click-url').eq(0).val(list[data_id].click_monitor_urls[0]);
            var click_length = list[data_id].click_monitor_urls.length;
            for(var i = 0; i < click_length - 1 ; i++){
                mClickAddBtn.click();
                $('.click-url').eq(i+1).val(list[data_id].click_monitor_urls[i+1]);
            }
        }

        //set assets
        if(list[data_id].idea_type == ADCONSTANT.IDEATYPE.TEXT){
            mATextTitle.val(list[data_id].assets.title);
            mATextDesc.val(list[data_id].assets.desc);
        }else if(list[data_id].idea_type == ADCONSTANT.IDEATYPE.IMAGE){
            fileUrl = list[data_id].assets.main_img.url;
            mImgUrlDisplay.html(list[data_id].assets.main_img.url);
            mImgSource.attr("href", list[data_id].assets.main_img.url);
            mAImgTitle.val(list[data_id].assets.title);
            mAImgW.val(list[data_id].assets.main_img.w);
            mAImgH.val(list[data_id].assets.main_img.h);
        }else if(list[data_id].idea_type == ADCONSTANT.IDEATYPE.FLASH){
            fileUrl = list[data_id].assets.flash.url;
            mFlashUrlDisplay.html(list[data_id].assets.flash.url);
            mFlashSource.attr("href", list[data_id].assets.flash.url);
            mAFlashTitle.val(list[data_id].assets.title);
            mAFlashW.val(list[data_id].assets.flash.w);
            mAFlashH.val(list[data_id].assets.flash.h);
        }else if(list[data_id].idea_type == ADCONSTANT.IDEATYPE.VIDEO){
            fileUrl = list[data_id].assets.video.url;
            mVideoUrlDisplay.html(list[data_id].assets.video.url);
            mVideoSource.attr("href", list[data_id].assets.video.url);
            mAVideoTitle.val(list[data_id].assets.title);
            mAVideoW.val(list[data_id].assets.video.w);
            mAVideoH.val(list[data_id].assets.video.h);
            mAVideoDura.val(list[data_id].assets.video.duration);
            mAVideoXyRadio.val(list[data_id].assets.video.xy_ratio);
        }else if(list[data_id].idea_type == ADCONSTANT.IDEATYPE.NATIVE){
            mANativeTitle.val(list[data_id].assets.title);
            mANativeDesc.val(list[data_id].assets.desc);
            mANativeDescSup.val(list[data_id].assets.desc2);
            mANativePrice.val(list[data_id].assets.price);
            mANativeSalePrice.val(list[data_id].assets.sale_price);
            mANativePhone.val(list[data_id].assets.phone);
            mANativeAddress.val(list[data_id].assets.address);
            mANativeDisplayUrl.val(list[data_id].assets.display_url);
        }else if(list[data_id].idea_type == ADCONSTANT.IDEATYPE.IMAGETEXT){
            fileUrl = list[data_id].assets.main_img.url;
            mWordsImgUrlDisplay.html(list[data_id].assets.main_img.url);
            mImgTextSource.attr("href", list[data_id].assets.main_img.url);
            mAImgTextTitle.val(list[data_id].assets.title);
            mAImgTextDesc.val(list[data_id].assets.desc)
            mAImgTextW.val(list[data_id].assets.main_img.w);
            mAImgTextH.val(list[data_id].assets.main_img.h);
        }
        //set form value end

        mSubmitBtn.unbind("click");
        mSubmitBtn.click(function(){
            submitEditIdeaForm(data_id);
        });
    }

    function delIdea(id){
        var page_number = $(".pagination>li[class=active]").children().html();
        var list_length = $("#idea-list tbody>tr").length;
        confirm("确认删除该创意？", function(){
            var param = {
                sinterface : SERVERCONF.ADS.IDEADEL,
                data : {
                    idea_id: id
                }
            };
            ajaxCall(param, function(err, data){
                if(err){
                    alert("未能成功删除");
                }else{
                    if(page_number > 1 && list_length == 1){
                        LoadIdeaList(page_number - 2);
                    }else{
                        LoadIdeaList(page_number - 1);
                    }     
                }
            });
        })
    }

    function auditIdea(id, plan_id, unit_id){
        confirm("确认提交审核？", function(){
            var page_number = $(".pagination>li[class=active]").children().html();
            var param = {
                sinterface : SERVERCONF.ADS.IDEASUBMITAUDIT,
                data :{
                    ideas:[
                         {
                              idea_id: id,
                              plan_id: plan_id,
                              unit_id: unit_id
                         }
                    ]
                }
            };
            ajaxCall(param, function(err, data){
                if(err){
                    alert("未能成功提交审核");
                }else{
                    LoadIdeaList(page_number - 1);
                }
            });
        })
    }

    function toggleIdea(idea_id, toggle, scb, ecb){
        var param = {
            sinterface : SERVERCONF.ADS.IDEAOP,
            data: {
                idea_id: idea_id,
                action: toggle ? ADCONSTANT.ADACTION.START : ADCONSTANT.ADACTION.PAUSE
            }
        }
        ajaxCall(param, function(err, data){
            if(err){
                ecb
            }else{
                scb
            }
        });
    }

    //add input when click add imp_url btn
    function addImpUrl(){
        imp_url_count ++;
        mImpUrlDiv.append("<div class='form-group'>" + 
                             "<label for='' class='col-sm-2 col-md-2 col-lg-2 control-label'> </label>" + 
                             "<div class='col-sm-6 col-md-6 col-lg-6'>" + 
                                "<input type='text' class='form-control input-sm imp-url'>" + 
                              "</div>" + 
                              "<div class='col-sm-1 col-md-1 col-lg-1'><button type='button' class='btn btn-sm del-url-input' style='line-height: 1.42857143; width:29px'>-</button>" + 
                           "</div></div> ");
        if(imp_url_count > 2){
            mImpAddBtn.attr("disabled", true);
        }
        
    }

    //add input when click add click_url btn
    function addClickUrl(){
        click_url_count ++;
        mClickUrlDiv.append("<div class='form-group'>" + 
                              "<label for='' class='col-sm-2 col-md-2 col-lg-2 control-label'> </label>" + 
                              "<div class='col-sm-6 col-md-6 col-lg-6'>" + 
                                "<input type='text' class='form-control input-sm click-url'>" + 
                              "</div>" + 
                               "<div class='col-sm-1 col-md-1 col-lg-1'><button type='button' class='btn btn-sm del-url-input' style='line-height: 1.42857143; width:29px'>-</button>" + 
                             "</div></div> ");
        if(click_url_count > 2){
            mClickAddBtn.attr("disabled", true);
        }
    }

    //aubmit add idea
    function submitNewIdeaForm(){
        var page_number = $(".pagination>li[class=active]").children().html();
        var idea_name = mIdeaName.val();
        var plan_id = mPlanId.val();
        var unit_id = mUnitId.val();
        var adview_type = mViewTypeBtnGp.find("input[class*=btn-primary]").val();
        var idea_type = mIdeaTypeBtnGp.find("input[class*=btn-primary]").val();
        var open_type = mOpenTypeBtnGp.find("input[class*=btn-primary]").val();
        var h5 = mAH5.val();
        var style = mAdStyle.val();
        //slots
        var idea_slots = new Array();
        mIdeaSlot.each(function(){            
            if($(this).prop("checked") == true){
                var slot = $(this).val();
                var json_slot = {"type": slot};
                idea_slots.push(json_slot);
            }            
        })
        var idea_trade = mIdeaTrade.val();
        var landing_page = mLandingPage.val();
        
        //imp and click url
        var imp_monitor_urls = new Array();
        $(".imp-url").each(function(){
            if($(this).val() == ""){
            }else{
                imp_monitor_urls.push($(this).val());
            }
        })
        for(var i = 0; i < imp_monitor_urls.length; i++){
            if(!isUrl(imp_monitor_urls[i])){
                setInfoDiv(mErrMsg, "error","请输入正确的展现监控");
                return;
            }
        }
        
        var click_monitor_urls = new Array();
        $(".click-url").each(function(){
            if($(this).val() == ""){
                console.log("1");
            }else{
                console.log($(this).val());
                click_monitor_urls.push($(this).val());
            }
        })
        for(var i = 0; i < click_monitor_urls.length; i++){
            if(!isUrl(click_monitor_urls[i])){
                setInfoDiv(mErrMsg, "error","请输入正确的点击监控");
                return;
            }
        }
            
        if(idea_name == ""){
            setInfoDiv(mErrMsg, "error","请输入创意名称");
            return;
        }else if(plan_id == ""){
            setInfoDiv(mErrMsg, "error","请选择创意所属广告单元，广告计划");
            return;
        }else if(idea_trade == null || idea_trade == 0){
            setInfoDiv(mErrMsg, "error","请选择创意所属行业");
            return;
        }else if(!isUrl(landing_page)){
            setInfoDiv(mErrMsg, "error","请输入正确的落地页");
            return;
        }
        
        //assets part
        if(idea_type == ADCONSTANT.IDEATYPE.TEXT){
            var title = mATextTitle.val();
            var desc = mATextDesc.val();
            var assets = {"title": title, "desc": desc, "open_type": open_type, "h5": h5, "style": style};
            if(title == "" || desc == ""){
                setInfoDiv(mErrMsg, "error", "请补全文字标题和描述");
                return;
            }
        }else if(idea_type == ADCONSTANT.IDEATYPE.IMAGE){
            //img value
            var width = mAImgW.val();
            var height = mAImgH.val();
            var title = mAImgTitle.val();
            var assets = {
                "title": title,
                "open_type": open_type,
                "h5": h5,
                "style": style,
                "main_img":{
                   "url": fileUrl,
                    "w": width,
                    "h": height,
                }
            }
            if(title == ""){
                setInfoDiv(mErrMsg, "error","请输入图片标题");
                return;
            }else if(!isPInt(width) || !isPInt(height)){
                setInfoDiv(mErrMsg, "error","图片宽、高必须为正整数");
                return;
            }else if(fileUrl == null){
                setInfoDiv(mErrMsg, "error","请上传图片");
                return;
            }
        }else if(idea_type == ADCONSTANT.IDEATYPE.FLASH){
            var width = mAFlashW.val();
            var height = mAFlashH.val();
            var title = mAFlashTitle.val();
            var assets = {
                "title": title,
                "open_type": open_type,
                "h5": h5,
                "style": style,
                "flash": {
                    "url": fileUrl,
                    "w": width,
                    "h": height 
                }
            }
            if(title == ""){
                setInfoDiv(mErrMsg, "error", "请输入flash标题");
                return;
            }else if(!isPInt(width) || !isPInt(height)){
                setInfoDiv(mErrMsg, "error","flash宽、高必须为正整数");
                return;
            }else if(fileUrl == null){
                setInfoDiv(mErrMsg, "error","请上传flash");
                return;
            }
        }else if(idea_type == ADCONSTANT.IDEATYPE.VIDEO){
            var width = mAVideoW.val();
            var height = mAVideoH.val();
            var duration = mAVideoDura.val();
            var xyradio = mAVideoXyRadio.val();
            var title = mAVideoTitle.val();
            var assets = {
                "title": title,
                "open_type": open_type,
                "h5": h5,
                "style": style,
                "video": {
                    "url": fileUrl,
                    "duration": duration,
                    "w": width,
                    "h": height,
                    "xy_ratio": xyradio
                }
            }
            if(title == ""){
                setInfoDiv(mErrMsg, "error","请输入视频标题");
                return;
            }else if(!isPInt(width) || !isPInt(height) || !isPInt(duration)){
                setInfoDiv(mErrMsg, "error","视频宽、高和时长必须为正整数");
                return;
            }else if(fileUrl == null){
                setInfoDiv(mErrMsg, "error","请上传视频");
                return;
            }
        }else if(idea_type == ADCONSTANT.IDEATYPE.NATIVE){
            var title = mANativeTitle.val();
            var desc = mANativeDesc.val();
            var desc2 = mANativeDescSup.val();
            var price = mANativePrice.val();
            var sale_price = mANativeSalePrice.val();
            var phone = mANativePhone.val();
            var address = mANativeAddress.val();
            var display_url = mANativeDisplayUrl.val();
            var assets = {
                "title": title,
                "open_type": open_type,
                "h5": h5,
                "style": style,
                "desc": desc,
                "desc2": desc2,
                "price": price,
                "sale_price": sale_price,
                "phone": phone,
                "address": address,
                "display_url": display_url
            }
            if(title == "" || desc == "" || desc2 == ""){
                setInfoDiv(mErrMsg, "error","请补全原生标题，描述和补充说明");
                return;         
            }else if(!isMoney(price) || !isMoney(sale_price)){
                setInfoDiv(mErrMsg, "error","原始价格和折后价格有误，必须大于0，最高精确到0.01元");
                return;
            }else if(!isMobile(phone)){
                setInfoDiv(mErrMsg, "error","手机号码有误");
                return;
            }else if(address == ""){
                setInfoDiv(mErrMsg, "error","联系地址不能为空");
                return;
            }else if(!isUrl(display_url)){
                setInfoDiv(mErrMsg, "error","广告链接格式有误");
                return;
            }
        }else if(ADCONSTANT.IDEATYPE.IMAGETEXT){
            var title = mAImgTextTitle.val();
            var desc = mAImgTextDesc.val();
            var width = mAImgTextW.val();
            var height = mAImgTextH.val();
            var assets = {
                "title": title,
                "open_type": open_type,
                "h5": h5,
                "style": style,
                "desc": desc,
                "main_img": {
                    "url": fileUrl,
                    "w": width,
                    "h": height
                }
            }
            if(title == "" || desc == ""){
                setInfoDiv(mErrMsg, "error", "请输入图文标题和描述");
                return;
            }else if(!isPInt(width) || !isPInt(height)){
                setInfoDiv(mErrMsg, "error","图片宽、高必须为正整数");
                return;
            }else if(fileUrl == null){
                setInfoDiv(mErrMsg, "error","请上传图片");
                return;
            }
        }
        
        var data = {
            idea_name: idea_name,
            plan_id: plan_id,
            unit_id: unit_id,
            adview_type: adview_type,
            idea_type: idea_type,
            idea_slots: idea_slots,
            idea_trade: idea_trade,
            landing_page: landing_page,
            assets: assets,               
        }
        
        if(imp_monitor_urls.length == 0){            
        }else{
            data.imp_monitor_urls = imp_monitor_urls;
        }
        if(click_monitor_urls.length == 0){            
        }else{
            data.click_monitor_urls = click_monitor_urls;
        }
        
        
        var param  = {
            sinterface : SERVERCONF.ADS.IDEAADD,
            data: data
        };

        ajaxCall(param, function(err, data){
            if(err){
                if(err.code == ERRCODE.DB_DATADUPLICATED.code){
                    setInfoDiv(mErrMsg, "info","创意名重复");
                }else{
                    setInfoDiv(mErrMsg, "info","创建失败");
                }
            }else{
                mIdeaModalForm.modal("hide");
                LoadIdeaList(page_number - 1);
            }
        })
    }

    //submit idea edit form
    function submitEditIdeaForm(id){
        var page_number = $(".pagination>li[class=active]").children().html();
        var idea_name = mIdeaName.val();
        var adview_type = mViewTypeBtnGp.find("input[class*=btn-primary]").val();
        var idea_type = mIdeaTypeBtnGp.find("input[class*=btn-primary]").val();
        var open_type = mOpenTypeBtnGp.find("input[class*=btn-primary]").val();
        var style = mAdStyle.val();
        var h5 = mAH5.val();
        //slots
        var idea_slots = new Array();
        mIdeaSlot.each(function(){            
            if($(this).prop("checked") == true){
                var slot = $(this).val();
                var json_slot = {"type": slot};
                idea_slots.push(json_slot);
            }            
        })
        var idea_trade = mIdeaTrade.val();
        var landing_page = mLandingPage.val();

        //imp and click url
        var imp_monitor_urls = new Array();
        $(".imp-url").each(function(){
            if($(this).val() == ""){
            }else{
                imp_monitor_urls.push($(this).val());
            }
        })   
        var click_monitor_urls = new Array();
        $(".click-url").each(function(){
            if($(this).val() == ""){
            }else{
                click_monitor_urls.push($(this).val());
            }
        })
            
        if(idea_trade == null || idea_trade == 0){
            setInfoDiv(mErrMsg, "error","请选择创意所属行业");
            return;
        }else if(!isUrl(landing_page)){
            setInfoDiv(mErrMsg, "error","请输入正确的落地页");
            return;
        }

        //assets part
        if(idea_type == ADCONSTANT.IDEATYPE.TEXT){
            var title = mATextTitle.val();
            var desc = mATextDesc.val();
            var assets = {"title": title, "desc": desc, "open_type": open_type, "h5": h5, "style": style};
            if(title == "" || desc == ""){
                setInfoDiv(mErrMsg, "error", "请补全文字标题和描述");
                return;
            }
        }else if(idea_type == ADCONSTANT.IDEATYPE.IMAGE){
            //img value
            var width = mAImgW.val();
            var height = mAImgH.val();
            var title = mAImgTitle.val();
            var assets = {
                "title": title,
                "open_type": open_type,
                "h5": h5,
                "style": style,
                "main_img":{
                   "url": fileUrl,
                    "w": width,
                    "h": height,
                }
            }
            if(title == ""){
                setInfoDiv(mErrMsg, "error","请输入图片标题");
                return;
            }else if(!isPInt(width) || !isPInt(height)){
                setInfoDiv(mErrMsg, "error","图片宽、高必须为正整数");
                return;
            }
        }else if(idea_type == ADCONSTANT.IDEATYPE.FLASH){
            var width = mAFlashW.val();
            var height = mAFlashH.val();
            var title = mAFlashTitle.val();
            var assets = {
                "title": title,
                "open_type": open_type,
                "h5": h5,
                "style": style,
                "flash": {
                    "url": fileUrl,
                    "w": width,
                    "h": height 
                }
            }
            if(title == ""){
                setInfoDiv(mErrMsg, "error", "请输入flash标题");
                return;
            }else if(!isPInt(width) || !isPInt(height)){
                setInfoDiv(mErrMsg, "error","flash宽、高必须为正整数");
                return;
            }
        }else if(idea_type == ADCONSTANT.IDEATYPE.VIDEO){
            var width = mAVideoW.val();
            var height = mAVideoH.val();
            var duration = mAVideoDura.val();
            var xyradio = mAVideoXyRadio.val();
            var title = mAVideoTitle.val();
            var assets = {
                "title": title,
                "open_type": open_type,
                "h5": h5,
                "style": style,
                "video": {
                    "url": fileUrl,
                    "duration": duration,
                    "w": width,
                    "h": height,
                    "xy_ratio": xyradio
                }
            }
            if(title == ""){
                setInfoDiv(mErrMsg, "error","请输入视频标题");
                return;
            }else if(!isPInt(width) || !isPInt(height) || !isPInt(duration)){
                setInfoDiv(mErrMsg, "error","视频宽、高和时长必须为正整数");
                return;
            }
        }else if(idea_type == ADCONSTANT.IDEATYPE.NATIVE){
            var title = mANativeTitle.val();
            var desc = mANativeDesc.val();
            var desc2 = mANativeDescSup.val();
            var price = mANativePrice.val();
            var sale_price = mANativeSalePrice.val();
            var phone = mANativePhone.val();
            var address = mANativeAddress.val();
            var display_url = mANativeDisplayUrl.val();
            var assets = {
                "title": title,
                "open_type": open_type,
                "h5": h5,
                "style": style,
                "desc": desc,
                "desc2": desc2,
                "price": price,
                "sale_price": sale_price,
                "phone": phone,
                "address": address,
                "display_url": display_url
            }
            if(title == "" || desc == "" || desc2 == ""){
                setInfoDiv(mErrMsg, "error","请补全原生标题，描述和补充说明");
                return;         
            }else if(!isMoney(price) || !isMoney(sale_price)){
                setInfoDiv(mErrMsg, "error","原始价格和折后价格有误，最高精确到0.01元");
                return;
            }else if(!isMobile(phone)){
                setInfoDiv(mErrMsg, "error","手机号码有误");
                return;
            }else if(address == ""){
                setInfoDiv(mErrMsg, "error","联系地址不能为空");
                return;
            }else if(!isUrl(display_url)){
                setInfoDiv(mErrMsg, "error","广告链接格式有误");
                return;
            }
        }else if(ADCONSTANT.IDEATYPE.IMAGETEXT){
            var title = mAImgTextTitle.val();
            var desc = mAImgTextDesc.val();
            var width = mAImgTextW.val();
            var height = mAImgTextH.val();
            var assets = {
                "title": title,
                "open_type": open_type,
                "h5": h5,
                "style": style,
                "desc": desc,
                "main_img": {
                    "url": fileUrl,
                    "w": width,
                    "h": height
                }
            }
            if(title == "" || desc == ""){
                setInfoDiv(mErrMsg, "error", "请输入图文标题和描述");
                return;
            }else if(!isPInt(width) || !isPInt(height)){
                setInfoDiv(mErrMsg, "error","图片宽、高必须为正整数");
                return;
            }
        }
        var data = {
            idea_id : choosed_idea_id,
            idea_name: idea_name,
            adview_type: adview_type,
            idea_type: idea_type,
            open_type: open_type,
            idea_slots: idea_slots,
            idea_trade: idea_trade,
            landing_page: landing_page,
            assets: assets,               
        }


        if(imp_monitor_urls.length == 0){
            if(list[id].imp_monitor_urls == undefined){
            }else{
                data.imp_monitor_urls = [""];
            }
        }else{
            data.imp_monitor_urls = imp_monitor_urls;
        }

        if(click_monitor_urls.length == 0){
            if(list[id].click_monitor_urls == undefined){
            }else{
                data.click_monitor_urls = [""];
            }
        }else{
            data.click_monitor_urls = click_monitor_urls;
        }

        var param = {
            sinterface : SERVERCONF.ADS.IDEAEDIT,
            data: data
        };

        ajaxCall(param, function(err, data){
            if(err){
                if(err.code == ERRCODE.DB_DATADUPLICATED.code){
                    setInfoDiv(mErrMsg, "info","创意名重复");
                }else{
                    setInfoDiv(mErrMsg, "info","编辑失败");
                }
            }else{
                mIdeaModalForm.modal("hide");
                LoadIdeaList(page_number - 1);
            }
        })
    }    

    function initUnitList(condition){
        function ecb(){
            alert("error");
        }
        
        function scb(data){
            $('#input-unit-name').editableSelect('destroy');
            selectUnitData = data;
            if(data.size > 0){
                var html = "";
                for(var i = 0; i < data.size; i++){
                    var item = data.list[i];
                    html = html + "<option data-id = '" + i + "'>" + item.unit_name + "</option>"
                }
                $('#input-unit-name').html(html);
            }
            $('#input-unit-name').editableSelect({ 
                filter: false 
            });
            //$('.es-list li').eq(0).mousedown();
            $('#input-unit-name')[0].focus();
        }
        
        var param = {
            sinterface : SERVERCONF.ADS.UNITSEARCH,
            data : {
                keyword : condition
            }
        };
        ajaxCall(param, function(err, data){
            if(err){
                ecb
            }else{
                scb(data)
            }
        })
    }
   
    //init idea trade fa
    function initIdeaTradeFa(){
        for(var i = 0; i < cate.length; i++){
            var op = cate[i];
            mIdeaTradeFa.append("<option value='"+op.value+"'>"+op.text+"</option>");
        }
    }
    
    // function initIdeaTradeFa(){
        // for(var i = 0; i < iab_cate.length; i++){
            // var op = iab_cate[i];
            // mIdeaTradeFa.append("<option value='"+op.value+"'>"+op.text+"</option>");
        // }
    // }

    //init indea trade
    function initIdeaTrade(){
        mIdeaTradeFa.change(function (){
            mIdeaTrade.html(""); 
            var index = $(this).prop('selectedIndex'); 
            for(var i = 0;i < shis[index].length; i++){
                var op = shis[index][i];
                mIdeaTrade.append("<option value='" + op.value + "'>" + op.text + "</option>");
            }  
        });
    }
    
    // function initIdeaTrade(){
        // mIdeaTradeFa.change(function (){
            // mIdeaTrade.html(""); 
            // var index = $(this).prop('selectedIndex'); 
            // for(var i = 0;i < trade[index].length; i++){
                // var op = trade[index][i];
                // mIdeaTrade.append("<option value='" + op.value + "'>" + op.text + "</option>");
            // }  
        // });
    // }

    $('.input-img').fileinput({
        language: 'zh',
        allowedFileExtensions : ['jpg', 'png', 'gif', 'bmp'],
        uploadUrl: getServerURL(path_img),
        showPreview: false,
    }).on("fileuploaded", function(event, data){
        if(data.response){
            fileUrl = data.response.data.url;  
        }
    })

    $('#input-assets-flash').fileinput({
        language: 'zh',
        allowedFileExtensions : ['swf'],
        uploadUrl: getServerURL(path_flash),
        showPreview: false,
    }).on("fileuploaded", function(event, data){
        if(data.response){
            fileUrl = data.response.data.url;
        }
    })

    $('#input-assets-video').fileinput({
        language: 'zh',
        allowedFileExtensions : ['mp4', 'f4v','flv'],
        uploadUrl: getServerURL(path_video),
        showPreview: false,
    }).on("fileuploaded", function(event, data){
        if(data.response){
            fileUrl = data.response.data.url;  
        }
    })        

    function initForm(){
        fileUrl = null;
        $(".fileinput-remove-button").click();
        $(".del-url-input").click();
        $("#outerdiv").css("display", "none");
        mMaterialMainFooter.html("");
        mMaterialMainBody.html("");
    }

}();
var fileUrl = null;
var temp_fileUrl = null;
var selectUnitData = null;