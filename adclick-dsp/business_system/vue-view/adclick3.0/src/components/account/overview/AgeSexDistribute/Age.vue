<template>
    <div class="chart-box">
        <div class="age-chart">
            
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'
export default {
    name: 'age',
    data() {
        return {
            chart: {}
        }
    },
    mounted() {
        this.$nextTick(function(item){
            this.initChart();
        });
    },
    methods: {
        initChart(){
            let data = [
                {
                    age: '18-24',
                    val: 0.21,
                    cost: 0.31
                },
                {
                    age: '25-34',
                    val: 0.21,
                    cost: 0.11
                },
                {
                    age: '35-44',
                    val: 0.12,
                    cost: 0.12
                },
                {
                    age: '45-54',
                    val: 0.11,
                    cost: 0.12
                }

            ];
            this.chart = echarts.init(document.querySelector('.chart-box .age-chart'));
            let option = {
                title: {
                    show: false,
                },
                tooltip:{
                    trigger: 'axis',
                    axisPointer: {
                        show: true,
                        type: 'shadow',
                        shadowStyle: {
                            opacity: 0.4
                        }
                    }
                },
                color: ['#3a72bf','#13bda6'],
                xAxis: {
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false,
                    },
                    data: data.map(function(item){
                        return item.age;
                    }),
                },
                yAxis: {
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        formatter: function(value,index){
                            let rate = value * 100;
                            rate = rate+ '%';
                            return rate;
                        }
                    }

                },
                series:[
                    {
                        name: '覆盖人数',
                        type: 'bar',
                        data: data.map(function(item){
                            return item.val;
                        }),
                        barMaxWidth: 30,
                        barGap: 0.1,
                        barCategoryGap: 0.1
                    },
                    {
                        name: '花费金额',
                        type: 'bar',
                        data: data.map(function(item){
                            return item.cost;
                        }),
                        barMaxWidth: 30,
                        barGap: 0.1,
                        barCategoryGap: 0.1
                    }
                ]

            };
            this.chart.setOption(option);
        }
    }
}
</script>
<style>
    .age-chart {
        height: 100%;
        width: 50%;
    }
</style>
