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
                            <button class="ad-btn ad-btn-border" @click="showLoginForm">登录投放系统</button>
                        </li>
                        <li style="margin-left: 20px;">
                            <router-link to="/regist" class="ad-btn ad-btn-primary">注册</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="content" v-bind:style="bg_style">
            <div class="login-bg2">
                <img src="../../assets/img/user/login-bg2.png">
            </div>
            <div class="login-form" v-show="form_show">
                <div class="form-header">
                    <h4>登录AdClick</h4>
                    <button type="button" class="ad-btn-close" @click="hideLoginForm">x</button>
                </div>
                <div class="form-content">
                    <div class="form-group">
                        <Input v-model="login_data.username" placeholder="请输入用户名"></Input>
                    </div>
                    <div class="form-group">
                        <Input type="password" v-model="login_data.password" placeholder="请输入密码（包含大小写、数字、长度6-16）"></Input>
                    </div>
                    <div class="form-group">
                        <Input v-model="login_data.code" placeholder="请输入图片中的验证码" style="width: 160px;"></Input>
                        <img class="verify-code" src="../../assets/img/user/default-sms.png" v-show="!login_data.img">
                        <img class="verify-code" :src="login_data.img" v-show="login_data.img">
                        <button class="ad-btn ad-btn-link" style="min-width: 60px;">换一张</button>
                    </div>
                    
                    <button type="button" class="ad-btn ad-btn-success ad-btn-block" @click="login">登录</button>
                </div>
                <div class="form-footer clearfix">
                    <div class="fr">
                        <ul class="action-list">
                            <li>
                                <router-link to="/forgetpass" class="ad-btn ad-btn-link">忘记密码？</router-link>
                            </li>
                            <li >
                                <span class="dotted">|</span>
                            </li>
                            <li>
                                <router-link to="/regist" class="ad-btn ad-btn-link">注册新账号</router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="login-bg"></div>
            <div class="footer">
                <span>Copyright © 2012-2017 上海数凹文化传媒有限公司. 版权所有</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'login',
    data: function(){
        return{
            bg_style:{
                width: '100%',
                height: (window.innerHeight - 50) + 'px'
            },
            form_show: false,
            login_data:{
                username: '',
                password: '',
                token: '',
                code: '',
                img: ''
            }
        }
    },
    methods: {
        showLoginForm(){
            this.form_show = true;
        },
        hideLoginForm(){
            this.form_show = false;
        },
        login(){
            console.log(this)
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
        display: inline-block;
    }
    .content{
        position: relative;
    }
    /*login-form start*/
    .login-form{
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -160px;
        margin-left: -170px;
        background-color: #ffffff;
        z-index: 1;
        width: 340px;
        height: 280px;
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
    .form-content{
        padding: 20px 20px 0;
    }
    .form-group{
        width: 100%;
        margin-bottom: 15px;
    }
    img.verify-code{
        display: inline-block;
        vertical-align: middle;
        width: 70px;
        height: 32px;
        border: 1px solid #dddee1;
        border-radius: 4px;
    }
    .form-footer{
        padding: 0 20px;
    }
    span.dotted{
        color: #bfbfbf;
        display: inline-block;
        padding-top: 2px;
    }
    /*login-form end*/
    .login-bg2{
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -500px;
        margin-top: -180px;
    }
    .login-bg2 img{
        max-width: 1000px;
    }
    .login-bg{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url(../../assets/img/user/login-bg.png) no-repeat 0 0/100% 100%;
        z-index: -1;
    }
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