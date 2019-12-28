import Vue from 'vue'
import Router from 'vue-router'
import Document from '@/views/Document.vue'
import LaunchDialog from '@/views/LaunchDialog.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/document',
      name: 'document',
      component: Document
    },
    {
      path: '/launch-dialog',
      name: 'launch-dialog',
      component: LaunchDialog
    }
  ]
})
