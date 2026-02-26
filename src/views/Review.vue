<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useCart } from '../composables/useCart'

const route = useRoute()
const router = useRouter()
const { cartItems, cartTotal, clearCart } = useCart()

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const SHIPPING_COST = 50

// Checks localStorage and sessionStorage for user
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
// Payment form state
const showPaymentForm = ref(false)
const isProcessing = ref(false)
const paymentForm = ref({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: ''
})

const handlePayNow = () => {

  if (!userId) {
    alert("Please log in to continue");
    router.push('/login');
    return;
  }

  showPaymentForm.value = true
}

const formatCardNumber = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  const matches = v.match(/\d{4,16}/g)
  const match = (matches && matches[0]) || ''
  const parts = []

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }

  if (parts.length) {
    return parts.join(' ')
  } else {
    return value
  }
}

const formatExpiryDate = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  if (v.length >= 2) {
    return v.slice(0, 2) + '/' + v.slice(2, 4)
  }
  return v
}

const formatCVV = (value) => {
  return value.replace(/\s+/g, '').replace(/[^0-9]/gi, '').slice(0, 4)
}

const handleCardNumberInput = (e) => {
  paymentForm.value.cardNumber = formatCardNumber(e.target.value)
}

const handleExpiryInput = (e) => {
  paymentForm.value.expiryDate = formatExpiryDate(e.target.value)
}

const handleCVVInput = (e) => {
  paymentForm.value.cvv = formatCVV(e.target.value)
}

const submitPayment = async () => {
  if (!paymentForm.value.cardNumber || !paymentForm.value.expiryDate || !paymentForm.value.cvv || !paymentForm.value.cardholderName) {
    alert('Please fill in all payment details')
    return
  }

  const cardNumber = paymentForm.value.cardNumber.replace(/\s/g, '')
  if (cardNumber.length < 13 || cardNumber.length > 19) {
    alert('Invalid card number')
    return
  }

  if (!/^\d{2}\/\d{2}$/.test(paymentForm.value.expiryDate)) {
    alert('Invalid expiry date (use MM/YY format)')
    return
  }

  if (!/^\d{3,4}$/.test(paymentForm.value.cvv)) {
    alert('Invalid CVV')
    return
  }

  isProcessing.value = true

  try {
    const checkoutId = route.query.checkoutId
    
    if (!checkoutId) {
      alert('Checkout ID not found. Please return to checkout.')
      return
    }

    const response = await fetch(`${API_URL}/payfast/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checkoutId: parseInt(checkoutId),
        cardNumber: paymentForm.value.cardNumber,
        expiryDate: paymentForm.value.expiryDate,
        cvv: paymentForm.value.cvv,
        cardholderName: paymentForm.value.cardholderName,
        amount: totalAmount.value,
        email: route.query.email
      })
    })

    const result = await response.json()

    if (!response.ok) {
      alert('Payment failed: ' + (result.error || 'Unknown error'))
      return
    }

    console.log('Payment successful:', result)
    alert('Payment processed successfully! Transaction ID: ' + result.transactionId)

    await clearCart()
    router.push({
      name: 'payment-success',
      query: { checkoutId, transactionId: result.transactionId }
    })
  } catch (error) {
    console.error('Payment error:', error)
    alert('Error processing payment: ' + error.message)
  } finally {
    isProcessing.value = false
  }
}

const cancelPayment = () => {
  showPaymentForm.value = false
  paymentForm.value = {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  }
}
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
            <button class="btn-primary" @click="handlePayNow" v-if="!showPaymentForm">
              <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Confirm &amp; Pay
            </button>
          </div>

          <div v-if="showPaymentForm" class="payment-form-overlay">
            <div class="payment-form-container">
              <div class="payment-form-header">
                <h3>Enter Payment Details</h3>
                <p class="form-subtitle">All payment information is processed securely</p>
              </div>

              <div class="payment-form-body">
                <div class="form-group">
                  <label for="cardholder">Cardholder Name *</label>
                  <input
                    id="cardholder"
                    v-model="paymentForm.cardholderName"
                    type="text"
                    placeholder="John Doe"
                    :disabled="isProcessing"
                  />
                </div>

                <div class="form-group">
                  <label for="card-number">Card Number *</label>
                  <input
                    id="card-number"
                    :value="paymentForm.cardNumber"
                    @input="handleCardNumberInput"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    :disabled="isProcessing"
                    maxlength="19"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="expiry">Expiry Date *</label>
                    <input
                      id="expiry"
                      :value="paymentForm.expiryDate"
                      @input="handleExpiryInput"
                      type="text"
                      placeholder="MM/YY"
                      :disabled="isProcessing"
                      maxlength="5"
                    />
                  </div>
                  <div class="form-group">
                    <label for="cvv">CVV *</label>
                    <input
                      id="cvv"
                      :value="paymentForm.cvv"
                      @input="handleCVVInput"
                      type="text"
                      placeholder="123"
                      :disabled="isProcessing"
                      maxlength="4"
                    />
                  </div>
                </div>

                <div class="form-info">
                  <p><strong>Amount to pay:</strong> R{{ totalAmount }}</p>
                </div>
              </div>

              <div class="payment-form-actions">
                <button class="btn-cancel" @click="cancelPayment" :disabled="isProcessing">
                  Cancel
                </button>
                <button class="btn-confirm" @click="submitPayment" :disabled="isProcessing">
                  {{ isProcessing ? 'Processing...' : 'Pay Now' }}
                </button>
              </div>
            </div>
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

.payment-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.payment-form-container {
  background: #ffffff;
  border-radius: 0.625rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.payment-form-header {
  background: #6b4423;
  color: #ffffff;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.payment-form-header h3 {
  margin: 0;
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.form-subtitle {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.9;
}

.payment-form-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  color: #3d2817;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #6b4423;
  box-shadow: 0 0 0 3px rgba(107, 68, 35, 0.1);
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-info {
  background: #f5ebe0;
  border: 1px solid #e0d0c0;
  padding: 1rem;
  border-radius: 0.4rem;
  margin: 1.25rem 0;
  font-size: 0.9rem;
  color: #3d2817;
}

.form-info p {
  margin: 0;
}

.payment-form-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #eee;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 0.875rem;
  border: none;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f5ebe0;
  color: #3d2817;
  border: 1px solid #d0c0b0;
}

.btn-cancel:hover:not(:disabled) {
  background: #e8d8c8;
}

.btn-confirm {
  background: #6b4423;
  color: #ffffff;
  border: 1px solid #6b4423;
}

.btn-confirm:hover:not(:disabled) {
  background: #5a3a1d;
  border-color: #5a3a1d;
}

.btn-cancel:disabled,
.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

</style>