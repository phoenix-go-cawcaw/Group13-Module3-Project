<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { clearAuthenticated } from '@/utils/auth'

const router = useRouter()

function handleLogout() {
  clearAuthenticated()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <img src="c:\Users\YC Student\Downloads\Hobby in a Box.png" alt="" style="height: 65px;">
      <RouterLink class="navbar-brand brand-title" to="/">
        Hobby in a Box
      </RouterLink>
      <ul class="navbar-nav ms-auto align-items-lg-center">
        <li class="nav-item">
          <RouterLink class="nav-link" to="/">Home</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/about">About Us</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/products">Products</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/pricing">Pricing</RouterLink>
        </li>
        <li class="nav-item ms-lg-2">
          <button class="btn btn-sm btn-outline-light" type="button" @click="handleLogout">
            Logout
          </button>
        </li>
      </ul>
    </div>
  </nav>
  <RouterView />
</template>

<style scoped>
.navbar.bg-body-tertiary {
  background-color: rgba(54, 79, 122, 0.848) !important;
}

.brand-title {
  color: #000000;
  font-weight: 800;
  text-decoration: none;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
    'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.nav-link {
  color: #fff;
}

.nav-link.router-link-active {
  text-decoration: underline;
  text-underline-offset: 4px;
}
</style>
