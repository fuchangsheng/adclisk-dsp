<template>
  <div>

    <!-- <top /> -->

    <div id="account-nav">
      <ul>
        <li><router-link :to="{ name:'account_basic_info' }" :class="{ checked: check_path('account_basic_info') }">基本信息</router-link></li>
        <li><router-link :to="{ name:'account_qual_info' }" :class="{ checked: check_path('account_qual_info') }">账户资质</router-link></li>
        <li><router-link :to="{ name:'account_pwd_reset' }" :class="{ checked: check_path('account_pwd_reset') }">密码重置</router-link></li>
      </ul>
    </div>

    <router-view></router-view>

  </div>
</template>
<script>
import top from '@/components/nav_top.vue'
import {ajaxCallPromise} from '@/public/index'

export default {
  name: 'account_nav',
  mounted () {
  },
  data () {
    return {
    }
  },
  components: {
    top
  },
  watch: {
  },
  methods: {
    check_path (path) {
      return this.$route.name === path
    }
  }
}
</script>
<style>
* {
  box-sizing:border-box;
  -moz-box-sizing:border-box;
  -webkit-box-sizing:border-box;
  margin: 0;
  padding: 0;
  border: 0;
}
#account-nav {
  font-size: 0;
  height: 50px;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
}
#account-nav>ul {
  list-style-type: none;
  margin-left: 60px;
} 
#account-nav>ul>li {
  display: inline-block;
}
#account-nav>ul>li>a {
  display: inline-block;
  width: 114px;
  height: 50px;
  border-bottom: 4px solid transparent;
  text-align: center;
  line-height: 46px;
  margin-right: 40px;

  font-family: HiraginoSansGB-W6;
  font-size: 16px;
  color: #000;
  text-decoration: none;
}
#account-nav>ul>li>a.checked {
  border-bottom: 4px solid #3a72bf;
}
.w6 {
  font-family: "HiraginoSansGB-W6";
}
.w3 {
  font-family: "HiraginoSansGB-W3";
}
.px-18 {
  font-size: 18px;
}
</style>