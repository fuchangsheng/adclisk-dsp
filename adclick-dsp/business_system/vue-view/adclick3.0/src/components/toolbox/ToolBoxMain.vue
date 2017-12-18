<template>
    <div class="account-main">
        <top-nav></top-nav>
        <div class="ac-mn-box">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import TopNav from './TopNav'
export default {
    name: 'toolboxmain',
    components: {
        'top-nav':TopNav
    }
}
</script>
<style>
.account-main{
    margin: 15px 55px auto 15px;
}
.ac-mn-box {
    padding: 20px 12px;
    border: 1px solid #ccc;
    background-color: #fff;
}
</style>