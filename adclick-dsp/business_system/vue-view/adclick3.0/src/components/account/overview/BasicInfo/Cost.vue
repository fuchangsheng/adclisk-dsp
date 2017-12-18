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
                    <span class="ci_2">￥{{cost | Number2Locale(2)}}</span><span :style= "{color: color[0]}">花费金额</span>
                </div>
            </div>
            <div class = "chart-box">
                <div class = "cost-chart">
                    
                </div>
            </div>
        </div>
        <div v-else>
            没记录
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'
export default {
    name: 'cost',
    data(){
        return {
            name: 'cost',
            chart: {},
            color: ['#3a72bf'],
            cost:''
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
        '$store.state.dailyList': function(val){
            if(this.hasRecords && this.name == this.$store.state.currentBasic){
                this.$nextTick(function(){
                    this.initData();
                })
            }
        }
    },
    mounted(){
        this.$nextTick(function(){
            this.initData();
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
            this.chart = echarts.init(document.querySelector('.cost-chart'));
            let data = this.$store.state.dailyList.list;
            this.cost = this.$store.state.dailyList.all_cost;
            let option = {
                title: {
                    show: false
                },
                color: this.color,
                grid: {
                    top: '7%',
                    left: '8%'
                },
                tooltip:{
                    trigger: 'axis',
                    axisPointer: {
                        show: true,
                        type: 'shadow',
                        shadowStyle: {
                            opacity: 0.4
                        }
                    },
                },
                xAxis: {
                    data: data.map(function(item){
                        return item.date;
                    }),
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#e5e5e5'
                        }
                    },
                    axisLabel: {
                        color: '#333333'
                    }
                },
                yAxis:{
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel:{
                        formatter: '￥{value}'
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#e5e5e5'
                        }
                    }

                },
                series: [
                    {
                        name: '花费金额',
                        type: 'bar',
                        data: data.map(function(item){
                            let re = {};
                            let cost = item.cost;
                            // if(cost == 0){
                            //     re.itemStyle = {};
                            //     re.itemStyle.normal = {};
                            //     re.itemStyle.normal.borderWidth = 1;
                            //     re.itemStyle.normal.borderColor = '#ccc';
                            // }
                            re.value = cost;
                            return re;
                        }),

                    }
                ]
            };
            this.chart.setOption(option); 
        }
    }

}
</script>

<style>
.cost-chart {
    width: 100%;
    height: 100%;
}
</style>
