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
      { label: "Making things with my hands", icon: "scissors" },
      { label: "Learning how things work", icon: "search" },
      { label: "Cooking & exploring new flavours", icon: "egg-fried" },
      { label: "Growing & nurturing living things", icon: "flower1" },
    ]
  },
  {
    question: "How do you prefer to spend a free afternoon?",
    options: [
      { label: "Creating something I can show off", icon: "brush" },
      { label: "Doing experiments or solving problems", icon: "lightbulb" },
      { label: "Trying a new recipe or cuisine", icon: "globe" },
      { label: "Being outdoors or tending to plants", icon: "tree" },
    ]
  },
  {
    question: "Which of these best describes you?",
    options: [
      { label: "I'm artistic and love DIY projects", icon: "palette" },
      { label: "I'm curious and love discovery", icon: "telescope" },
      { label: "I love culture and food adventures", icon: "map" },
      { label: "I care about sustainability & nature", icon: "recycle" },
    ]
  },
  {
    question: "What kind of gift box excites you most?",
    options: [
      { label: "A craft kit with step-by-step guides", icon: "box-seam" },
      { label: "A science experiment kit", icon: "eyedropper" },
      { label: "Exotic spices from around the world", icon: "stars" },
      { label: "Seeds, soil & gardening supplies", icon: "flower3" },
    ]
  },
]

const iconPaths = {
  'scissors':   'M3.5 3.5a.5.5 0 0 0 0 1h1.443l7.942 8.925A4 4 0 1 0 14.9 12.21l-2.241-2.52 2.208-2.483a.5.5 0 0 0-.756-.654L12 9.197 8.099 4.793A4 4 0 1 0 3.5 3.5m6.618 5.559-1.205 1.355-2.16-2.43 1.205-1.354zm-5.97-4.31a3 3 0 1 1-1.716 3.53zm8.706 8.394a3 3 0 1 1-3.53 1.716z',
  'search':     'M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.099zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0',
  'egg-fried':  'M8 3a5 5 0 1 0 0 10A5 5 0 0 0 8 3M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m6.5-.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0',
  'flower1':    'M6.174 1.184a2 2 0 0 1 3.652 0A2 2 0 0 1 12.99 3.01a2 2 0 0 1 1.826 3.164 2 2 0 0 1 0 3.652 2 2 0 0 1-1.826 3.164 2 2 0 0 1-3.164 1.826 2 2 0 0 1-3.652 0A2 2 0 0 1 3.01 12.99a2 2 0 0 1-1.826-3.164 2 2 0 0 1 0-3.652A2 2 0 0 1 3.01 3.01a2 2 0 0 1 3.164-1.826M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8m0-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4',
  'brush':      'M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.1 6.1 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.1 8.1 0 0 1-3.078.132 4 4 0 0 1-.562-.135 1.4 1.4 0 0 1-.466-.247.7.7 0 0 1-.204-.288.62.62 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896q.19.012.37.048c.09-.367.15-.717.188-.958.115-.718.242-1.133.462-1.519a6 6 0 0 1 .957-1.216C11.07 4.74 15.818 1.424 15.825.12',
  'lightbulb':  'M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1',
  'globe':      'M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z',
  'tree':       'M8.416.223a.5.5 0 0 0-.832 0l-3 4.5A.5.5 0 0 0 5 5.5h.098L3.076 8.735A.5.5 0 0 0 3.5 9.5h.191l-1.638 3.276a.5.5 0 0 0 .447.724H7V16h2v-2.5h4.5a.5.5 0 0 0 .447-.724L12.31 9.5h.191a.5.5 0 0 0 .424-.765L10.902 5.5H11a.5.5 0 0 0 .416-.777z',
  'palette':    'M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.5 10 9.5c-.943 0-4 1.09-4 2.5s3 2.5 4 2.5c.667 0 1.5-.25 1.5-1s-.5-1-1-1-1 .5-1 1c0 .333.167.5.5.5.29 0 .5.21.5.5S10.29 15 10 15c-1 0-4-1.09-4-2.5C6 11.09 9 10 10 10c.535 0 1.508.263 2.433.535C14.866 11.085 16 10.585 16 8A8 8 0 1 0 .11 9.672c.01.065.02.13.032.194C.44 11.61 2 12.5 2 12.5c.667 0 1-.333 1-1s-.333-1-1-1c-.6 0-1 .4-1 1 0 .25.1.469.266.625A7 7 0 0 1 16 8',
  'telescope':  'M.42 9.563A.25.25 0 0 1 .38 9.5l5.9-5.9a.25.25 0 0 1 .354 0l1.75 1.75a.25.25 0 0 1 0 .354L3.48 10.6a.25.25 0 0 1-.354 0zm8.45-2.63L7.12 5.183l4.95-4.95a.5.5 0 0 1 .707 0l1.75 1.75a.5.5 0 0 1 0 .707zM4.646 11.354a.5.5 0 0 0 .708 0l6-6a.5.5 0 0 0-.708-.708l-6 6a.5.5 0 0 0 0 .708M7.5 13l-.5 3h3l-.5-3z',
  'map':        'M15.817.113A.5.5 0 0 1 16 .5v14a.5.5 0 0 1-.402.49l-5 1a.5.5 0 0 1-.196 0L5.5 15.01l-4.902.98A.5.5 0 0 1 0 15.5v-14a.5.5 0 0 1 .402-.49l5-1a.5.5 0 0 1 .196 0L10.5.99l4.902-.98a.5.5 0 0 1 .415.103M10 1.91l-4-.8v12.98l4 .8zm1 12.98 4-.8V1.11l-4 .8zm-6-.92V1.91l-4 .8v12.98z',
  'recycle':    'M9.302 1.256a1.5 1.5 0 0 0-2.604 0l-1.704 2.98a.5.5 0 0 0 .869.497l1.703-2.981a.5.5 0 0 1 .868 0l2.54 4.444-1.256-.337a.5.5 0 1 0-.26.966l2.415.647a.5.5 0 0 0 .613-.353l.647-2.415a.5.5 0 1 0-.966-.259l-.333 1.242zM2.973 7.773l-1.255.337a.5.5 0 1 1-.26-.966l2.416-.647a.5.5 0 0 1 .612.353l.647 2.415a.5.5 0 0 1-.966.259l-.333-1.242-2.545 4.454a.5.5 0 0 0 .434.748H5a.5.5 0 0 1 0 1H1.723A1.5 1.5 0 0 1 .421 12.24zm10.89 1.463a.5.5 0 1 0-.868.496l1.716 3.004a.5.5 0 0 1-.434.748h-5.57l.647-2.415a.5.5 0 0 0-.966-.259l-.647 2.415a.5.5 0 0 0 .353.612l2.416.647a.5.5 0 0 0 .259-.966l-1.256-.337H12.2a1.5 1.5 0 0 0 1.301-2.244z',
  'box-seam':   'M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z',
  'eyedropper': 'M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708z',
  'stars':      'M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z',
  'flower3':    'M11.5 6.5a3.5 3.5 0 0 1-3.5 3.5 3.5 3.5 0 0 1-3.5-3.5 3.5 3.5 0 0 1 3.5-3.5 3.5 3.5 0 0 1 3.5 3.5M8 4a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708',
}

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
    router.push({ name: 'box-reveal' })
  }
}
</script>

<template>
  <div class="prefs-root">
    <div class="bg-gradient" />

    <div class="bg-icons">
      <span class="float-icon" style="left:8%;top:10%;--d:0s;--dur:7s">
        <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor"><path :d="iconPaths['scissors']"/></svg>
      </span>
      <span class="float-icon" style="left:80%;top:15%;--d:1.5s;--dur:6s">
        <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor"><path :d="iconPaths['flower3']"/></svg>
      </span>
      <span class="float-icon" style="left:20%;top:80%;--d:3s;--dur:8s">
        <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor"><path :d="iconPaths['search']"/></svg>
      </span>
      <span class="float-icon" style="left:88%;top:65%;--d:0.5s;--dur:5s">
        <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor"><path :d="iconPaths['egg-fried']"/></svg>
      </span>
      <span class="float-icon" style="left:50%;top:5%;--d:2s;--dur:9s">
        <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor"><path :d="iconPaths['palette']"/></svg>
      </span>
      <span class="float-icon" style="left:5%;top:55%;--d:4s;--dur:6s">
        <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor"><path :d="iconPaths['brush']"/></svg>
      </span>
      <span class="float-icon" style="left:65%;top:85%;--d:1s;--dur:7s">
        <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor"><path :d="iconPaths['flower1']"/></svg>
      </span>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="icon-badge">
          <svg width="36" height="36" viewBox="0 0 16 16" fill="#bc6c25"><path :d="iconPaths['box-seam']"/></svg>
        </div>
        <h1 class="card-title">Find Your Perfect Box</h1>
        <p class="card-subtitle">Answer a few quick questions so we can match you to your ideal hobby kit</p>
      </div>

      <div class="progress-wrap">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progress + '%' }" />
        </div>
        <span class="progress-label">{{ currentStep + 1 }} of {{ questions.length }}</span>
      </div>

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
                <span class="opt-icon">
                  <svg width="28" height="28" viewBox="0 0 16 16" fill="currentColor">
                    <path :d="iconPaths[opt.icon]"/>
                  </svg>
                </span>
                <span class="opt-label">{{ opt.label }}</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <button class="next-btn" :disabled="selected === null" @click="next">
        {{ currentStep < questions.length - 1 ? 'Next →' : 'Show My Box' }}
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
  color: rgba(188, 108, 37, 0.18);
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: #fefae0;
  border: 2px solid #a67c52;
  border-radius: 50%;
  margin-bottom: 0.75rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
  .options-grid { grid-template-columns: 1fr; }
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
  color: #7f5539;
}

.option-btn:hover {
  border-color: #bc6c25;
  background: #fff8e7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(188, 108, 37, 0.2);
  color: #603813;
}

.option-btn.selected {
  border-color: #bc6c25;
  background: #fff3d0;
  box-shadow: 0 0 0 3px rgba(188, 108, 37, 0.2);
  transform: translateY(-2px);
  color: #603813;
}

.opt-icon {
  display: flex;
  align-items: center;
  justify-content: center;
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

.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from { opacity: 0; transform: translateX(30px); }
.slide-leave-to { opacity: 0; transform: translateX(-30px); }
</style>