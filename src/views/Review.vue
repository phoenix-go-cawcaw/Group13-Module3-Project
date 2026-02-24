<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useCart } from '../composables/useCart'

const route = useRoute()
const router = useRouter()
const { cartItems, cartTotal } = useCart()

const SHIPPING_COST = 50

const user = JSON.parse(localStorage.getItem('user') || '{}')
const userId = user.user_id || null

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

const voucherCode = null

const handlePayNow = async () => {
  try {
    const response = await fetch("http://localhost:5000/payfast/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        total_amount: totalAmount.value,
        voucher_code: voucherCode
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Payment error:", errorData);
      alert(`Payment failed: ${errorData.error}`);
      return;
    }

    const data = await response.json();
    // console.log("PAYFAST paymentData:", data.paymentData);

    if (!data.paymentData) {
      console.error("No payment data in response:", data);
      alert("Failed to prepare payment");
      return;
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = data.payfastUrl;

    Object.entries(data.paymentData).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
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
  <div class="container py-5">
    <h2 class="text-center mb-4">Review Your Order</h2>

    <div class="card shadow p-4">

      <h5>Customer Details</h5>
      <p><strong>Name:</strong> {{ route.query.name }}</p>
      <p><strong>Email:</strong> {{ route.query.email }}</p>

      <hr />

      <h5 v-if="isSubscription">Subscription Details</h5>
      <h5 v-else>Order Summary</h5>
      <div v-if="cartItems.length > 0 || isSubscription">
        <div v-if="isSubscription" class="d-flex justify-content-between mb-2">
          <span>{{ route.query.name }}</span>
          <span>R{{ itemTotal.toFixed(2) }}</span>
        </div>
        <div v-else v-for="item in cartItems" :key="item.id" class="d-flex justify-content-between mb-2">
          <span>{{ item.name }} x{{ item.quantity }}</span>
          <span>R{{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>
      </div>
      <div v-else class="alert alert-warning">
        Your cart is empty
      </div>

      <hr />

      <div v-if="!isSubscription" class="d-flex justify-content-between mb-2">
        <span>Subtotal:</span>
        <span>R{{ itemTotal.toFixed(2) }}</span>
      </div>

      <div v-if="!isSubscription" class="d-flex justify-content-between mb-3">
        <span>Shipping:</span>
        <span>R{{ SHIPPING_COST.toFixed(2) }}</span>
      </div>

      <div v-if="isSubscription" class="alert alert-warning">
        <small><strong>Monthly Subscription</strong> - This will be charged every month</small>
      </div>

      <h4 class="mt-3">
        Total: R{{ totalAmount }}
        <span v-if="isSubscription" class="small text-muted">/month</span>
      </h4>

      <div class="d-flex gap-3 mt-4">
        <button class="btn btn-outline-secondary w-50" @click="router.back()">
          Back to Checkout
        </button>

        <button class="btn btn-success w-50" @click="handlePayNow">
          Confirm & Pay
        </button>
      </div>

    </div>
  </div>
</template>