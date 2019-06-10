import Vue from 'vue'
import Router from 'vue-router'
import Calendar from '@/views/Calendar.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Calendar
    }
  ]
})
