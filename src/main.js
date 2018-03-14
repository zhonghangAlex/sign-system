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

/*
router.beforeEach((to, from, next) => {
  //NProgress.start();
  var if_state = true;
  if (from.path == '/login') {
    if_state = false;
  }
  if (if_state && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})
*/
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
