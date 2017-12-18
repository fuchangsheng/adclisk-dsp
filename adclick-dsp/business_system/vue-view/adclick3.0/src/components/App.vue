<template>
   <div class="wrapper">
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    name: 'app',
    mounted(){
        console.log('this is app mounted!')
    },
    beforeRouteEnter(to,from,next){
        var user = localStorage.getItem('name');
        console.log('localStorage'+user)
        if(!user){
            next({path:'/login'});
        }else{
            next({path:'/main'})
        }
    }
} 
</script>
<style>
* {
  -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
          box-sizing: border-box;
}
html{
    font-size: 100%;
    font-family: 'HiraginoSansGB-W6';
}

body{
    font-size: 1em;
    margin: 0;
    min-width: 1024px;
    background-color: #e9eaeb;
    overflow-y: scroll;
}

h2{
    font-size: 20px;
}
/*IE滚动条颜色设置*/
body {
    scrollbar-arrow-color:#f2f2f3;  /*上下箭头*/
    scrollbar-track-color:#1589ce;  /*底层背景色*/
    scrollbar-face-color:#27aeff;   /*滚动条前景色*/
    scrollbar-Shadow-color:#1589ce; /*滚动条边线色*/
}
/*chrome滚动条颜色设置*/
body::-webkit-scrollbar {width:5px; height:5px; background-color:transparent;} /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
body::-webkit-scrollbar-track {background-color:transparent; -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3);} /*定义滚动条轨道 内阴影+圆角*/
body::-webkit-scrollbar-thumb {background-color:#ccc; border-radius:10px; -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);} /*定义滑块 内阴影+圆角*/
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/



/*定义select下拉框的样式*/
.scrollbar ::-webkit-scrollbar
{
    display: none;
}
 

/*定义select下拉框的样式*/
.scrollbar:hover ::-webkit-scrollbar
{
    display: inherit;
    width: 5px;
    height: 5px; 
    background-color:#fff;
}
 
/*定义滚动条轨道 内阴影+圆角*/
.scrollbar:hover ::-webkit-scrollbar-track:
{
    background-color:transparent;
    -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3);
}
 
/*定义滑块 内阴影+圆角*/
.scrollbar:hover ::-webkit-scrollbar-thumb
{
    background-color:#e5e5e5;
    border-radius: 5px;
    -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);
}



[disabled]{
    cursor: not-allowed !important;
}
/*vue compile over*/
[v-cloak] {
  display: none;
}


/*按钮组*/
.ad-btn {
    display: inline-block;
    font-size: 14px;
    padding: 4.5px 9px;
    white-space: nowrap;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    border: none;
    text-align: center;
    outline: none;
    line-height: 1.42857143;
}

.ad-btn-primary {
    background-color: #3a72bf;
}

.ad-btn-primary:hover {
    background-color: #1d4a88;
}

.ad-btn-primary[disabled]{
    cursor: default !important;
    background-color: #a5bfe4;
}

.ad-btn-border {
    background-color: #ffffff;
    color: #3a72bf;
    border: 1px solid #3272bf;
    padding: 3.5px 9px;
}

.ad-btn-border:hover {
    background-color: #3272bf;
    color: #ffffff;
}

.ad-btn-default {
    color: #4b4f56;
    background-color: #cccccc;
}

.ad-btn-default:hover {
    background-color: #a5a5a5;
}

.ad-btn-default[disabled]{
    cursor: default !important;
    background-color: #cccccc;
    color: #aaaaaa;
}

.ad-btn-success {
    background-color: #42b72a;
}

.ad-btn-success:hover {
    background-color: #278214;
}

.ad-btn-success[disabled]{
    cursor: default !important;
    background-color: #a3de97;
}

.ad-btn-link{
    border-color: transparent;
    background-color: transparent;
    color: #337ab7;
}

.ad-btn-link:hover{
    color: #23527c;
    text-decoration: underline;
}

.ad-btn-lg {
    padding: 8px 18px;
    font-size: 16px;
    line-height: 1.5;
}

.ad-btn-down {
    background-color: #f3f4f4;
    color: #4b4f56;
    padding-top: 3.5px;
    padding-bottom: 3.5px;
    border: 1px solid #cccccc;
}

.ad-btn-down:hover {
    background-color: #dedede;
}

.ad-btn-close {
    border: 0;
    background: 0 0;
    cursor: pointer;
    line-height: 1;
    color: #000;
    opacity: .2;
    font-size: 18px;
}

.ad-btn-close:hover {
    opacity: .5;
}

.ad-btn-block{
    display: block;
    width: 100%;
}


/*表单组*/
.ad-form-control{
    display: inline-block;
    height: 32px;
    width: 100%;
    font-size: 14px;
    line-height: 1.42857143;
    padding: 5px 12px;
    border: 1px solid #ccc;
    color: #555;
    background-color: #fff;
    background-image: none;
    /*border-radius: 4px;*/
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
}
.ad-form-control:focus {
  border-color: #66afe9;
  outline: 0;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);
}

/*下拉框*/
.select{
    display: inline-block;
    height: 32px;
    font-size: 14px;
    line-height: 1.42857143;
    padding: 5px 12px;
    border: 1px solid #ccc;
    color: #555;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    cursor: pointer;
}


/*标记*/
.mark{
    display: inline-block;
    width: 9px;
    height: 9px;
    margin-right: 5px;
    border: 1px solid transparent;
    border-radius: 50%;
} 

.mark-default {
    background-color: #bbbbbb;
}

.mark-info {
    background-color: #6dbd25;
}

.mark-error {
    background-color: #c73f3f;
}

.mark-warning {
    background-color: #e9a31d;
}

.mark-primary{
    background-color: #3a72bf;
}

/*开关*/
.switch{
    position: relative;
    display: inline-block;
    width: 35px;
    height: 19px;
    background-color: #838b97;
    border: 1px solid transparent;
    border-radius: 9px;
}

.switch:before{
    display: block;
    position: absolute;
    top: -2px;
    left: -1px;
    content: '';
    width: 21px;
    height: 21px;
    border-radius: 50%;
    background-color: #fff;
    border: 1px solid #838b97;
    box-sizing: border-box;
    cursor: pointer;
}

.switch.selected:before{
    left: 14px;
    border-color: #3a72bf;
}

.switch.selected{
    background-color: #3a72bf;
}

.switch-sm{
    width: 26px;
    height: 14px;
}

.switch-sm:before{
    width: 16px;
    height: 16px;

}

.switch-sm.selected:before{
    left: 10px;
}

/*面板*/
.msg{
    display: block;
    width: 427px;
    margin-bottom: 20px;
    font-size: 14px;
    border: 1px solid #ccc;
    background-color: #fff;
}


/*隐藏*/
.hidden{
    display: none;
}

/*表格相关*/
.table {
    text-align: left;
    width: 100%;
    border-collapse: collapse;
}
.caption{
    text-align: left;
    background-color: #838b97;
    color: #fff;
    font-weight: bold;
    line-height: 30px;
    font-size: 18px;
    padding: 10px 20px 10px 29px;
}
.table th,.table td {
    font-size: 14px;
    padding-left: 29px;
    line-height: 44px;
    border: 1px solid #ccc;
    background-color: #fff;
}

.msg-heading{
    line-height: 43px;
    padding-left: 16px;
    border-bottom: 1px solid #ccc;
    background: #f5f5f5;
}
.msg-body{
    min-height: 72px;
    padding: 16px;
    line-height: 39px;
    border-bottom: 1px solid #ccc;
}

.msg-footer{
    padding: 10px 16px;
    height: 50px;
}

.msg-dismiss{
    display: inline-block;
    float: right;
    width:40px;
    text-align: center;
    cursor: pointer;
}

/*分割线*/
.cut-line{
    display: inline-block;
    width: 1px;
    height: 40px;
    background-color: #ccc;
}

a {
    text-decoration: none;
}

ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
}

.cp {
    cursor: pointer;
}

.fr {
    float: right;
}

.fl {
    float: left;
}

.clearfix {
    zoom: 1;
}

.clearfix:after {
    content: '';
    display: block;
    clear: both;
    height: 0;
    line-height: 0;
    font-size: 0;
    visibility: hidden;
}
._im {
    display: inline-block;
    vertical-align: middle;
}
.vtop{
    vertical-align: top;
}

.p73 {
    display: inline-block;
    padding: 6px 3px;
}  

.inline {
    display: inline-block;
}

.ft_14{
    font-size: 14px;
}

.wrapper{
    min-width: 928px;
}


.content{
    margin-top: 50px;
}

.position_1{

}
 

/*当列表无数据时*/
.no-data{
    font-size: 85%;
    color: #777;
    text-align: center;
}


</style>
