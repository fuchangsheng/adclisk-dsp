<template>
    <div class="chart-box">
        <div class="as-chart">
            this is Age and sex
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'
export default {
    name: 'agesex',
    data(){
        return {
            chart: {}
        }
    },
    mounted() {
        this.$nextTick(function(){
            this.initChart();
        })
    },
    methods: {
        initChart(){
            let data = [
                {
                    age: '18-24',
                    male: {
                        value: 0.11,
                        cost: 0.02
                    },
                    female: {
                        value: 0.21,
                        cost: 0.21
                    }
                },
                {
                    age: '18-24',
                    male: {
                        value: 0.11,
                        cost: 0.02
                    },
                    female: {
                        value: 0.21,
                        cost: 0.11
                    }
                },
                {
                    age: '18-24',
                    male: {
                        value: 0.11,
                        cost: 0.02
                    },
                    female: {
                        value: 0.21,
                        cost: 0.23
                    }
                },
                {
                    age: '18-24',
                    male: {
                        value: 0.11,
                        cost: 0.02
                    },
                    female: {
                        value: 0.21,
                        cost: 0.45
                    }
                },
            ];
            this.chart = echarts.init(document.querySelector('.chart-box .as-chart'));
            let option = {
                title: {
                    show: false
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        show: true,
                        type: 'shadow',
                        shadowStyle: {
                            opacity: 0.4
                        }
                    },
                    formatter: '{b}--{a}--{c}'
                },
                color: ['#3a72bf','#13bda6'],
                grid: [
                    {
                        width: '38%',
                        height: '38%'
                    },
                    {
                        left: '52%',
                        width: '38%',
                        height: '38%'
                    }
                ],
                xAxis: [
                    {
                        type: 'value',
                        inverse: true,
                        axisLabel: {
                            formatter: function(value,index){
                                let rate = value * 100 + '%';
                                return rate; 
                            }
                        },
                        axisLine: {
                            show: false,
                        },
                        axisTick: {
                            show: false,
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#e5e5e5'
                            }
                        }
                    },
                    {
                        gridIndex: 1,
                        type: 'value',
                        axisLabel: {
                            formatter: function(value,index){
                                let rate = value * 100 + '%';
                                return rate; 
                            }
                        },
                        axisLine: {
                            show: false,
                        },
                        axisTick: {
                            show: false,
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#e5e5e5'
                            }
                        }

                    }
                ],
                yAxis: [
                    {
                        gridIndex: 0,
                        type: 'category',
                        axisLine: {
                            show: false,
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            show: false
                        },
                        data: data.map(function(item){
                            return item.age;
                        })
                    },
                    {
                        gridIndex: 1,
                        type: 'category',
                        axisLine: {
                            show: false,
                        },
                        axisTick: {
                            show: false,
                        },
                        data: data.map(function(item){
                            return item.age;
                        })
                    }
                ],
                series: [
                    {
                        name: '覆盖人数',
                        type: 'bar',
                        xAxisIndex: 0,
                        yAxisIndex: 0,
                        data: data.map(function(item){
                            return item.male.value;
                        }),
                    },
                    {
                        name: '花费',
                        type: 'bar',
                        xAxisIndex: 0,
                        yAxisIndex: 0,
                        data: data.map(function(item){
                            return item.male.cost;
                        }),
                    },
                    {
                        name: '覆盖人数',
                        type: 'bar',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        data: data.map(function(item){
                            return item.female.value;
                        }),
                    },
                    {
                        name: '花费',
                        type: 'bar',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        data: data.map(function(item){
                            return item.female.cost;
                        }),
                    },

                ]
            };
            this.chart.setOption(option);
        }
    }
}
</script>
<style>
    .as-chart {
        width: 100%;
        height: 100%;
    }
</style>
