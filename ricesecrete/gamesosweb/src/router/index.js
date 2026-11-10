import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/casino',
      name: 'casino',
      component: () => import('../views/CasinoView.vue')
    },
    {
      path: '/sports',
      name: 'sports',
      component: () => import('../views/SportsView.vue')
    },
    {
      path: '/cards',
      name: 'cards',
      component: () => import('../views/CardsView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/provider/:provider',
      name: 'provider-games',
      component: () => import('../views/ProviderGamesView.vue')
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('../views/GameView.vue')
    },
    {
      path: '/chatroom',
      name: 'chatroom',
      component: () => import('../views/ChatRoomView.vue')
    }
  ]
})

export default router
