<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="cancel-page">
    <div class="page-content">
      <div class="card">
        <div class="card-body">
          <div class="icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2 class="message">Payment Cancelled</h2>
          <p class="details">Your payment was not completed. No charges have been made.</p>
          <p class="subtext">You can return to your cart and try again whenever you're ready.</p>
          <div class="actions">
            <button class="btn-secondary" @click="router.back()">Go Back</button>
            <a href="/" class="btn-home">Return to Home</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.cancel-page {
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
  background: rgba(212, 24, 61, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.icon-wrap svg {
  width: 2rem;
  height: 2rem;
  color: #d4183d;
}

.message {
  font-size: 1.6rem;
  font-weight: 500;
  color: #d4183d;
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

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 2rem;
  background: transparent;
  color: #3d2817;
  border: 2px solid rgba(107, 68, 35, 0.3);
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-secondary:hover {
  background: #f5ebe0;
}

.btn-home {
  display: inline-flex;
  align-items: center;
  justify-content: center;
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