<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import heroBg from '../assets/HobbyinaBox.png'

const route = useRoute()
const router = useRouter()

// ── Welcome banner ───────────────────────────────────────────────────────────
const showWelcome = ref(false)
const welcomeMessage = ref('')

onMounted(() => {
  if (route.query.welcome === 'back') {
    welcomeMessage.value = '✨ Welcome Back!'
    showWelcome.value = true
  } else if (route.query.welcome === 'new') {
    welcomeMessage.value = '✨ Welcome to Hobby in a Box!'
    showWelcome.value = true
  }

  if (showWelcome.value) {
    setTimeout(() => {
      showWelcome.value = false
      router.replace({ path: '/' })
    }, 4000)
  }
})

// ── 3-D box interaction ───────────────────────────────────────────────────────
const isHovered = ref(false)
const isOpen = ref(false)
const rotateX = ref(0)
const rotateY = ref(0)

// Smooth spring values (manual simple spring via animation frame)
const springX = ref(0)
const springY = ref(0)
let raf = null

function springTick() {
  const stiffness = 0.12
  springX.value += (rotateX.value - springX.value) * stiffness
  springY.value += (rotateY.value - springY.value) * stiffness
  raf = requestAnimationFrame(springTick)
}
springTick()

function onMouseMove(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const mx = (e.clientX - rect.left) / rect.width - 0.5
  const my = (e.clientY - rect.top) / rect.height - 0.5
  rotateY.value = mx * 30
  rotateX.value = -my * 30
}

function onMouseEnter() {
  isHovered.value = true
  isOpen.value = true
}

function onMouseLeave() {
  isHovered.value = false
  isOpen.value = false
  rotateX.value = 0
  rotateY.value = 0
}

// Lid angle: closed = 90, open = 220 (spring toward target)
const lidAngle = ref(90)
const lidTarget = ref(90)
let lidRaf = null

function lidTick() {
  lidAngle.value += (lidTarget.value - lidAngle.value) * 0.1
  lidRaf = requestAnimationFrame(lidTick)
}
lidTick()

// Watch isOpen to update lid target
import { watch } from 'vue'
watch(isOpen, val => { lidTarget.value = val ? 220 : 90 })

const HALF = 128 // px — half of 256px box
</script>

<template>
  <main class="home-root">

    <!-- ── Gradient background ── -->
    <div class="home-bg-gradient" />

    <!-- ── Decorative floating icons ── -->
    <div class="deco-icons" aria-hidden="true">
      <span class="deco palette float-a">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
        </svg>
      </span>
      <span class="deco sprout float-b">
        <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-9"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 00-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>
        </svg>
      </span>
      <span class="deco chef float-c">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 13.87A4 4 0 017.41 6a5.11 5.11 0 019.18 0A4 4 0 0118 13.87V21H6z"/><line x1="6" y1="17" x2="18" y2="17"/>
        </svg>
      </span>
    </div>

    <!-- ── Welcome banner ── -->
    <Transition name="banner">
      <div v-if="showWelcome" class="welcome-banner" role="status">
        {{ welcomeMessage }}
      </div>
    </Transition>

    <!-- ── Main grid ── -->
    <div class="home-grid">

      <!-- Left: text content -->
      <div class="home-text slide-in-left">
        <div>
          <h1 class="hero-title">
            Welcome to<br />
            <span class="hero-gradient">Hobby in a Box!</span>
          </h1>
          <p class="hero-sub">
            Curated hobby boxes delivered to your door — explore creativity,
            learning, and culture in every package.
          </p>
        </div>

        <!-- CTA Buttons -->
        <div class="hero-btns">
          <RouterLink to="/products" class="btn-primary">
            Browse Products
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
          </RouterLink>
          <RouterLink to="/pricing" class="btn-secondary">
            View Pricing
          </RouterLink>
        </div>

        <!-- How it works card -->
        <div class="steps-card">
          <div class="step">
            <div class="step-num">1</div>
            <div>
              <h3 class="step-title">Choose a Category</h3>
              <div class="step-categories">
                <span class="cat-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C06A22" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5" fill="#C06A22"/><circle cx="17.5" cy="10.5" r=".5" fill="#C06A22"/><circle cx="8.5" cy="7.5" r=".5" fill="#C06A22"/><circle cx="6.5" cy="12.5" r=".5" fill="#C06A22"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
                  Arts & DIY
                </span>
                <span class="cat-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-9"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 00-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>
                  Green Living
                </span>
                <span class="cat-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2196F3" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  Education 4 Kidz
                </span>
                <span class="cat-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9800" stroke-width="2"><path d="M6 13.87A4 4 0 017.41 6a5.11 5.11 0 019.18 0A4 4 0 0118 13.87V21H6z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>
                  Culinary Discovery
                </span>
              </div>
            </div>
          </div>

          <div class="step-row">
            <div class="step step-sm">
              <div class="step-num">2</div>
              <div>
                <h3 class="step-title">Flexible Plans</h3>
                <p class="step-desc">Subscribe monthly or buy once. No commitments.</p>
              </div>
            </div>
            <div class="step step-sm">
              <div class="step-num">3</div>
              <div>
                <h3 class="step-title">Free Delivery</h3>
                <p class="step-desc">All materials included, delivered to your door.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: interactive 3D box -->
      <div
        class="box-scene"
        @mousemove="onMouseMove"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
      >
        <!-- CSS 3D box -->
        <div
          class="box-3d"
          :style="{
            transform: `rotateX(${springX}deg) rotateY(${springY}deg)`,
          }"
        >
          <!-- Shadow -->
          <div class="box-shadow" />

          <!-- Back face -->
          <div class="face face-back" />
          <!-- Right face -->
          <div class="face face-right"><div class="face-inner-dash" /></div>
          <!-- Left face -->
          <div class="face face-left"><div class="face-inner-dash" /></div>
          <!-- Bottom face -->
          <div class="face face-bottom" />
          <!-- Front face -->
          <div class="face face-front">
            <div class="front-content">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#3E2A1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="front-icon">
                <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
              </svg>
              <span class="front-label">Hobby<br/>Box</span>
              <span class="front-badge">EST. 2024</span>
            </div>
          </div>

          <!-- Floating items that pop out when open -->
          <div
            class="floaters"
            :style="{ transform: 'translateZ(0px)' }"
          >
            <!-- Palette -->
            <div
              class="floater floater-palette"
              :class="{ 'floater-out-center': isOpen }"
            >
              <svg width="90" height="90" viewBox="0 0 24 24" fill="#E53935" stroke="#B71C1C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
              </svg>
            </div>

            <!-- Sprout -->
            <div
              class="floater floater-sprout"
              :class="{ 'floater-out-left': isOpen }"
            >
              <svg width="80" height="80" viewBox="0 0 24 24" fill="#43A047" stroke="#1B5E20" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-9"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 00-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>
              </svg>
            </div>

            <!-- Chef hat -->
            <div
              class="floater floater-chef"
              :class="{ 'floater-out-right': isOpen }"
            >
              <svg width="80" height="80" viewBox="0 0 24 24" fill="#FFB74D" stroke="#E65100" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 13.87A4 4 0 017.41 6a5.11 5.11 0 019.18 0A4 4 0 0118 13.87V21H6z"/><line x1="6" y1="17" x2="18" y2="17"/>
              </svg>
            </div>

            <!-- Magic glow -->
            <div class="magic-glow" :class="{ 'glow-on': isOpen }" />
          </div>

          <!-- Top lid (hinges open) -->
          <div
            class="face face-lid"
            :style="{
              transform: `translateY(-${HALF}px) rotateX(${lidAngle}deg)`,
            }"
          >
            <div class="lid-inner">
              <div class="lid-circle">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#A06020" stroke-width="1.5" opacity="0.5">
                  <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Hover prompt -->
        <div class="box-prompt" :class="{ 'prompt-visible': true }">
          <span class="prompt-spark">✦</span>
          {{ isHovered ? 'Look inside!' : 'Hover to open the box!' }}
          <span class="prompt-spark">✦</span>
        </div>
      </div>

    </div>
  </main>
</template>

<style scoped>
/* ── Layout ─────────────────────────────────────────────────────── */
.home-root {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  font-family: 'Georgia', serif;
}

.home-bg-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #F3E6D3 0%, #E2C49A 45%, #D1A877 100%);
  z-index: 0;
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

@media (min-width: 1024px) {
  .home-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* ── Decorative floating background icons ────────────────────────── */
.deco-icons {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.deco {
  position: absolute;
  color: rgba(192, 106, 34, 0.18);
}

.palette { top: 5%; left: 3%; }
.sprout  { bottom: 8%; right: 3%; }
.chef    { top: 22%; right: 12%; }

@keyframes floatA {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%       { transform: translateY(-20px) rotate(5deg); }
}
@keyframes floatB {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%       { transform: translateY(20px) rotate(-5deg); }
}
@keyframes floatC {
  0%, 100% { transform: translate(0,0); }
  50%       { transform: translate(10px, -15px); }
}

.float-a { animation: floatA 5s ease-in-out infinite; }
.float-b { animation: floatB 7s ease-in-out infinite 1s; }
.float-c { animation: floatC 6s ease-in-out infinite 0.5s; }

/* ── Welcome banner ──────────────────────────────────────────────── */
.welcome-banner {
  position: fixed;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  background: #C06A22;
  color: #fff;
  padding: 0.7rem 2rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: 0.03em;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  border: 2px solid #F3E6D3;
  white-space: nowrap;
}

.banner-enter-active, .banner-leave-active {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease;
}
.banner-enter-from, .banner-leave-to {
  transform: translateX(-50%) translateY(-60px);
  opacity: 0;
}

/* ── Slide-in animation for left column ─────────────────────────── */
@keyframes slideInLeft {
  from { transform: translateX(-40px); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}

.slide-in-left {
  animation: slideInLeft 0.8s ease-out both;
}

/* ── Text content ────────────────────────────────────────────────── */
.home-text {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  color: #3E2A1B;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0 0 1rem;
}

.hero-gradient {
  background: linear-gradient(to right, #C06A22, #8B4513);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-sub {
  font-size: 1.15rem;
  color: #5A3A22;
  line-height: 1.7;
  margin: 0;
}

/* ── CTA buttons ─────────────────────────────────────────────────── */
.hero-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn-primary, .btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.9rem 1.8rem;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 12px;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  cursor: pointer;
  font-family: inherit;
}

.btn-primary {
  background: #C06A22;
  color: #fff;
  box-shadow: 0 4px 0 #8B4513;
}
.btn-primary:hover {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #8B4513;
  color: #fff;
}

.btn-secondary {
  background: #F3E6D3;
  color: #8B4513;
  border: 2px solid #8B4513;
  box-shadow: 0 4px 0 #8B4513;
}
.btn-secondary:hover {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #8B4513;
  color: #8B4513;
}

/* ── Steps card ──────────────────────────────────────────────────── */
.steps-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.6);
  padding: 1.75rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.step-num {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: #C06A22;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: inset 0 -2px 4px rgba(0,0,0,0.15);
}

.step-title {
  font-size: 1rem;
  font-weight: 700;
  color: #3E2A1B;
  margin: 0 0 0.4rem;
}

.step-desc {
  font-size: 0.875rem;
  color: #5A3A22;
  margin: 0;
  line-height: 1.5;
}

.step-categories {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.cat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #5A3A22;
}

.step-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.step-sm {
  align-items: flex-start;
}

/* ── 3D Box scene ────────────────────────────────────────────────── */
.box-scene {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 600px;
  perspective: 1200px;
  user-select: none;
  cursor: pointer;
}

.box-3d {
  position: relative;
  width: 256px;
  height: 256px;
  transform-style: preserve-3d;
  transition: transform 0.05s ease; /* very short — springX/Y do the smoothing */
}

.box-shadow {
  position: absolute;
  bottom: -128px;
  left: 50%;
  transform: translateX(-50%);
  width: 256px;
  height: 80px;
  background: rgba(0,0,0,0.18);
  filter: blur(24px);
  border-radius: 50%;
  pointer-events: none;
}

/* ── Box faces ───────────────────────────────────────────────────── */
.face {
  position: absolute;
  inset: 0;
  border-radius: 10px;
  border: 2px solid #703808;
  backface-visibility: hidden;
}

.face-back {
  background: #A05515;
  transform: rotateY(180deg) translateZ(128px);
}
.face-right {
  background: #B05E18;
  transform: rotateY(90deg) translateZ(128px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.face-left {
  background: #B05E18;
  transform: rotateY(-90deg) translateZ(128px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.face-inner-dash {
  width: 80%;
  height: 80%;
  border: 2px dashed rgba(112, 56, 8, 0.3);
  border-radius: 6px;
}
.face-bottom {
  background: #8B4513;
  transform: rotateX(-90deg) translateZ(128px);
  border-color: transparent;
}
.face-front {
  background: #C06A22;
  transform: translateZ(128px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
}

.front-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 1rem;
  width: 100%;
  height: 100%;
}

.front-icon {
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.front-label {
  font-size: 1.5rem;
  font-weight: 900;
  color: #3E2A1B;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  line-height: 1.2;
  text-shadow: 0 1px 0 rgba(255,255,255,0.3);
}

.front-badge {
  font-size: 0.65rem;
  font-weight: 700;
  color: #3E2A1B;
  background: rgba(62,42,27,0.1);
  border: 1px solid rgba(62,42,27,0.2);
  padding: 2px 10px;
  border-radius: 999px;
  letter-spacing: 0.12em;
}

/* ── Lid ─────────────────────────────────────────────────────────── */
.face-lid {
  background: #D48C44;
  border-color: #A06020;
  transform-origin: top center;
  transform-style: preserve-3d;
  transition: transform 0.15s ease;
}

.lid-inner {
  position: absolute;
  inset: 6px;
  border: 2px dashed rgba(160, 96, 32, 0.35);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lid-circle {
  width: 56px;
  height: 56px;
  background: rgba(160,96,32,0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Floating items inside the box ──────────────────────────────── */
.floaters {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transform-style: preserve-3d;
}

.floater {
  position: absolute;
  opacity: 0;
  transform: scale(0.4) translateY(0);
  transition: transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.25));
}

/* Each floater pops out to a different position */
.floater-out-center { opacity: 1; transform: scale(1.2) translateY(-180px) rotate(15deg); }
.floater-out-left   { opacity: 1; transform: scale(1)   translate(-90px, -140px) rotate(-25deg); transition-delay: 0.1s; }
.floater-out-right  { opacity: 1; transform: scale(1)   translate(90px, -140px)  rotate(25deg);  transition-delay: 0.2s; }

/* Glow */
.magic-glow {
  position: absolute;
  width: 256px;
  height: 256px;
  background: radial-gradient(circle, #facc15 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transform: scale(0.5);
  mix-blend-mode: screen;
  pointer-events: none;
  transition: opacity 0.5s ease, transform 0.5s ease;
  filter: blur(30px);
}

.glow-on {
  opacity: 0.55;
  transform: scale(1.5);
}

/* ── Hover prompt ────────────────────────────────────────────────── */
.box-prompt {
  margin-top: 8rem;
  color: #5A3A22;
  font-weight: 700;
  font-size: 1rem;
  padding: 0.5rem 1.5rem;
  background: rgba(255,255,255,0.45);
  backdrop-filter: blur(8px);
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.55);
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  gap: 8px;
  animation: promptFadeIn 1s ease 2s both;
  pointer-events: none;
}

.prompt-spark {
  color: #C06A22;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

@keyframes promptFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>