<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const heroText = ref(null)
const heroImg = ref(null)
const missionCard = ref(null)
const whyTitle = ref(null)
const featureRefs = ref([])
const catTitle = ref(null)
const catRefs = ref([])
const footerLogo = ref(null)

function observe(el, cls = 'visible') {
  if (!el) return
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { el.classList.add(cls); io.disconnect() }
  }, { threshold: 0.15 })
  io.observe(el)
}

onMounted(() => {
  observe(heroText.value)
  observe(heroImg.value, 'visible-right')
  observe(missionCard.value)
  observe(whyTitle.value)
  featureRefs.value.forEach((el, i) => {
    if (!el) return
    el.style.transitionDelay = (i * 0.12) + 's'
    observe(el)
  })
  observe(catTitle.value)
  catRefs.value.forEach((el, i) => {
    if (!el) return
    el.style.transitionDelay = (i * 0.12 + 0.1) + 's'
    observe(el)
  })
  observe(footerLogo.value)
})

const categories = [
  {
    title: 'Arts & DIY',
    subtitle: 'The Watercolorist & The Maker\'s Studio',
    img: 'https://images.unsplash.com/photo-1616169158811-6144c62622f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    icon: 'palette',
  },
  {
    title: 'Green Living',
    subtitle: 'Gardening & Eco-friendly Kits',
    img: 'https://images.unsplash.com/photo-1748092278708-3a3b77f8d52b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    icon: 'leaf',
  },
  {
    title: 'STEM Explorer',
    subtitle: 'Hands-on Experiments',
    img: 'https://images.unsplash.com/photo-1758685734153-132c8620c1bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    icon: 'flask',
  },
  {
    title: 'Culinary Discovery',
    subtitle: 'Spices & Recipes from Around the World',
    img: 'https://images.unsplash.com/photo-1745793434534-77eafc1bbe99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    icon: 'utensils',
  },
]

const features = [
  { icon: 'package', title: 'Expertly Curated', desc: 'Each box is designed by hobby enthusiasts.' },
  { icon: 'refresh', title: 'Flexible Options', desc: 'Monthly subscriptions or one-time purchases.' },
  { icon: 'grad', title: 'Educational & Fun', desc: 'Perfect for kids, adults, and lifelong learners.' },
  { icon: 'heart', title: 'Sustainable', desc: 'We use eco-friendly materials whenever possible.' },
]
</script>

<template>
  <main class="about-root">

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

    <section class="section hero-section">
      <div class="hero-grid">

        <div ref="heroText" class="hero-text anim-fade-left">
          <h1 class="hero-title">
            Discover.<br />Create.<br />
            <span class="hero-accent">Explore.</span>
          </h1>
          <p class="hero-sub">
            <strong>Hobby in a Box</strong> delivers curated hobby experiences every month, so you can explore your
            passions, learn new skills, and have fun from home.
          </p>
          <RouterLink to="/products" class="btn-primary">
            Get Your Box
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </RouterLink>
        </div>

        <div ref="heroImg" class="hero-img-wrap anim-fade-right">
          <div class="hero-img-card">
            <img
              src="https://images.unsplash.com/photo-1630609079767-c7fd7176fbe8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900"
              alt="Creative hobby workspace" class="hero-img" />
          </div>
        </div>

      </div>
    </section>

    <section class="section">
      <div ref="missionCard" class="mission-card anim-fade-up">
        <h2 class="section-title">Our Mission</h2>
        <p class="mission-body">
          At Hobby in a Box, our mission is to make hobbies accessible, fun, and educational for everyone.
          We believe that trying new things sparks creativity, builds skills, and brings joy. Whether it's
          painting, gardening, cooking, or exploring STEM — we make it easy to get started every month.
        </p>
      </div>
    </section>

    <section class="section why-section">
      <div class="inner-wide">
        <h2 ref="whyTitle" class="section-title anim-fade-up">Why Choose Hobby in a Box</h2>

        <div class="features-grid">
          <div v-for="(f, i) in features" :key="f.title" :ref="el => featureRefs[i] = el"
            class="feature-card anim-fade-up">
            <div class="feat-icon-wrap">
              <svg v-if="f.icon === 'package'" width="40" height="40" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>

              <svg v-else-if="f.icon === 'refresh'" width="40" height="40" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>

              <svg v-else-if="f.icon === 'grad'" width="40" height="40" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>

              <svg v-else-if="f.icon === 'heart'" width="40" height="40" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </div>
            <h3 class="feat-title">{{ f.title }}</h3>
            <p class="feat-desc">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="inner-wide">
        <h2 ref="catTitle" class="section-title anim-fade-up">Our Categories</h2>

        <div class="categories-grid">
          <div v-for="(cat, i) in categories" :key="cat.title" :ref="el => catRefs[i] = el"
            class="cat-card anim-fade-up">
            <img :src="cat.img" :alt="cat.title" class="cat-img" />
            <div class="cat-overlay" />
            <div class="cat-content">
              <div class="cat-icon">
                <!-- Palette -->
                <svg v-if="cat.icon === 'palette'" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5">
                  <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                  <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                  <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                  <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                  <path
                    d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                </svg>
                <!-- Leaf -->
                <svg v-else-if="cat.icon === 'leaf'" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 20A7 7 0 014 13V6a1 1 0 011-1h6a7 7 0 017 7v1a7 7 0 01-7 7z" />
                  <path d="M11 20v-7M4 7l7 6" />
                </svg>
                <!-- Flask -->
                <svg v-else-if="cat.icon === 'flask'" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10 2v7.31l-5.48 8.38A1 1 0 005.4 19h13.2a1 1 0 00.88-1.31L14 9.31V2" />
                  <line x1="8.5" y1="2" x2="15.5" y2="2" />
                </svg>
                <!-- Utensils -->
                <svg v-else-if="cat.icon === 'utensils'" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
                  <path d="M7 2v20" />
                  <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
                </svg>
              </div>
              <h3 class="cat-title">{{ cat.title }}</h3>
              <p class="cat-subtitle">{{ cat.subtitle }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section footer-section">
      <div ref="footerLogo" class="footer-logo anim-scale-up">
        <div class="logo-circle">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F3E6D3" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path
              d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>
        <h2 class="footer-brand">Hobby in a Box</h2>
        <p class="footer-copy">© 2026 Hobby in a Box. All rights reserved.</p>
      </div>
    </section>

  </main>
</template>

<style scoped>
.about-root {
  min-height: 100vh;
  position: relative;
  color: #3E2A1B;
  overflow-x: hidden;
}

.bg-wash {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #F3E6D3 0%, #E2C49A 45%, #D1A877 100%);
  z-index: 0;
}

.bg-grain {
  position: fixed;
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

.section {
  position: relative;
  z-index: 10;
  padding: 5rem 1.5rem;
}

.inner-wide {
  max-width: 1100px;
  margin: 0 auto;
}

.anim-fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.anim-fade-left {
  opacity: 0;
  transform: translateX(-40px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.anim-fade-right {
  opacity: 0;
  transform: translateX(50px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.anim-scale-up {
  opacity: 0;
  transform: scale(0.85);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(.34, 1.56, .64, 1);
}

.anim-fade-up.visible,
.anim-fade-left.visible,
.anim-scale-up.visible {
  opacity: 1;
  transform: none;
}

.anim-fade-right.visible-right {
  opacity: 1;
  transform: none;
}

.hero-section {
  padding-top: 6rem;
  padding-bottom: 4rem;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  max-width: 1100px;
  margin: 0 auto;
  align-items: center;
}

@media (min-width: 900px) {
  .hero-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.hero-title {
  font-size: clamp(2.6rem, 6vw, 4.4rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: #5A3A22;
  margin: 0 0 1.2rem;
}

.hero-accent {
  background: linear-gradient(to right, #C06A22, #A95A1C);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-sub {
  font-size: 1.15rem;
  color: #5A3A22;
  line-height: 1.75;
  margin: 0 0 2rem;
}

.btn-primary {
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
  background: #C06A22;
  color: #F3E6D3;
  border: 2px solid #A95A1C;
  box-shadow: 0 6px 0 #A95A1C;
  transition: transform .15s ease, box-shadow .15s ease;
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

.hero-img-wrap {
  display: flex;
  justify-content: center;
}

.hero-img-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(62, 42, 27, .22);
  transform: rotate(2deg);
  transition: transform 0.5s ease;
}

.hero-img-card:hover {
  transform: rotate(0deg);
}

.hero-img {
  width: 100%;
  height: auto;
  display: block;
  max-height: 440px;
  object-fit: cover;
}

.mission-card {
  max-width: 860px;
  margin: 0 auto;
  background: rgba(243, 230, 211, .70);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1.5px solid rgba(255, 255, 255, .55);
  border-radius: 28px;
  padding: 3rem 3.5rem;
  box-shadow: 0 12px 32px rgba(62, 42, 27, .09);
  text-align: center;
}

.mission-body {
  font-size: 1.15rem;
  line-height: 1.8;
  color: #3E2A1B;
  margin: 0;
}

.section-title {
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 800;
  color: #5A3A22;
  text-align: center;
  margin: 0 0 3.5rem;
  letter-spacing: -0.02em;
}

.why-section {
  background: rgba(226, 196, 154, .45);
  backdrop-filter: blur(6px);
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 600px) {
  .features-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1000px) {
  .features-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.feature-card {
  background: rgba(243, 230, 211, .80);
  backdrop-filter: blur(12px);
  border: 1.5px solid rgba(255, 255, 255, .55);
  border-radius: 20px;
  padding: 2.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 8px 24px rgba(62, 42, 27, .09);
  transition: box-shadow 0.3s ease, transform 0.3s ease,
    opacity 0.6s ease, transform 0.6s ease;
}

.feature-card:hover {
  box-shadow: 0 16px 40px rgba(62, 42, 27, .16);
  transform: translateY(-4px);
}

.feat-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255, 255, 255, .5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #C06A22;
  margin-bottom: 1.2rem;
}

.feat-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #3E2A1B;
  margin: 0 0 .5rem;
}

.feat-desc {
  font-size: .88rem;
  color: #5A3A22;
  line-height: 1.55;
  margin: 0;
}

.categories-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 700px) {
  .categories-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.cat-card {
  position: relative;
  height: 300px;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 12px 32px rgba(62, 42, 27, .18);
  transition: transform 0.35s ease, box-shadow 0.35s ease,
    opacity 0.6s ease;
}

.cat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 48px rgba(62, 42, 27, .25);
}

.cat-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.cat-card:hover .cat-img {
  transform: scale(1.08);
}

.cat-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(62, 42, 27, .88) 0%, rgba(62, 42, 27, .35) 55%, transparent 100%);
}

.cat-content {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 2rem;
  color: #F3E6D3;
}

.cat-icon {
  color: #E2C49A;
  margin-bottom: .5rem;
}

.cat-title {
  font-size: 1.55rem;
  font-weight: 800;
  margin: 0 0 .3rem;
}

.cat-subtitle {
  font-size: .9rem;
  color: #E2C49A;
  font-weight: 600;
  margin: 0;
}

.footer-section {
  padding: 4rem 1.5rem 5rem;
  text-align: center;
}

.footer-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.logo-circle {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: #C06A22;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(192, 106, 34, .4);
}

.footer-brand {
  font-size: 2.2rem;
  font-weight: 800;
  color: #5A3A22;
  letter-spacing: -0.02em;
  margin: 0;
}

.footer-copy {
  font-size: .85rem;
  color: #5A3A22;
  opacity: .6;
  margin: 0;
}
</style>