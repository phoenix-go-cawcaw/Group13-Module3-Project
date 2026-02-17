<script setup>
const pricingPlans = [
  {
    plan_id: 312,
    name: "Arts & DIY Subscription",
    description: "A monthly creative subscription delivering curated arts and DIY hobby kits.",
    price: 449.00,
    features: [
      "Monthly curated box",
      "Step-by-step guides",
      "Access to exclusive tutorials"
    ]
  },
  {
    plan_id: 487,
    name: "Green Living Subscription",
    description: "A sustainable living subscription focused on eco-friendly gardening and green practices.",
    price: 399.00,
    features: [
      "Seasonal seeds",
      "Organic materials",
      "Sustainable packaging"
    ]
  },
  {
    plan_id: 654,
    name: "STEM Explorer Subscription",
    description: "An educational monthly STEM subscription designed for children.",
    price: 369.00,
    features: [
      "Hands-on science experiments",
      "Educational guides",
      "Safe materials"
    ]
  },
  {
    plan_id: 829,
    name: "Culinary Discovery Subscription",
    description: "A monthly culinary subscription delivering spices and recipes from a new country.",
    price: 429.00,
    features: [
      "Authentic spices",
      "Cultural recipes",
      "Monthly country theme"
    ]
  },
  {
    plan_id: 505,
    name: "Premium All-Access Plan",
    description: "Subscribers receive two boxes each month: one from any chosen hobby category and one flexible surprise box.",
    price: 899.00,
    features: [
      "Two boxes per month",
      "Priority support & member perks",
      "Exclusive limited-edition boxes",
      "Early release theme reveals"
    ]
  },
  {
    plan_id: 707,
    name: "School Discovery Plan",
    description: "Tailored monthly subscription for schools, supporting classroom learning in arts, STEM, and creative projects for ~30 students.",
    price: 3499.00,
    features: [
      "Monthly classroom kits",
      "Teaching guides",
      "Online resources for educators",
      "Optional training webinars"
    ]
  }
];

</script>


<template>
  <main class="pricing-bg py-5">
    <div class="container">
      <h2 class="fw-bold text-center mb-4 pricing-title">Subscription Plans</h2>
      <br>
      <div class="row g-4 justify-content-center">
        <div v-for="plan in pricingPlans" :key="plan.plan_id" class="col-12 col-md-6 col-xl-4 d-flex">
          <div class="card pricing-card h-100 w-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h3 class="h5 card-title fw-semibold mb-2">{{ plan.name }}</h3>
              <p class="card-text text-muted mb-3">{{ plan.description }}</p>
              <p class="fw-bold mb-3">R {{ plan.price.toFixed(2) }}/month</p>
              <ul class="mb-4 ps-3">
                <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
              </ul>
              <RouterLink class="btn btn-success mt-auto" to="/checkout">Subscribe Now</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
.pricing-bg{
  background-image: url(https://img.freepik.com/free-vector/blurred-light-background-design_1107-160.jpg?t=st=1770904010~exp=1770907610~hmac=0a26e817aab791674c21f016c9f7242727292ad2fe329935bb71ced6b81d2517);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  padding: 1rem 2rem 2rem;
}

.pricing-title {
  margin-top: 0;
}

.pricing-card {
  border-radius: 1rem;
  overflow: hidden;
  background-color: #f3e7d3;
}

.pricing-bg {
  padding-top: 1 rem;   /* smaller top padding */
}

.pricing-title {
  margin-top: -7rem;   /* moves h2 up */
}

</style>
