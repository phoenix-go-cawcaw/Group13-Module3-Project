<script setup>
import { useRouter } from "vue-router"
import { onMounted } from "vue"

const router = useRouter()

// This page is no longer used — payment is handled inline on the Review page.
// Redirect anyone who lands here back to the home page.
onMounted(() => {
  router.replace("/")
})
</script>

<template>
  <div class="container">
    <p>Redirecting...</p>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  margin-top: 100px;
  color: #8b7355;
}
</style>