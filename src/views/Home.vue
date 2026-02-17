<script setup>
import { RouterLink } from 'vue-router'
import heroBg from '../assets/Hobby in a Box.png'
</script>

<template>
  <main class="home-bg py-4">
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
  line-height: 1.4;
}

.steps {
  max-width: 700px;
}

.home-bg {
  background-image: url(https://img.freepik.com/free-vector/blurred-light-background-design_1107-160.jpg?t=st=1770904010~exp=1770907610~hmac=0a26e817aab791674c21f016c9f7242727292ad2fe329935bb71ced6b81d2517);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  padding: 2rem;
  min-height: 80vh;
  padding: 2rem 2rem;

}

.hero-image {
  max-height: 500px;
  width: 100%;
  object-fit: contain;
}

.btn {
  margin-top: auto;
  display: flex;
  gap: 10px;
  justify-content: center;   
  width: 50%;
}
</style>
