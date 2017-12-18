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
                    <div class="ci_2">{{imp | Number2Locale}}</div><span :style ="{color: color[0]}" class="">展现量</span>    
                </div>
                <div class="ci_1"> 
                    <div class="ci_2">￥{{cpm | Number2Locale(2)}}</div><span :style= "{color: color[1]}">平均CPM</span>
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
   name: 'impression',
    data(){
        return {
            name: 'impression',
            color: ['#3a72bf','#13bda6'],
            series: [],
            imp: '',
            cpm: ''

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
            this.imp = dailyList.all_imp;
            this.cpm = dailyList.cpm_total;
            let data = [
                {
                    name: '展现量',
                    xAxis: list.map(function(item){
                        return item.date;
                    }),
                    yAxisUnit: '次',
                    data: list.map(function(item){
                        return item.imp;
                    }),
                    color: this.color
                },
                {
                    name: '千次展现花费',
                    xAxis: list.map(function(item){
                        return item.date;
                    }),
                    yAxisUnit: '元',
                    data: list.map(function(item){
                        return item.CPM;
                    }),
                    color: this.color
                }
            ];
            this.series = data;
        },
    }
}
</script>
<style>

</style>
