// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './components/App'
import router from './router'
import axios from 'axios'
import iView from 'iView'
import '../theme/index.less'
import {Number2Locale} from './filter'
import store from './store'
// import 'iview/dist/styles/iview.css';

Vue.config.productionTip = false;
Vue.filter('Number2Locale',Number2Locale);

Vue.use(iView);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
