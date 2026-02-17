<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const form = ref({
  fullName: '',
  email: '',
  address: '',
  city: '',
  postalCode: ''
})

function goToReview() {
  router.push({
    name: 'review',
    query: {
      name: form.value.fullName,
      email: form.value.email
    }
  })
}
</script>

<template>
  <div class="container py-5">
    <h2 class="mb-4 text-center">Checkout</h2>

    <div class="card shadow p-4">
      <form @submit.prevent="goToReview">
        
        <div class="mb-3">
          <label class="form-label">Full Name</label>
          <input v-model="form.fullName" type="text" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Email</label>
          <input v-model="form.email" type="email" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Address</label>
          <input v-model="form.address" type="text" class="form-control" required />
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">City</label>
            <input v-model="form.city" type="text" class="form-control" required />
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Postal Code</label>
            <input v-model="form.postalCode" type="text" class="form-control" required />
          </div>
        </div>

        <button class="btn btn-dark w-100 mt-3">
          Continue to Review
        </button>

      </form>
    </div>
  </div>
</template>