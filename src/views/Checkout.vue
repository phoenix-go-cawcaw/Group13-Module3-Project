<script setup>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useCart } from '../composables/useCart'
import axios from 'axios'

const router = useRouter()
const { cartItems, cartTotal } = useCart()

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"
const SHIPPING_COST = 50
const subscription = ref(null)
const isSubscriptionCheckout = ref(false)

const form = ref({
  full_name: '',
  email: '',
  country: '',
  address: '',
  city: '',
  province: '',
  postal_code: '',
  phonenumber: ''
})

onMounted(() => {
  const subData = sessionStorage.getItem('subscriptionCheckout')
  if (subData) {
    subscription.value = JSON.parse(subData)
    isSubscriptionCheckout.value = true
    sessionStorage.removeItem('subscriptionCheckout')
  }
})

const checkoutTotal = computed(() => {
  if (isSubscriptionCheckout.value && subscription.value) {
    return subscription.value.price
  }
  return cartTotal.value + SHIPPING_COST
})

const checkoutItems = computed(() => {
  if (isSubscriptionCheckout.value && subscription.value) {
    return [{
      subscription_id: subscription.value.subscription_id,
      subscription_name: subscription.value.subscription_name,
      price: parseFloat(subscription.value.price) || 0,
      quantity: 1
    }]
  }
  return cartItems.value
})

async function goToReview() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}')
    const userId = user.user_id || user.id || null

    if (!form.value.full_name || !form.value.email || !form.value.address || !form.value.city || !form.value.postal_code) {
      alert("Please fill in all required fields")
      return
    }

    await axios.post(`${API_URL}/checkout`, {
      full_name: form.value.full_name,
      email: form.value.email,
      address: form.value.address,
      city: form.value.city,
      postal_code: form.value.postal_code,
      user_id: userId
    })

    router.push({
      name: 'review',
      query: {
        name: form.value.full_name,
        email: form.value.email,
        address: form.value.address,
        city: form.value.city,
        postalCode: form.value.postal_code,
        isSubscription: isSubscriptionCheckout.value,
        subscriptionId: subscription.value?.subscription_id || null,
        subscriptionName: subscription.value?.subscription_name || null,
        price: isSubscriptionCheckout.value
          ? subscription.value?.price
          : cartTotal.value
      }
    })
  } catch (error) {
    console.error("Checkout error:", error.response?.data || error.message)
    alert("Failed to save checkout information: " + (error.response?.data?.message || error.message))
  }
}
</script>

<template>
  <div class="checkout-page">
    <div class="page-content">
      <div class="page-header">
        <h2>Checkout</h2>
        <p class="page-subtitle">Complete your order details below</p>
      </div>

      <div class="layout-grid">
        <div class="form-section">
          <div class="card">
            <div class="card-body">
              <form @submit.prevent="goToReview">
                <div class="form-sections">

                  <div class="form-group-section">
                    <h3 class="section-title">
                      <svg class="section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                      </svg>
                      Contact Information
                    </h3>
                    <div class="input-grid-2">
                      <div class="field">
                        <label for="full_name">Full Name *</label>
                        <input id="full_name" v-model="form.full_name" type="text" required />
                      </div>
                      <div class="field">
                        <label for="email">Email Address *</label>
                        <input id="email" v-model="form.email" type="email" required />
                      </div>
                    </div>
                  </div>

                  <div class="form-group-section">
                    <h3 class="section-title">
                      <svg class="section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        <polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>
                      </svg>
                      Shipping Address
                    </h3>
                    <div class="field">
                      <label for="address">Street Address *</label>
                      <input id="address" v-model="form.address" type="text" required />
                    </div>
                    <div class="input-grid-2">
                      <div class="field">
                        <label for="city">City *</label>
                        <input id="city" v-model="form.city" type="text" required />
                      </div>
                      <div class="field">
                        <label for="province">Province / State</label>
                        <input id="province" v-model="form.province" type="text" />
                      </div>
                    </div>
                    <div class="input-grid-2">
                      <div class="field">
                        <label for="postal_code">Postal Code *</label>
                        <input id="postal_code" v-model="form.postal_code" type="text" required />
                      </div>
                      <div class="field">
                        <label for="country">Country *</label>
                        <input id="country" v-model="form.country" type="text" required />
                      </div>
                    </div>
                    <div class="field">
                      <label for="phonenumber">Phone Number</label>
                      <input id="phonenumber" v-model="form.phonenumber" type="tel" />
                    </div>
                  </div>

                  <button type="submit" class="btn-primary-full">
                    <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    Continue to Review
                  </button>

                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="summary-section">
          <div class="card card-sticky">
            <div class="card-body">
              <h3 class="summary-title">Order Summary</h3>

              <div v-if="checkoutItems.length > 0" class="items-list">
                <div v-for="item in checkoutItems" :key="item.id || item.subscription_id" class="item-row">
                  <div class="item-info">
                    <p class="item-name">
                      {{ isSubscriptionCheckout ? item.subscription_name : item.name }}
                    </p>
                    <p v-if="!isSubscriptionCheckout" class="item-qty">Qty: {{ item.quantity }}</p>
                  </div>
                  <p class="item-price">R{{ (item.price * (item.quantity || 1)).toFixed(2) }}</p>
                </div>
              </div>
              <div v-else class="empty-cart">
                <p>Your cart is empty</p>
              </div>

              <div class="summary-totals">
                <template v-if="!isSubscriptionCheckout">
                  <div class="total-row">
                    <span class="total-label">Subtotal:</span>
                    <span>R{{ cartTotal.toFixed(2) }}</span>
                  </div>
                  <div class="total-row">
                    <span class="total-label">Shipping:</span>
                    <span>R{{ SHIPPING_COST.toFixed(2) }}</span>
                  </div>
                </template>

                <div v-if="isSubscriptionCheckout" class="subscription-badge">
                  <p class="sub-badge-title">Monthly Subscription</p>
                  <p class="sub-badge-sub">Recurring billing</p>
                </div>

                <div class="grand-total-row">
                  <span class="grand-total-label">Total:</span>
                  <span class="grand-total-value">
                    R{{ checkoutTotal.toFixed(2) }}
                    <span v-if="isSubscriptionCheckout" class="per-month">/month</span>
                  </span>
                </div>
              </div>

              <div v-if="!isSubscriptionCheckout" class="shipping-note">
                <p>Shipping: One-time charge</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --bg: #faf8f5;
  --primary: #6b4423;
  --primary-fg: #ffffff;
  --secondary: #d4a574;
  --muted: #f5ebe0;
  --muted-fg: #8b7355;
  --accent: #c89b6e;
  --border: rgba(107, 68, 35, 0.2);
  --card-bg: #ffffff;
  --foreground: #3d2817;
  --radius: 0.625rem;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

.checkout-page {
  min-height: 100vh;
  background: #faf8f5;
  font-family: inherit;
  color: #3d2817;
}

.page-content {
  max-width: 1200px;
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

.layout-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .layout-grid {
    grid-template-columns: 2fr 1fr;
  }
}

.card {
  background: #ffffff;
  border: 2px solid rgba(107, 68, 35, 0.2);
  border-radius: 0.625rem;
  box-shadow: 0 4px 16px rgba(107, 68, 35, 0.1);
}

.card-sticky {
  position: sticky;
  top: 2rem;
}

.card-body {
  padding: 1.5rem;
}

.form-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(107, 68, 35, 0.15);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.05rem;
  font-weight: 500;
  color: #3d2817;
}

.section-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: #6b4423;
  flex-shrink: 0;
}

.input-grid-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .input-grid-2 {
    grid-template-columns: 1fr 1fr;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #3d2817;
}

.field input {
  height: 2.5rem;
  padding: 0 0.75rem;
  border: 1px solid rgba(107, 68, 35, 0.3);
  border-radius: 0.5rem;
  background: #ffffff;
  color: #3d2817;
  font-size: 0.95rem;
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
}

.field input:focus {
  border-color: #6b4423;
  box-shadow: 0 0 0 3px rgba(107, 68, 35, 0.12);
}

.btn-primary-full {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: #6b4423;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-primary-full:hover {
  background: #5a3a1d;
}

.btn-icon {
  width: 1.1rem;
  height: 1.1rem;
}

.summary-title {
  font-size: 1.05rem;
  font-weight: 500;
  color: #3d2817;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(107, 68, 35, 0.15);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 1rem;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.625rem 0;
  border-bottom: 1px solid #f5ebe0;
}

.item-info { flex: 1; }

.item-name {
  font-weight: 500;
  font-size: 0.9rem;
  color: #3d2817;
}

.item-qty {
  font-size: 0.8rem;
  color: #8b7355;
  margin-top: 0.125rem;
}

.item-price {
  font-weight: 500;
  font-size: 0.9rem;
  color: #3d2817;
  white-space: nowrap;
  margin-left: 0.75rem;
}

.empty-cart {
  background: #f5ebe0;
  color: #8b7355;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.summary-totals {
  padding-top: 0.75rem;
  border-top: 1px solid rgba(107, 68, 35, 0.15);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
  padding: 0.625rem 0.75rem;
}

.sub-badge-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #3d2817;
}

.sub-badge-sub {
  font-size: 0.75rem;
  color: #8b7355;
  margin-top: 0.125rem;
}

.grand-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(107, 68, 35, 0.15);
  margin-top: 0.25rem;
}

.grand-total-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #3d2817;
}

.grand-total-value {
  font-weight: 600;
  font-size: 0.95rem;
  color: #6b4423;
}

.per-month {
  font-size: 0.8rem;
  color: #8b7355;
  font-weight: 400;
}

.shipping-note {
  margin-top: 1rem;
  background: rgba(245, 235, 224, 0.5);
  border-radius: 0.5rem;
  padding: 0.625rem 0.75rem;
  text-align: center;
}

.shipping-note p {
  font-size: 0.75rem;
  color: #8b7355;
}
</style>