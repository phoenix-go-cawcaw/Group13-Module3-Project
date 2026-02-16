<script setup>
import { ref } from "vue"
import axios from "axios"

const fullName = ref("")
const email = ref("")
const phone = ref("")
const country = ref("")
const city = ref("")
const state = ref("")
const zip = ref("")

// Replace with real cart total later using stores or smth
const subtotal = 45
const shipping = 5
const discount = 10
const total = subtotal + shipping - discount

const startPayment = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/payments/payfast/create",
      { //Mock cart, Remove after stores have been implemented
        user_id: 1,
        total_amount: total
      }
    )

    window.location.href = response.data.redirectUrl

  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="checkout-container">

    <div class="left">
      <h2>Checkout</h2>

      <h3>Shipping Information</h3>

      <input v-model="fullName" placeholder="Full name" />
      <input v-model="email" placeholder="Email address" />
      <input v-model="phone" placeholder="Phone number" />
      <input v-model="country" placeholder="Country" />
      <input v-model="city" placeholder="City" />
      <input v-model="state" placeholder="State" />
      <input v-model="zip" placeholder="ZIP Code" />
    </div>

    <div class="right">
      <h3>Review your cart</h3>

      <p>Subtotal: R{{ subtotal }}</p>
      <p>Shipping: R{{ shipping }}</p>
      <p>Discount: -R{{ discount }}</p>
      <h3>Total: R{{ total }}</h3>

      <button @click="startPayment">
        Pay Now
      </button>
    </div>

  </div>
</template>

<style>
.checkout-container {
  display: flex;
  gap: 50px;
  padding: 40px;
}

.left {
  flex: 2;
}

.right {
  flex: 1;
  background: #f7f7f7;
  padding: 20px;
}

input {
  display: block;
  margin: 10px 0;
  padding: 10px;
  width: 100%;
}

button {
  background: #3b5bfd;
  color: white;
  padding: 12px;
  width: 100%;
  border: none;
  cursor: pointer;
}

</style>