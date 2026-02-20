<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import hobbyLogo from '../assets/HobbyinaBox.png'

const router = useRouter()

function handleLogout() {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
  router.replace({ name: 'login' })
}
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">

      <img
        :src="hobbyLogo"
        alt="Hobby in a Box Logo"
        style="height: 65px;"
        class="me-2"
      />

      <RouterLink class="navbar-brand brand-title me-auto" to="/">
        Hobby in a Box
      </RouterLink>

      <ul class="navbar-nav ms-auto me-0 align-items-lg-center gap-lg-2">
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
          <button
            class="btn btn-sm btn-outline-light"
            type="button"
            @click="handleLogout"
          >
            Logout
          </button>
        </li>
      </ul>

    </div>
  </nav>

  <RouterView />
</template>

<style scoped>
.navbar{
  margin-bottom: 0;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.navbar.bg-body-tertiary {
  background-color: #3E2A1B !important;
}

.brand-title {
  color: #F3E6D3;
  font-weight: 800;
  text-decoration: none;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
    'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.nav-link {
  color: #E2C49A;
  font-weight: 500;
}

.nav-link:hover {
  color: #F3E6D3;
}

.nav-link.router-link-active {
  text-decoration: underline;
  text-underline-offset: 4px;
  color: #F3E6D3;
}

.btn-outline-light {
  border-color: #E2C49A;
  color: #E2C49A;
}

.btn-outline-light:hover {
  background-color: #A95A1C;
  border-color: #A95A1C;
  color: #fff;
}


</style>
