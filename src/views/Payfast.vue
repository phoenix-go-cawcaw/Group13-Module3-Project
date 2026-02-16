<script setup>
import { useRoute, useRouter } from "vue-router"
import axios from "axios"

const route = useRoute()
const router = useRouter()

const checkoutId = route.params.id

const handlePayment = async (status) => {
  try {
    await axios.post("http://localhost:5000/api/payments/payfast/update", {
      checkoutId,
      status
    })

    if (status === "paid") {
      router.push("/payment-success")
    } else {
      router.push("/payment-failed")
    }

  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="container">
    <h2>PayFast Secure Payment</h2>
    <p>Checkout ID: {{ checkoutId }}</p>

    <button @click="handlePayment('paid')" class="pay">
      Pay Now
    </button>

    <button @click="handlePayment('failed')" class="cancel">
      Cancel
    </button>
  </div>
</template>

<style>
.container {
  text-align: center;
  margin-top: 100px;
}

.pay {
  background: green;
  color: white;
  padding: 10px 20px;
  margin: 10px;
}

.cancel {
  background: red;
  color: white;
  padding: 10px 20px;
}
</style>