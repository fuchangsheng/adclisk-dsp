<template>
    <div>
        <div class="header">
            <div class="container">
                <div class="fl">
                    <div class="nav-header">
                        <img src="../../assets/icons/home/logo.png">
                        <a href="javascript:;">AdClick投放系统</a>
                    </div>
                </div>
                <div class="fr">
                    <ul class="action-list">
                        <li>
                            <router-link to="/login" class="ad-btn ad-btn-border">返回登录</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="content" v-bind:style="bg_style">
            <div class="forgetpass-bg"></div>
            <div class="forgetpass-form">
                <div class="form-header" style="border-bottom: 1px solid #dddee1;">
                    <h4>忘记密码</h4>
                </div>
                <div class="form-content">
                    <div class="form-group">
                        <label class="input-label input-label-user"></label>
                        <Input v-model="forgetpass_data.username" placeholder="请输入登录用户名" style="width: 324px;"></Input>
                    </div>
                    <div class="form-group">
                        <label class="input-label input-label-phone"></label>
                        <Input v-model="forgetpass_data.phone" placeholder="请输入手机号" style="width: 324px;"></Input>
                    </div>
                    <div class="form-group">
                        <label class="input-label input-label-sms"></label>
                        <Input v-model="forgetpass_data.smscode" placeholder="请输入短信验证码" style="width: 202px;"></Input>
                        <button class="ad-btn ad-btn-primary" style="height: 32px;width: 118px;" v-show="time == 60" @click="getSmsCode">获取验证码</button>
                        <button class="ad-btn ad-btn-primary" style="height: 32px;width: 118px;" v-show="!(time == 60)" disabled>重新发送（{{time}}）</button>
                    </div>
                    <div class="form-group">
                        <label class="input-label input-label-password"></label>
                        <Input v-model="forgetpass_data.password" placeholder="请设置新密码（包含大小写，数字，长度6-16）" style="width: 324px;"></Input>
                    </div>
                    <div class="form-group">
                        <label class="input-label input-label-rpassword"></label>
                        <Input v-model="forgetpass_data.rpassword" placeholder="再次确认密码" style="width: 324px;"></Input>
                    </div>

                    <button type="button" class="ad-btn ad-btn-success ad-btn-block">确认修改密码</button>

                    <div class="fr">
                        <ul class="action-list">
                            <li>
                                <router-link to="/login" class="ad-btn ad-btn-link">返回登录</router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="footer">
                <span>Copyright © 2012-2017 上海数凹文化传媒有限公司. 版权所有</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'forgetpass',
    data: function(){
        return{
            bg_style:{
                width: '100%',
                height: (window.innerHeight - 50) + 'px'
            },
            forgetpass_data: {
                username: '',
                phone: '',
                smscode: '',
                password: '',
                rpassword: ''
            },
            time: 60,
        }
    },
    methods: {
        countDown(){
            var _this = this;
            var timer = setInterval(function(){
                _this.time --;
                if(_this.time <= 0){
                    clearInterval(timer);
                    _this.time = 60
                }
            }, 1000)
        },
        getSmsCode(){
            this.countDown();
        }
    }
}
</script>
<style scoped>
    body{
        min-width: 1200px;
    }
    .container{
        width: 1200px;
        height: 100%;
        margin: 0 auto;
    }
    .header{
        position: fixed;
        width: 100%;
        top: 0;
        height: 50px;
        background-color: #ffffff;
        z-index: 99;
    }
    .header .container{
        width: auto;
        max-width: 1200px;
    }
    .nav-header{
        margin: 5px;
    }
    .nav-header>*{
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
    }
    .nav-header>a{
        color: #4b4f56;
    }
    .action-list{
        margin-top: 10px;
    }
    .action-list li{
        float: left;
    }
    .content{
        position: relative;
    }
    .content-main{
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -500px;
        margin-top: -180px;
    }
    .content-main img{
        max-width: 1000px;
    }
    .forgetpass-bg{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url(../../assets/img/user/regist.png) no-repeat 0 0/100% 100%;
        z-index: -1;
    }
    /**/
    .forgetpass-form{
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -220px;
        margin-left: -220px;
        background-color: #fff;
        z-index: 1;
        width: 440px;
        height: 370px;
        border-radius: 4px;
    }
    .form-header{
        position: relative;
    }
    .form-header h4{
        text-align: center;
        font-size: 18px;
        line-height: 50px;
        font-weight: normal;
    }
    .form-header button{
        position: absolute;
        right: 10px;
        top: 8px;
    }
    .forgetpass-form .form-content{
        padding: 20px 40px 0;
    }
    .form-group{
        width: 100%;
        margin-bottom: 15px;
    }
    .input-label{
        display: inline-block;
        width: 26px;
        height: 26px;
        margin-right: 5px;
        vertical-align: middle;
    }
    .input-label-user{
        background: url(../../assets/icons/login/account.png) no-repeat 0 0/100% 100%;
    }
    .input-label-password{
        background: url(../../assets/icons/login/password.png) no-repeat 0 0/100% 100%;
    }
    .input-label-rpassword{
        background: url(../../assets/icons/login/repeat_password.png) no-repeat 0 0/100% 100%;
    }
    .input-label-company{
        background: url(../../assets/icons/login/company.png) no-repeat 0 0/100% 100%;
    }
    .input-label-phone{
        background: url(../../assets/icons/login/phone_num.png) no-repeat 0 0/100% 100%;
    }
    .input-label-sms{
        background: url(../../assets/icons/login/sms_code.png) no-repeat 0 0/100% 100%;
    }
    /**/
    .footer{
        position: absolute;
        width: 100%;
        bottom: 10px;
        text-align: center;
        color: #ffffff;
        font-size: 13px;
        z-index: 99;
    }
    
</style>