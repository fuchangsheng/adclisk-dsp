<template>
    <div class="main">
        <top></top>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import top from '@/components/nav_top.vue'
export default {
    name: 'app',
    mounted(){
        console.log('this is main mounted');
    },
    components: {
        top
    }
} 
</script>