<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentStep = ref(0)
const answers = ref([])
const selected = ref(null)

const questions = [
  {
    question: "What kind of activities do you enjoy most?",
    options: [
      { label: "Making things with my hands", icon: "✂️" },
      { label: "Learning how things work", icon: "🔬" },
      { label: "Cooking & exploring new flavours", icon: "🍳" },
      { label: "Growing & nurturing living things", icon: "🌱" },
    ]
  },
  {
    question: "How do you prefer to spend a free afternoon?",
    options: [
      { label: "Creating something I can show off", icon: "🎨" },
      { label: "Doing experiments or solving problems", icon: "🧪" },
      { label: "Trying a new recipe or cuisine", icon: "🌍" },
      { label: "Being outdoors or tending to plants", icon: "🪴" },
    ]
  },
  {
    question: "Which of these best describes you?",
    options: [
      { label: "I'm artistic and love DIY projects", icon: "🧶" },
      { label: "I'm curious and love discovery", icon: "🔭" },
      { label: "I love culture and food adventures", icon: "🫙" },
      { label: "I care about sustainability & nature", icon: "🌿" },
    ]
  },
  {
    question: "What kind of gift box excites you most?",
    options: [
      { label: "A craft kit with step-by-step guides", icon: "📦" },
      { label: "A science experiment kit", icon: "⚗️" },
      { label: "Exotic spices from around the world", icon: "🌶️" },
      { label: "Seeds, soil & gardening supplies", icon: "🌻" },
    ]
  },
]

const progress = computed(() => ((currentStep.value) / questions.length) * 100)

function selectOption(index) {
  selected.value = index
}

function next() {
  if (selected.value === null) return
  answers.value.push(selected.value)
  selected.value = null

  if (currentStep.value < questions.length - 1) {
    currentStep.value++
  } else {
    // All questions answered — go to reveal
    router.push({ name: 'box-reveal' })
  }
}
</script>

<template>
  <div class="prefs-root">
    <div class="bg-gradient" />

    <!-- Floating hobby icons -->
    <div class="bg-icons">
      <span class="float-icon" style="left:8%;top:10%;--d:0s;--dur:7s">✂️</span>
      <span class="float-icon" style="left:80%;top:15%;--d:1.5s;--dur:6s">🌱</span>
      <span class="float-icon" style="left:20%;top:80%;--d:3s;--dur:8s">🔬</span>
      <span class="float-icon" style="left:88%;top:65%;--d:0.5s;--dur:5s">🍳</span>
      <span class="float-icon" style="left:50%;top:5%;--d:2s;--dur:9s">🎨</span>
      <span class="float-icon" style="left:5%;top:55%;--d:4s;--dur:6s">🧶</span>
      <span class="float-icon" style="left:65%;top:85%;--d:1s;--dur:7s">🌻</span>
    </div>

    <div class="card">
      <!-- Header -->
      <div class="card-header">
        <div class="icon-badge">🎁</div>
        <h1 class="card-title">Find Your Perfect Box</h1>
        <p class="card-subtitle">Answer a few quick questions so we can match you to your ideal hobby kit</p>
      </div>

      <!-- Progress bar -->
      <div class="progress-wrap">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progress + '%' }" />
        </div>
        <span class="progress-label">{{ currentStep + 1 }} of {{ questions.length }}</span>
      </div>

      <!-- Question -->
      <div class="question-area">
        <Transition name="slide" mode="out-in">
          <div :key="currentStep" class="question-block">
            <p class="question-text">{{ questions[currentStep].question }}</p>

            <div class="options-grid">
              <button
                v-for="(opt, i) in questions[currentStep].options"
                :key="i"
                class="option-btn"
                :class="{ selected: selected === i }"
                @click="selectOption(i)"
              >
                <span class="opt-icon">{{ opt.icon }}</span>
                <span class="opt-label">{{ opt.label }}</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Next button -->
      <button
        class="next-btn"
        :disabled="selected === null"
        @click="next"
      >
        {{ currentStep < questions.length - 1 ? 'Next →' : 'Show My Box 🎁' }}
      </button>

      <div class="bottom-tape" />
    </div>
  </div>
</template>

<style scoped>
.prefs-root {
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

.bg-icons {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.float-icon {
  position: absolute;
  font-size: 2rem;
  opacity: 0.18;
  animation: floatUp var(--dur, 6s) ease-in-out infinite;
  animation-delay: var(--d, 0s);
}

@keyframes floatUp {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-22px) rotate(8deg); }
}

.card {
  position: relative;
  z-index: 10;
  width: min(520px, 96vw);
  background: #e6be8a;
  border: 2px solid #a67c52;
  border-radius: 12px;
  box-shadow: 0 25px 50px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3);
  overflow: hidden;
}

.card-header {
  text-align: center;
  padding: 2rem 2rem 1rem;
  background: #d4a373;
  border-bottom: 2px solid #a67c52;
}

.icon-badge {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.card-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #603813;
  letter-spacing: 0.06em;
  margin: 0 0 0.35rem;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #7f5539;
  margin: 0;
  line-height: 1.5;
}

.progress-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem 0;
}

.progress-track {
  flex: 1;
  height: 8px;
  background: rgba(166, 124, 82, 0.25);
  border-radius: 99px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #bc6c25;
  border-radius: 99px;
  transition: width 0.4s ease;
}

.progress-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #7f5539;
  white-space: nowrap;
}

.question-area {
  padding: 1.5rem 2rem 0.5rem;
  min-height: 280px;
}

.question-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #603813;
  margin: 0 0 1.25rem;
  text-align: center;
  line-height: 1.5;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

@media (max-width: 420px) {
  .options-grid {
    grid-template-columns: 1fr;
  }
}

.option-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.75rem;
  background: #fefae0;
  border: 2px solid #d4a373;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.option-btn:hover {
  border-color: #bc6c25;
  background: #fff8e7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(188, 108, 37, 0.2);
}

.option-btn.selected {
  border-color: #bc6c25;
  background: #fff3d0;
  box-shadow: 0 0 0 3px rgba(188, 108, 37, 0.2);
  transform: translateY(-2px);
}

.opt-icon {
  font-size: 1.75rem;
}

.opt-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #603813;
  line-height: 1.3;
}

.next-btn {
  display: block;
  width: calc(100% - 4rem);
  margin: 1.25rem 2rem;
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
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s, opacity 0.2s;
}

.next-btn:hover:not(:disabled) {
  background: #a45a1c;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(188, 108, 37, 0.5);
}

.next-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.bottom-tape {
  height: 8px;
  background: #b08968;
  opacity: 0.5;
}

/* Slide transition between questions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>