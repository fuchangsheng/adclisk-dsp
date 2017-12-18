<template>
    <div class="pay">
        <div class="pay-top">
            <router-link :to = "{name: 'info'}" class="back">
                <img src="../../assets/icons/public/go_back.png">
            </router-link>
            
            <span style="margin-left: 50px;">充值-充值信息确认</span>
        </div>
        <div class="pay-content">
            <div class="pay-info">
                <div class="hd">
                    <span>请确认以下信息</span>
                </div>
                <div class="ct">
                    <div class="pay-info-box">
                        <span>充值金额</span><span class="_money _mglf20">{{amount}}</span><span>元</span>
                    </div>
                    <div class="pay-info-box">
                        <div>
                            <span>收款方</span><span class="_mglf20">上海数凹文化传媒有限公司</span>
                        </div>
                        <div>
                            <span>付款方</span><span  class="_mglf20">{{userName}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pay-bottom">
                <div class="pay-box">
                    <div class="wxpay" id="qrcode">
                        <!-- 放置二维码 -->
                    </div>
                    <span class="wxbtn" @click = "wxpay">
                    </span>
                </div>
                <div class="pay-box alipay">
                    <span class="alipay-btn" @click="alipay"></span> 
                    
                </div>
            </div>
        </div>
        <Modal v-model="payModal" title="网上支付提示" width = "400" :mask-closable = "false" @on-cancel = "alipaySure">
            <div class="pay-modal">
                <span>
                    请在新打开的支付宝页面完成支付,支付完成前请不要关闭该窗口
                </span>
            </div>
            <div slot = "footer" style="text-align:center;">
                <button type="button" class="ad-btn ad-btn-primary" @click="alipaySure">已经完成支付</button>
            </div>
        </Modal>
        <Modal v-model="payResutltModal" title="支付结果提示" width = "400" :mask-closable = "false" @on-cancel = "payReturn">
            <div class="pay-modal">
                <span>
                    {{payResult}}
                </span>
            </div>
            <div slot = "footer" style="text-align:center;">
                <button type="button" class="ad-btn ad-btn-primary" @click="payReturn">确定</button>
            </div>
        </Modal>
    </div>
</template>
<script>
import {SERVERCONF,getErrMsg} from '@/public/constants'
import {ajaxCallPromise} from '@/public/index'
import QRCode from 'qrcodejs2'


export default {
    name:'Alipay',
    data(){
        return {
            userName: '',
            amount: 0,
            payUrl:'',
            out_trade_no:'',
            payModal: false,
            payResult: '',
            payResutltModal: false,
            qrcode: null,
            mWxOrderId: null,
            mWxTimer: null
        }
    },
    beforeDestroy(){
        this.stopWxQuery();
    },
    mounted(){
        this.$nextTick(function(){
            this.getUserName();
            this.amount = this.$route.query.amount;
            // this.alipay();//生成支付宝支付按钮
        });
    },
    methods:{
        getUserName(){
            let param = {
                sinterface: SERVERCONF.USERS.USERNAME,
                data:{}
            };
            let _self = this;
            ajaxCallPromise(param).then(res =>{
                _self.userName = res.user_name;
            }).catch(err => {
                let msg = getErrMsg(err);
                _self.$Message.error({
                    content: msg,
                    duration: 2,
                    closable: true
                })
            });
        },
        //支付宝支付
        alipay(){
            //清除微信支付的信息
            if(this.mWxTimer){
                this.stopWxQuery();
            }
            let amount = this.amount;
            let param = {
                sinterface: SERVERCONF.ACCOUNT.ALIPAY,
                data: {
                    amount: amount
                }
            };
            let newPage =  window.open('about:blank');
            let _self = this;
            ajaxCallPromise(param).then(res => {
                let payUrl = res.content.pay_url;
                let out_trade_no = res.content.out_trade_no;
                _self.out_trade_no = out_trade_no;
                _self.payModal = true;
                newPage.location.href = payUrl;
            }).catch(err => {
                let msg = getErrMsg(err);
                _self.$Message.error({
                    content: msg,
                    duration: 2,
                    closable: true
                })
            });
        },

        alipaySure(){
            //判断是否支付成功，支付成功和失败都弹出支付结果框，然后返回到info
            let param = {
                sinterface: SERVERCONF.ACCOUNT.ALIPAYRETURN,
                data:{
                    out_trade_no: this.out_trade_no
                }
            };
            let _self = this;
            console.log('确认')
            console.log(this.out_trade_no);
            ajaxCallPromise(param).then(res=>{
                if(res.charge_status =='充值成功'){
                    _self.payResult = '支付成功';
                }else{
                    _self.payResult = '支付失败';
                }
            }).catch(err=>{
                _self.payResult = '支付失败';
                let msg = getErrMsg(err);
                _self.$Message.error({
                    content: msg,
                    duration: 2,
                    closable: true,
                })
            });
            this.payModal = false;
            this.payResutltModal = true;
        },
        payReturn(){
            this.payResutltModal = false;
            this.$router.replace({name:'info'});
        },
        //微信支付
        wxpay(){
            if(this.qrcode){
                let qrcode_clear = document.getElementById('qrcode');
                qrcode_clear.innerHTML = '';
                this.stopWxQuery();
            }
            let amount = this.amount;
            let param = {
                sinterface: SERVERCONF.ACCOUNT.WECHATPAY,
                data: {
                    amount: amount
                }
            };
            let _self = this;
            ajaxCallPromise(param).then(param).then(res => {
                let content = res.content;
                let id = res.id;
                _self.mWxOrderId = id;
                _self.qrcode = new QRCode('qrcode',{
                    width: 150,
                    height: 150
                });
                _self.qrcode.makeCode(content);
                //开启定时任务，判断是否已经付款
                _self.startWxQuery();
            }).catch(err => {
                let msg = getErrMsg(err);
                _self.$Message.error({
                    content: msg,
                    duration: 2,
                    closable: true
                });
            })
            console.log('微信支付');
        },
        startWxQuery(){
            if(!this.mWxOrderId){
                console.log('没有微信订单id')
                return;
            }
            if(this.mWxTimer){
                console.log('查询早已经开始了')
                return;
            }
            this.mWxTimer = setInterval(this.queryWxOrder,10000);
        },
        queryWxOrder(){
            if(!this.mWxOrderId){
                this.stopWxQuery();
                return;
            }
            let param = {
                sinterface: SERVERCONF.ACCOUNT.PAYORDERVIEW,
                data: {
                    id: this.mWxOrderId
                }
            };
            let _self = this;
            ajaxCallPromise(param).then(res=>{
                if(res && res.html){
                    console.log('支付成功');
                    _self.stopWxQuery();
                    _self.$router.replace({name:'info'});
                }
            }).catch(err=>{
                _self.stopWxQuery();
                let msg = getErrMsg(err);
                _self.$Message.error({
                    content: msg,
                    duration: 2,
                    closablel: true,
                });
                _self.$router.replace({name:'info'});
            })
        },
        stopWxQuery(){
            if(this.mWxTimer){
                clearInterval(this.mWxTimer);
                this.mWxTimer = null;
                this.mWxOrderId = null;
            }
        }

    }
}
</script>
<style>
    .pay{
        background: #fff;
        color: #4b4f56;
        font-weight: bold;
    }
    .pay-top{
        position: relative;
        width: 100%;
        height: 50px;
        font-size: 16px;
        line-height: 29px;
        padding: 10px 20px;
        border-bottom: 1px solid #ccc;
        background: #fafbfc;
    }
    .pay-box{
        position: relative;
        display: inline-block;
        width: 160px;
        height: 200px;
        margin-top: 20px;
        margin-left: 20%;
    }
    .alipay{
        background: url('../../assets/img/pay/alipaybox.png') left top no-repeat;
    }
    #alipaySubmitBtn{
        position: absolute;
        bottom: 0;
        font-size: 20px; 
        color: #fff;
        width: 160px;
        height: 30px;
        background-color: #07a0f8;
        border-radius: 2px;
        border: solid 1px #07a0f8;
        cursor: pointer;
        font-weight: bold;
    }
    /*当按钮未加载出来时*/
    .alipay-btn{
        position: absolute;
        bottom: 0;
        width: 160px;
        height: 30px;
        background: url('../../assets/img/pay/alipaybtn.png') left top no-repeat;
        cursor: pointer;
    }
    .wxpay{
        width: 160px;
        height: 160px;
        padding: 5px;
        border: 1px solid #4bb414;
    }
    .wxbtn {
        position: absolute;
        bottom: 0;
        width: 160px;
        height: 30px;
        background: url('../../assets/img/pay/wxbtn.png') left top no-repeat;
        cursor: pointer;
    }
    

   .pay .back{
        display: inline-block;
        font-size: 150%;
        color: #838b97;
        vertical-align: middle;
   }
   .pay .back:after{
        content: '';
        position: absolute;
        top: 10px;
        left: 65px;
        display: block;
        height: 29px;
        width: 1px;
        background: #ccc;
   }

    .pay-content{
        width: 799px;
        margin: 20px auto;
    }
    .pay-bottom{
        margin-top: 20px;
        width: 100%;
        height: 246px;
        background: #f9f9f9;
    }
    .pay-info{
        font-size: 14px;
        height: 164px;
        border: 1px solid #cccccc;
    }
    .pay-info .hd{
        background: #f5f5f5;
        height: 44px;
        line-height: 1.428571;
        padding: 12px 20px;
        border-bottom: 1px solid #cccccc;
        
    }
    .pay-info .ct{
        height: 120px;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .pay-info-box{
        display: inline-block;
        vertical-align: top;
        width: 49%;
        height: 100%;
        padding-left: 75px;
        padding-top: 20px;
    }
    .pay-info-box:nth-child(1){
        border-right: 1px solid #cccccc;
    }
    ._mglf20{
        margin-left: 20px;
    }

    .pay-modal{
        width: 100%;
        height: 120px;
        font-size: 18px;
        padding: 20px 5px;
        text-align: center;
    }
</style>