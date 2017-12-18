<template>
    <div v-if = "loading">
        <div >
            加载中
        </div>
    </div>
    <div v-else>
        <div v-if = "hasRecords">
            <div class="chart-info scrollbar">
                <div class="ci_1">
                    <div class="ci_2">
                        <Select 
                            v-model = "targetOne"  
                            class= "ci_select"
                            @on-change = "targetOneChange" 
                            :style="{color:color[0]}"
                        >
                                <Option 
                                v-for = "item in selectListOne" 
                                :key = "item.id" 
                                :value = "item.value"
                                ></Option>
                        </Select>
                    </div>
                </div>
                <div class="ci_1">
                    <div class="ci_2">
                        <Select 
                            v-model = "targetTwo"  
                            class= "ci_select" 
                            @on-change = "targetTwoChange" 
                            :style="{color:color[1]}"
                        >
                                <Option 
                                v-for = "item in selectListTwo" 
                                :key = "item.id" 
                                :value = "item.value"
                                ></Option>
                        </Select>
                    </div>
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
import {isEmptyObject} from '@/public/tools'
export default {
    name: 'custom',
    data(){
        return {
            name: 'custom',
            color: ['#3a72bf','#13bda6'],
            series: [],
            selectListOne: [
                {
                    id: 1,
                    value: '展现量'
                },
                {
                    id: 1,
                    value: '千次展现费用'
                },
                {
                    id: 1,
                    value: '点击量'
                },
                {
                    id: 1,
                    value: '点击率'
                },
                {
                    id: 1,
                    value: '单次点击费用'
                },
                {
                    id: 1,
                    value: '转化率'
                },
                {
                    id: 1,
                    value: '单次转化花费'
                },
                {
                    id: 1,
                    value: '花费'
                },

            ],
            selectListTwo: [
                {
                    id: 1,
                    value: '展现量'
                },
                {
                    id: 1,
                    value: '千次展现费用'
                },
                {
                    id: 1,
                    value: '点击量'
                },
                {
                    id: 1,
                    value: '点击率'
                },
                {
                    id: 1,
                    value: '单次点击费用'
                },
                {
                    id: 1,
                    value: '转化率'
                },
                {
                    id: 1,
                    value: '单次转化花费'
                },
                {
                    id: 1,
                    value: '花费'
                },

            ],
            targetOne: '展现量',
            targetTwo: '千次展现费用'
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
            this.targetOneChange();
            this.targetTwoChange();
        },
        targetOneChange(){
            let _self = this;
            let listTwo = _self.selectListTwo;
            this.selectListTwo = listTwo.filter(function(item){
                let value = item.value;
                if(_self.targetOne == value){
                    return false;
                }
                return true;
            });
            let targetOne = _self.targetOne;
            let dailyList = _self.$store.state.dailyList;
            let list = dailyList.list;
            let data =  {
                    name: '',
                    xAxis: [],
                    yAxisUnit: '',
                    data: [],
                    color: _self.color,
                };
            if(targetOne == '展现量'){
                data.name = '展现量';
                data.xAxis = list.map(function(item){
                    return item.date;
                });
                data.yAxisUnit = '次';
                data.data = list.map(function(item){
                    return item.imp;
                });
            }else if (targetOne == '千次展现费用') {
                data.name = '千次展现费用';
                data.xAxis = list.map(function(item){
                    return item.date;
                });
                data.yAxisUnit = '￥';
                data.data = list.map(function(item){
                    return item.CPM;
                });
            }else if (targetOne == '点击量'){
                data.name = '点击量';
                data.xAxis = list.map(function(item){
                    return item.date;
                });
                data.yAxisUnit = '次';
                data.data = list.map(function(item){
                    return item.click;
                });
            }else if (targetOne == '点击率'){
                data.name = '点击率';
                data.xAxis = list.map(function(item){
                    return item.date;
                });
                data.yAxisUnit = '';
                data.data = list.map(function(item){
                    return item.CTR;
                });
            }else if (targetOne == '单次点击费用'){
                data.name = '单次点击费用';
                data.xAxis = list.map(function(item){
                    return item.date;
                });
                data.yAxisUnit = '￥';
                data.data = list.map(function(item){
                    return item.CPC;
                });
            }else if (targetOne == '转化率'){
                data.name = '转化率';
                data.xAxis = list.map(function(item){
                    return item.date;
                });
                data.yAxisUnit = '';
                data.data = list.map(function(item){
                    return item.CPA;
                });
            }else if (targetOne == '单次转化花费'){
                data.name = '单次转化花费';
                data.xAxis = list.map(function(item){
                    return item.date;
                });
                data.yAxisUnit = '￥';
                data.data = list.map(function(item){
                    return item.atr;
                });
            }else if (targetOne == '花费'){
                data.name = '花费';
                data.xAxis = list.map(function(item){
                    return item.date;
                });
                data.yAxisUnit = '￥';
                data.data = list.map(function(item){
                    return item.cost;
                });
            }
            _self.$set(_self.series,0,data);
        },
        targetTwoChange(){
            let _self = this;
            let listOne = _self.selectListOne;
            this.selectListOne = listOne.filter(function(item){
                let value = item.value;
                if(_self.targetOne == value){
                    return false;
                }
                return true;
            });
            let targetTwo = _self.targetTwo;
            let dailyList = _self.$store.state.dailyList;
            let list = dailyList.list;
            let data =  {
                    name: '',
                    xAxis: [],
                    yAxisUnit: '',
                    data: [],
                    color: _self.color,
                };
            if(targetTwo == '展现量'){
                data.name = '展现量';
                data.xAxis = list.map(function(item){
                    return item.date;
                });
                data.yAxisUnit = '次';
                data.data = list.map(function(item){
                    return item.imp;
                });
            }else if (targetTwo == '千次展现费用') {
                data.name = '千次展现费用';
                data.xAxis = list.map(function(item){
                    return item.date;
                });
                data.yAxisUnit = '￥';
                data.data = list.map(function(item){
                    return item.CPM;
                });
            }else if (targetTwo == '点击量'){
                data.name = '点击量';
                data.xAxis = list.map(function(item){
                    return item.date;
                });
                data.yAxisUnit = '次';
                data.data = list.map(function(item){
                    return item.click;
                });
            }else if (targetTwo == '点击率'){
                data.name = '点击率';
                data.xAxis = list.map(function(item){
                    return item.date;
                });
                data.yAxisUnit = '';
                data.data = list.map(function(item){
                    return item.CTR;
                });
            }else if (targetTwo == '单次点击费用'){
                data.name = '单次点击费用';
                data.xAxis = list.map(function(item){
                    return item.date;
                });
                data.yAxisUnit = '￥';
                data.data = list.map(function(item){
                    return item.CPC;
                });
            }else if (targetTwo == '转化率'){
                data.name = '转化率';
                data.xAxis = list.map(function(item){
                    return item.date;
                });
                data.yAxisUnit = '';
                data.data = list.map(function(item){
                    return item.CPA;
                });
            }else if (targetTwo == '单次转化花费'){
                data.name = '单次转化花费';
                data.xAxis = list.map(function(item){
                    return item.date;
                });
                data.yAxisUnit = '￥';
                data.data = list.map(function(item){
                    return item.atr;
                });
            }else if (targetTwo == '花费'){
                data.name = '花费';
                data.xAxis = list.map(function(item){
                    return item.date;
                });
                data.yAxisUnit = '￥';
                data.data = list.map(function(item){
                    return item.cost;
                });
            }
            _self.$set(_self.series,1,data);
            console.log(_self.series)
        },
    }
}
</script>
<style>

    
</style>
