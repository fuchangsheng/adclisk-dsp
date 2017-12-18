<template>
    <div id="ac-tn">
        <ul>
            <li v-for = "item in navList" class="ac-tn-li" @click = "chooseThis(item)">
                <router-link :to = "item.link">
                    <div class="ac-tn-box clearfix" :class = "{choosed: item.choosed}">
                        <div class="ac-tn-align clearfix">
                            <div class="ac-tn-item _mr5"><img :src= "item.choosed ? item.icon_2 : item.icon_1" alt="" ></div>
                            <div class="ac-tn-item">{{item.name}}</div>
                        </div>
                        
                    </div>
                    <div class="ac-tn-box-s"></div>
                </router-link>
            </li> 
        </ul>
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    name: 'material',
    data(){
        return {
            navList:[
                {
                    name: '图片',
                    link: {
                        name: 'material_pic'
                    },
                    icon_1: require('@/assets/icons/home/account_summary.png'),
                    icon_2: require('@/assets/icons/home/account_summary_checked.png'),
                    choosed: false
                },
                {
                    name: '视频',
                    link: {
                        name: 'material_video'
                    },
                    icon_1: require('@/assets/icons/home/account_summary.png'),
                    icon_2: require('@/assets/icons/home/account_summary_checked.png'),
                    choosed: false
                },
                {
                    name: 'flash',
                    link: {
                        name: 'material_flash'
                    },
                    icon_1: require('@/assets/icons/home/account_summary.png'),
                    icon_2: require('@/assets/icons/home/account_summary_checked.png'),
                    choosed: false
                }
            ]
        }
    },
    methods: {
        chooseThis(item){
            this.navList.forEach(function(i){
                i.choosed = false;
            });
            item.choosed = true;
        }
    }
}
</script>
<style>
.top-nav-1 {
    background-color: #f5f7f8;
    border: 1px solid #dadcde;
    border-radius: 8px 8px 0 0;
    bottom: 0;
    content: '';
    position: absolute;
    top: -6px;
    transform: perspective(20px) rotateX(2deg);
    transform-origin: bottom left;
    width: 100%;
}
#ac-tn ul {
    height: 46px;
}
#ac-tn .ac-tn-li {
    position: relative;
    display: inline-block;
    width: 20%;
    height: 46px;
    font-size: 16px;
    font-weight: bold;
    float: none;
}
.ac-tn-box-s{
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    border: 1px solid #ccc;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    transform: perspective(20px) rotateX(2deg);
    transform-origin: bottom left;
    background-color: #f5f7f8;
}
.choosed + .ac-tn-box-s{
    bottom: -1px;
    background-color: #fff;
}
.ac-tn-box {
    width: 100%;
    height: 100%;
    color: #838b97;
    position: relative;
    padding-right: 20px;
    padding-top: 11px;
    padding-left: 15px;
    z-index: 200;
}
.ac-tn-item{
    vertical-align: middle;
    float: left
}
#ac-tn .choosed {
    color: #3a72bf;
}
#ac-tn ._mr5{
    margin-right: 5px;
}
</style>