<template>
  <div id="basic-info" calss="w6">

    <div id="title">
      <span>广告主基本信息</span>
      <div :class="audit_box_class" v-if="show_audit">
        <span>{{audit_message}}</span>
        <img src="../../assets/icons/home/close.png" @click="hideAudit" />
      </div>
    </div>

    
    <div class="horizon"></div>

    <form>

      <div class="input-set">
        <div class="input-unit">
          <div class="label-container">
            <label for="advertiser-name">广告主名</label>
          </div>
          <input type="text" id="advertiser-name" v-model="basic_info.user_name"></input>
        </div>
        <div class="input-unit">
          <div class="label-container">
            <label for="company-name">公司名称</label>
          </div>         
          <input type="text" id="company-name" v-model="basic_info.company_name"></input>
        </div>
        <div class="input-unit">
          <div class="label-container">
            <label for="company-num">公司电话</label>
          </div>
          <input type="text" id="company-num" v-model="basic_info.telephone"></input>
        </div>
        <div class="input-unit">
          <div class="label-container">
            <label for="company-addr">公司地址</label>
          </div>
          <input type="text" id="company-addr" v-model="basic_info.address"></input>
        </div>
        <div class="input-unit">
          <div class="label-container">
            <label for="advertiser-name">营业执照类型</label>
          </div>
          <select name="qualification_type" v-model="basic_info.qualification_type">
            <option v-for="ls_type in ls_type_set" :value="ls_type[1]">{{ls_type[0]}}</option>
          </select>
        </div>
        <div class="input-unit">
          <div class="label-container">
            <label for="advertiser-name">营业执照编号</label>
          </div>
          <input type="text" id="lisence-num" v-model="basic_info.license_number"></input>
        </div>
        <div class="input-unit">
          <div class="label-container">
            <label for="">营业执照有效期</label>
          </div>
          <DatePicker type="daterange" class="date-picker" v-model="validity_period">
          </DatePicker>
        </div>
        <div class="input-unit">
          <div class="label-container">
            <label for="advertiser-name">公司营业执照</label>
          </div>
        </div>
      </div>

      <div class="vertical-line"></div>

      <div class="input-set">
        <div class="input-unit">
          <div class="label-container">
            <label for="contact-name">联系人姓名</label>
          </div>
          <input type="text" id="contact-name" v-model="basic_info.contacts_name"></input>
        </div>
        <div class="input-unit">
          <div class="label-container">
            <label for="contact-num">联系人电话</label>
          </div>         
          <input type="text" id="contact-num" v-model="basic_info.contacts_mobile"></input>
        </div>
        <div class="input-unit">
          <div class="label-container">
            <label for="contact-email">联系人邮箱</label>
          </div>
          <input type="text" id="contact-email" v-model="basic_info.contacts_email"></input>
        </div>
      </div>

      <input type="button" value="保存" @click="submitBasicInfo" />
    </form>
  </div>
</template>

<script type="text/javascript">

import {ajaxCallPromise} from '@/public/index'
import '@/public/tools'
import {SERVERCONF,getErrMsg} from '@/public/constants'

export default {
  name: 'account_basic_info',
  mounted () {
    this.getBasicInfo();
  },
  data () {
    return {
      am_list: [
        '用户信息尚未编辑！为了不影响您正常投放广告，请及时编辑！', 
        '用户信息审核中', 
        '用户信息审核通过', 
        '用户信息审核不通过'
      ],
      audit_message: '',
      show_audit: true,
      audit_box_class: {},
      ls_type_set: [
        ['请选择', 0], 
        ['大陆个体工商类客户', 1], 
        ['大陆企业单位类客户', 2], 
        ['香港主体类客户', 3], 
        ['台湾主体类客户', 4], 
        ['澳门主体类客户', 5],
        ['大陆事业单位类客户', 6], 
        ['民办企业类客户', 7], 
        ['社会团体类客户', 8], 
        ['学校类客户', 9], 
        ['国外主体类客户', 10]
      ],
      validity_period: ['', ''],
      basic_info: {
        user_name: '',
        company_name: '',
        telephone: '',
        address: '',

        qualification_type: '',
        license_number: '',
        company_license: '',
        license_valid_date_begin: '',
        license_valid_date_end: '',

        contacts_name: '',
        contacts_mobile: '',
        contacts_email: ''
      },
    }
  },
  watch: {
    validity_period: function(val){
      if(typeof(val[0]) != 'object') return;
      this.basic_info.license_valid_date_begin = val[0].format('yyyy-MM-dd hh:mm:ss');
      this.basic_info.license_valid_date_end = val[1].format('yyyy-MM-dd hh:mm:ss');
    }
  },
  methods: {
    hideAudit(){
      this.show_audit = false;
    },
    getBasicInfo(){
      let param = {
        sinterface: {
          method: 'POST',
          path: '/v3/settings/account/info/view'
        },
        data: {}
      };

      let _self = this;

      ajaxCallPromise(param).then(res => {
        _self.show_audit = true;
        _self.basic_info = res;

        _self.validity_period = [_self.basic_info.license_valid_date_begin, _self.basic_info.license_valid_date_end];

        if(res.user_audit_status == '未审核'){
          _self.audit_message = _self.am_list[0];
          _self.audit_box_class = { 'red-style': true };
        } else if(res.user_audit_status == '审核中'){
          _self.audit_message = _self.am_list[1];
          _self.audit_box_class = { 'yellow-style': true };
        } else if(res.user_audit_status == '审核通过'){
          _self.audit_message = _self.am_list[2];
          _self.audit_box_class = { 'green-style': true };
        } else if(res.user_audit_status == '审核失败'){
          _self.audit_message = _self.am_list[3];
          _self.audit_box_class = { 'red-style': true };
        }
      })
    },
    submitBasicInfo(){
      let data = this.basic_info;

      data.edit_user_name = data.user_name;
      let param = {
        sinterface: {
          method: 'POST',
          path: '/v3/settings/account/info/edit'
        },
        data
      }
      let _self = this;
      ajaxCallPromise(param).then(res => {
        _self.getBasicInfo();
        _self.$Message.info({
          content: '提交成功！',
          duration: 2,
          closable: true
        })
      }).catch(err=> {
        let msg = getErrMsg(err);
        _self.$Message.error({
            content: msg,
            duration: 2,
            closable:true
        });        
      });
    }
  }
}
</script>

<style type="text/css">
#basic-info {
  background-color: white;
  margin: 20px 70px 0 70px;
  height: 635px;
  position: relative;
}

#basic-info>#title {
  background-color: #838b97;
  padding-left: 30px;
  height: 50px;
  line-height: 50px;
  font-size: 0;
}
#basic-info>#title>span {
  font-size: 16px;
  color: #fff;
  vertical-align: middle;
}
#basic-info>#title>div {
  display: inline-block;
  height: 34px;
  line-height: 34px;
  vertical-align: middle;
  border-radius: 3px;
  margin-left: 30px;
  padding: 0 14px;

  font-size: 0px;
}
#basic-info>#title>div.green-style {
  background-color: #daecd1;
  color: #31780d;
}
#basic-info>#title>div.yellow-style {
  background-color: #f4ecd1;
  color: #91792a;
}
#basic-info>#title>div.red-style {
  background-color: #f3dfdf;
  color: #975353;
}
#basic-info>#title>div>* {
  vertical-align: middle;
  font-size: 14px;
  display: inline-block;
}
#basic-info>#title>div>img {
  width: 14px;
  margin-left: 10px;
  cursor: pointer;
}

#basic-info div.horizon {
  background-color: #ccc;
  position: absolute;
  bottom: 82px;
  width: 100%;
  height: 1px;
}

#basic-info .input-set {
  float: left;
  padding-top: 35px;
  font-size: 0;
  line-height: 52px;
}
#basic-info .input-unit {
  height: 52px;
}
#basic-info .input-unit>* {
  vertical-align: middle;
}
#basic-info .input-unit .label-container {
  height: 52px;
  display: inline-block;
  width: 220px;
  margin-right: 16px;
}
#basic-info label {
  float: right;
  font-size: 14px;
}
#basic-info input[type="text"] {
  display: inline-block;
  width: 250px;
  height: 30px;
  border: 1px solid #ccc;
  font-size: 14px;
  padding-left: 6px;
  border-radius: 3px;
}
#basic-info select {
  display: inline-block;
  width: 250px;
  height: 30px;
  border: 1px solid #ccc;
  font-size: 14px;
  padding-left: 2px;
  border-radius: 3px;
}
#basic-info .date-picker {
  font-size: 14px;
}
#basic-info .date-picker input {
  display: inline-block;
  border: 1px solid #ccc;
  height: 30px;
  font-size: 14px;
  /*color: #000;*/
}

#basic-info div.vertical-line {
  float: left;
  background-color: #ccc;
  margin-top: 30px;
  margin-left: 150px;
  width: 1px;
  height: 443px;
}

#basic-info input[type="button"] {
  width: 100px;
  height: 40px;
  font-size: 16px;
  color: #fff;
  background-color: #3a72bf;
  border-radius: 3px;
  position: absolute;
  bottom: 20px;
  right: 20px;
}

#basic-info input, select {
  color: #838b97;
}

</style>