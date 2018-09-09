import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home'
import Data from '../components/Data'
import Site from '../components/Site'
import Analysis from '../components/Analysis'
import Video from '../components/Video'
import Login from '../components/Login'
import Demo from '../components/demo'
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/home',
      name: '首页',
      component: Home
    },
    {
      path: '/data',
      name: '数据列表',
      component: Data
    },
    {
      path: '/analysis',
      name: '数据分析',
      component: Analysis
    },
    {
      path: '/site',
      name: '站点列表',
      component: Site
    },
    {
      path: '/video',
      name: '视频列表',
      component: Video
    },
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/demo',
      name: 'demo',
      component: Demo
    }
  ]
})
