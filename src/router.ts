import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('./views/Search.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
