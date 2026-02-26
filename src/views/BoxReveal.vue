<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const recommendedBox = {
  name: 'The Watercolorist Box',
  category: 'Arts & DIY',
  description: 'A curated watercolor kit including paints, brushes, and premium paper for creative exploration.',
  price: 'R549.00',
}

const phase = ref(0)
const showSparkles = ref(false)
const showCard = ref(false)

onMounted(() => {
  setTimeout(() => { phase.value = 1 }, 800)
  setTimeout(() => { phase.value = 2; showSparkles.value = true }, 2200)
  setTimeout(() => { showCard.value = true }, 3000)
})

function goToProducts() {
  router.push({ path: '/products', query: { welcome: 'new' } })
}
</script>

<template>
  <div class="reveal-root">
    <div class="bg-gradient" />

    <div class="bg-icons" v-if="showSparkles">
      <span v-for="n in 12" :key="n" class="confetti-dot"
        :style="`--x:${Math.random()*90+5}%;--d:${n*0.12}s;--hue:${n*30}`" />
    </div>

    <div class="scene">

      <Transition name="fade">
        <p v-if="phase < 2" class="teaser-text">
          {{ phase === 0 ? "We've been busy packing just for you..." : 'Something special is inside...' }}
        </p>
        <p v-else-if="!showCard" class="teaser-text reveal-text">
          We found it!
        </p>
      </Transition>

      <div class="box-wrap" :class="`phase-${phase}`">
        <div class="box-lid" :class="{ open: phase >= 2 }">
          <div class="lid-ribbon" />
          <div class="lid-texture" />
        </div>

        <div class="sparkle-burst" v-if="showSparkles">
          <div v-for="n in 8" :key="n" class="sparkle" :style="`--angle:${n*45}deg`" />
        </div>

        <div class="box-body">
          <div class="box-ribbon-v" />
          <div class="box-ribbon-h" />
          <div class="box-texture" />
          <Transition name="pop">
            <div v-if="phase >= 2" class="box-icon">
              <!-- Bootstrap Icon: brush -->
              <svg width="48" height="48" viewBox="0 0 16 16" fill="#fefae0">
                <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.1 6.1 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.1 8.1 0 0 1-3.078.132 4 4 0 0 1-.562-.135 1.4 1.4 0 0 1-.466-.247.7.7 0 0 1-.204-.288.62.62 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896q.19.012.37.048c.09-.367.15-.717.188-.958.115-.718.242-1.133.462-1.519a6 6 0 0 1 .957-1.216C11.07 4.74 15.818 1.424 15.825.12"/>
              </svg>
            </div>
          </Transition>
        </div>

        <div class="box-shadow" />
      </div>

      <Transition name="rise">
        <div v-if="showCard" class="reveal-card">
          <div class="reveal-card-inner">
            <div class="match-icon">
              <svg width="28" height="28" viewBox="0 0 16 16" fill="#bc6c25">
                <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
              </svg>
            </div>
            <p class="match-label">We have the perfect box just for you!</p>

            <div class="product-icon-wrap">
              <svg width="52" height="52" viewBox="0 0 16 16" fill="#bc6c25">
                <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.5 10 9.5c-.943 0-4 1.09-4 2.5s3 2.5 4 2.5c.667 0 1.5-.25 1.5-1s-.5-1-1-1-1 .5-1 1c0 .333.167.5.5.5.29 0 .5.21.5.5S10.29 15 10 15c-1 0-4-1.09-4-2.5C6 11.09 9 10 10 10c.535 0 1.508.263 2.433.535C14.866 11.085 16 10.585 16 8A8 8 0 1 0 .11 9.672c.01.065.02.13.032.194C.44 11.61 2 12.5 2 12.5c.667 0 1-.333 1-1s-.333-1-1-1c-.6 0-1 .4-1 1 0 .25.1.469.266.625A7 7 0 0 1 16 8"/>
              </svg>
            </div>

            <h2 class="product-name">{{ recommendedBox.name }}</h2>
            <span class="product-category">{{ recommendedBox.category }}</span>
            <p class="product-desc">{{ recommendedBox.description }}</p>
            <div class="product-price">{{ recommendedBox.price }}</div>

            <button class="cta-btn" @click="goToProducts">
              Explore All Products
              <!-- Bootstrap Icon: arrow-right -->
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" style="margin-left:6px">
                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
              </svg>
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
  color: #3d2b1f;
}

.bg-gradient {
  position: fixed;
  inset: 0;
  background: linear-gradient(160deg, #f7f3ea 0%, #e8dcc7 60%, #d9c9a8 100%);
  z-index: 0;
}

.bg-icons {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.confetti-dot {
  position: absolute;
  left: var(--x);
  top: -8px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: hsl(var(--hue), 70%, 55%);
  animation: confettiFall var(--dur, 1.5s) ease-in forwards;
  animation-delay: var(--d, 0s);
  opacity: 0;
}

@keyframes confettiFall {
  0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg) scale(0.5); opacity: 0; }
}

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

.box-wrap {
  position: relative;
  width: 160px;
  height: 160px;
  transition: transform 0.3s ease;
}

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

.box-wrap.phase-2, .box-wrap.phase-3 {
  animation: boxBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes boxBounce {
  0%   { transform: translateY(0); }
  40%  { transform: translateY(-18px); }
  100% { transform: translateY(0); }
}

.box-lid {
  position: absolute;
  top: -18px;
  left: 0; right: 0;
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
  left: 50%; top: 0; bottom: 0;
  width: 18px;
  transform: translateX(-50%);
  background: #ffd700;
  opacity: 0.9;
}

.lid-texture {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.04) 16px);
}

.box-body {
  position: absolute;
  top: 24px; left: 0; right: 0; bottom: 0;
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
  left: 50%; top: 0; bottom: 0;
  width: 18px;
  transform: translateX(-50%);
  background: #ffd700;
  opacity: 0.9;
  z-index: 1;
}

.box-ribbon-h {
  position: absolute;
  top: 50%; left: 0; right: 0;
  height: 18px;
  transform: translateY(-50%);
  background: #ffd700;
  opacity: 0.9;
  z-index: 1;
}

.box-texture {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.04) 16px);
}

.box-icon {
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}

.box-shadow {
  position: absolute;
  bottom: -14px; left: 12px; right: 12px;
  height: 12px;
  background: rgba(0,0,0,0.2);
  filter: blur(10px);
  border-radius: 50%;
}

.sparkle-burst {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 5;
}

.sparkle {
  position: absolute;
  width: 6px; height: 6px;
  background: #ffd700;
  border-radius: 50%;
  transform: rotate(var(--angle)) translateX(0);
  animation: sparkleOut 0.6s ease-out forwards;
}

@keyframes sparkleOut {
  0%   { transform: rotate(var(--angle)) translateX(0); opacity: 1; }
  100% { transform: rotate(var(--angle)) translateX(80px); opacity: 0; }
}

.reveal-card { width: 100%; }

.reveal-card-inner {
  background: #fefae0;
  border: 2px solid #a67c52;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 16px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6);
}

.match-icon {
  margin-bottom: 0.5rem;
}

.match-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #bc6c25;
  letter-spacing: 0.04em;
  margin: 0 0 1rem;
  text-transform: uppercase;
}

.product-icon-wrap {
  margin-bottom: 0.75rem;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.pop-enter-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-enter-from { opacity: 0; transform: scale(0.3) translateY(20px); }

.rise-enter-active { transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
.rise-enter-from { opacity: 0; transform: translateY(40px); }
</style>