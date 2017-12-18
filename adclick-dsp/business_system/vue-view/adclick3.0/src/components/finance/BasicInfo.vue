<template>
<div class="invoice">
    <div class="content">
        <div class="caption">账户信息</div>
        <div class="info-outer">
            <div  class="info-inner">
                <div class="balance">
                    <div>账户余额</div>
                    <div><span class="_money">{{balance}}</span>元</div>
                </div>
                <div class="balance-caution"> 
                    <span>充值成功后，因账户余额不足而暂停的广告会自动投放，请关注！</span>
                </div>
            </div>
        </div>
        <div class="info-outer">
            <div class="info-inner">
                <span>账户充值</span>
                <div class="btn-item" v-for="item in payList">
                    <button type="button" class="ad-btn ad-btn-default" :value="item.money" @click="changePay(item)" :class="{'choosed':item.choosed}">￥ {{item.money | number2Local}}
                    </button>
                </div>
                <div class="btn-item">
                    <button type="button" class="ad-btn ad-btn-default" @click="customPay" :class="{choosed: !noCustom}">其他金额</button>
                </div>
                <form style="margin-top: 15px;">
                    <div :class="{hidden : noCustom}" class="customForm">
                        <Row>
                            <Col span="5"><span class="im-notice">具体金额</span></Col>
                            <Col span="14"><input type="text" class="ad-form-control" v-model.lazy = "customChoose"></Col>
                            <Col span="4"><span class="im-notice">元</span></Col>
                        </Row>
                        <div class="sg"><small>100元起充，最高精确到0.01元</small></div>
                    </div>
                    <div style="margin-left: 200px;">
                        <button type="button" class="ad-btn ad-btn-primary" @click = 'pay' :disabled='isMoney'>充值</button>    
                    </div>
                </form>
            </div>
        </div>
        
    </div>
</div>
</template>
<script>

import { ajaxCall,ajaxCallPromise} from '@/public/index';
import {isMoney} from '@/public/tools'
import {SERVERCONF,getErrMsg} from '@/public/constants';
export default {
    name: 'info',
    data(){
        return {
            payList:[
                {
                    money: 1000.00,
                    choosed:false
                },
                {
                    money: 5000.00,
                    choosed:false
                },
                {
                    money: 10000.00,
                    choosed:false
                }   

            ],
            noCustom: true,
            balance: '',
            customChoose: 10000.00,
            recharge: 0,

        }
    },
    mounted(){
        this.$nextTick(function(){
            this.getAccountBalance();
        });
    },
    filters: {
        number2Local(num){
            let local = Number(num).toLocaleString();
            return local;
        }
    },
    computed:{
        isMoney(){
            return this.recharge == 0 || (!this.noCustom && !isMoney(this.customChoose));
        }
    },
    methods: {
        //控制选中按钮颜色
        isChoosed(){
            return true;
        },
        pay(){
            if(!this.noCustom){
                this.recharge = this.customChoose;
            }
            let amount = Number(this.recharge).toFixed(2);
            this.$router.push({name:'pay',query:{amount:amount}});
        },
        customPay(){
            this.noCustom = false;
            this.payList.forEach((i)=>{
                i.choosed =  false;
            });
            this.recharge = this.customChoose;
        },
        changePay(item){
            if(!this.noCustom){
                this.noCustom = true;
            }
            this.payList.forEach((i)=>{
                i.choosed =  false;
            });
            item.choosed =true;
            this.recharge = item.money;
        },
        //显示账号余额
        getAccountBalance(){
            let param = {
                sinterface: SERVERCONF.ACCOUNT.BALANCE,
                data: {}
            };
            let _self = this;
            ajaxCallPromise(param).then(function(res){
                let balance = res.balance;
                _self.balance = balance || '0.00';
            }).catch(function(err){
                let msg = getErrMsg(err);
                _self.$Message.error({
                    content: msg,
                    duration: 2,
                    closable: true
                });
            });
        }

    }
}
</script>
<style>
.invoice .info-outer{
    border-bottom: 1px solid #ccc;
}
.invoice .info-inner{
    width: 50%;
    margin: 0 auto;
    padding-top: 25px;
    padding-bottom: 25px;
}

.invoice .info-inner .ad-btn-default {
    color: #4b4f56;
    background-color: #fff;
    border: 1px #ccc solid;
}
.invoice .info-inner .ad-btn-default:hover,.invoice .info-inner .ad-btn-default.choosed{
    color: #3a72bf;
    border-color: #3a72bf;
}

.invoice .info-inner .btn-item{
    display: inline-block;
    margin-left: 10px;
}
.invoice .info-inner .btn-item:nth-child(2){
    margin-left: 15px;
}

.invoice .info-inner .balance{
    position: absolute;
}

.invoice .info-inner .balance-caution{
    display: inline-block;
    width: 280px;
    height: 61px;
    margin-left: 180px;
    background-color: #f5f5f5;
    padding: 6px 4px;
}

.invoice .customForm{
    width: 380px;
    height: 96px; 
    background-color: #f5f5f5;
    margin-left: 80px;
    margin-bottom: 15px;
    padding: 20px 30px;
}
.invoice .sg{
    margin-left: 68px;
    margin-top: 10px;
}
</style>
