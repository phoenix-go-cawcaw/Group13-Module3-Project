<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { setAuthenticated } from '@/utils/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')

function handleLogin() {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter email and password.'
    return
  }

  setAuthenticated()
  router.push('/')
}
</script>

<template>
  <main class="login-page d-flex align-items-center justify-content-center">
    <section class="card shadow-sm p-4 login-card">
      <h1 class="h4 mb-3">Login</h1>
      <p class="text-muted mb-4">Sign in to access the site.</p>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label" for="email">Email</label>
          <input id="email" v-model="email" type="email" class="form-control">
        </div>
        <div class="mb-3">
          <label class="form-label" for="password">Password</label>
          <input id="password" v-model="password" type="password" class="form-control">
        </div>
        <p v-if="errorMessage" class="text-danger small">{{ errorMessage }}</p>
        <button class="btn btn-primary w-100 mt-2" type="submit">Login</button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background-color: #f5f7fb;
}

.login-card {
  width: min(420px, 92vw);
}
</style>
