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
            <div class="regist-bg"></div>
            <div class="regist-form">
                <div class="form-header" style="border-bottom: 1px solid #dddee1;">
                    <h4>请输入注册信息</h4>
                </div>
                <div class="form-content">
                    <div class="form-group">
                        <label class="input-label input-label-user"></label>
                        <Input v-model="regist_data.username" placeholder="请输入用户名（主账号登录用户名）" style="width: 324px;"></Input>
                    </div>
                    <div class="form-group">
                        <label class="input-label input-label-password"></label>
                        <Input  v-model="regist_data.password" placeholder="请输入密码（包含大小写，数字，长度6-16" style="width: 324px;"></Input>
                    </div>
                    <div class="form-group">
                        <label class="input-label input-label-rpassword"></label>
                        <Input v-model="regist_data.rpassword" placeholder="再次确认密码" style="width: 324px;"></Input>
                    </div>
                    <div class="form-group">
                        <label class="input-label input-label-company"></label>
                        <Input v-model="regist_data.company" placeholder="请输入公司名称" style="width: 324px;"></Input>
                    </div>
                    <div class="form-group">
                        <label class="input-label input-label-phone"></label>
                        <Input v-model="regist_data.phone" placeholder="请输入手机号码" style="width: 324px;"></Input>
                    </div>
                    <div class="form-group">
                        <label class="input-label input-label-sms"></label>
                        <Input v-model="regist_data.smscode" placeholder="请输入短信验证码" style="width: 202px;"></Input>
                        <button class="ad-btn ad-btn-primary" style="height: 32px;width: 118px;" v-show="time == 60" @click="getSmsCode">获取验证码</button>
                        <button class="ad-btn ad-btn-primary" style="height: 32px;width: 118px;" v-show="!(time == 60)">重新发送（{{time}}）</button>
                    </div>

                    <button type="button" class="ad-btn ad-btn-success ad-btn-block">确认注册</button>

                    <Alert closable>An info prompt</Alert>

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
    name: 'regist',
    data: function(){
        return{
            bg_style:{
                width: '100%',
                height: (window.innerHeight - 50) + 'px'
            },
            regist_data: {
                username: '',
                password: '',
                rpassword: '',
                company: '',
                phone: '',
                smscode: '',
            },
            time: 60
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
    .regist-bg{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url(../../assets/img/user/regist.png) no-repeat 0 0/100% 100%;
        z-index: -1;
    }
    /**/
    .regist-form{
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -220px;
        margin-left: -220px;
        background-color: #ffffff;
        z-index: 1;
        width: 440px;
        height: 420px;
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
    .regist-form .form-content{
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