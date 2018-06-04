// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './routes'

Vue.config.productionTip = false

/*event bus*/
export  const scrollEvent = new Vue()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h=>h(App)
})
