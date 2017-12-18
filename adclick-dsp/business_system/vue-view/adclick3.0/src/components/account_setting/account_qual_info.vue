<template>
  <div id="qual-info" calss="w6">

    <div id="title">
      <span>广告主资质信息</span>
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
            <label for="lisence-name">资质名称</label>
          </div>
          <input type="text" id="lisence-name" v-model="qual_info.qualification_name"></input>
        </div>
        <div class="input-unit">
          <div class="label-container">
            <label for="web-name">主站名</label>
          </div>
          <input type="text" id="web-name" v-model="qual_info.site_name"></input>
        </div>
        <div class="input-unit">
          <div class="label-container">
            <label for="web-url">主站网址</label>
          </div>
          <input type="text" id="web-url" v-model="qual_info.site_url"></input>
        </div>
        <div class="input-unit">
          <div class="label-container">
            <label for="industry-cat">行业分类</label>
          </div>
          <select v-model="qual_info.categories">
            <option v-for="cate in cates" :value="cate.value">{{cate.label}}</option>
          </select>
        </div>
        <div class="input-unit">
          <div class="label-container">
            <!-- <label for="industry-cat">行业分类</label> -->
          </div>
          <select v-model="qual_info.subcategories">
            <option v-for="subcate in subcates[cate_index]" :value="subcate.value">{{subcate.label}}</option>
          </select>
        </div>
        <div class="input-unit">
          <div class="label-container">
            <label for="lisence-num">资质编号</label>
          </div>
          <input type="text" id="lisence-num" v-model="qual_info.qualification_number"></input>
        </div>
        <div class="input-unit">
          <div class="label-container">
            <label for="">资质有效时间</label>
          </div>
          <DatePicker type="daterange" class="date-picker" v-model="validity_period">
          </DatePicker>
        </div>
        <div class="input-unit">
          <div class="label-container">
            <label for="">行业资质</label>
          </div>
        </div>
      </div>
      
      <input type="button" value="保存" @click="submitQualInfo" />
    </form>
  </div>
</template>

<script type="text/javascript">
import {ajaxCallPromise} from '@/public/index'
import '@/public/tools'
import {SERVERCONF,getErrMsg} from '@/public/constants'
import {cate, shis} from '@/public/cate'

export default {
  name: 'account_qual_info',
  mounted () {
    this.getQualInfo();
  },
  data () {
    return {
      am_list: ['用户信息尚未编辑！为了不影响您正常投放广告，请及时编辑！', '用户信息审核中', '用户信息审核通过', '用户信息审核不通过'],
      audit_message: '',
      show_audit: true,
      audit_box_class: {},

      qual_info: {
        qualification_name: '',
        qualification_number: '',
        qualification: '',
        site_name: '',
        site_url: '',
        valid_date_begin: '',
        valid_date_end: '',
        categories: '',
        subcategories: ''
      },
      validity_period: ['', ''],
      cates: cate,
      subcates: shis,
      cate_selected: '0',
      cate_index: 0,
      subcate_selected: '0',
      just_loaded: true

    }
  },
  watch: {
    validity_period: function(val){
      if(typeof(val[0]) != 'object') return;
      this.qual_info.valid_date_begin = val[0].format('yyyy-MM-dd hh:mm:ss');
      this.qual_info.valid_date_end = val[1].format('yyyy-MM-dd hh:mm:ss');
    },
    'qual_info.categories': function(val){
      for(let i=0; i<this.cates.length; i++){
        if(this.cates[i].value == val){
          this.cate_index = i;
          if(!this.just_loaded){
            this.qual_info.subcategories = this.subcates[i][0].value;
          }
          break;
        }
      }
      this.just_loaded = false;
    }
  },
  methods: {
    hideAudit(){
      this.show_audit = false;
    },
    getQualInfo(){
      let param = {
        sinterface: {
          method: 'GET',
          path: '/v3/settings/account/qinfo/view'
        },
        data: {}
      };

      let _self = this;

      ajaxCallPromise(param).then(res => {
        _self.show_audit = true;
        _self.just_loaded = true;
        // _self.cate_selected = '51';
        // _self.subcate_selected = '5102';
        _self.qual_info = res;

        _self.validity_period = [_self.qual_info.valid_date_begin, _self.qual_info.valid_date_end];

        if(res.audit_status == '未审核'){
          _self.audit_message = _self.am_list[0];
          _self.audit_box_class = { 'red-style': true };
        } else if(res.audit_status == '审核中'){
          _self.audit_message = _self.am_list[1];
          _self.audit_box_class = { 'yellow-style': true };
        } else if(res.audit_status == '审核通过'){
          _self.audit_message = _self.am_list[2];
          _self.audit_box_class = { 'green-style': true };
        } else if(res.audit_status == '审核失败'){
          _self.audit_message = _self.am_list[3];
          _self.audit_box_class = { 'red-style': true };
        }
      }).catch(err=> {
        let msg = getErrMsg(err);
        _self.$Message.error({
            content: msg,
            duration: 2,
            closable:true
        });        
      });
    },
    submitQualInfo(){
      let data = this.qual_info;

      let param = {
        sinterface: {
          method: 'POST',
          path: '/v3/settings/account/qinfo/edit'
        },
        data
      }
      let _self = this;
      ajaxCallPromise(param).then(res => {
        _self.getQualInfo();
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
#qual-info {
  background-color: white;
  margin: 20px 70px 0 70px;
  height: 610px;
  position: relative;
}

#qual-info>#title {
  background-color: #838b97;
  padding-left: 30px;
  height: 50px;
  line-height: 50px;
  font-size: 0;
}
#qual-info>#title>span {
  font-size: 16px;
  color: #fff;
  vertical-align: middle;
}
#qual-info>#title>div {
  display: inline-block;
  height: 34px;
  line-height: 34px;
  vertical-align: middle;
  border-radius: 3px;
  margin-left: 30px;
  padding: 0 14px;

  font-size: 0px;
}
#qual-info>#title>div.green-style {
  background-color: #daecd1;
  color: #31780d;
}
#qual-info>#title>div.yellow-style {
  background-color: #f4ecd1;
  color: #91792a;
}
#qual-info>#title>div.red-style {
  background-color: #f3dfdf;
  color: #975353;
}
#qual-info>#title>div>* {
  vertical-align: middle;
  font-size: 14px;
  display: inline-block;
}
#qual-info>#title>div>img {
  width: 14px;
  margin-left: 10px;
  cursor: pointer;
}

#qual-info div.horizon {
  background-color: #ccc;
  position: absolute;
  bottom: 82px;
  width: 100%;
  height: 1px;
}

#qual-info .input-set {
  margin-top: 30px;
  position: absolute;
  /*background-color: green;*/
  left: 48%;
  transform: translateX(-50%);
  line-height: 50px;
}
#qual-info .input-unit {
  height: 50px;
  /*width: 100%;*/
}
#qual-info .input-unit>* {
  vertical-align: middle;
}
#qual-info .input-unit .label-container {
  height: 52px;
  display: inline-block;
  width: 100px;
  margin-right: 16px;
}
#qual-info label {
  float: right;
  font-size: 14px;
}
#qual-info input[type="text"] {
  display: inline-block;
  width: 250px;
  height: 30px;
  border: 1px solid #ccc;
  font-size: 14px;
  padding-left: 6px;
  border-radius: 3px;
}
#qual-info select {
  display: inline-block;
  width: 250px;
  height: 30px;
  border: 1px solid #ccc;
  font-size: 14px;
  padding-left: 2px;
  border-radius: 3px;
}
#qual-info .date-picker {
  font-size: 14px;
}
#qual-info .date-picker input {
  display: inline-block;
  border: 1px solid #ccc;
  height: 30px;
  font-size: 14px;
}

#qual-info input[type="button"] {
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

#qual-info input, select {
  color: #838b97;
}
</style>