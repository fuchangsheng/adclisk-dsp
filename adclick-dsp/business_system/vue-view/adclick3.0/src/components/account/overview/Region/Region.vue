<template>
    <div id="rg-dis">
        
    </div>
</template>
<script>
import echarts from 'echarts'
import china from 'echarts/map/js/china'
export default {
    name: 'region',
     data(){
        return {
            data: [
                {
                    name: '成都'
                }

            ],
        }
    },
    mounted(){
        this.$nextTick(function(){
        this.initAgeSex();
        })
    },
    methods:{
        initAgeSex(){
            let asChart =  echarts.init(document.getElementById('rg-dis'));
            let option = {
                title: {
                    text: '地区分布图',
                    left:'center',
                    top: 0
                },
                tooltip : {
                    trigger: 'item',
                    formatter: function(params){
                        if(!params.name){
                            return ''
                        }
                        let data = params.data;
                        let name = params.name;
                        let prop = '0%';
                        let num = 0;
                        let fontWeight = 400;
                        if(data.value){
                            prop = data.value[0];
                            num = data.value[1];
                        }
                        let text =`<div style="display: inline-block;width:120px;height: 75px;padding: 20px 20px;">
                                  <div><span style='font-weight: ${fontWeight};'>${name}</span></div> 
                                  <div>
                                        <span>${prop}(${num})</span><span style="font-weight: ${fontWeight};margin-left:5px;">占比</span>
                                  </div>     
                            </div>
                        `;
                        return text;
                    },
                    backgroundColor: '#eeeff0',
                    textStyle: {
                        color: '#4b4f56',
                        fontSize: 12,
                    }
                },
                backgroundColor: '#eceff2',
                visualMap: {
                    type: 'continuous',
                    min: 0,
                    // show: false,
                    max: 1000,
                    realtime: false,
                    calculable : true,
                    text: ['高','低'],
                    inRange:{
                        color: ['rgba(58,114,191,0.2)','rgba(58,114,191,0.4)', 'rgba(58,114,191,0.6)', 'rgba(58,114,191,0.8)','rgba(58,114,191,1)']
                    },
                    // textStyle: {
                    //     color: '#fff'
                    // }
                },
                series:[{
                    type: 'map',
                    map: 'china',
                    roam: true, // 开启缩放
                    zoom: 1, //缩放比例
                    label:{
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }

                    },
                    scaleLimit: { //缩放范围
                        min: 0.5,
                        max: 1.5
                    },
                    itemStyle: {
                        normal: {
                            areaColor: '#ced0d4',
                            borderColor: '#b4b8bc',
                        },
                        emphasis: {
                            areaColor: ''
                        },
                    },
                    data: [
                        {name: '四川',value: ['2%',100] },
                        {name: '陕西',value: ['4%',200] },
                        {name: '江苏',value: ['8%',400] },
                        {name: '新疆',value: ['10%',500] },
                        {name: '上海',value: ['16%',800] }
                    ]

                }]
            };
            let param = {
                sinterface: '',
                data: {}
            };
            asChart.showLoading();
            setTimeout(function(){
                asChart.hideLoading();
                asChart.setOption(option);
            },5);
        }
    }
}
</script>
<style>
    #rg-dis{
        background-color: #fff;
        width: 90%;
        height: 400px;
    }
</style>
