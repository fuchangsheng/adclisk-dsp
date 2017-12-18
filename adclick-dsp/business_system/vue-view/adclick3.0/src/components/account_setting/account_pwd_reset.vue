<template>
  <div id="pwd_new-reset" calss="w6">

    <div id="title">
      <span>密码重置</span>
      <div v-if="show_audit" class="yellow-style">
        <span>更改密码后请牢记并妥善保存密码！</span>
        <img src="../../assets/icons/home/close.png" @click="hideAudit" />
      </div>
    </div>

    
    <div class="horizon"></div>

    <form>
      <div class="input-set">
        <div class="input-unit">
          <div class="label-container">
            <label for="pwd-present">当前密码</label>
          </div>
          <input type="password" id="pwd_new-present" v-model="pwd_present" placeholder="请输入当前密码"></input>
        </div>
        <div class="input-unit">
          <div class="label-container">
            <label for="pwd-new">新密码</label>
          </div>
          <input type="password" id="pwd_new-new" v-model="pwd_new" placeholder="密码需要包含大小写字母、数字，长度6-32位"></input>
        </div>
        <div class="input-unit">
          <div class="label-container">
            <label for="pwd-repeat">确认密码</label>
          </div>
          <input type="password" id="pwd-repeat" v-model="pwd_repeat" placeholder="请重新输入密码"></input>
        </div>
      </div>
      
      <input type="button" value="修改" @click="submitQualInfo" />
    </form>
  </div>
</template>

<script type="text/javascript">
import '@/public/tools'
import {isPassword} from '@/public/tools'
import {ajaxCallPromise} from '@/public/index'
import {SERVERCONF,getErrMsg,SYSTEM} from '@/public/constants'
import {hex_sha1} from '@/public/sha1'

export default {
  name: 'account_qual_info',
  mounted () {
  },
  data () {
    return {
      show_audit: true,
      pwd_present: '',
      pwd_new: '',
      pwd_repeat: ''
    }
  },
  watch: {
  },
  methods: {
    showInfo(text){
      this.$Message.info({
        content: text,
        duration: 2,
        closable: true
      });
    },
    showErr(text){
      this.$Message.error({
        content: text,
        duration: 2,
        closable: true
      });
    },
    hideAudit(){
      this.show_audit = false;
    },
    submitQualInfo(){
      if(this.pwd_present == "" || this.pwd_new == "" || this.pwd_repeat == ""){
          this.showErr("密码不能为空！");
      }else if(this.pwd_new != this.pwd_repeat){
          this.showErr("两次密码不一致！");
      }else if(!isPassword(this.pwd_new)){
          this.showErr("密码格式错误！必须包含数字，大小写字母，长度6-16位");
      }else{
          var passwords = {
            passwords: hex_sha1(this.pwd_new + SYSTEM.SALT),
            oldpassword: hex_sha1(this.pwd_present + SYSTEM.SALT)
          }

          var param = {
              // sinterface : SERVERCONF.USERS.RESETPASS,
              sinterface: {
                method: 'POST',
                path: '/v3/password/reset'
              },
              data : passwords
          };

          let _self = this;
      
          ajaxCallPromise(param).then( res => {
            _self.showInfo('密码修改成功！');
          }).catch( err => {
            _self.showErr(getErrMsg(err));
          });
      }
    }
  }
}
</script>

<style type="text/css">
#pwd_new-reset {
  background-color: white;
  margin: 20px 70px 0 70px;
  height: 400px;
  position: relative;
}

#pwd_new-reset>#title {
  background-color: #838b97;
  padding-left: 30px;
  height: 50px;
  line-height: 50px;
  font-size: 0;
}
#pwd_new-reset>#title>span {
  font-size: 16px;
  color: #fff;
  vertical-align: middle;
}
#pwd_new-reset>#title>div {
  display: inline-block;
  height: 34px;
  line-height: 34px;
  vertical-align: middle;
  border-radius: 3px;
  margin-left: 30px;
  padding: 0 14px;

  font-size: 0px;
}
#pwd_new-reset>#title>div.yellow-style {
  background-color: #f4ecd1;
  color: #91792a;
}
#pwd_new-reset>#title>div>* {
  vertical-align: middle;
  font-size: 14px;
  display: inline-block;
}
#pwd_new-reset>#title>div>img {
  width: 14px;
  margin-left: 10px;
  cursor: pointer;
}

#pwd_new-reset div.horizon {
  background-color: #ccc;
  position: absolute;
  bottom: 82px;
  width: 100%;
  height: 1px;
}

#pwd_new-reset .input-set {
  margin-top: 50px;
  position: absolute;
  left: 48%;
  transform: translateX(-50%);
  line-height: 50px;
}
#pwd_new-reset .input-unit {
  height: 50px;
}
#pwd_new-reset .input-unit>* {
  vertical-align: middle;
}
#pwd_new-reset .input-unit .label-container {
  height: 52px;
  display: inline-block;
  width: 100px;
  margin-right: 16px;
}
#pwd_new-reset label {
  float: right;
  font-size: 14px;
}
#pwd_new-reset input[type="password"] {
  display: inline-block;
  width: 300px;
  height: 30px;
  border: 1px solid #ccc;
  font-size: 14px;
  padding-left: 6px;
  border-radius: 3px;
  color: #000;
}

#pwd_new-reset input[type="button"] {
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

</style>