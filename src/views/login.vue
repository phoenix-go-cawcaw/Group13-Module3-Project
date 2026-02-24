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
const isSubmitting = ref(false)
const isSuccess = ref(false)

let mouseHandler

const icons = [
  { name: 'palette', color: '#FF6B6B', left: '12%', top: '8%', size: 48, delay: 0, dur: 6 },
  { name: 'gamepad', color: '#4ECDC4', left: '28%', top: '72%', size: 64, delay: 2, dur: 7 },
  { name: 'camera', color: '#45B7D1', left: '44%', top: '18%', size: 56, delay: 4, dur: 5 },
  { name: 'music', color: '#96CEB4', left: '60%', top: '60%', size: 48, delay: 1, dur: 8 },
  { name: 'utensils', color: '#FFC75F', left: '76%', top: '12%', size: 72, delay: 3, dur: 6 },
  { name: 'dumbbell', color: '#FF9999', left: '88%', top: '50%', size: 56, delay: 5, dur: 7 },
  { name: 'plane', color: '#845EC2', left: '5%', top: '45%', size: 64, delay: 2.5, dur: 9 },
  { name: 'book', color: '#D65DB1', left: '35%', top: '85%', size: 48, delay: 0.5, dur: 6 },
  { name: 'hammer', color: '#FFC75F', left: '55%', top: '40%', size: 56, delay: 3.5, dur: 8 },
  { name: 'flower', color: '#F9F871', left: '92%', top: '78%', size: 48, delay: 1.5, dur: 5 },
]

onMounted(() => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (token) router.push('/')

  mouseHandler = (e) => {
    const wrappers = document.querySelectorAll('.bg-icon')
    wrappers.forEach((el, i) => {
      const factor = (i + 1) * 20
      const x = ((e.clientX / window.innerWidth) * 2 - 1) * factor * 0.4
      const y = ((e.clientY / window.innerHeight) * 2 - 1) * factor * 0.4
      el.style.transform = `translate(${x}px, ${y}px)`
    })
  }

  window.addEventListener('mousemove', mouseHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', mouseHandler)
})

async function handleSubmit() {
  if (!email.value || !password.value || (!isLogin.value && !username.value)) {
    errorMessage.value = 'Please check your shipping details (all fields required).'
    return
  }

  try {
    isSubmitting.value = true
    errorMessage.value = ''

    const endpoint = isLogin.value
      ? 'http://localhost:5000/auth/login'
      : 'http://localhost:5000/auth/register'

    const payload = isLogin.value
      ? { email: email.value, password: password.value }
      : { username: username.value, email: email.value, password: password.value }

    const response = await axios.post(endpoint, payload)
    const { token, user } = response.data

    if (rememberMe.value) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      sessionStorage.setItem('token', token)
      sessionStorage.setItem('user', JSON.stringify(user))
    }

    isSubmitting.value = false
    isSuccess.value = true

    setTimeout(() => {
      router.push({
        path: '/',
        query: { welcome: isLogin.value ? 'back' : 'new' }
      })
    }, 1000)

  } catch (err) {
    isSubmitting.value = false
    password.value = ''
    errorMessage.value = err.response?.data?.message || 'Delivery failed. Please try again.'
  }
}
</script>

<!-- Toggle down the svg icon floats (icon-float) if it is laggy-->

<template>
  <div class="login-root">
    <div class="bg-gradient" />

    <div class="bg-icons-container">
      <div v-for="(icon, i) in icons" :key="i" class="bg-icon" :style="{
        left: icon.left,
        top: icon.top,
        '--float-delay': icon.delay + 's',
        '--float-dur': icon.dur + 's',
        '--icon-color': icon.color,
      }">
        <div class="icon-float">
          <svg v-if="icon.name === 'palette'" :width="icon.size" :height="icon.size" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
            <path
              d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
          </svg>

          <svg v-else-if="icon.name === 'gamepad'" :width="icon.size" :height="icon.size" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="6" y1="12" x2="10" y2="12" />
            <line x1="8" y1="10" x2="8" y2="14" />
            <line x1="15" y1="13" x2="15.01" y2="13" />
            <line x1="18" y1="11" x2="18.01" y2="11" />
            <rect x="2" y="6" width="20" height="12" rx="2" />
          </svg>

          <svg v-else-if="icon.name === 'camera'" :width="icon.size" :height="icon.size" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
          </svg>

          <svg v-else-if="icon.name === 'music'" :width="icon.size" :height="icon.size" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>

          <svg v-else-if="icon.name === 'utensils'" :width="icon.size" :height="icon.size" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
          </svg>

          <svg v-else-if="icon.name === 'dumbbell'" :width="icon.size" :height="icon.size" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 5v14M18 5v14M6 8H2v8h4M18 8h4v8h-4M10 12h4" />
          </svg>

          <svg v-else-if="icon.name === 'plane'" :width="icon.size" :height="icon.size" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path
              d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
          </svg>

          <svg v-else-if="icon.name === 'book'" :width="icon.size" :height="icon.size" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
            <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
          </svg>

          <svg v-else-if="icon.name === 'hammer'" :width="icon.size" :height="icon.size" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 12l-8.5 8.5a2.12 2.12 0 01-3-3L12 9" />
            <path d="M17.64 15L22 10.64" />
            <path
              d="M20.91 11.7l-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 00-3.94-1.64H9l.92.82A6.18 6.18 0 0112 8.4v1.56l2 2h2.47l2.26 1.91" />
          </svg>

          <svg v-else-if="icon.name === 'flower'" :width="icon.size" :height="icon.size" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path
              d="M12 7.5a4.5 4.5 0 114.5 4.5M12 7.5A4.5 4.5 0 117.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 104.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 11-4.5 4.5m4.5-4.5H15m-3 4.5V15" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
      </div>
    </div>

    <div class="box-wrapper" :class="{
      'is-submitting': isSubmitting,
      'is-success': isSuccess
    }">
      <div class="box-flap" :class="{
        'flap-open': !isSubmitting && !isSuccess,
        'flap-closed': isSubmitting,
        'flap-opened': isSuccess,
      }">
        <div class="flap-texture" />
      </div>

      <div class="box-body">
        <div class="cardboard-texture" />

        <div class="box-inner">
          <div class="box-header">
            <div class="icon-badge">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#bc6c25" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h1 class="box-title">Hobby in a Box</h1>
            <p class="box-subtitle">
              {{ isLogin ? 'Welcome back, Maker!' : 'Start your new hobby today!' }}
            </p>
          </div>

          <div class="mode-toggle">
            <div class="toggle-pill" :class="{ 'right': !isLogin }" />
            <button class="toggle-btn" :class="{ active: isLogin }" @click="isLogin = true">Log In</button>
            <button class="toggle-btn" :class="{ active: !isLogin }" @click="isLogin = false">Sign Up</button>
          </div>

          <form @submit.prevent="handleSubmit" class="box-form">
            <div class="field-group" :class="{ 'field-visible': !isLogin, 'field-hidden': isLogin }">
              <label class="field-label">Username</label>
              <input v-model="username" type="text" class="field-input" placeholder="MakerOne" />
            </div>

            <div class="field-group">
              <label class="field-label">Email</label>
              <input v-model="email" type="email" class="field-input" placeholder="hello@hobbyinabox.com" />
            </div>

            <div class="field-group">
              <label class="field-label">Password</label>
              <input v-model="password" type="password" class="field-input" placeholder="••••••••" />
            </div>

            <div class="remember-row">
              <input type="checkbox" id="remember" v-model="rememberMe" class="remember-check" />
              <label for="remember" class="remember-label">Remember this device</label>
            </div>

            <div v-if="errorMessage" class="error-label">
              <p class="error-heading">Return to Sender</p>
              <p>{{ errorMessage }}</p>
            </div>

            <button type="submit" class="submit-btn" :disabled="isSubmitting || isSuccess">
              <span v-if="isSubmitting" class="btn-content">
                <svg class="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Packing...
              </span>
              <span v-else-if="isSuccess" class="btn-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Shipped!
              </span>
              <span v-else>
                {{ isLogin ? 'Open My Box' : 'Create My Box' }}
              </span>
              <div class="btn-shine" />
            </button>
          </form>
        </div>

        <div class="bottom-tape" />
      </div>

      <div class="table-shadow" />
    </div>
  </div>
</template>


<style scoped>
.login-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow: hidden;
  position: relative;
  font-family: 'Georgia', serif;
  color: #3d2b1f;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, #f7f3ea 0%, #e8dcc7 60%, #d9c9a8 100%);
  z-index: 0;
}

.bg-icons-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.bg-icon {
  position: absolute;
  color: var(--icon-color);
  opacity: 0.28;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.icon-float {
  animation: iconFloat var(--float-dur, 6s) ease-in-out infinite;
  animation-delay: var(--float-delay, 0s);
}

@keyframes iconFloat {
  0% {
    transform: translateY(0) rotate(0deg) scale(0.9);
  }

  33% {
    transform: translateY(-30px) rotate(10deg) scale(1.05);
  }

  66% {
    transform: translateY(-15px) rotate(-8deg) scale(1.0);
  }

  100% {
    transform: translateY(0) rotate(0deg) scale(0.9);
  }
}

.box-wrapper {
  position: relative;
  z-index: 10;
  width: min(440px, 94vw);
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease;
}

.box-wrapper.is-submitting {
  animation: boxShake 0.5s ease-in-out infinite;
}

.box-wrapper.is-success {
  transform: translateY(-60px) scale(0.92);
  opacity: 0;
}

@keyframes boxShake {

  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  20% {
    transform: translateY(-10px) rotate(-1deg);
  }

  40% {
    transform: translateY(-4px) rotate(1deg);
  }

  60% {
    transform: translateY(-8px) rotate(-0.5deg);
  }

  80% {
    transform: translateY(-2px) rotate(0.5deg);
  }
}

.box-flap {
  position: absolute;
  top: -44px;
  left: 0;
  right: 0;
  height: 56px;
  background: #d4a373;
  border: 2px solid #a67c52;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  transform-origin: bottom center;
  transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), z-index 0.3s;
  z-index: 0;
}

.flap-texture {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(45deg,
      transparent,
      transparent 10px,
      rgba(0, 0, 0, 0.03) 10px,
      rgba(0, 0, 0, 0.03) 20px);
  opacity: 0.6;
}

.box-flap.flap-open {
  transform: rotateX(-45deg);
  z-index: 0;
}

.box-flap.flap-closed {
  transform: rotateX(0deg);
  z-index: 20;
}

.box-flap.flap-opened {
  transform: rotateX(-85deg);
  z-index: 0;
}

.box-body {
  position: relative;
  background: #e6be8a;
  border-radius: 10px;
  border: 2px solid #a67c52;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.cardboard-texture {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.15;
  background-image:
    repeating-linear-gradient(0deg,
      transparent,
      transparent 3px,
      rgba(0, 0, 0, 0.05) 3px,
      rgba(0, 0, 0, 0.05) 4px),
    repeating-linear-gradient(90deg,
      transparent,
      transparent 12px,
      rgba(0, 0, 0, 0.03) 12px,
      rgba(0, 0, 0, 0.03) 13px);
}

.box-inner {
  position: relative;
  padding: 2rem;
  z-index: 2;
}

.box-header {
  text-align: center;
  margin-bottom: 1.75rem;
}

.icon-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: #fefae0;
  border: 2px solid #a67c52;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.75rem;
}

.box-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #603813;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
  margin: 0 0 0.35rem;
}

.box-subtitle {
  color: #7f5539;
  font-size: 0.95rem;
  margin: 0;
}

.mode-toggle {
  position: relative;
  display: flex;
  background: rgba(203, 153, 126, 0.3);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.toggle-pill {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc(50% - 4px);
  background: #fefae0;
  border-radius: 9px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
}

.toggle-pill.right {
  transform: translateX(100%);
}

.toggle-btn {
  flex: 1;
  padding: 0.5rem;
  background: transparent;
  border: none;
  font-size: 0.875rem;
  font-weight: 700;
  color: #8d6e63;
  cursor: pointer;
  position: relative;
  z-index: 2;
  transition: color 0.25s ease;
  border-radius: 9px;
}

.toggle-btn.active {
  color: #603813;
}

.box-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
  transition: max-height 0.4s ease, opacity 0.4s ease;
}

.field-group.field-hidden {
  max-height: 0;
  opacity: 0;
  pointer-events: none;
  margin: 0;
  gap: 0;
}

.field-group.field-visible {
  max-height: 100px;
  opacity: 1;
}

.field-group:not(.field-hidden):not(.field-visible) {
  max-height: 100px;
  opacity: 1;
}

.field-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #7f5539;
  padding-left: 2px;
}

.field-input {
  background: #fefae0;
  border: 2px solid #d4a373;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-size: 0.95rem;
  color: #603813;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
}

.field-input::placeholder {
  color: rgba(212, 163, 115, 0.7);
}

.field-input:focus {
  border-color: #bc6c25;
  box-shadow: 0 0 0 3px rgba(188, 108, 37, 0.15);
}

.remember-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.remember-check {
  width: 16px;
  height: 16px;
  accent-color: #bc6c25;
  cursor: pointer;
}

.remember-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #7f5539;
  cursor: pointer;
}

.error-label {
  background: #f8f1e5;
  border: 2px dashed rgba(185, 28, 28, 0.5);
  border-radius: 6px;
  padding: 0.75rem;
  text-align: center;
  transform: rotate(-1deg);
  animation: fadeInDown 0.3s ease;
}

.error-heading {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
  color: #b91c1c;
  margin: 0 0 2px;
}

.error-label p {
  font-size: 0.8rem;
  color: #b91c1c;
  margin: 0;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: rotate(-1deg) translateY(-8px);
  }

  to {
    opacity: 1;
    transform: rotate(-1deg) translateY(0);
  }
}

.submit-btn {
  position: relative;
  width: 100%;
  background: #bc6c25;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  letter-spacing: 0.04em;
  box-shadow: 0 4px 14px rgba(188, 108, 37, 0.4);
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn:hover:not(:disabled) {
  background: #a45a1c;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(188, 108, 37, 0.5);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.submit-btn:disabled {
  cursor: default;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-shine {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.18);
  transform: translateY(100%) skewY(12deg);
  transition: transform 0.35s ease;
  pointer-events: none;
}

.submit-btn:hover .btn-shine {
  transform: translateY(0) skewY(12deg);
}

.spin {
  animation: spinning 0.8s linear infinite;
}

@keyframes spinning {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.bottom-tape {
  height: 8px;
  background: #b08968;
  opacity: 0.5;
}

.table-shadow {
  position: absolute;
  bottom: -32px;
  left: 16px;
  right: 16px;
  height: 16px;
  background: rgba(0, 0, 0, 0.2);
  filter: blur(16px);
  border-radius: 50%;
}
</style>