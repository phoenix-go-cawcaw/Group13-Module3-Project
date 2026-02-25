<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useCart } from '../composables/useCart'

const route = useRoute()
const router = useRouter()
const { cartItems, cartTotal } = useCart()

const API_URL = import.meta.env.VITE_API_URL || "https://sylas-indorsable-epifania.ngrok-free.dev"

const SHIPPING_COST = 50

// Check both localStorage and sessionStorage for user
const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}')
const userId = user.user_id || user.id || null

const isSubscription = computed(() => route.query.isSubscription === 'true')

const itemTotal = computed(() => {
  if (isSubscription.value) {
    return parseFloat(route.query.price) || 0
  }
  return cartTotal.value
})

const totalAmount = computed(() => {
  if (isSubscription.value) {
    return itemTotal.value.toFixed(2)
  }
  return (itemTotal.value + SHIPPING_COST).toFixed(2)
})

const handlePayNow = async () => {
  try {
    // Check if user is logged in
    if (!userId) {
      alert("Please log in to continue");
      router.push('/login');
      return;
    }

    // Use the checkoutId passed from Checkout view (no duplicate creation)
    const checkoutId = route.query.checkoutId;
    console.log("Using existing checkout ID:", checkoutId);

    if (!checkoutId) {
      alert("Checkout ID not found. Please return to checkout.");
      return;
    }

    console.log("Step 1: Creating payment with PayFast...");

    const paymentResponse = await fetch(`${API_URL}/payfast/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        total_amount: totalAmount.value
      })
    });

    const paymentData = await paymentResponse.json();
    console.log("Payment response:", paymentData);

    if (!paymentResponse.ok) {
      console.error("Payment creation failed:", paymentData);
      alert("Failed to create payment: " + (paymentData.error || "Unknown error"));
      return;
    }

    if (!paymentData.paymentData) {
      console.error("No payment data in response:", paymentData);
      alert("Failed to prepare payment");
      return;
    }

    console.log("Step 4: Redirecting to PayFast...");
    console.log("Form data to submit:", paymentData.paymentData);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = paymentData.payfastUrl;

    Object.entries(paymentData.paymentData).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value); // Ensure value is a string
      form.appendChild(input);
      console.log(`Added form field: ${key}=${value}`);
    });

    document.body.appendChild(form);
    form.submit();

  } catch (err) {
    console.error("Payment error:", err);
    alert("Error processing payment: " + err.message);
  }
};
</script>

<template>
  <div class="review-page">
    <div class="page-content">
      <div class="page-header">
        <h2>Review Your Order</h2>
        <p class="page-subtitle">Please review your order details before completing payment</p>
      </div>

      <div class="card">
        <div class="card-body">

          <div class="review-section">
            <h3 class="section-title">
              <svg class="section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Customer Details
            </h3>
            <div class="detail-box">
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">{{ route.query.firstName }} {{ route.query.lastName }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{{ route.query.email }}</span>
              </div>
            </div>
          </div>

          <div class="review-section">
            <h3 class="section-title">
              <svg class="section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.29 7 12 12 20.71 7" />
                <line x1="12" y1="22" x2="12" y2="12" />
              </svg>
              {{ isSubscription ? 'Subscription Details' : 'Order Summary' }}
            </h3>

            <div v-if="cartItems.length > 0 || isSubscription" class="items-list">
              <div v-if="isSubscription" class="item-row">
                <span class="item-name">{{ route.query.subscriptionName || 'Subscription' }}</span>
                <span class="item-price">R{{ itemTotal.toFixed(2) }}</span>
              </div>
              <div v-else v-for="item in cartItems" :key="item.id" class="item-row">
                <div>
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-qty"> x{{ item.quantity }}</span>
                </div>
                <span class="item-price">R{{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
            <div v-else class="empty-cart">
              <p>Your cart is empty</p>
            </div>
          </div>

          <div class="review-section">
            <template v-if="!isSubscription">
              <div class="total-row">
                <span class="total-label">Subtotal:</span>
                <span>R{{ itemTotal.toFixed(2) }}</span>
              </div>
              <div class="total-row">
                <span class="total-label">Shipping:</span>
                <span>R{{ SHIPPING_COST.toFixed(2) }}</span>
              </div>
            </template>

            <div v-if="isSubscription" class="subscription-badge">
              <p class="sub-badge-title">Monthly Subscription</p>
              <p class="sub-badge-sub">This amount will be charged every month</p>
            </div>

            <div class="grand-total-row">
              <span class="grand-total-label">Total:</span>
              <span class="grand-total-value">
                R{{ totalAmount }}
                <span v-if="isSubscription" class="per-month">/month</span>
              </span>
            </div>
          </div>

          <div class="action-buttons">
            <button class="btn-outline" @click="router.back()">
              <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Checkout
            </button>
            <button class="btn-primary" @click="handlePayNow">
              <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Confirm &amp; Pay
            </button>
          </div>

        </div>
      </div>

      <div class="security-notice">
        <p>Your payment information is secure and encrypted</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.review-page {
  min-height: 100vh;
  background: #faf8f5;
  color: #3d2817;
  font-family: inherit;
}

.page-content {
  max-width: 56rem;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h2 {
  font-size: 1.75rem;
  font-weight: 500;
  color: #3d2817;
  margin-bottom: 0.25rem;
}

.page-subtitle {
  color: #8b7355;
  font-size: 0.95rem;
}

.card {
  background: #ffffff;
  border: 2px solid rgba(107, 68, 35, 0.2);
  border-radius: 0.625rem;
  box-shadow: 0 4px 16px rgba(107, 68, 35, 0.1);
}

.card-body {
  padding: 1.75rem 2rem;
}

@media (max-width: 640px) {
  .card-body {
    padding: 1.25rem;
  }
}

.review-section {
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(107, 68, 35, 0.15);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.05rem;
  font-weight: 500;
  color: #6b4423;
  margin-bottom: 0.25rem;
}

.section-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: #6b4423;
  flex-shrink: 0;
}

.detail-box {
  background: rgba(245, 235, 224, 0.4);
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.detail-label {
  color: #8b7355;
}

.detail-value {
  font-weight: 500;
  color: #3d2817;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(245, 235, 224, 0.4);
  border-radius: 0.5rem;
}

.item-name {
  font-weight: 500;
  font-size: 0.9rem;
  color: #3d2817;
}

.item-qty {
  color: #8b7355;
  font-size: 0.875rem;
}

.item-price {
  font-weight: 600;
  font-size: 0.9rem;
  color: #3d2817;
  white-space: nowrap;
}

.empty-cart {
  background: rgba(212, 24, 61, 0.08);
  border: 1px solid rgba(212, 24, 61, 0.2);
  color: #d4183d;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #8b7355;
}

.subscription-badge {
  background: rgba(200, 155, 110, 0.15);
  border: 1px solid #c89b6e;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
}

.sub-badge-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #3d2817;
}

.sub-badge-sub {
  font-size: 0.8rem;
  color: #8b7355;
  margin-top: 0.25rem;
}

.grand-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(107, 68, 35, 0.15);
  margin-top: 0.25rem;
}

.grand-total-label {
  font-size: 1.15rem;
  font-weight: 600;
  color: #3d2817;
}

.grand-total-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #6b4423;
}

.per-month {
  font-size: 1rem;
  color: #8b7355;
  font-weight: 400;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 0.25rem;
}

@media (max-width: 480px) {
  .action-buttons {
    grid-template-columns: 1fr;
  }
}

.btn-outline,
.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.btn-outline {
  background: transparent;
  border: 2px solid rgba(107, 68, 35, 0.3);
  color: #3d2817;
}

.btn-outline:hover {
  background: #f5ebe0;
}

.btn-primary {
  background: #6b4423;
  border: 2px solid #6b4423;
  color: #ffffff;
}

.btn-primary:hover {
  background: #5a3a1d;
  border-color: #5a3a1d;
}

.btn-icon {
  width: 1.1rem;
  height: 1.1rem;
}

.security-notice {
  margin-top: 1.5rem;
  background: rgba(245, 235, 224, 0.5);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  text-align: center;
}

.security-notice p {
  font-size: 0.8rem;
  color: #8b7355;
}
</style>