import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/utils/auth'

import AuthenticatedLayout from '../layouts/AuthenticatedLayout.vue'
import About from '../views/About.vue'
import Checkout from '../views/Checkout.vue'
import Confirmation from '../views/Confirmation.vue'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Payfast from '../views/Payfast.vue'
import PaymentSuccess from '../views/PaymentSuccess.vue'
import Pricing from '../views/Pricing.vue'
import Products from '../views/Products.vue'
import Review from '../views/Review.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/',
      component: AuthenticatedLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: Home,
        },
        {
          path: 'about',
          name: 'about',
          component: About,
        },
        {
          path: 'products',
          name: 'products',
          component: Products,
        },
        {
          path: 'pricing',
          name: 'pricing',
          component: Pricing,
        },
        {
          path: 'checkout',
          name: 'checkout',
          component: Checkout,
        },
        {
          path: 'review',
          name: 'review',
          component: Review,
        },
        {
          path: 'payfast',
          name: 'payfast',
          component: Payfast,
        },
        {
          path: 'payment-success',
          name: 'payment-success',
          component: PaymentSuccess,
        },
        {
          path: 'confirmation',
          name: 'confirmation',
          component: Confirmation,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
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
