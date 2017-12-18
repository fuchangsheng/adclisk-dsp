<template>
    <div class="ac-part">
        <div class="ac-as">
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
                <component :is = "currentView"></component>
            </div>
        </div>
    </div>
</template>
<script>
import AgeSex from './AgeSexDistribute/AgeSex'
import Age from './AgeSexDistribute/Age'
import Sex from './AgeSexDistribute/Sex'
import Hour from './AgeSexDistribute/Hour'
export default {
    name: 'ageSexDistribute',
    data() {
        return {
            currentView: 'ageSex',//默认的页面
            tabs: [
                {
                    type: 'ageSex',
                    name: '年龄和性别',
                    choosed: true,
                },
                {
                    type: 'age',
                    name: '年龄',
                    choosed: false
                },
                {
                    type: 'sex',
                    name: '性别',
                    choosed: false
                },
                {
                    type: 'hour',
                    name: '小时',
                    choosed: false
                },
            ]
        }
    },
    components: {
        ageSex: AgeSex,
        age: Age,
        sex: Sex,
        hour: Hour
    },
    methods: {
        chooseThis(tab){
            this.tabs.forEach(function(i){
                i.choosed = false;
            });
            tab.choosed = true;
            this.currentView = tab.type;
        }
    }

}
</script>
<style>
    
</style>