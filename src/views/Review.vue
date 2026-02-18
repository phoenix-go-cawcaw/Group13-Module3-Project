<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

function confirmOrder() {
  // Later this will trigger PayFast
  alert("Order Confirmed! Next step: Payment integration.")
}
</script>

<template>
  <div class="container py-5">
    <h2 class="text-center mb-4">Review Your Order</h2>

    <div class="card shadow p-4">
      
      <h5>Customer Details</h5>
      <p><strong>Name:</strong> {{ route.query.name }}</p>
      <p><strong>Email:</strong> {{ route.query.email }}</p>

      <hr />

      <h5>Order Summary (Placeholder)</h5>
      <ul>
        <li>Hobby Box – R299.00</li>
        <li>Shipping – R50.00</li>
      </ul>

      <h4 class="mt-3">Total: R349.00</h4>

      <div class="d-flex gap-3 mt-4">
        <button class="btn btn-outline-secondary w-50" @click="router.back()">
          Back to Checkout
        </button>

        <button class="btn btn-success w-50" @click="confirmOrder">
          Confirm & Pay
        </button>
      </div>

    </div>
  </div>
</template>