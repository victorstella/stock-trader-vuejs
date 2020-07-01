import Home from '../components/Home.vue'
import Portfolio from '../components/portfolio/Portfolio.vue'
import StockList from '../components/stocks/StockList.vue'
import Login from '../components/clientArea/Login.vue'
import SignUp from '../components/clientArea/SignUp.vue'
import UserAccount from '../components/clientArea/UserAccount.vue'

import store from '../store/store.js'
import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/signUp', name: 'signup', component: SignUp },
  {
    path: '/userAccount',
    name: 'account',
    component: UserAccount,
    beforeEnter (to, from, next) {
      if (store.state.userEmail) {
        next()
      } else {
        next({ name: 'login' })
      }
    }
  },
  {
    path: '/stocks',
    name: 'stocks',
    component: StockList,
    beforeEnter (to, from, next) {
      if (store.state.userEmail) {
        next()
      } else {
        next({ name: 'login' })
      }
    }
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    component: Portfolio,
    beforeEnter (to, from, next) {
      if (store.state.userEmail) {
        next()
      } else {
        next({ name: 'login' })
      }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
