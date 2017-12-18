<template>
    <div class="ac-part">
        <div class="ac-ot-top">
            
        </div>
        <div class="ac-ot-content">
           <Table border :columns="columns" :data = "acData"></Table>
        </div>
    </div> 
</template>
<script>
import {SERVERCONF,getErrMsg} from '@/public/constants'
import {ajaxCallPromise} from '@/public/index'
export default {
    name: 'overallTable',
    props: ['dailyList'],
    data() {
        return {
            columns: [
                {
                    title: '账户名称',
                    key: 'name',
                    // fixed: 'left'
                },
                {
                    title: '展现量',
                    key: 'all_imp'
                },
                {
                    title: '点击量',
                    key: 'all_click'
                },
                {
                    title: '点击率',
                    key: 'ctr_total'
                },
                {
                    title: '千次展现费用',
                    key: 'cpm_total'
                },
                {
                    title: '单次点击费用',
                    key: 'cpc_total'
                },
                {
                    title: '总费用',
                    key: 'all_cost'
                }
            ],
            acData:[]
        }
    },
    mounted(){
        this.getUserName();
        this.initData();
        // this.$nextTick(function(){
            console.log(this.acData)
        // })
    },
    watch: {
        dailyList: {
            handler(val){
                this.initData();
            },
            deep: true
        }
    },
    methods: {
        initData(){
            let length = Object.keys(this.dailyList).length;
            if(!length){
                return ;
            }
            let dataItem = {};
            let _self = this;
            this.columns.forEach(function(item){
                let key = item.key;
                if(key == 'name'){
                    return;
                }
                let val = _self.dailyList[key];
                dataItem[key] = val;
            });
            this.acData.push(dataItem);
        },
        getUserName(){
            let _self = this;
            let param = {
                sinterface: SERVERCONF.USERS.USERNAME,
                data: {}
            };
            ajaxCallPromise(param).then(res => {
                let user_name = res.user_name;
                _self.$set(_self.acData[0],'name',user_name);
            }).catch(err => {
                let msg = getErrMsg(err);
                _self.$Message.error({
                    content: msg,
                    duration: 2,
                    closable: true
                })
            });
        }   
    }
}
</script>
<style>
    .ac-ot-top {
        height: 50px;
        line-height: 50px;
    }
</style>
