<template>
    <div v-if = "loading">
        <div >
            加载中
        </div>
    </div>
    <div v-else>
        <div v-if = "hasRecords">
            <div class="chart-info">
                <div class="ci_1">
                    <span class="ci_2">{{click | Number2Locale}}</span><span :style ="{color: color[0]}" class="">点击量</span>    
                </div>
                <div class="ci_1"> 
                    <span class="ci_2">￥{{cpc | Number2Locale(2)}}</span><span :style= "{color: color[1]}">平均CPC</span>
                </div>
            </div>
            <div class="chart-box">
                <line-chart :series= "series"></line-chart>
            </div>
        </div>
        <div v-else>
            没记录
        </div>
    </div>
</template>
<script>
import LineChart from '../chart/LineChart'
export default {
   name: 'clicks',
    data(){
        return {
            name: 'clicks',
            color: ['#3a72bf','#13bda6'],
            series: [],
            click: '',
            cpc: ''
        }
    },
    computed: {
        loading(){
            return this.$store.state.overviewLoading;
        },
        hasRecords(){
            return this.$store.getters.hasRecords;
        }
    },
    watch: {
        '$store.state.dailyList' : function(val){
            if(this.hasRecords && this.name == this.$store.state.currentBasic){
                this.$nextTick(function(){
                    console.log('cl ---------------')
                    this.initData();
                });
            }
        }
    },
    components: {
        LineChart
    },
    mounted(){
        this.$nextTick(function(){
            this.initData()
        });
    },
    activated(){
        this.initData();
    },
    methods: {
        initData(){
            if(this.loading || !this.hasRecords){
                return;
            }   
            let dailyList = this.$store.state.dailyList;
            let list = dailyList.list;
            this.click =  dailyList.all_click;
            this.cpc = dailyList.cpc_total;
            let data = [
                {
                    name: '点击量',
                    xAxis: list.map(function(item){
                        return item.date;
                    }),
                    yAxisUnit: '次次',
                    data: list.map(function(item){
                        return item.click;
                    }),
                    color: this.color,
                },
                {
                    name: '单次点击花费',
                    xAxis: list.map(function(item){
                        return item.date;
                    }),
                    yAxisUnit: '元',
                    data: list.map(function(item){
                        return item.CPC;
                    }),
                    color:this.color,
                }
            ];
            this.series = data;
        }
    }
}
</script>
<style>
</style>
