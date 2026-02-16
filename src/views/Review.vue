<script setup>
import { useRouter } from "vue-router"
import { ref } from "vue"

const router = useRouter()

// Temporary mock cart (replace with store later)
const cartItems = ref([])

const subtotal = cartItems.value.reduce(
  (sum, item) => sum + item.price * item.qty,
  0
)

const goToCheckout = () => {
  router.push("/checkout")
}
</script>

<template>
  <div class="container">
    <h2>Review Your Order</h2>

    <div v-for="item in cartItems" :key="item.id" class="item">
      <p>{{ item.name }} (x{{ item.qty }})</p>
      <p>R{{ item.price }}</p>
    </div>

    <h3>Subtotal: R{{ subtotal }}</h3>

    <button @click="goToCheckout">
      Proceed to Checkout
    </button>
  </div>
</template>
