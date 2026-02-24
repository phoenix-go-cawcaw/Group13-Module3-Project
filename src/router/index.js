import { createRouter, createWebHistory } from "vue-router";

import AuthenticatedLayout from "../layouts/AuthenticatedLayout.vue";
import About from "../views/About.vue";
import Checkout from "../views/Checkout.vue";
import Contact from "../views/Contact.vue";
import Home from "../views/Home.vue";
import Login from "../views/login.vue";
import Payfast from "../views/Payfast.vue";
import Pricing from "../views/Subscriptions.vue";
import Products from "../views/Products.vue";
import Review from "../views/Review.vue";
import PaymentSuccess from "../views/PaymentSuccess.vue";
import PaymentCancel from "../views/PaymentCancel.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/",
      component: AuthenticatedLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          name: "home",
          component: Home,
        },
        {
          path: "about",
          name: "about",
          component: About,
        },
        {
          path: "products",
          name: "products",
          component: Products,
        },
        {
          path: "pricing",
          name: "pricing",
          component: Pricing,
        },
        {
          path: "contact",
          name: "contact",
          component: Contact,
        },
        {
          path: "checkout",
          name: "checkout",
          component: Checkout,
        },
        {
          path: "review",
          name: "review",
          component: Review,
        },
        {
          path: "payfast",
          name: "payfast",
          component: Payfast,
        },
        {
          path: "/payment-success",
          name: "payment-success",
          component: PaymentSuccess,
        },
        {
          path: "/payment-cancel",
          name: "payment-cancel",
          component: PaymentCancel,
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/login",
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  if (to.name === "login" && token) {
    return next("/");
  }

  next();
});

export default router;
