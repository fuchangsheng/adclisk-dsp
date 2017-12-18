<template>
    <div class="top">
            <div class="top-wrapper">
                <div class="inline">
                    <a href="#">
                        <img src="../assets/icons/home/logo.png">
                    </a>
                </div>
                <div class="inline">
                    <img src="../assets/icons/home/menu.png">
                </div>
                <div class="fr clearfix"> 
                    <ul> 
                        <li>
                            <div class="cp">
                                <img src="../assets/icons/home/portrait.png" class="_im"  style="width: 35px;">
                                <div class="_im">
                                    <span>Wen Zhou</span>
                                    <a href="#">
                                        <img src="../assets/icons/home/menu.png">
                                    </a>
                                </div>
                            </div>
                        </li>
                        <li>
                           <router-link :to= "{name:'info'}" class="p73" replace>
                                <img src="../assets/icons/home/message.png" style="width: 25px;">
                            </router-link>
                        </li>
                        <li>
                            <a href="#" class="p73">
                                <img src="../assets/icons/side_bar/setting.png">
                            </a>
                        </li>
                        <li>
                            <router-link :to="{name:'overall',query:{startDate:new Date(),endDate:new Date()}}" class="p73">
                                <span class="_im">获取帮助</span>
                                <img  class="_im" src="../assets/icons/home/help.png" style="width: 25px;">
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
</template>
<script>
export default {
    name: 'top',
}
</script>
<style>
    
.top {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    min-width: 928px;
    height: 50px;
    background-color: #222222;
    color: #fff;
    z-index: 2;
}


.top a {
    color: #fff;
}

.top-wrapper {
    padding: 7px;
}

.top ul li{
    float: left;
}
.top ul li{
    margin-left: 10px;
}
</style>