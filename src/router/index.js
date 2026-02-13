import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/utils/auth'
import HomeView from '../views/Home.vue'
import LoginView from '../login.vue'
import AuthenticatedLayout from '../layouts/AuthenticatedLayout.vue'
import AboutView from '@/views/AboutView.vue'
import Payfast from '@/views/Payfast.vue'
import Checkout from '@/views/Checkout.vue'
import Review from '@/views/Review.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      component: AuthenticatedLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('../views/About.vue'),
        },
        {
          path: 'products',
          name: 'products',
          component: () => import('../views/Products.vue'),
        },
        {
          path: 'checkout',
          name: 'checkout',
          component: () => import('../views/Checkout.vue'),
        },
        {
          path: 'pricing',
          name: 'pricing',
          component: () => import('../views/Pricing.vue'),
        },
        {
          path: 'confirmation',
          name: 'confirmation',
          component: () => import('../views/Confirmation.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: 'login' }
  }

  if (to.name === 'login' && isAuthenticated()) {
    return { name: 'home' }
  }

  return true
})

export default router
