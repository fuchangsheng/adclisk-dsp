<template>
  <div>

    <top></top>

    <div id="system_setting">
      <ul>
        <li><router-link :to="{ name:'teamworker_management' }" :class="{ checked: check_path('teamworker_management') }">协作管理</router-link></li>
        <li><router-link :to="{ name:'operation_log' }" :class="{ checked: check_path('operation_log') }">操作日志</router-link></li>
        <li><router-link :to="{ name:'message_setting' }" :class="{ checked: check_path('message_setting') }">消息设置</router-link></li>
        <li><router-link :to="{ name:'auth_management' }" :class="{ checked: check_path('auth_management') }">权限管理</router-link></li>
      </ul>
    </div>
    
    <router-view></router-view>

  </div>
</template>
<script>
import top from '@/components/nav_top.vue'
import {ajaxCallPromise} from '@/public/index'

export default {
  name: 'system_setting',
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
#system_setting {
  font-size: 0;
  height: 50px;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
}
#system_setting>ul {
  list-style-type: none;
  margin-left: 60px;
} 
#system_setting>ul>li {
  display: inline-block;
}
#system_setting>ul>li>a {
  display: inline-block;
  width: 114px;
  height: 50px;
  border-bottom: 4px solid transparent;
  text-align: center;
  line-height: 46px;
  margin-right: 40px;
  
  font-size: 16px;
  color: #000;
  text-decoration: none;
}
#system_setting>ul>li>a.checked {
  border-bottom: 4px solid #3a72bf;
}
.w6 {
  
}
.w3 {
    
}
.px-18 {
  font-size: 18px;
}

</style>