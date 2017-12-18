<template>
    <!-- <div class="ac-as">
        <div class="ac-as-nav">
            <ul>
                <li v-for = "tab in tabs" @click = "chooseThis(tab)">
                    <div class="ac-as-tab" :class="{choosed: tab.choosed}">
                        <div  class = "ac-as-box-1"></div>
                        <div class = "ac-as-box-2">
                            {{tab.name}}
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="ac-as-conntent">
            <div class="chart-box">
                <div class="hour-chart">
                    
                </div>
            </div>
        </div>
    </div> -->
    <div class="chart-box">
        <div class="hour-chart">
                    
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'
export default {
    name: 'hour',
    data(){
        return {
            tabs: [
                {
                    type: 'hour',
                    name: '小时',
                    choosed: true,
                },
            ],
            chart: {}
        }
    },
    mounted() {
        this.$nextTick(function(){
            this.initChart();
        });
    },
    methods: {
        initChart(){
            let data = [
                {
                    date: '00',
                    value: 1
                },
                {
                    date: '01',
                    value: 2
                },
                {
                    date: '02',
                    value: 3
                },
                {
                    date: '03',
                    value: 4
                },
                {
                    date: '04',
                    value: 5
                },
                {
                    date: '05',
                    value: 6
                },
                 {
                    date: '06',
                    value: 7
                },
                {
                    date: '07',
                    value: 8
                },
                {
                    date: '08',
                    value: 9
                },
                {
                    date: '09',
                    value: 10
                },
                {
                    date: '10',
                    value: 11
                },
                {
                    date: '11',
                    value: 12
                },

            ];
            this.chart = echarts.init(document.querySelector('.chart-box .hour-chart'));
            let option = {
                title: {
                    show: false
                },
                color: ['#3a72bf','#13bda6'],
                tooltip:{
                    trigger: 'axis',
                    formatter: '{b0}:{c0}----{b1}:{c1}',
                    padding: 10,
                    backgroundColor: '#fff',
                    textStyle: {
                        color: '#495060'
                    },
                    axisPointer: {
                        show: true,
                        type: 'shadow',
                        shadowStyle: {
                            opacity: 0.4
                        }
                    },
                },
                xAxis: {
                    axisLine: {
                        show: false
                    },
                    axisTick:{
                        show: false
                    },
                    spiltLine: {
                        show: false
                    },
                    axisLabel: {
                        formatter: function(value,index){
                            if(index % 3 == 0){
                                return value;
                            }
                        }
                    },
                    data: data.map(function(item){
                        return item.date;
                    }),
                },
                yAxis: {
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        formatter: '{value}'
                    },
                    spiltLine: {
                        lineStyle: {
                            color: '#e5e5e5'
                        }
                    }
                },
                series: [
                    {
                        name: '点击量',
                        type: 'bar',
                        data: data.map(function(item){
                            return item.value;
                        }),
                    },
                    {
                        name: '展现次数',
                        type: 'bar',
                        data: data.map(function(item){
                            return item.value;
                        })
                    }
                ]
            }
            this.chart.setOption(option);
        }
    }
}
</script>
<style>
    .hour-chart {
        width: 100%;
        height: 100%;
    }
</style>
