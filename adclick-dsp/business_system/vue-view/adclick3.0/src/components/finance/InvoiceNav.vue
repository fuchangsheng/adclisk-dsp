<template>
    
    <div class="invoice-main">
        <div class="invoice-nav clearfix">
            <ul>
                <li><router-link :to="{name:'info'}" :class="{selected:choose('info')}" replace>充值管理</router-link></li>
                <li><router-link :to="{name:'records'}" :class="{selected:choose('records')}" replace>财务记录</router-link></li>
                <li><router-link :to="{name:'invoice-management'}" :class="{selected:choose('invoice-management')}" replace>发票管理</router-link></li>
            </ul>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>

export default {
    name: 'records',
    mounted(){
        this.$nextTick(function(){
            if(this.$route.name != this.currentPage){
                this.currentPage = this.$route.name;
            }
        });
    },
    data(){
        return {
            currentPage: 'info',
        }
    },
    watch: {
        '$route': function(){
            this.currentPage = this.$route.name;
        }
    },
    methods:{
        choose(cs){
            if(this.currentPage == 'pay' && cs=='info'){
                return true;
            }else{
                return this.currentPage == cs;
            }
        }
    }
}
</script>
<style>
.invoice-nav {
    padding-left: 3.65%; 
    font-size: 18px;
    border-bottom: 1px solid #cccccc;
    background-color: #fff;
}
.invoice-nav li{
    float: left;
}

.invoice-nav ul>li>a{
    display: inline-block;
    font-weight: bold; 
    line-height: 50px;
    width: 114px;
    color: #4b4f56;
    /*padding: 10px 0;*/
    border-bottom: 6px solid transparent;
    text-align: center;
}


.invoice-nav ul>li>a.selected{
    border-bottom: 6px solid #3a72bf;
}

.invoice{
    width: 92.7%;
    max-width: 1780px;
    min-width: 928px;
    margin: 29px auto;
}

._mt29{
    margin-top: 29px;
}

.c_red{
    color: #f00;
    font-size: 16px;
    font-weight: bold;
    padding-left: 5px;
    padding-right: 5px;
}
/*select{
    text-transform: none;
    text-decoration: none;
}*/
._inline50{
    display: inline-block;
    width: 45%;
    vertical-align: top;
    padding-top: 40px;
    padding-bottom: 40px;
}
.invoice .sp{
    display: inline-block;
    width: 20px;
}
.invoice form ._inline50:nth-child(1){
    padding-left: 12%;
}
.invoice form ._inline50:nth-child(2){
     padding-left: 8%;
}
._inline50 ._br{
    border-right: 1px solid #ccc;
}
._inline50 ._br .form-item:last-child{
    padding-left: 82px;
}
.invoice .form-item{
    line-height: 1.42857143;
    font-size: 14px;
    margin-bottom: 10px;
    margin-top: 24px;
}
.invoice .form-item label{
    text-align: right;
    display: inline-block;
    padding-right: 15px;
    width: 88px;
}

.invoice .form-item input[type=radio]{
    margin-right: 5px;
    vertical-align: middle;
}
.invoice .form-item .ad-form-control{
    width: 254px;
    margin-right: 15px;
}
.invoice .content{
    background-color: #fff;
    margin-top: 0;
}
._money{
    font-size: 20px;
    font-weight: bold;
    color: #ed2f2f;
}
.im-notice{
    display: inline-block;
    width: 100%;
    height: 32px;
    line-height: 32px;
    color: #838b97;
    
}
</style>