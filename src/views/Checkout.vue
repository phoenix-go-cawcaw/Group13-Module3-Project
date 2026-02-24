<script setup>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useCart } from '../composables/useCart'
import axios from 'axios'

const router = useRouter()
const { cartItems, cartTotal } = useCart()

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
  // Checks if theres a subscription in sessionStorage
  const subData = sessionStorage.getItem('subscriptionCheckout')
  if (subData) {
    subscription.value = JSON.parse(subData)
    isSubscriptionCheckout.value = true
    sessionStorage.removeItem('subscriptionCheckout') // Clears after reading
  }
})

const checkoutTotal = computed(() => {
  if (isSubscriptionCheckout.value && subscription.value) {
    // Subscriptions dont have shipping
    return subscription.value.price
  }
  // Products will have shipping
  return cartTotal.value + SHIPPING_COST
})

const checkoutItems = computed(() => {
  if (isSubscriptionCheckout.value && subscription.value) {
    return [subscription.value]
  }
  return cartItems.value
})

async function goToReview() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    await axios.post("http://localhost:5000/checkout", {
      ...form.value,
      user_id: user.user_id || null
    })

    router.push({
      name: 'review',
      query: {
        name: form.value.full_name,
        email: form.value.email,
        isSubscription: isSubscriptionCheckout.value,
        subscriptionId: subscription.value?.subscription_id || null
      }
    })

  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="container py-5">
    <h2 class="mb-4 text-center">Checkout</h2>

    <div class="row">
      <div class="col-lg-7">
        <div class="card shadow p-4">
          <form @submit.prevent="goToReview">

            <div class="mb-3">
              <label>Full Name *</label>
              <input v-model="form.full_name" type="text" class="form-control" required />
            </div>

            <div class="mb-3">
              <label>Email Address *</label>
              <input v-model="form.email" type="email" class="form-control" required />
            </div>

            <div class="mb-3">
              <label>Country *</label>
              <input v-model="form.country" type="text" class="form-control" required />
            </div>

            <div class="mb-3">
              <label>Street Address *</label>
              <input v-model="form.address" type="text" class="form-control" required />
            </div>

            <div class="mb-3">
              <label>City *</label>
              <input v-model="form.city" type="text" class="form-control" required />
            </div>

            <div class="mb-3">
              <label>Province / State</label>
              <input v-model="form.province" type="text" class="form-control" />
            </div>

            <div class="mb-3">
              <label>Postal Code *</label>
              <input v-model="form.postal_code" type="text" class="form-control" required />
            </div>

            <div class="mb-3">
              <label>Phone Number</label>
              <input v-model="form.phonenumber" type="tel" class="form-control" />
            </div>

            <button type="submit" class="btn btn-dark w-100 mt-3">
              Continue to Review
            </button>

          </form>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="card shadow p-4">
          <h5 class="mb-3">Order Summary</h5>

          <div v-if="checkoutItems.length > 0" class="mb-3">
            <div v-for="item in checkoutItems" :key="item.id || item.subscription_id"
              class="d-flex justify-content-between mb-2">
              <span v-if="isSubscriptionCheckout">{{ item.subscription_name }}</span>
              <span v-else>{{ item.name }} x{{ item.quantity }}</span>
              <span>R{{ (item.price * (item.quantity || 1)).toFixed(2) }}</span>
            </div>
          </div>
          <div v-else class="alert alert-warning">
            Your cart is empty
          </div>

          <hr />

          <div v-if="!isSubscriptionCheckout" class="d-flex justify-content-between mb-2">
            <span>Subtotal:</span>
            <span>R{{ cartTotal.toFixed(2) }}</span>
          </div>

          <div v-if="!isSubscriptionCheckout" class="d-flex justify-content-between mb-3">
            <span>Shipping:</span>
            <span>R{{ SHIPPING_COST.toFixed(2) }}</span>
          </div>

          <div v-if="!isSubscriptionCheckout" class="alert alert-info">
            <small>Shipping: One-time charge</small>
          </div>

          <div v-if="isSubscriptionCheckout" class="alert alert-warning">
            <small>This is a monthly recurring payment</small>
          </div>

          <hr />

          <div class="d-flex justify-content-between">
            <strong>Total:</strong>
            <strong>R{{ checkoutTotal.toFixed(2) }}</strong>
          </div>
          <div v-if="isSubscriptionCheckout" class="text-muted mt-2">
            <small>per month</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>