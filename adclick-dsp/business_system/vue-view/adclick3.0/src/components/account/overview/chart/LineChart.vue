<template>
    <div class="line-chart">
    </div>        
</template>
<script>
import echarts from 'echarts'
import * as tools from '@/public/tools'
export default {
    name: 'lineChart',
    props: {
        series: {
            type: Array,
            require: true,
        },
    },
    data(){
        return {
            lineChart: {},
        }
    },
    mounted(){
        this.$nextTick(function(){
            this.initLine();
        });
    },
    watch: {
        series: {
            handler(){
                this.initLine();
            },
            // deep: true
        }
    },
    computed: {
        opt() {
            let _slef = this;
            let data = _slef.series;
            console.log(data[0].color)
            let option = {
                title: {
                    show: false
                },
                color:data[0].color,
                grid: [
                {
                    left: '7%',
                    right: '10%',
                    top: '5%',
                    height: '40%',
                },
                {
                    left: '7%',
                    right: '10%',
                    height: '35%',
                    top: '57%'
                }
                ],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false,
                    }
                },
                axisPointer: {
                    link: {xAxisIndex: [0,1]}
                },
                xAxis:[
                {
                    type: 'category',
                    gridIndex: 0,
                    boundaryGap: false,
                    interval:10,
                    splitLine: {
                        show: true,
                        interval: 2,
                        lineStyle: {
                            color: '#e5e5e5'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#cccccc',
                        }
                    },
                    axisLabel: {
                        show: true,
                        color: '#4b4f56',
                    },
                    axisPointer: {
                        label: {
                            show: true,
                            textStyle: {
                                color: '#4b4f56',
                            },
                            backgroundColor: '#cccccc'
                        },
                    },
                    data: data[0].xAxis,
                },
                {
                    type: 'category',
                    gridIndex: 1,
                    boundaryGap: false,
                    position: 'top',
                    show: true,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#e5e5e5'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#cccccc',
                        }
                    },
                    axisLabel: {
                        show: false
                    },
                    show: true,
                    data: data[1].xAxis,
                }],
                yAxis: [
                {
                    gridIndex: 0,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#e5e5e5'
                        }
                    },

                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false,
                    },
                    axisLabel: {
                        color: '#838b97',
                        // formatter: '{value}'
                    },
                    show: true,
                },
                {
                    gridIndex: 1,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#e5e5e5'
                        }
                    },
                    inverse: true,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        color: '#838b97',
                        // formatter: '{value}' 
                    },
                    show: true,
                }
                ],
                series: data.map(function(item,index){
                    let series = {
                        name: item.name,
                        type: 'line',
                        showSymbol: false,
                        xAxisIndex: index,
                        yAxisIndex: index,
                        data: item.data
                    };
                    return series;
                })
            };
        return option;
        }
    },
    methods:{
        initLine(){
            if(tools.isEmptyObject(this.series)){
                return;
            }
            this.lineChart = echarts.init(document.querySelector('.line-chart'));
            this.lineChart.setOption(this.opt);
        },
        // updateLine(){
        //         console.log('update line ---------')
        //         console.log(this.lineChart);
        //     if(!tools.isEmptyObject(this.lineChart)){
        //         this.lineChart.setOption(this.opt);
        //     }
        // }
    }
}
</script>
<style>
  .chart,.line-chart{
        width: 100%;
        height: 100%;
    }
</style>