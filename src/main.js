import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router/routes.js'
import store from './store/store.js'
import Vuelidate from 'vuelidate'

Vue.use(Vuelidate)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
