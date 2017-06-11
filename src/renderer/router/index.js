import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage')
    },
    {
      path: '/project',
      name: 'project-view',
      component: require('@/views/ProjectView')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
