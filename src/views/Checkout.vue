<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import axios from 'axios'

const router = useRouter()

const form = ref({
  name: '',
  country: '',
  address: '',
  city: '',
  province: '',
  postalcode: '',
  phonenumber: ''
})

async function goToReview() {
  try {
    await axios.post("http://localhost:5000/shipping", form.value)

    router.push({ name: 'review' })

  } catch (error) {
    console.error(error)
  }
}
</script>


<template>
  <div class="container py-5">
    <h2 class="mb-4 text-center">Checkout</h2>

    <div class="card shadow p-4">
      <form @submit.prevent="goToReview">

        <div class="mb-3">
          <label>Name</label>
          <input v-model="form.name" type="text" class="form-control" required />
        </div>

        <div class="mb-3">
          <label>Country</label>
          <input v-model="form.country" type="text" class="form-control" required />
        </div>

        <div class="mb-3">
          <label>Address</label>
          <input v-model="form.address" type="text" class="form-control" required />
        </div>

        <div class="mb-3">
          <label>City</label>
          <input v-model="form.city" type="text" class="form-control" required />
        </div>

        <div class="mb-3">
          <label>Province</label>
          <input v-model="form.province" type="text" class="form-control" required />
        </div>

        <div class="mb-3">
          <label>Postal Code</label>
          <input v-model="form.postalcode" type="text" class="form-control" required />
        </div>

        <div class="mb-3">
          <label>Phone Number</label>
          <input v-model="form.phonenumber" type="text" class="form-control" required />
        </div>

        <button class="btn btn-dark w-100 mt-3">
          Continue to Review
        </button>

      </form>
    </div>
  </div>
</template>