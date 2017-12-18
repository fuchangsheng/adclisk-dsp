/*
 * @file  qual-info.js
 * @description user data logic part
 * @copyright dmtec.cn reserved, 2016
 * @author jiangtu
 * @date 2016.12.16
 * @version 0.0.1 
 */
 
'use strict';

!function(){
    // page static elements
    var mQualName = null;
    var mSiteName = null;
    var mSiteUrl = null;
    var mCateAndSub = null;
    var mQualifitionUrl = null;
    //var mQualType = null;
    var mQualNum = null;
    var mStartToEndTime = null;
    
    var mEditQualName = null;
    var mEditSiteName = null;
    var mEditSiteUrl = null;
    var mEditCate = null
    var mEditSub = null;
    var mEditQualifitionUrl = null;
    //var mEditQualType = null;
    var mEditQualNum = null;
    var mStartTime = null;
    var mEndTime = null;
    
    var mQualModal = null;
    var mSubmitQualBtn = null;
    var mQualEditBtn = null;
    var mErrMesg = null;
    var mSubmitErr = null;
    
    var qual_data = null;
    // var qual_type = ["", "大陆个体工商类客户", "大陆企业单位类客户", "香港主体类客户", "台湾主体类客户", "澳门主体类客户",
                         // "大陆事业单位类客户", "民办企业类客户", "社会团体类客户", "学校类客户", "国外主体类客户"];
    
    $(function(){
        var current_tab = window.current_tab || "";
        initTabs(user_tabs_config, current_tab);
        
        var role = sessionStorage.getItem('_role');
        var r = window._role[role] || false;
        if(r && r.account.enable) {
          if(r.account.credential.enable && r.account.credential.write) {
            $('#qual-edit').css('display', '');
          } else {
            $('#err-msg').css('display', 'none');
            $('#qual-edit').remove();
            $('#qual-modal').remove();
          }
        }
        
        initPageStaticElement();
        initFormDatetimePicker();
        initQualInfo();
        initSelect();
        
        //init modal value
        mQualEditBtn.click(function(){
            mEditQualName.val(qual_data.qualification_name)
            mEditSiteName.val(qual_data.site_name);
            mEditSiteUrl.val(qual_data.site_url);
            mEditCate.val(qual_data.categories);
            mEditCate.change();
            mEditSub.val(qual_data.subcategories);
            //mEditQualType.val(qual_data.qualification_type);
            mEditQualNum.val(qual_data.qualification_number);
            mStartTime.val(qual_data.valid_date_begin);
            mEndTime.val(qual_data.valid_date_end);
            if(qual_data.qualification == null){
                mEditQualifitionUrl.parents(".form-group").addClass("hidden");
            }else{
                mEditQualifitionUrl.parents(".form-group").removeClass("hidden");
                mEditQualifitionUrl.html(qual_data.qualification + "<a href='" + qual_data.qualification + "'target = '_blank' style='text-decoration:none'>查看</a>");
            }
            mSubmitErr.html("");
            $(".fileinput-remove").click();
            mQualModal.modal("show");
        })
            
        mSubmitQualBtn.click(submitQualInfo);
    });
     
    function initPageStaticElement(){
        mQualName = $("#qulification-name");
        mSiteName = $("#site-name");
        mSiteUrl = $("#site-url");
        mCateAndSub = $("#cate-subcate");
        mQualifitionUrl = $("#qualification");
        //mQualType = $("#qualification-type");
        mQualNum = $("#qualification_number");
        mStartToEndTime = $("#start-to-end-time");
        
        mEditQualName = $("#edit-qualification-name");
        mEditSiteName = $("#edit-site-name");
        mEditSiteUrl = $("#edit-site-url");
        mEditCate = $("#categoriesse");
        mEditSub = $("#subcategoriesse");
        mEditQualifitionUrl = $("#edit-qualification-url");
        //mEditQualType = $("#edit-qualification-type");
        mEditQualNum = $("#eidt-qualification-number");
        mStartTime = $('#input-starttime');
        mEndTime = $('#input-endtime');
        
        mQualModal = $('#qual-modal');
        mSubmitQualBtn = $('#submit-qual-form')
        mQualEditBtn = $('#qual-edit');
        mErrMesg = $('#err-msg');
        mSubmitErr = $('#submit-err');
        
    }
    
    function initFormDatetimePicker() {
        $("#qual-modal .form_datetime").datetimepicker({
            format:         "yyyy-mm-dd",
            weekStart:      1,
            autoclose:      1,
            startView:      2,
            minView:        2,
            maxView:        3,
            todayBtn:       1,
            todayHighlight: 1,
            language:       "zh-CN",
            forceParse:     0,
        });
    }

    function initQualInfo(){
        function ecb(){
            setInfoDiv(mErrMesg, "error","用户信息初始化失败");
        }
        
        function scb(data){
            qualificationUrl = data.qualification;
            mQualName.html(data.qualification_name);
            mSiteName.html(data.site_name);
            mSiteUrl.html(data.site_url);
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
            //mQualType.html(qual_type[data.qualification_type]);
            mQualNum.html(data.qualification_number);
            if(data.valid_date_begin != null){
                mStartToEndTime.html(data.valid_date_begin + "至" + data.valid_date_end);
            }
            
            if(data.audit_status == ADCONSTANT.CHECK.VERIFYING){
                setInfoDiv(mErrMesg, "info", "信息审核中，请耐心等待审核结果");
            }else if(data.audit_status == ADCONSTANT.CHECK.PASS){
                setInfoDiv(mErrMesg, "success", "资质信息审核通过！");
            }else if(data.audit_status == ADCONSTANT.CHECK.UNSUBMIT){
                setInfoDiv(mErrMesg, "info", "资质信息尚未提交审核，请及时提交");
            }else{
                var msg = "资质信息审核失败，失败原因：“" + data.audit_message + "”。请重新编辑资质信息";
                var re_msg = msg.replace("null", "");
                setInfoDiv(mErrMesg, "error", re_msg);
            }
        }
        
        var param = {
            sinterface : SERVERCONF.USERS.QUALIFICATIONVIEW,
            data : {}
        }
        
        ajaxCall(param, function(err, data){
            if(err){
                ecb;
            }else{
                qual_data = data;
                scb(data);
            }
        })
    }
    
    function submitQualInfo(){
        var qualification_name = mEditQualName.val();
        var site_name = mEditSiteName.val();
        var site_url = mEditSiteUrl.val();
        var categories = mEditCate.val();
        var subcategories = mEditSub.val();
        //var qualification_type = mEditQualType.val();
        var qualification_number = mEditQualNum.val();
        var valid_date_begin = mStartTime.val();
        var valid_date_end = mEndTime.val();
        
        if(qualification_name == ""){
            setInfoDiv(mSubmitErr ,"error", "请输入资质名称");
        }else if(site_name == ""){
            setInfoDiv(mSubmitErr ,"error", "请输入主站名称");
        }else if(!isUrl(site_url)){
            setInfoDiv(mSubmitErr ,"error", "请输入合法的url");
        }else if(categories == 0){
            setInfoDiv(mSubmitErr ,"error", "请选择行业分类");
        }else if(qualification_number == ""){
            setInfoDiv(mSubmitErr ,"error", "请输入资质编号");
        }else if(valid_date_begin == "" || valid_date_end == ""){
            setInfoDiv(mSubmitErr ,"error", "请输入资质有效的起止时间");
        }else if(valid_date_begin >= valid_date_end){
            setInfoDiv(mSubmitErr ,"error", "起始时间不能晚于结束时间");
        }else if(qualificationUrl == null){
            setInfoDiv(mSubmitErr ,"error", "请上传资质文件");
        }else{
            var param = {
                sinterface : SERVERCONF.USERS.QUALIFICATIONEDIT,
                data : {
                    qualification_name: qualification_name,
                    site_name: site_name,
                    site_url: site_url,
                    categories: categories,
                    subcategories: subcategories,
                    qualification: qualificationUrl,
                    //qualification_type: qualification_type,
                    qualification_number: qualification_number,
                    valid_date_begin: valid_date_begin,
                    valid_date_end: valid_date_end
                }
            };
            
            ajaxCall(param, function(err, data){
                if(err){
                    setInfoDiv(mSubmitErr ,"info", "修改失败");
                }else{
                    mQualModal.modal("hide");
                    initQualInfo();
                }
            });
        }
    }
    
    function initSelect(){
        var categories=$('#categoriesse');
        //cate is defined in cate.js
        for(var i=0;i<cate.length;i++){  
            var op=cate[i];
            categories.append("<option value='"+op.value+"'>"+op.text+"</option>");
        }  
    }
    
    $('#categoriesse').change(function (){
        var subcategories=$('#subcategoriesse');
        subcategories.html(""); 
        var index=$('#categoriesse').prop('selectedIndex'); 
        for(var i=0;i<shis[index].length;i++){
            var op=shis[index][i];
            subcategories.append("<option value='"+op.value+"'>"+op.text+"</option>");
        }  
    });
    
    var up_qualification_url = getServerURL(SERVERCONF.UPLOAD.QUALIFICATION.path);
    $('#edit-qualification').fileinput({
      language: 'zh',
      allowedFileExtensions : ['jpg', 'png','gif'],
      uploadUrl: up_qualification_url,
      showPreview: false,
    }).on("fileuploaded", function(event, data){
        if(data.response){
            qualificationUrl = data.response.data.url;
        }
    })

}();
var qualificationUrl = null;