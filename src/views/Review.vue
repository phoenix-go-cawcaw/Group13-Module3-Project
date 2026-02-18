<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const userId = 4
const totalAmount = "349.00"
const voucherCode = null

const handlePayNow = async () => {
  try {
    const response = await fetch("http://localhost:5000/payfast/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        total_amount: totalAmount,
        voucher_code: voucherCode
      })
    });

    const data = await response.json();
    console.log("PAYFAST RESPONSE:", data);

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
    console.error(err);
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

        <button class="btn btn-success w-50" @click="handlePayNow">
          Confirm & Pay
        </button>
      </div>

    </div>
  </div>
</template>