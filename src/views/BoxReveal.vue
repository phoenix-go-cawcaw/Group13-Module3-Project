<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Hardcoded recommendation — The Watercolorist Box
const recommendedBox = {
  name: 'The Watercolorist Box',
  category: 'Arts & DIY',
  description: 'A curated watercolor kit including paints, brushes, and premium paper for creative exploration.',
  price: 'R549.00',
  emoji: '🎨',
}

// Animation phases:
// 0 = box sitting still
// 1 = box shaking
// 2 = lid flies open + sparkles
// 3 = product card revealed
const phase = ref(0)
const showSparkles = ref(false)
const showCard = ref(false)

onMounted(() => {
  // Phase 1: shake after a short pause
  setTimeout(() => { phase.value = 1 }, 800)
  // Phase 2: open
  setTimeout(() => {
    phase.value = 2
    showSparkles.value = true
  }, 2200)
  // Phase 3: show card
  setTimeout(() => {
    showCard.value = true
  }, 3000)
})

function goToProducts() {
  router.push({ path: '/products' })
}
</script>

<template>
  <div class="reveal-root">
    <div class="bg-gradient" />

    <!-- Floating confetti-style icons -->
    <div class="bg-icons" v-if="showSparkles">
      <span v-for="(s, i) in ['🎨','✨','🌟','🎉','🖌️','⭐','💫','🎊','✂️','🌈']"
        :key="i" class="confetti" :style="`--x:${Math.random()*90+5}%;--d:${i*0.15}s;--dur:${1.5+i*0.1}s`">
        {{ s }}
      </span>
    </div>

    <div class="scene">

      <!-- Message above box -->
      <Transition name="fade">
        <p v-if="phase < 2" class="teaser-text">
          {{ phase === 0 ? 'We\'ve been busy packing just for you...' : 'Something special is inside...' }}
        </p>
        <p v-else-if="!showCard" class="teaser-text reveal-text">
          We found it! 🎉
        </p>
      </Transition>

      <!-- The Gift Box -->
      <div class="box-wrap" :class="`phase-${phase}`">

        <!-- Lid -->
        <div class="box-lid" :class="{ open: phase >= 2 }">
          <div class="lid-ribbon" />
          <div class="lid-texture" />
        </div>

        <!-- Sparkle burst when opening -->
        <div class="sparkle-burst" v-if="showSparkles">
          <div v-for="n in 8" :key="n" class="sparkle" :style="`--angle:${n*45}deg`" />
        </div>

        <!-- Box body -->
        <div class="box-body">
          <div class="box-ribbon-v" />
          <div class="box-ribbon-h" />
          <div class="box-texture" />
          <!-- Emoji floats out when opened -->
          <Transition name="pop">
            <div v-if="phase >= 2" class="box-emoji">{{ recommendedBox.emoji }}</div>
          </Transition>
        </div>

        <!-- Shadow -->
        <div class="box-shadow" />
      </div>

      <!-- Reveal card -->
      <Transition name="rise">
        <div v-if="showCard" class="reveal-card">
          <div class="reveal-card-inner">
            <p class="match-label">✨ We have the perfect box just for you! ✨</p>
            <div class="product-emoji">{{ recommendedBox.emoji }}</div>
            <h2 class="product-name">{{ recommendedBox.name }}</h2>
            <span class="product-category">{{ recommendedBox.category }}</span>
            <p class="product-desc">{{ recommendedBox.description }}</p>
            <div class="product-price">{{ recommendedBox.price }}</div>

            <button class="cta-btn" @click="goToProducts">
              Explore All Products →
            </button>
          </div>
        </div>
      </Transition>

    </div>
  </div>
</template>

<style scoped>
.reveal-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;
  font-family: 'Georgia', serif;
  color: #3d2b1f;
}

.bg-gradient {
  position: fixed;
  inset: 0;
  background: linear-gradient(160deg, #f7f3ea 0%, #e8dcc7 60%, #d9c9a8 100%);
  z-index: 0;
}

/* Confetti burst */
.bg-icons {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.confetti {
  position: absolute;
  left: var(--x);
  top: -2rem;
  font-size: 1.5rem;
  animation: confettiFall var(--dur, 1.5s) ease-in forwards;
  animation-delay: var(--d, 0s);
  opacity: 0;
}

@keyframes confettiFall {
  0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}

/* Scene */
.scene {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: min(500px, 96vw);
}

.teaser-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #7f5539;
  text-align: center;
  margin: 0;
  min-height: 1.6rem;
}

.reveal-text {
  color: #bc6c25;
  font-size: 1.3rem;
}

/* ---- BOX ---- */
.box-wrap {
  position: relative;
  width: 160px;
  height: 160px;
  transition: transform 0.3s ease;
}

/* Shake phase */
.box-wrap.phase-1 {
  animation: boxShake 0.35s ease-in-out infinite;
}

@keyframes boxShake {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  20%       { transform: translateX(-8px) rotate(-2deg); }
  40%       { transform: translateX(8px) rotate(2deg); }
  60%       { transform: translateX(-5px) rotate(-1deg); }
  80%       { transform: translateX(5px) rotate(1deg); }
}

/* Open phase — slight bounce up */
.box-wrap.phase-2,
.box-wrap.phase-3 {
  animation: boxBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes boxBounce {
  0%   { transform: translateY(0); }
  40%  { transform: translateY(-18px); }
  100% { transform: translateY(0); }
}

/* Lid */
.box-lid {
  position: absolute;
  top: -18px;
  left: 0;
  right: 0;
  height: 42px;
  background: #c1440e;
  border: 2px solid #8b2e08;
  border-radius: 6px 6px 0 0;
  transform-origin: bottom center;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 3;
  overflow: hidden;
}

.box-lid.open {
  transform: rotateX(-110deg) translateY(-10px);
}

.lid-ribbon {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 18px;
  transform: translateX(-50%);
  background: #ffd700;
  opacity: 0.9;
}

.lid-texture {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    45deg, transparent, transparent 8px,
    rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.04) 16px
  );
}

/* Box body */
.box-body {
  position: absolute;
  top: 24px;
  left: 0;
  right: 0;
  bottom: 0;
  background: #c1440e;
  border: 2px solid #8b2e08;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.box-ribbon-v {
  position: absolute;
  left: 50%;
  top: 0; bottom: 0;
  width: 18px;
  transform: translateX(-50%);
  background: #ffd700;
  opacity: 0.9;
  z-index: 1;
}

.box-ribbon-h {
  position: absolute;
  top: 50%;
  left: 0; right: 0;
  height: 18px;
  transform: translateY(-50%);
  background: #ffd700;
  opacity: 0.9;
  z-index: 1;
}

.box-texture {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    45deg, transparent, transparent 8px,
    rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.04) 16px
  );
}

.box-emoji {
  position: relative;
  z-index: 2;
  font-size: 2.5rem;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}

/* Shadow under box */
.box-shadow {
  position: absolute;
  bottom: -14px;
  left: 12px;
  right: 12px;
  height: 12px;
  background: rgba(0,0,0,0.2);
  filter: blur(10px);
  border-radius: 50%;
}

/* Sparkle burst */
.sparkle-burst {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 5;
}

.sparkle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #ffd700;
  border-radius: 50%;
  transform: rotate(var(--angle)) translateX(0);
  animation: sparkleOut 0.6s ease-out forwards;
}

@keyframes sparkleOut {
  0%   { transform: rotate(var(--angle)) translateX(0); opacity: 1; }
  100% { transform: rotate(var(--angle)) translateX(80px); opacity: 0; }
}

/* ---- REVEAL CARD ---- */
.reveal-card {
  width: 100%;
}

.reveal-card-inner {
  background: #fefae0;
  border: 2px solid #a67c52;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 16px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6);
}

.match-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #bc6c25;
  letter-spacing: 0.04em;
  margin: 0 0 1rem;
  text-transform: uppercase;
}

.product-emoji {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.product-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #603813;
  margin: 0 0 0.4rem;
}

.product-category {
  display: inline-block;
  background: rgba(188, 108, 37, 0.12);
  color: #bc6c25;
  border: 1px solid rgba(188, 108, 37, 0.3);
  border-radius: 99px;
  padding: 2px 12px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 0.85rem;
}

.product-desc {
  font-size: 0.9rem;
  color: #7f5539;
  line-height: 1.6;
  margin: 0 0 1rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #bc6c25;
  margin-bottom: 1.25rem;
}

.cta-btn {
  width: 100%;
  padding: 0.875rem;
  background: #bc6c25;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  letter-spacing: 0.04em;
  box-shadow: 0 4px 14px rgba(188, 108, 37, 0.4);
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
}

.cta-btn:hover {
  background: #a45a1c;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(188, 108, 37, 0.5);
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.pop-enter-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-enter-from { opacity: 0; transform: scale(0.3) translateY(20px); }

.rise-enter-active { transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
.rise-enter-from { opacity: 0; transform: translateY(40px); }
</style>