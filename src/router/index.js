import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import ChatWindow from '@/components/ChatWindow'
import {app} from '../main.js'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    }, 
    {
      path: '/chat',
      name: 'Chat',
      component: ChatWindow,
      props: true
    }
  ]
})
