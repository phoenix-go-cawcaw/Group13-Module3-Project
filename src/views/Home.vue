<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import heroBg from '../assets/Hobby in a Box.png'
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()

const showWelcome = ref(false)
const welcomeMessage = ref('')

onMounted(() => {
  if (route.query.welcome === 'back') {
    welcomeMessage.value = 'Welcome Back!'
    showWelcome.value = true
  }

  if (route.query.welcome === 'new') {
    welcomeMessage.value = 'Welcome!'
    showWelcome.value = true
  }

  if (showWelcome.value) {
    setTimeout(() => {
      showWelcome.value = false
      router.replace({ path: '/' })
    }, 3000)
  }
})
</script>

<template>
  <main class="home-bg gradient-bg py-4">
    <div v-if="showWelcome" class="welcome-banner">
      {{ welcomeMessage }}
    </div>
    <div class="container h-100">
      <div class="row align-items-center g-4 h-100">
        <div class="col-12 col-lg-7">
          <h1 class="display-6 fw-bold">Welcome to Hobby in a Box!</h1>
          <br>
          <p class="lead text-body-secondary"><strong>Curated hobby boxes delivered to your door - explore creativity,
              learning, and culture.</strong>
          </p>
          <div class="d-flex gap-2 mt-3">
            <RouterLink class="btn btn-success" to="/products">Browse Products</RouterLink>
            <RouterLink class="btn btn-success" to="/pricing">View Pricing</RouterLink>
          </div>
          <br>
          <section class="steps mt-4">
            <p><i class="pi pi-align-justify me-2"></i><strong>Choose a Category</strong></p>
            <p>Arts & DIY, Green Living, Education 4 Kidz, or Culinary Discovery</p>
            <p><i class="pi pi-cart-plus me-2"></i><strong>Subscribe or Buy Once</strong></p>
            <p>Flexible monthly subscriptions or one-time purchases</p>
            <p><i class="pi pi-box me-2"></i><strong>Receive Your Box</strong></p>
            <p>Delivered monthly with all materials included</p>
          </section>
        </div>
        <div class="col-12 col-lg-5 text-center">
          <img :src="heroBg" alt="Hobby in a Box" class="hero-image img-fluid" />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.pi-align-justify,
.pi-cart-plus,
.pi-box {
  font-size: 1.25rem;
}

.steps {
  max-width: 700px;
}

.home-bg {
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  align-items: flex-start;
}

.hero-image {
  max-height: 500px;
  width: 100%;
  object-fit: contain;
}

.gradient-bg {
  background-image: url(https://img.freepik.com/free-vector/blurred-light-background-design_1107-160.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.welcome-banner {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #5c4033;
  color: white;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: bold;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
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

</style>
