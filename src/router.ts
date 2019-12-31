import Vue from 'vue'
import Router from 'vue-router'
import LaunchDialog from '@/views/LaunchDialog.vue'
import NewDocument from '@/views/NewDocument.vue'
import Document from '@/views/Document.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/launch-dialog',
      name: 'launch-dialog',
      component: LaunchDialog
    },
    {
      path: '/new-document',
      name: 'new-document',
      component: NewDocument
    },
    {
      path: '/document',
      name: 'document',
      component: Document
    }
  ]
})
