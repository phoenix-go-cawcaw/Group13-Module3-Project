<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const showWelcome = ref(false)
const welcomeMessage = ref('')

const isHovered = ref(false)
const isOpen = ref(false)

const targetX = ref(0), targetY = ref(0)
const springX = ref(0), springY = ref(0)

const backFlap = ref(0), targetBack = ref(0)
const frontFlap = ref(0), targetFront = ref(0)
const leftFlap = ref(0), targetLeft = ref(0)
const rightFlap = ref(0), targetRight = ref(0)

let rafId = null
let flapRaf = null

const BOX = 240
const HALF = BOX / 2

const tiles = [
  { key: 'glass', bg: '#FF9B5E', border: '#C95A00', tx: '-68px', ty: '-155px', tz: '52px', z: 7, rot: '-12deg', delay: 0.05, size: 32 },
  { key: 'utensils', bg: '#58D46A', border: '#1F8A2E', tx: '18px', ty: '-175px', tz: '-28px', z: 3, rot: '8deg', delay: 0.10, size: 28 },
  { key: 'footstep', bg: '#F06E4A', border: '#B5401B', tx: '78px', ty: '-130px', tz: '62px', z: 8, rot: '20deg', delay: 0.15, size: 32 },
  { key: 'flask', bg: '#C68336', border: '#8A4F14', tx: '-82px', ty: '-88px', tz: '-44px', z: 2, rot: '-24deg', delay: 0.12, size: 28 },
  { key: 'sun', bg: '#FFD166', border: '#CC8A00', tx: '90px', ty: '-72px', tz: '-12px', z: 4, rot: '14deg', delay: 0.18, size: 32 },
  { key: 'brush', bg: '#D08A4A', border: '#9A5317', tx: '24px', ty: '-42px', tz: '38px', z: 6, rot: '32deg', delay: 0.20, size: 28 },
  { key: 'waves', bg: '#F2B94B', border: '#B97800', tx: '-46px', ty: '-28px', tz: '-58px', z: 1, rot: '-16deg', delay: 0.22, size: 28 },
]

const particles = [
  { x: -120, y: -220 }, { x: 60, y: -260 }, { x: 140, y: -190 },
  { x: -60, y: -170 }, { x: 100, y: -130 }, { x: -140, y: -130 },
  { x: 20, y: -290 }, { x: -20, y: -100 },
]

onMounted(() => {
  // Check for welcome message
  const q = route.query.welcome
  console.log("Route query:", route.query)
  console.log("Welcome query:", q)

  if (q === 'back') {
    welcomeMessage.value = '✦ Welcome Back!';
    showWelcome.value = true
    console.log("Showing welcome back")
  }
  if (q === 'new') {
    welcomeMessage.value = '✦ Welcome to Hobby in a Box!';
    showWelcome.value = true
    console.log("Showing welcome new")
  }
  if (showWelcome.value) {
    setTimeout(() => {
      showWelcome.value = false;
      router.replace({ query: {} })
    }, 4000)
  }

  // Start animation loops
  tick()
  flapTick()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  cancelAnimationFrame(flapRaf)
})

function tick() {
  const k = 0.08
  springX.value += (targetX.value - springX.value) * k
  springY.value += (targetY.value - springY.value) * k
  rafId = requestAnimationFrame(tick)
}

function flapTick() {
  const k = 0.10
  backFlap.value += (targetBack.value - backFlap.value) * k
  frontFlap.value += (targetFront.value - frontFlap.value) * k
  leftFlap.value += (targetLeft.value - leftFlap.value) * k
  rightFlap.value += (targetRight.value - rightFlap.value) * k
  flapRaf = requestAnimationFrame(flapTick)
}

// MOUSE MOVEMENT
function onMouseMove(e) {
  const r = e.currentTarget.getBoundingClientRect()
  const mx = (e.clientX - r.left) / r.width - 0.5
  const my = (e.clientY - r.top) / r.height - 0.5
  targetY.value = mx * 50
  targetX.value = -my * 50
}

function onMouseEnter() {
  isHovered.value = true;
  isOpen.value = true
}

function onMouseLeave() {
  isHovered.value = false;
  isOpen.value = false
  targetX.value = 0;
  targetY.value = 0
}

watch(isOpen, open => {
  targetBack.value = open ? 120 : 0
  targetFront.value = open ? -130 : 0
  targetLeft.value = open ? -130 : 0
  targetRight.value = open ? 130 : 0
})
</script>

<template>
  <main class="home-root">
    <div class="bg-wash" />
    <div class="bg-grain" />

    <div class="deco-layer" aria-hidden="true">
      <span class="deco deco-palette float-a">
        <svg width="130" height="130" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
          <path
            d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
      </span>
      <span class="deco deco-sprout float-b">
        <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1">
          <path d="M7 20h10" />
          <path d="M10 20c5.5-2.5.8-6.4 3-9" />
          <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
          <path d="M14.1 6a7 7 0 00-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
        </svg>
      </span>
    </div>

    <Transition name="banner">
      <div v-if="showWelcome" class="welcome-banner" role="status" aria-live="polite">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          class="spark-icon">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        {{ welcomeMessage }}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          class="spark-icon">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
    </Transition>

    <div class="home-grid">
      <div class="home-text slide-in-left">
        <div>
          <h1 class="hero-title">
            Welcome to<br />
            <span class="hero-accent">Hobby in a Box!</span>
          </h1>
          <p class="hero-sub">
            Curated hobby boxes delivered to your door — explore creativity,
            learning, and culture in every package.
          </p>
        </div>

        <div class="hero-btns">
          <RouterLink to="/products" class="btn-primary">
            Browse Products
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </RouterLink>
          <RouterLink to="/subscriptions" class="btn-secondary">
            View Subscriptions
          </RouterLink>
        </div>

        <div class="features-card">
          <div class="feature-row">
            <div class="feat-icon" style="background:#C06A22;transform:rotate(3deg)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F3E6D3" stroke-width="2">
                <circle cx="13.5" cy="6.5" r=".5" fill="#F3E6D3" />
                <circle cx="17.5" cy="10.5" r=".5" fill="#F3E6D3" />
                <circle cx="8.5" cy="7.5" r=".5" fill="#F3E6D3" />
                <circle cx="6.5" cy="12.5" r=".5" fill="#F3E6D3" />
                <path
                  d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
              </svg>
            </div>
            <div>
              <h3 class="feat-title">Choose a Category</h3>
              <p class="feat-desc">Arts & DIY, Green Living, Education 4 Kidz, or Culinary Discovery</p>
            </div>
          </div>

          <div class="feature-row">
            <div class="feat-icon" style="background:#A95A1C;transform:rotate(-2deg)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F3E6D3" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <h3 class="feat-title">Flexible Plans</h3>
              <p class="feat-desc">Subscribe monthly or make a one-time purchase — no commitments.</p>
            </div>
          </div>

          <div class="feature-row">
            <div class="feat-icon" style="background:#D1A877;transform:rotate(1deg)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3E2A1B" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <div>
              <h3 class="feat-title">Monthly Shipping</h3>
              <p class="feat-desc">All materials included, shipped directly to your doorstep every month.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="box-scene" @mousemove="onMouseMove" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
        <div class="box-3d"
          :style="{ transform: `translateY(130px) rotateX(${springX - 25}deg) rotateY(${springY}deg)` }">

          <div class="box-ground-shadow" />

          <div class="face face-back" />
          <div class="face face-right" />
          <div class="face face-left" />
          <div class="face face-bottom" />
          <div class="face face-front">
            <div class="front-score" />
          </div>

          <div class="floaters-root">
            <div v-for="t in tiles" :key="t.key" class="tile" :class="{ 'tile-out': isOpen }" :style="{
              '--tx': t.tx, '--ty': t.ty, '--tz': t.tz, '--rot': t.rot,
              '--bg': t.bg, '--border': t.border,
              zIndex: t.z,
              transitionDelay: isOpen ? t.delay + 's' : '0s',
            }">

              <!-- SVG icons -->

              <svg v-if="t.key === 'glass'" :width="t.size" :height="t.size" viewBox="0 0 24 24" fill="none"
                stroke="#F3E6D3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 8l1.5 10.5A2 2 0 008.5 21h7a2 2 0 002-1.5L19 8M3 8h18" />
                <path d="M10 12h4" />
              </svg>

              <!-- UTENSILS -->
              <svg v-else-if="t.key === 'utensils'" :width="t.size" :height="t.size" viewBox="0 0 24 24" fill="none"
                stroke="#F3E6D3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 3v7a4 4 0 008 0V3" />
                <path d="M8 3v18" />
                <path d="M20 3v18" />
              </svg>

              <!-- FOOTSTEP -->
              <svg v-else-if="t.key === 'footstep'" :width="t.size" :height="t.size" viewBox="0 0 24 24" fill="none"
                stroke="#F3E6D3" stroke-width="2.5">
                <circle cx="12" cy="8" r="3" />
                <path d="M6 21c0-4 3-7 6-7s6 3 6 7" />
              </svg>

              <!-- FLASK -->
              <svg v-else-if="t.key === 'flask'" :width="t.size" :height="t.size" viewBox="0 0 24 24" fill="none"
                stroke="#F3E6D3" stroke-width="2.5">
                <path d="M10 2v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V2" />
              </svg>

              <!-- SUN -->
              <svg v-else-if="t.key === 'sun'" :width="t.size" :height="t.size" viewBox="0 0 24 24" fill="none"
                stroke="#F3E6D3" stroke-width="2.5">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
              </svg>

              <!-- BRUSH -->
              <svg v-else-if="t.key === 'brush'" :width="t.size" :height="t.size" viewBox="0 0 24 24" fill="none"
                stroke="#F3E6D3" stroke-width="2.5">
                <path d="M3 21l6-6" />
                <path d="M14 3l7 7-9 9H5v-7z" />
              </svg>

              <!-- WAVES -->
              <svg v-else-if="t.key === 'waves'" :width="t.size" :height="t.size" viewBox="0 0 24 24" fill="none"
                stroke="#F3E6D3" stroke-width="2.5">
                <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
              </svg>

            </div>

            <div class="plant-wrap" :class="{ 'plant-out': isOpen }">
              <div class="plant-stem" />
              <div class="plant-leaf plant-leaf-left" />
              <div class="plant-leaf plant-leaf-right" />
              <div class="plant-flower">
                <div class="petal petal-1"></div>
                <div class="petal petal-2"></div>
                <div class="petal petal-3"></div>
                <div class="petal petal-4"></div>
                <div class="petal petal-5"></div>
                <div class="petal petal-6"></div>
              </div>
            </div>

            <div v-for="(p, i) in particles" :key="i" class="particle" :class="{ 'particle-out': isOpen }" :style="{
              '--px': p.x + 'px',
              '--py': p.y + 'px',
              transitionDelay: isOpen ? (i * 0.07) + 's' : '0s',
            }" />

            <div class="magic-glow" :class="{ 'glow-on': isOpen }" />
          </div>

          <div class="flap-plane" :style="{ transform: `translateY(-${HALF}px) rotateX(90deg)` }">
            <div class="flap flap-back" :style="{ transform: `rotateX(${backFlap}deg)` }" />
            <div class="flap flap-front" :style="{ transform: `rotateX(${frontFlap}deg)` }" />
            <div class="flap flap-left" :style="{ transform: `rotateY(${leftFlap}deg)` }" />
            <div class="flap flap-right" :style="{ transform: `rotateY(${rightFlap}deg)` }" />
          </div>
        </div>

        <div class="box-prompt fade-in-late">
          <span class="prompt-spark">✦</span>
          {{ isHovered ? "It's full of hobbies!" : "Hover to open the box!" }}
          <span class="prompt-spark">✦</span>
        </div>
      </div>
    </div>
  </main>
</template>


<style scoped>
.home-root {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  color: #3E2A1B;
}

.bg-wash {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #F3E6D3 0%, #E2C49A 45%, #D1A877 100%);
  z-index: 0;
}

.bg-grain {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.045;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
}

.deco-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.deco {
  position: absolute;
  color: rgba(192, 106, 34, 0.14);
}

.deco-palette {
  top: 4%;
  left: 2%;
}

.deco-sprout {
  bottom: 6%;
  right: 3%;
}

@keyframes floatA {

  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes floatB {

  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(20px) rotate(-5deg);
  }
}

.float-a {
  animation: floatA 5s ease-in-out infinite;
}

.float-b {
  animation: floatB 7s ease-in-out infinite 1s;
}

.welcome-banner {
  position: fixed;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  background: #C06A22;
  color: #F3E6D3;
  padding: .65rem 2rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: .04em;
  box-shadow: 0 8px 32px rgba(62, 42, 27, .3);
  border: 3px solid #F3E6D3;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: .6rem;
}

.spark-icon {
  animation: sparkSpin 3s ease-in-out infinite;
}

@keyframes sparkSpin {

  0%,
  100% {
    transform: rotate(0) scale(1);
  }

  50% {
    transform: rotate(20deg) scale(1.15);
  }
}

.banner-enter-active,
.banner-leave-active {
  transition: transform .5s cubic-bezier(.34, 1.56, .64, 1), opacity .4s ease;
}

.banner-enter-from,
.banner-leave-to {
  transform: translateX(-50%) translateY(-60px);
  opacity: 0;
}

.home-grid {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  width: 100%;
  max-width: 1200px;
  align-items: center;
}

@media (min-width:1024px) {
  .home-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-40px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in-left {
  animation: slideInLeft .85s ease-out both;
}

.home-text {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.6rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -.02em;
  margin: 0 0 1rem;
  color: #3E2A1B;
}

.hero-accent {
  background: linear-gradient(to right, #C06A22, #A95A1C);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-sub {
  font-size: 1.1rem;
  color: #5A3A22;
  line-height: 1.75;
  margin: 0;
}

.hero-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: .9rem 1.8rem;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 14px;
  text-decoration: none;
  cursor: pointer;
  font-family: inherit;
  transition: transform .15s ease, box-shadow .15s ease;
}

.btn-primary {
  background: #C06A22;
  color: #F3E6D3;
  border: 2px solid #A95A1C;
  box-shadow: 0 6px 0 #A95A1C;
}

.btn-primary:hover {
  transform: translateY(3px);
  box-shadow: 0 3px 0 #A95A1C;
  color: #F3E6D3;
}

.btn-primary:active {
  transform: translateY(5px);
  box-shadow: 0 1px 0 #A95A1C;
}

.btn-secondary {
  background: #F3E6D3;
  color: #A95A1C;
  border: 2px solid #A95A1C;
  box-shadow: 0 6px 0 #A95A1C;
}

.btn-secondary:hover {
  transform: translateY(3px);
  box-shadow: 0 3px 0 #A95A1C;
  color: #A95A1C;
}

.btn-secondary:active {
  transform: translateY(5px);
  box-shadow: 0 1px 0 #A95A1C;
}

.features-card {
  background: rgba(243, 230, 211, .70);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 20px;
  border: 1.5px solid rgba(255, 255, 255, .55);
  padding: 1.75rem;
  box-shadow: 0 12px 32px rgba(62, 42, 27, .09);
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.feature-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.feat-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 8px rgba(62, 42, 27, .18);
}

.feat-title {
  font-size: 1rem;
  font-weight: 700;
  color: #3E2A1B;
  margin: 0 0 3px;
}

.feat-desc {
  font-size: .85rem;
  color: #5A3A22;
  margin: 0;
  line-height: 1.55;
}

.box-scene {
  width: 100%;
  max-width: 380px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 580px;
  perspective: 1200px;
  user-select: none;
  cursor: pointer;
  transform: none;
}

.box-3d {
  position: relative;
  width: 240px;
  height: 240px;
  transform-style: preserve-3d;
}

.box-ground-shadow {
  position: absolute;
  bottom: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 240px;
  height: 70px;
  background: rgba(169, 90, 28, .18);
  filter: blur(28px);
  border-radius: 50%;
  pointer-events: none;
}

.face {
  position: absolute;
  inset: 0;
  border-radius: 10px;
  backface-visibility: visible;
  /* if laggy, switch to hidden (visibility may cause website render issues) */
}

.face-back {
  background: #A95A1C;
  border: 2px solid #C06A22;
  transform: rotateY(180deg) translateZ(120px);
}

.face-right {
  background: #C06A22;
  border: 2px solid #E2C49A;
  transform: rotateY(90deg) translateZ(120px);
}

.face-left {
  background: #C06A22;
  border: 2px solid #E2C49A;
  transform: rotateY(-90deg) translateZ(120px);
}

.face-bottom {
  background: #A95A1C;
  border: none;
  transform: rotateX(-90deg) translateZ(120px);
}

.face-front {
  background: linear-gradient(145deg, #D1A877 0%, #C06A22 100%);
  border: 2px solid #E2C49A;
  transform: translateZ(120px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.front-score {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(243, 230, 211, .18);
}

.flap-plane {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  width: 240px;
  height: 240px;
  pointer-events: none;
}

.flap {
  position: absolute;
  background: #D1A877;
  border: 1px solid #E2C49A;
  backface-visibility: visible;
}

.flap-back {
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  transform-origin: top;
}

.flap-front {
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  transform-origin: bottom;
}

.flap-left {
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  transform-origin: left;
}

.flap-right {
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  transform-origin: right;
}

.floaters-root {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transform-style: preserve-3d;
  overflow: visible;
}

.tile {
  position: absolute;
  width: 56px;
  height: 56px;
  background: var(--bg);
  border-radius: 14px;
  border-bottom: 4px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(62, 42, 27, .25);
  opacity: 0;
  transform: scale(.4) translate(0, 0) rotate(0deg);
  transition: transform .55s cubic-bezier(.34, 1.56, .64, 1),
    opacity .35s ease,
    box-shadow .2s ease;
}

.tile-out {
  opacity: 1;
  transform:
    scale(1) translate3d(var(--tx), calc(var(--ty) - 80px), var(--tz)) rotate(var(--rot));
}

.tile-out:hover {
  transform: scale(1.1) translate3d(var(--tx), calc(var(--ty) - 80px), var(--tz)) rotate(var(--rot));
  box-shadow: 0 12px 28px rgba(62, 42, 27, .35);
}

.plant-wrap {
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  opacity: 0;
  transform: scale(0) translateY(50px);
  transition: transform .65s cubic-bezier(.34, 1.56, .64, 1) .1s, opacity .4s ease .1s;
}


.plant-out {
  opacity: 1;
  transform: scale(1.35) translateY(-200px);
}

.plant-stem {
  width: 8px;
  height: 110px;
  background: linear-gradient(to top, #163915, #34a91c);
  border-radius: 999px;
}

.plant-leaf {
  position: absolute;
  bottom: 36px;
  width: 32px;
  height: 14px;
  background: #51c637;
  border-radius: 999px;
}

.plant-leaf-left {
  left: -24px;
  transform: rotate(-45deg);
}

.plant-leaf-right {
  right: -24px;
  transform: rotate(45deg);
}

.plant-flower {
  position: relative;
  width: 34px;
  height: 34px;
  background: radial-gradient(circle at 30% 30%, #ffed2b, #d1d119);
  border-radius: 50%;
  border: 3px solid #cec813;
}

.petal {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 24px;
  height: 36px;
  background: #F3E6D3;
  border-radius: 50%;
  transform-origin: center center;
}

.petal-1 { transform: translate(-50%, -50%) rotate(0deg) translateY(-18px); }
.petal-2 { transform: translate(-50%, -50%) rotate(60deg) translateY(-18px); }
.petal-3 { transform: translate(-50%, -50%) rotate(120deg) translateY(-18px); }
.petal-4 { transform: translate(-50%, -50%) rotate(180deg) translateY(-18px); }
.petal-5 { transform: translate(-50%, -50%) rotate(240deg) translateY(-18px); }
.petal-6 { transform: translate(-50%, -50%) rotate(300deg) translateY(-18px); }

.particle {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ffce2b;
  opacity: 0;
  transform: scale(0) translate(0, 0);
  transition: transform .9s ease, opacity .9s ease;
}

.particle-out {
  opacity: .65;
  transform: scale(1) translate(var(--px), var(--py));
}

.magic-glow {
  position: absolute;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(209, 168, 119, .9) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transform: scale(.5);
  pointer-events: none;
  filter: blur(32px);
  mix-blend-mode: screen;
  transition: opacity .5s ease, transform .5s ease;
}

.glow-on {
  opacity: .55;
  transform: scale(1.6);
}

.box-prompt {
  margin-top: 8rem;
  color: #5A3A22;
  font-weight: 700;
  font-size: 1rem;
  padding: .5rem 1.5rem;
  background: rgba(243, 230, 211, .55);
  backdrop-filter: blur(8px);
  border-radius: 999px;
  border: 1.5px solid rgba(255, 255, 255, .55);
  box-shadow: 0 2px 12px rgba(62, 42, 27, .08);
  display: flex;
  align-items: center;
  gap: 16px;
  pointer-events: none;
}

.prompt-spark {
  color: #C06A22;
  animation: sparkPulse 1.4s ease-in-out infinite;
}

@keyframes sparkPulse {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: .3;
    transform: scale(.8);
  }
}

.fade-in-late {
  animation: fadeInUp 1s ease 2s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
