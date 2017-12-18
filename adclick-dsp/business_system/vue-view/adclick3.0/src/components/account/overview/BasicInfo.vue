<template>
    <div class="ac-part">
        <div class="ac-bs-nav">
            <ul>
                <li v-for = "tab in tabs" @click = "chooseThis(tab)">
                    <div class="ac-bs-tab" :class="{choosed: tab.choosed}">
                        <div class="ac-bs-box-1"></div>
                        <div class="ac-bs-box-2"  v-cloak>
                            <div><span>{{tab.name}}</span></div>
                            <div class="ac-bs-box-3"><span>{{tab.value}}</span></div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="sc-bs-content">
            <keep-alive>
            <component :is = "currentView"></component>
            </keep-alive>
        </div>
    </div>
</template>
<script>
import Impression from './BasicInfo/Impression';
import Cost from './BasicInfo/Cost'
import Clicks from './BasicInfo/Clicks'
import Custom from './BasicInfo/Custom'
import * as tools from '@/public/tools'
export default {
    name: 'basic',
    data(){
        return {
            currentView: 'impression',
            tabs: [
                {
                    type: 'impression',
                    name: '展现量',
                    value: 0,
                    choosed: true
                },
                {
                    type: 'clicks',
                    name: '点击量',
                    value: 0,
                    choosed: false
                },
                {
                    type: 'cost',
                    name: '总花费',
                    value: 0,
                    choosed: false
                },
                {
                    type: 'custom',
                    name: '自定义',
                    value: '--',
                    choosed: false
                }
            ]
        }
    },
    mounted(){
        this.$nextTick(function(){
            this.initData();
        })
    },
    watch: {
        '$store.state.dailyList' : function(val){
            this.initData();
        }
    },
    components:{
        Impression,Cost,Clicks,Custom
    },
    methods: {
        chooseThis(item){
            this.tabs.forEach(function(i){
                i.choosed = false;
            });
            item.choosed = true;
            this.currentView = item.type;
            this.$store.commit({
                type: 'setCurrentBasic',
                view: item.type
            });
        },
        Number2Locale(val){
            return Number(val).toLocaleString();
        },
        initData(){
            //改变标签数值
            let data = this.$store.state.dailyList;
            if(!tools.isEmptyObject(data)){
                this.tabs[0].value = this.Number2Locale(data.all_imp);
                this.tabs[1].value = this.Number2Locale(data.all_click);
                this.tabs[2].value = this.Number2Locale(data.all_cost);
            }
        }
    },

}
</script>
<style>
.ac-bs {
    border: 1px solid #ccc;
    /*height: 100px;*/
}

 .ac-bs-nav {
    background-color: #f5f7f8;
} 
.ac-bs-nav ul li {
    width: 15%;
    height: 71px;
    display: inline-block;
    vertical-align: top;
    cursor: pointer;
}
.ac-bs-tab {
    position: relative;
    height: 100%;
    border-right: 1px solid #ccc;
}

.ac-bs-nav .choosed.ac-bs-tab {
    border-bottom: none;
}

.ac-bs-box-1 {
    height: 6px;
}
.ac-bs-box-2 {
    position: absolute;
    top: 6px;
    width:100%;
    bottom: 0;
    padding: 5px 10px;
}
.ac-bs-nav .choosed .ac-bs-box-1 {
    background: #3a72bf;
}
.ac-bs-nav .choosed .ac-bs-box-2 {
    bottom: -1px;
    background: #fff;
}
.ac-bs-box-3 {
    font-size: 20px;
    line-height: 30px;
}
.sc-bs-content{
    border-top: 1px solid #ccc;
    padding-left: 15px;
    padding-top: 20px;
}

.chart-info {

}
.ci_1 {
    display: inline-block;
    font-weight: bold;
}
.ci_2 {
    display: inline-block;
    margin-right: 15px;
    margin-left: 15px;
}
/*下拉框宽度*/
.ci_select{
    width: 110px;
}
.ivu-select-selected-value{
    text-align: center;
}
</style>
