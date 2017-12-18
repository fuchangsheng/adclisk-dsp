<template>
    <div class = "chart-box">
        <div class = "sex-box">
            
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'
export default {
    name: 'sex',
    data() {
        return {
            chart: {}
        }
    },
    mounted(){
        this.$nextTick(function(){
            this.initChart();
        })
    },
    methods: {
        initChart(){
            let data = [
                {
                    sex: '女性',
                    value: 0.11,
                    cost: 0.21
                },
                {
                    sex: '男性',
                    value: 0.22,
                    cost: 0.12
                },
                {
                    sex: '未知',
                    value: 0.05,
                    cost: 0.05
                }

            ];
            this.chart = echarts.init(document.querySelector('.chart-box .sex-box'));
            let option = {
                title: {
                    show: false
                },
                tooltip: {
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
                color: ['#3a72bf','#13bda6'],
                xAxis: {
                    type: 'value',

                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false,
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#e5e5e5'
                        }
                    },
                    axisLabel: {
                        formatter: function(value,index){
                            let rate = value * 100;
                            rate = rate + '%';
                            return rate;
                        },
                    }
                },
                yAxis: {
                    type: 'category',
                    inverse: true,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    data: data.map(function(item){
                        return item.sex;
                    })
                },
                series: [
                    {
                        name: '覆盖人数',
                        type: 'bar',
                        data: data.map(function(item){
                            return item.value;
                        }),
                    },
                    {
                        name: '花费',
                        type: 'bar',
                        data: data.map(function(item){
                            return item.cost;
                        })
                    }
                ]
            };
            this.chart.setOption(option);
        }
    }
}
</script>
<style>
    .sex-box {
        width: 100%;
        height: 100%;
    }
</style>
