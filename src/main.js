import Vue from 'vue'
import App from './App.vue'
import router from './routes.js'
import store from './store/store.js'
import Vuelidate from 'vuelidate'

Vue.use(Vuelidate)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
