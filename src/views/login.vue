<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const rememberMe = ref(false)

const isLogin = ref(true)
const errorMessage = ref('')
const isOpening = ref(false)
const isOpened = ref(false)

// AUTO-LOGIN
onMounted(() => {
  const token =
    localStorage.getItem('token') ||
    sessionStorage.getItem('token')

  if (token) {
    router.push('/')
  }
})

async function handleSubmit() {
  if (!email.value || !password.value || (!isLogin.value && !username.value)) {
    errorMessage.value = 'Shipment requires all fields.'
    return
  }

  try {
    isOpening.value = true
    errorMessage.value = ''

    const endpoint = isLogin.value
      ? 'http://localhost:5000/auth/login'
      : 'http://localhost:5000/auth/register'

    const payload = isLogin.value
      ? {
          email: email.value,
          password: password.value
        }
      : {
          username: username.value,
          email: email.value,
          password: password.value
        }

    const response = await axios.post(endpoint, payload)

    // REMEMBER ME SCRIPT
    if (rememberMe.value) {
      localStorage.setItem('token', response.data.token)
    } else {
      sessionStorage.setItem('token', response.data.token)
    }

    setTimeout(() => {
      isOpened.value = true
    }, 400)

    setTimeout(() => {
      router.push('/')
    }, 1000)

  } catch (err) {
    isOpening.value = false
    errorMessage.value =
      err.response?.data?.message || 'Delivery failed. Try again.'
  }
}
</script>

<template>
  <main class="login-page d-flex align-items-center justify-content-center">
    <div class="table-surface"></div>

    <section class="box-card" :class="{ opening: isOpening, opened: isOpened }">
      <div class="box-flap" @click="isOpening = true"></div>

      <div class="box-content">
        <h1 class="box-title">Hobby in a Box</h1>

        <div class="mode-switch">
          <button :class="{ active: isLogin }" @click="isLogin = true">
            Login
          </button>
          <button :class="{ active: !isLogin }" @click="isLogin = false">
            Register
          </button>
        </div>

        <form @submit.prevent="handleSubmit">

          <!-- REGISTER -->
          <div v-if="!isLogin" class="mb-3">
            <label>Username</label>
            <input v-model="username" type="text" class="form-control box-input" />
          </div>

          <div class="mb-3">
            <label>Email</label>
            <input v-model="email" type="email" class="form-control box-input" />
          </div>

          <div class="mb-3">
            <label>Password</label>
            <input v-model="password" type="password" class="form-control box-input" />
          </div>

          <!-- REMEMBER ME -->
          <div class="form-check mb-2">
            <input
              type="checkbox"
              class="form-check-input"
              id="remember"
              v-model="rememberMe"
            />
            <label class="form-check-label" for="remember">
              Remember Me
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="shipping-label">
            {{ errorMessage }}
          </div>

          <button class="btn box-button w-100 mt-3" type="submit">
            {{ isLogin ? 'Open Box' : 'Create Box' }}
          </button>

        </form>
      </div>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f7f3ea, #e8dcc7);
  position: relative;
}

.table-surface {
  position: absolute;
  bottom: 80px;
  width: 500px;
  height: 40px;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.2), transparent 70%);
  filter: blur(6px);
}

.box-card {
  position: relative;
  width: min(420px, 92vw);
  background-color: #c69c6d;
  border: 3px solid #a67c52;
  border-radius: 6px;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.25);
  padding-top: 50px;
  overflow: hidden;
  transition: transform 0.6s ease;

  background-image:
    repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.03) 0px,
      rgba(255, 255, 255, 0.03) 2px,
      transparent 2px,
      transparent 6px
    );
}

.box-flap {
  position: absolute;
  top: -25px;
  left: 10%;
  width: 80%;
  height: 50px;
  background: #d2a679;
  border: 3px solid #a67c52;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  transform-origin: bottom;
  transition: transform 0.6s ease;
  cursor: pointer;
}

.box-card.opening .box-flap {
  transform: rotateX(45deg);
}

.box-card.opened {
  transform: translateY(-20px);
}

.box-card.opened .box-flap {
  transform: rotateX(80deg);
}

.box-content {
  padding: 2rem;
}

.box-title {
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #5c4033;
  letter-spacing: 2px;
  text-transform: uppercase;
  border: 2px dashed #8b5e3c;
  padding: 8px;
}

.mode-switch {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.mode-switch button {
  background: transparent;
  border: 2px solid #8b5e3c;
  padding: 6px 16px;
  margin: 0 5px;
  font-weight: 600;
  color: #5c4033;
}

.mode-switch button.active {
  background: #8b5e3c;
  color: white;
}

.box-input {
  background-color: #f4e3c1;
  border: 2px solid #a67c52;
}

.box-input:focus {
  border-color: #8b5e3c;
  box-shadow: none;
}

.shipping-label {
  background: #f8f1e5;
  border: 2px dashed #b02a37;
  padding: 10px;
  margin-top: 10px;
  font-size: 0.85rem;
  color: #842029;
  text-align: center;
}

.box-button {
  background-color: #f2c94c;
  border: none;
  font-weight: bold;
  color: #5c4033;
  transition: 0.2s ease;
}

.box-button:hover {
  background-color: #e0b03f;
}
</style>