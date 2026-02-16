<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
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

let mouseHandler

// AUTO LOGIN + PARALLAX
onMounted(() => {
  const token =
    localStorage.getItem('token') ||
    sessionStorage.getItem('token')

  if (token) {
    router.push('/')
  }

  mouseHandler = (e) => {
    const icons = document.querySelectorAll('.icon-wrapper')

    icons.forEach((icon, index) => {
      const speed = (index + 1) * 0.01
      const xMove = (e.clientX - window.innerWidth / 2) * speed * 0.01
      icon.style.transform = `translateX(${xMove}px)`
    })
  }

})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', mouseHandler)
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
      ? { email: email.value, password: password.value }
      : {
        username: username.value,
        email: email.value,
        password: password.value
      }

    const response = await axios.post(endpoint, payload)

    if (rememberMe.value) {
      localStorage.setItem('token', response.data.token)
    } else {
      sessionStorage.setItem('token', response.data.token)
    }

    setTimeout(() => {
      router.push({
        path: '/',
        query: {
          welcome: isLogin.value ? 'back' : 'new'
        }
      })
    }, 1000)

  } catch (err) {
    isOpening.value = false
    errorMessage.value =
      err.response?.data?.message || 'Delivery failed. Try again.'
  }
}
</script>

<template>
  <div class="animated-bg" v-motion :initial="{ scale: 1.1 }" :enter="{ scale: 1, transition: { duration: 2000 } }">
    <div v-motion :initial="{ opacity: 0, y: 40 }" :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
      <main class="login-page d-flex align-items-center justify-content-center">

        <div v-if="showWelcome" class="welcome-banner">
          {{ welcomeMessage }}
        </div>

        <div class="floating-icons">

          <div class="icon-wrapper">
            <svg viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 100 20c2 0 3-1 3-2s-1-2-2-2h-1a2 2 0 010-4h3a3 3 0 003-3A9 9 0 0012 2z" />
            </svg>
          </div>

          <div class="icon-wrapper">
            <svg viewBox="0 0 24 24">
              <path d="M4 5a2 2 0 012-2h10a2 2 0 012 2v14a1 1 0 00-1-1H6a2 2 0 01-2-2V5z" />
            </svg>
          </div>

          <div class="icon-wrapper">
            <svg viewBox="0 0 24 24">
              <path d="M4 7h3l2-2h6l2 2h3v12H4V7z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </div>

          <div class="icon-wrapper">
            <svg viewBox="0 0 24 24">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>

          <div class="icon-wrapper">
            <svg viewBox="0 0 24 24">
              <path d="M6 8h12l2 6a4 4 0 01-4 5l-3-3H11l-3 3a4 4 0 01-4-5l2-6z" />
            </svg>
          </div>

          <div class="icon-wrapper">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="7" />
              <path d="M5 12h14" />
            </svg>
          </div>

        </div>

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
                <input type="checkbox" class="form-check-input" id="remember" v-model="rememberMe" />
                <label class="form-check-label" for="remember">
                  Remember Me
                </label>
              </div>

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
    </div>
  </div>
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
    repeating-linear-gradient(45deg,
      rgba(255, 255, 255, 0.03) 0px,
      rgba(255, 255, 255, 0.03) 2px,
      transparent 2px,
      transparent 6px);
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

button {
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

button:active {
  transform: scale(0.97);
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

.welcome-banner {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #8b5e3c;
  color: white;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: bold;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  animation: slideDown 0.4s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }

  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.floating-icons {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.icon-wrapper {
  position: absolute;
  top: 0;
  animation: floatUp linear infinite;
}

.icon-wrapper:nth-child(1) {
  left: 10%;
  animation-duration: 22s;
  animation-delay: 0s;
}

.icon-wrapper:nth-child(2) {
  left: 25%;
  animation-duration: 28s;
  animation-delay: -6s;
}

.icon-wrapper:nth-child(3) {
  left: 40%;
  animation-duration: 24s;
  animation-delay: -12s;
}

.icon-wrapper:nth-child(4) {
  left: 60%;
  animation-duration: 30s;
  animation-delay: -3s;
}

.icon-wrapper:nth-child(5) {
  left: 75%;
  animation-duration: 26s;
  animation-delay: -15s;
}

.icon-wrapper:nth-child(6) {
  left: 88%;
  animation-duration: 32s;
  animation-delay: -8s;
}

/* Icon styling */
.icon-wrapper svg {
  width: 42px;
  height: 42px;
  stroke: #a67c52;
  fill: none;
  stroke-width: 1.6;
  opacity: 0.5;
}

@keyframes floatUp {
  0% {
    transform: translateY(120vh) rotate(0deg);
  }

  50% {
    transform: translateY(50vh) rotate(90deg);
  }

  100% {
    transform: translateY(-20vh) rotate(180deg);
  }
}
</style>