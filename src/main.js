// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './routes'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueCookies from 'vue-cookies'
import BMap from 'BMap'
import Bmap from './views/ordadmin-view/Bmap.vue'
import 'babel-polyfill'

//Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(BMap)
Vue.use(VueRouter)
Vue.use(VueCookies)
Vue.component('Bmap', Bmap)
axios.defaults.withCredentials=true;


new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
