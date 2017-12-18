<template>
    <div class="overall">
        <basic></basic>
        <!-- <div class="clearfix">
            <div class="part fl">
                <agesex :date = "date"></agesex>
            </div>
            <div class="part fr">
                <hour></hour>
            </div>
        </div> -->
        <agesex></agesex>
        <regional-distribute></regional-distribute>
        <overall-table :daily-list = "dailyList"></overall-table>
    </div>
</template>
<script>
import BasicInfo from './BasicInfo'
import OverallTable from  './OverallTable'
import RegionalDistribute from './RegionalDistribute'
import AgeSexDistribute from './AgeSexDistribute'
import {ajaxCallPromise} from '@/public/index'
import {SERVERCONF,getErrMsg} from '@/public/constants'
// import Hour from './Hour'
export default {
    name: 'overall',
    data(){
        return {
            date: this.$route.query,
            dailyList: {}
        }
    },
    mounted(){
        this.$nextTick(function(){
            this.initData();
        })
    },
    watch: {
        $route(newVal){
            this.date = newVal.query;
            this.initData();
        }
    },
    components: {
        OverallTable,
        RegionalDistribute,
        // Hour,
        agesex: AgeSexDistribute,
        basic: BasicInfo ,

    },
    methods: {
        initData(){
            let param = {
                sinterface: SERVERCONF.SUMMARY.DAILYSUMMARY,
                data: {
                    begin_date: this.date.startDate,
                    end_date: this.date.endDate,
                }
            };
            let _self = this;
            this.$store.commit('overviewLoadingOn');
            ajaxCallPromise(param).then(res => {
                _self.dailyList = res;
                _self.$store.commit('setDailyList',res);
                _self.$store.commit('overviewLoadingOff');
            }).catch(err => {
                let msg = getErrMsg(err);
                _self.$Message.error({
                    content: msg,
                    duration: 2,
                    closable: true
                });
                _self.$store.commit('overviewLoadingOff');
            });
        }
    }
}
</script>
<style>
  /* .overall .part{
        width: 45%;
   }*/
   .ac-part {
        margin-top: 20px;
        border: 1px solid #ccc;
    }
    .ac-as ul li {
        display: inline-block;
        /*width: 33.3333%;*/
        width: 210px;
        height: 45px;
        vertical-align: top;
        cursor: pointer;
    }

    .ac-as-nav{
        background-color: #f5f7f8;
    }
    .ac-as-tab{
        position: relative;
        height: 100%;
        border-right: 1px solid #ccc;
    }
    /*.ac-as ul li:last-child .ac-as-tab{
        border-right: none;
    }*/
    .ac-as .ac-as-tab.choosed {
        border-bottom: none;
    }

    .ac-as-box-1 {
        height: 6px;
    }
    .ac-as .choosed .ac-as-box-1 {
        background-color: #3a72bf;
    }
    .ac-as-box-2 {
        position: absolute;
        top: 6px;
        width: 100%;
        bottom: 0px;
        padding: 7px 10px;
    }
    .ac-as .choosed  .ac-as-box-2{
        bottom: -1px;
        background-color: #fff;
    }   
    .ac-as-conntent {
        padding-top: 20px;
        padding-left: 15px;
        border-top: 1px solid #ccc;
    }

    .chart-box{
        width: 100%;
        height: 250px;
    }

</style>
