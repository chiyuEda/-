// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
Vue.use(ElementUI)
Vue.config.productionTip = false
import {
  ajaxGet,
  ajaxPost
} from './api/http.js'
Vue.prototype.$ajaxGet = ajaxGet;
Vue.prototype.$ajaxPost = ajaxPost;
/* eslint-disable no-new */
router.afterEach(() => {
  window.scrollTo(0, 0);
})
router.beforeEach((to, from, next) => {
  if (to.path === "/") {
    next({
      path: '/login'
    })
  }
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  // console.log(user);
  if (!user && to.path != '/login') {
    next({
      path: '/login'
    })
  } else {
    // if()
    next();

  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
