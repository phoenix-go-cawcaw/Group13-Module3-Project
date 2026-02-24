<script setup>
import { ref } from "vue"

const message = ref("Payment Processing")
const details = ref("Your payment has been submitted. Please allow a few moments for processing.")
</script>

<template>
  <div class="container py-5 text-center">
    <div class="card shadow p-5">
      <h2 class="text-success mb-3">{{ message }}</h2>
      <p class="lead">{{ details }}</p>
      <p class="text-muted">You will receive a confirmation email shortly.</p>
      <a href="/" class="btn btn-primary mt-3">Return to Home</a>
    </div>
  </div>
</template>
