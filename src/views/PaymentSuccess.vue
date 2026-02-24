<script setup>
import { ref } from "vue"

const message = ref("Payment Processing")
const details = ref("Your payment has been submitted. Please allow a few moments for processing.")
</script>

<template>
  <div class="success-page">
    <div class="page-content">
      <div class="card">
        <div class="card-body">
          <div class="icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 class="message">{{ message }}</h2>
          <p class="details">{{ details }}</p>
          <p class="subtext">You will receive a confirmation email shortly.</p>
          <a href="/" class="btn-home">Return to Home</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.success-page {
  min-height: 100vh;
  background: #faf8f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  font-family: inherit;
  color: #3d2817;
}

.page-content {
  width: 100%;
  max-width: 36rem;
}

.card {
  background: #ffffff;
  border: 2px solid rgba(107, 68, 35, 0.2);
  border-radius: 0.625rem;
  box-shadow: 0 4px 16px rgba(107, 68, 35, 0.1);
}

.card-body {
  padding: 3rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
}

.icon-wrap {
  width: 4rem;
  height: 4rem;
  background: rgba(107, 68, 35, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.icon-wrap svg {
  width: 2rem;
  height: 2rem;
  color: #6b4423;
}

.message {
  font-size: 1.6rem;
  font-weight: 500;
  color: #6b4423;
}

.details {
  font-size: 1rem;
  color: #3d2817;
  line-height: 1.6;
}

.subtext {
  font-size: 0.875rem;
  color: #8b7355;
}

.btn-home {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
  padding: 0.75rem 2rem;
  background: #6b4423;
  color: #ffffff;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.15s;
}

.btn-home:hover {
  background: #5a3a1d;
  color: #ffffff;
}
</style>