/*
 * @file  user.js
 * @description user data logic part
 * @copyright dmtec.cn reserved, 2016
 * @author jiangtu
 * @date 2016.12.16
 * @version 0.0.1 
 */
 
'use strict';

!function(){
    // page static elements
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
    
    var mEditUserName = null;
    var mEditCompany = null;
    var mEditCompanyLicenseUrl = null;
    var mEditPhone = null;
    var mEditAddress = null;
    var mEditContactName = null;
    var mEditContactMobile = null;
    var mEditContactEmail = null;
    var mStartTime = null;
    var mEndTime = null;
    var mEditQualType = null;
    var mEditLicenseNum = null;
    
    var mUserModal = null;
    var mUserEditBtn = null;
    var mSubmitUserBtn = null;
    var mErrMesg = null;
    var mSubmitErr = null;
    
    var user_data = null;
    var qual_type = ["", "大陆个体工商类客户", "大陆企业单位类客户", "香港主体类客户", "台湾主体类客户", "澳门主体类客户",
                         "大陆事业单位类客户", "民办企业类客户", "社会团体类客户", "学校类客户", "国外主体类客户"];
    
    $(function(){
        initPageStaticElement();
        initFormDatetimePicker();
        var current_tab = window.current_tab || "";
        initTabs(user_tabs_config, current_tab);
        
        var role = sessionStorage.getItem('_role');
        var r = window._role[role] || false;
        if (r && r.account.enable) {
          if (r.account.adverInfo.enable && r.account.adverInfo.write) {
            $('#user-edit').css('display', '');
          } else {
            $('#err-msg').css('display', 'none');
            $('#user-edit').remove();
            $('#user-modal').remove();
          }
        }

        initUserInfo();
        
        mUserEditBtn.click(function(){
            mEditUserName.val(user_data.user_name);
            mEditCompany.val(user_data.company_name);
            mEditQualType.val(user_data.qualification_type);
            mEditLicenseNum.val(user_data.license_number);
            mStartTime.val(user_data.license_valid_date_begin);
            mEndTime.val(user_data.license_valid_date_end);
            if(user_data.company_license == null){
                mEditCompanyLicenseUrl.parents(".form-group").addClass("hidden");
            }else{
                mEditCompanyLicenseUrl.parents(".form-group").removeClass("hidden");
                mEditCompanyLicenseUrl.html(user_data.company_license + "<a href='" + user_data.company_license + "'target = '_blank' style='text-decoration:none'>查看</a>");
            } 
            mEditPhone.val(user_data.telephone);
            mEditAddress.val(user_data.address);
            mEditContactName.val(user_data.contacts_name);
            mEditContactMobile.val(user_data.contacts_mobile);
            mEditContactEmail.val(user_data.contacts_email);
            mSubmitErr.html("");
            $(".fileinput-remove").click();
            mUserModal.modal("show");
        })
            
        mSubmitUserBtn.click(submitUserInfo);
    });
     
    function initPageStaticElement(){
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
        
        mEditUserName = $("#edit-user-name");
        mEditCompany = $("#edit-company-name");
        mEditCompanyLicenseUrl = $("#edit-company-license-url");
        mEditPhone = $("#edit-phone");
        mEditAddress = $("#edit-address");
        mEditContactName = $("#edit-contact-name");
        mEditContactMobile = $("#edit-contact-mobile");
        mEditContactEmail = $("#edit-contact-email");
        mStartTime = $('#input-starttime');
        mEndTime = $('#input-endtime');
        mEditQualType = $("#edit-qualification-type");
        mEditLicenseNum = $("#edit-license-number");
        
        mUserModal = $("#user-modal")
        mSubmitUserBtn = $("#submit-user-form");
        mUserEditBtn = $("#user-edit");
        mErrMesg = $('#err-msg');
        mSubmitErr = $('#submit-err');
    }
    
    function initFormDatetimePicker() {
        $("#user-modal .form_datetime").datetimepicker({
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
     
    function initUserInfo(){
        function ecb(){
            setInfoDiv(mErrMesg, "error","用户信息初始化失败");
        }
        
        function scb(data){
            mUserName.html(data.user_name);
            mCompany.html(data.company_name);
            mQualType.html(qual_type[data.qualification_type]);
            mLicenseNum.html(data.license_number);
            if(data.license_valid_date_begin != null){
                mStartToEndTime.html(data.license_valid_date_begin + "至" + data.license_valid_date_end);
            }
            licenseUrl = data.company_license;
            mCompanyLicense.attr("src", data.company_license);
            if(data.company_license != null){
                mCompanyLicense.css({"width":"420px", "height":"600px"});
            }
            mPhone.html(data.telephone);
            mAddress.html(data.address);
            mContactName.html(data.contacts_name);
            mContactMobile.html(data.contacts_mobile);
            mContactEmail.html(data.contacts_email);
            if(data.user_audit_status == ADCONSTANT.CHECK.VERIFYING){
                setInfoDiv(mErrMesg, "info", "信息审核中，请耐心等待");
            }else if(data.user_audit_status == ADCONSTANT.CHECK.PASS){
                setInfoDiv(mErrMesg, "success", "用户信息审核通过！");
            }else if(data.user_audit_status == ADCONSTANT.CHECK.UNSUBMIT){
                setInfoDiv(mErrMesg, "info", "基本信息为初始状态，请及时编辑");
            }else{
                var msg = "用户信息审核失败，失败原因：“" + data.user_audit_message + "”。请重新编辑用户信息";
                var re_msg = msg.replace("null", "");
                setInfoDiv(mErrMesg, "error", re_msg);
            }
        }
        
        var param = {
            sinterface : SERVERCONF.USERS.USERVIEW,
            data : {}
        }
        
        ajaxCall(param, function(err, data){
            if(err){
                ecb;
            }else{
                user_data = data;
                scb(data);
            }
        })
    }
    
    function submitUserInfo(){
        var user_name = mEditUserName.val();
        var company_name = mEditCompany.val();
        var address = mEditAddress.val();
        var telephone = mEditPhone.val();
        var contacts_name = mEditContactName.val();
        var contacts_mobile = mEditContactMobile.val();
        var contacts_email = mEditContactEmail.val();
        var qualification_type = mEditQualType.val();
        var license_number = mEditLicenseNum.val();
        var license_valid_date_begin = mStartTime.val();
        var license_valid_date_end = mEndTime.val();
        
        if(user_name == ""){
            setInfoDiv(mSubmitErr ,"error", "请输入广告主名");
        }else if(company_name == ""){
            setInfoDiv(mSubmitErr ,"error", "请输入公司名称");
        }else if(!isPhone(telephone)){
            setInfoDiv(mSubmitErr ,"error", "请输入正确的公司电话号码，格式为区号+号码，如01088888888,010-88888888");
        }else if(address == ""){
            setInfoDiv(mSubmitErr ,"error", "请输入公司地址");
        }else if(qualification_type == 0){
            setInfoDiv(mSubmitErr ,"error", "请选择资质类型");
        }else if(license_number == ""){
            setInfoDiv(mSubmitErr ,"error", "请输入资质编号");
        }else if(license_valid_date_begin == "" || license_valid_date_end == ""){
            setInfoDiv(mSubmitErr ,"error", "起止时间不能为空");
        }else if(license_valid_date_begin >= license_valid_date_end){
            setInfoDiv(mSubmitErr ,"error", "起始时间不能晚于结束时间");
        }else if(licenseUrl == null){
            setInfoDiv(mSubmitErr ,"error", "请上传公司营业执照");
        }else if(contacts_name == ""){
            setInfoDiv(mSubmitErr ,"error", "请输入联系人姓名");
        }else if(!isMobile(contacts_mobile)){
            setInfoDiv(mSubmitErr ,"error", "请输入正确的手机号");
        }else if(!isEmail(contacts_email)){
            setInfoDiv(mSubmitErr ,"error", "请输入正确的邮箱");
        }else{
            var param = {
                sinterface : SERVERCONF.USERS.USEREDIT,
                data : {
                    edit_user_name : user_name,
                    company_name : company_name,
                    address : address,
                    company_license : licenseUrl,
                    telephone : telephone,
                    contacts_name : contacts_name,
                    contacts_mobile : contacts_mobile,
                    contacts_email : contacts_email,
                    qualification_type : qualification_type,
                    license_number : license_number,
                    license_valid_date_begin : license_valid_date_begin,
                    license_valid_date_end : license_valid_date_end,
                }
            };
            
            ajaxCall(param, function(err, data){
                if(err){
                    setInfoDiv(mSubmitErr ,"info", "修改失败");
                }else{
                    mUserModal.modal("hide");
                    initUserInfo();
                    updateUsername();
                }
            });
        }
        
    }
    
    function updateUsername(){
        var sinterface = SERVERCONF.USERS.USERNAME;
        var param = {
            sinterface: sinterface,
            data: {},
        };

        ajaxCall(param, function(err, data){
        if (err) {
                ecb(err);
            }else {
                scb(data);
            }
        });

        var scb = function(data){
            var user_name = data.user_name || '';
            $('#weluser').text('欢迎您: ' +user_name);
        }
        var ecb = function(data) {
            console.log(data);
            $('#weluser').text('欢迎您: ');
        }
    }
    
    var up_license_url = getServerURL(SERVERCONF.UPLOAD.LICENSE.path);
    $('#edit-company-license').fileinput({
      language: 'zh',
      allowedFileExtensions : ['jpg', 'png','gif'],
      uploadUrl: up_license_url,
      showPreview: false,
    }).on("fileuploaded", function(event, data){
        if(data.response){
            licenseUrl = data.response.data.url;
        }
    })
}();
var licenseUrl = null;