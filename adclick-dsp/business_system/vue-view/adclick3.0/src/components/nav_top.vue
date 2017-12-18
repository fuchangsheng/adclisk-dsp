<template>
  <div id="top" class="clearfix">

    <a href="#">
      <img class="vertical-center mr-12 ml-17 cp"src="../assets/icons/home/logo.png" /> 
    </a>

    <div class="vertical-line vertical-center mr-7"></div>

    <div id="menu-wrapper" class="vertical-center cp top-unit">
      <a href="#">
        <img class="vertical-center w-24" src="../assets/icons/home/menu.png" /> 
      </a>
      <span id="present-module" class="vertical-center w6">{{present_module}}</span>
    </div>


    <div id="top-fr-wrapper" class="fr wrapper-50">

      <div class="wrapper-36 vertical-center mr-7 cp top-unit">
        <img src="../assets/icons/home/portrait.png" class="vertical-center">
        <span class="w3 white px-14 vertical-center ml-8">{{account_name}}</span>
        <img src="../assets/icons/home/drop_down.png" class="vertical-center ml-8">
      </div>

      <div class="vertical-line vertical-center mr-12"></div>

      <a href="#" class="vertical-center">
        <img src="../assets/icons/home/message.png" class="w-24 mr-12 cp">
      </a>
      <a href="#" class="vertical-center">
        <img src="../assets/icons/home/setting.png" class="w-24 mr-12 cp">
      </a>

      <div class="vertical-line vertical-center mr-7"></div>

      <div class="wrapper-30 vertical-center mr-15 cp top-unit">
        <span class="w3 white px-14 vertical-center mr-7">获取帮助</span>
        <a href="#" class="vertical-center">
          <img src="../assets/icons/home/help.png" class="w-24">
        </a>
      </div>
      
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'top',
  data () {
    return {
      present_module: '账户设置',
      account_name: 'Zhou Wen'
    }
  }
}
</script>

<style type="text/css">
* {
  padding: 0;
  margin: 0;
}
.cp {
  cursor: pointer;
}
#top {
  width: 100%;
  height: 50px;
  background-color: #222222;
  line-height: 50px;
  font-size: 0;
  overflow: auto;
  zoom: 1;
  position: fixed;
  left: 0;
  top: 0;
}
.clearfix {
    zoom: 1;
}
.clearfix:after {
    content: '';
    display: block;
    clear: both;
    height: 0;
    visibility: hidden;
}
.vertical-center {
  display: inline-block;
  vertical-align: middle;
}
.vertical-line {
  width: 1px;
  height: 30px;
  background-color: #666666;
}
#menu-wrapper {
  height: 30px;
  line-height: 30px;
  font-size: 0;
}
#present-module {
  font-size: 16px;
  color: #ffffff;
  margin-left: 10px;
}
.w6 {
  font-family: "HiraginoSansGB-W6";
}
.w3 {
  font-family: "HiraginoSansGB-W3";
}
.white {
  color: #ffffff;
}
.px-14 {
  font-size: 14px;
}
.fr {
  float: right;
}
.mr-7 {
  margin-right: 7px;
}
.mr-12 {
  margin-right: 12px;
}
.mr-15 {
  margin-right: 15px;
}
.ml-8 {
  margin-left: 8px;
}
.ml-17 {
  margin-left: 17px;
}
.w-24 {
  width: 24px;
}
#top-fr-wrapper {
  height: 50px;
}
#top-fr-wrapper div.wrapper-50 {
  height: 50px;
  line-height: 50px;
  font-size: 0;
}
#top-fr-wrapper div.wrapper-36 {
  height: 36px;
  line-height: 36px;
  font-size: 0;
  padding-left: 0;
}
#top-fr-wrapper div.wrapper-30 {
  height: 30px;
  line-height: 30px;
  font-size: 0;
}
#top-fr-wrapper a {
  height: 24px;
  line-height: 24px;
}
.top-unit:hover {
  background-color: #4b4f56;
}
.top-unit {
  border-radius: 3px;
  padding: 0 5px;
}
</style>