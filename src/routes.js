import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/home.vue'
import Proj from './components/proj.vue'
import About from './components/about.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', component: Home},
    {path: '/about', component:Home},
    {path: '/p/:id', name:"p", component:Proj}
  ],
  mode: 'history',
  scrollBehavior(to, from, savedPosition){
    if (savedPosition){
      return savedPosition
    }
  }
})
