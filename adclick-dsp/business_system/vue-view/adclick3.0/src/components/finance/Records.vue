<template>
<div class="invoice">
    <div class="records">
        <div  class="caption">财务记录
              <div class="fr">
                <div class="inline ft_14">
                    <select class="select" v-model="type">
                        <option value= 0>在线充值</option>
                        <option value= 1>后台充值</option>
                    </select>
                </div>
                <div class="inline ft_14 vtop">
                    <div class="date">
                     <DatePicker v-model="startTime" type="datetime"   placement="bottom-end" placeholder="开始日期"></DatePicker>
                    </div>
                    <span>至</span>
                    <div class="date">
                        <DatePicker v-model="endTime" type="datetime"  placement="bottom-end" placeholder="结束日期"></DatePicker>
                    </div>
                    <div class="inline">
                        <button type="button" class="ad-btn ad-btn-primary" @click="search">搜索</button>
                    </div>
                </div>
            </div>
        </div>
        <table class="table" v-cloak>
            <thead>
                <tr>
                    <th>交易日期</th>
                    <th>存入</th>
                    <th>支出</th>
                    <th>充值类型</th>
                    <th>结果</th>
                    <th>备注</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for = "record in records_list">
                <td>{{record.date}}</td>
                <!-- <template v-if="record.type == 0">
                    <td style="color:#44b549;">+￥{{record.amount}}</td>
                    <td>--</td>
                </template>
                <template v-else>
                    <td>--</td>
                    <td style="color:#ed2f2f;">-￥{{record.amount}}</td>
                </template> -->
                    <td style="color:#44b549;">￥{{record.amount}}</td>
                    <td>--</td>
                <td>{{record.charge_type}}</td>
                <td>{{record.charge_status}}</td>
                <td>{{record.notes}}</td>
            </tr>
            </tbody>
            <tfoot v-if = "resultMsg">
                <tr><td colspan="6" class="no-data">{{resultMsg}}</td></tr>
            </tfoot>
        </table>
        <page v-on:on-change = "changePage"  :index = "index" :total = "total" v-if = "total!=0"></page>
    </div>
</div>
</template>
<script>
import Page from '../global/Page'
import {SERVERCONF} from '@/public/constants'
import {ajaxCallPromise} from '@/public/index'
import {stringLoadFail} from '@/public/component'

// const charge_status = ["充值成功", "充值中", "充值中", "充值失败"];
// const charge_type = ["网银充值","支付宝充值","微信充值","后台充值"];
export default {
    name: 'recharge-records',
    data() {
      return {
        startTime: '',
        endTime: '',
        index: 1,
        count: 10,
        records_list:[],
        type: 0,//1 虚拟账户0现金账户（虚拟账户为后台充值。）
        sort: 0,//0 创建时间减序 1创建时间增序
        resultMsg: '',
        total: 0,//总页数
      };
    },
    mounted(){
        this.$nextTick(function(){
            this.loadRecordList();
        });
    },
    components:{
        Page
    },
    filters:{
        // chargeStatusFilter(index){
        //     return charge_status[index];
        // },
        // chargeTypeFilter(index){
        //     return charge_type[index];
        // }
    },

    methods:{
        search(){
            //TODO 有选择的查询
            this.loadRecordList();
        },
        changePage(page){
            this.index = page;
            // this.loadRecordList();
            this.loadRecordList();
        },
        loadRecordList(){
            let sort = this.sort == 0 ? '创建时间减序' : '创建时间增序';
            let type = this.type == 0 ? '现金账户' : '虚拟账户';
            let param = {
                sinterface: SERVERCONF.ACCOUNT.RECHARGERECORDS,
                data: {
                    type: type,
                    index: this.index - 1,
                    count: this.count,
                    sort: sort
                }
            };
            this.resultMsg = '';
            let _slef = this;
            ajaxCallPromise(param).then(res => { 
                _slef.records_list = res.list;
                let total = res.total;//返回的为总条数
                _slef.total = Math.ceil(total / _slef.count);
                if(res.size == 0){
                    _slef.resultMsg = stringLoadFail("没有数据");
                }
            }).catch(err => {
                _slef.resultMsg = stringLoadFail(err.msg);
            });
        }
    }
}
</script>
<style>

.date{
    display: inline-block;
    font-size: 14px;
    color: #4b4f56;
}
</style>
