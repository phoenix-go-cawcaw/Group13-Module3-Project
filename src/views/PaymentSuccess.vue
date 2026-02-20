<script setup>
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const message = ref("Processing payment...")

onMounted(async () => {
  try {
    const response = await fetch("http://localhost:5000/payfast/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checkoutId: route.query.m_payment_id,
        payment_status: route.query.payment_status,
        pf_payment_id: route.query.pf_payment_id,
        amount: route.query.amount_gross
      })
    })

    const data = await response.json()

    if (response.ok) {
      message.value = "Payment Successful"
    } else {
      message.value = data.error || "Payment verification failed"
    }

  } catch (err) {
    console.error(err)
    message.value = "Server error confirming payment"
  }
})
</script>

<template>
  <div class="container py-5 text-center">
    <h2 class="text-success">{{ message }}</h2>
  </div>
</template>
