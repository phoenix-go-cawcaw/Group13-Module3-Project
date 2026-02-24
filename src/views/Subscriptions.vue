<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const visibleCards = ref(new Set())

const pricingPlans = [
  {
    subscription_id: 312,
    subscription_name: "Arts & DIY Subscription",
    description: "A monthly creative subscription delivering curated arts and DIY hobby kits.",
    price: 449.00,
    features: [
      "Monthly curated box",
      "Step-by-step guides",
      "Access to exclusive tutorials"
    ]
  },
  {
    subscription_id: 487,
    subscription_name: "Green Living Subscription",
    description: "A sustainable living subscription focused on eco-friendly gardening and green practices.",
    price: 399.00,
    features: [
      "Seasonal seeds",
      "Organic materials",
      "Sustainable packaging"
    ]
  },
  {
    subscription_id: 654,
    subscription_name: "STEM Explorer Subscription",
    description: "An educational monthly STEM subscription designed for children.",
    price: 369.00,
    features: [
      "Hands-on science experiments",
      "Educational guides",
      "Safe materials"
    ]
  },
  {
    subscription_id: 829,
    subscription_name: "Culinary Discovery Subscription",
    description: "A monthly culinary subscription delivering spices and recipes from a new country.",
    price: 429.00,
    features: [
      "Authentic spices",
      "Cultural recipes",
      "Monthly country theme"
    ]
  },
  {
    subscription_id: 505,
    subscription_name: "Premium All-Access Plan",
    description: "Subscribers receive two boxes each month: one from any chosen hobby category and one flexible surprise box.",
    price: 899.00,
    isPremium: true,
    features: [
      "Two boxes per month",
      "Priority support & member perks",
      "Exclusive limited-edition boxes",
      "Early release theme reveals"
    ]
  },
  {
    subscription_id: 707,
    subscription_name: "School Discovery Plan",
    description: "Tailored monthly subscription for schools, supporting classroom learning in arts, STEM, and creative projects for ~30 students.",
    price: 3499.00,
    isSchool: true,
    features: [
      "Monthly classroom kits",
      "Teaching guides",
      "Online resources for educators",
      "Optional training webinars"
    ]
  }
];

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index') || '0')
          visibleCards.value = new Set([...visibleCards.value, index])
        }
      })
    },
    { threshold: 0.15 }
  )

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el)
  })
})

function handleSubscribeNow(plan) {
  sessionStorage.setItem('subscriptionCheckout', JSON.stringify({
    subscription_id: plan.subscription_id,
    subscription_name: plan.subscription_name,
    price: plan.price,
    type: 'subscription'
  }))
  router.push('/checkout')
}

function cardStyle(index) {
  return {
    opacity: visibleCards.value.has(index) ? 1 : 0,
    transform: visibleCards.value.has(index) ? 'translateY(0)' : 'translateY(32px)',
    transition: `opacity 0.55s ease ${index * 0.08}s, transform 0.55s ease ${index * 0.08}s`
  }
}

function featureStyle(cardIndex, featureIndex) {
  return {
    opacity: visibleCards.value.has(cardIndex) ? 1 : 0,
    transform: visibleCards.value.has(cardIndex) ? 'translateX(0)' : 'translateX(-10px)',
    transition: `opacity 0.4s ease ${0.4 + cardIndex * 0.08 + featureIndex * 0.05}s, transform 0.4s ease ${0.4 + cardIndex * 0.08 + featureIndex * 0.05}s`
  }
}
</script>

<template>
  <main class="pricing-bg">
    <div class="bg-blob bg-blob-left" />
    <div class="bg-blob bg-blob-right" />

    <div class="container">
      <div class="hero-section">
        <h1 class="pricing-title">Subscription Plans</h1>
        <p class="pricing-subtitle">
          Choose the perfect plan to fuel your creative journey. Cancel anytime.
        </p>
      </div>

      <div class="cards-grid">
        <div v-for="(plan, index) in pricingPlans" :key="plan.subscription_id" :data-index="index"
          class="animate-on-scroll card-wrapper" :style="cardStyle(index)">
          <div class="pricing-card" :class="{
            'pricing-card--premium': plan.isPremium,
            'pricing-card--school': plan.isSchool
          }">
            <div v-if="plan.isPremium || plan.isSchool" class="badge">
              <span v-if="plan.isPremium" class="badge-icon">✦</span>
              <span v-else class="badge-icon">🎓</span>
              <span class="badge-text">{{ plan.isPremium ? 'Premium' : 'Schools' }}</span>
            </div>

            <div class="card-body">
              <h3 class="plan-name">{{ plan.subscription_name }}</h3>

              <p class="plan-description">{{ plan.description }}</p>

              <div class="plan-price">
                <span class="price-amount">R{{ plan.price.toFixed(2) }}</span>
                <span class="price-period">/month</span>
              </div>

              <ul class="features-list">
                <li v-for="(feature, fIndex) in plan.features" :key="feature" class="feature-item"
                  :style="featureStyle(index, fIndex)">
                  <div class="feature-check">
                    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 7l3.5 3.5L12 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                    </svg>
                  </div>
                  <span class="feature-text">{{ feature }}</span>
                </li>
              </ul>

              <button class="subscribe-btn" @click="handleSubscribeNow(plan)">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="cta-section">
        <div class="cta-card">
          <h3 class="cta-title">Still not sure which plan is right for you?</h3>
          <p class="cta-subtitle">
            Contact our team for personalized recommendations or explore our one-time boxes first.
          </p>
          <div class="cta-buttons">
            <button class="btn-outline">Contact Us</button>
            <button class="btn-solid">Browse Products</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.pricing-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #F3E6D3 0%, #E8D5BE 100%);
  padding: 4rem 1rem 4rem;
  position: relative;
  overflow: hidden;
}

.bg-blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
  opacity: 0.05;
  background-color: #A95A1C;
}

.bg-blob-left {
  width: 18rem;
  height: 18rem;
  top: 5rem;
  left: 2.5rem;
}

.bg-blob-right {
  width: 24rem;
  height: 24rem;
  bottom: 5rem;
  right: 2.5rem;
  background-color: #C06A22;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  padding-top: 4rem;
}

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeUp 0.7s ease both;
}

.pricing-title {
  font-size: clamp(2.5rem, 6vw, 3.75rem);
  font-weight: 800;
  color: #3E2A1B;
  margin: 0 0 1rem;
}

.pricing-subtitle {
  font-size: 1.125rem;
  color: #5A3A22;
  max-width: 40rem;
  margin: 0 auto;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  max-width: 1280px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1280px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* .card-wrapper {
  /* opacity/transform driven by inline :style binding }*/


.pricing-card {
  border-radius: 1.5rem;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 6px 24px rgba(62, 42, 27, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.pricing-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(62, 42, 27, 0.2);
}

.pricing-card--premium {
  background: linear-gradient(135deg, #3E2A1B 0%, #5A3A22 100%);
}

.pricing-card--school {
  background: linear-gradient(135deg, #A95A1C 0%, #C06A22 100%);
}

.badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  animation: popIn 0.4s ease 0.3s both;
}

.badge-icon {
  font-size: 0.85rem;
  color: #fff;
}

.badge-text {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #fff;
}

.card-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.plan-name {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
  color: #3E2A1B;
}

.pricing-card--premium .plan-name,
.pricing-card--school .plan-name {
  color: #fff;
}

.plan-description {
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0 0 1rem;
  color: #5A3A22;
}

.pricing-card--premium .plan-description,
.pricing-card--school .plan-description {
  color: rgba(255, 255, 255, 0.88);
}

.plan-price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
}

.price-amount {
  font-size: 2.25rem;
  font-weight: 800;
  color: #C06A22;
}

.pricing-card--premium .price-amount,
.pricing-card--school .price-amount {
  color: #fff;
}

.price-period {
  font-size: 1rem;
  color: #5A3A22;
}

.pricing-card--premium .price-period,
.pricing-card--school .price-period {
  color: rgba(255, 255, 255, 0.75);
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  /* opacity/transform driven by inline :style */
}

.feature-check {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: #F3E6D3;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.1rem;
  color: #A95A1C;
}

.pricing-card--premium .feature-check,
.pricing-card--school .feature-check {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.feature-check svg {
  width: 0.8rem;
  height: 0.8rem;
}

.feature-text {
  font-size: 0.875rem;
  color: #5A3A22;
  line-height: 1.5;
}

.pricing-card--premium .feature-text,
.pricing-card--school .feature-text {
  color: rgba(255, 255, 255, 0.88);
}

.subscribe-btn {
  margin-top: auto;
  width: 100%;
  padding: 0.875rem 1.5rem;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  background: #3E2A1B;
  color: #fff;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
}

.subscribe-btn:hover {
  background: #5A3A22;
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(62, 42, 27, 0.3);
}

.subscribe-btn:active {
  transform: scale(0.98);
}

.pricing-card--premium .subscribe-btn,
.pricing-card--school .subscribe-btn {
  background: #fff;
  color: #3E2A1B;
}

.pricing-card--premium .subscribe-btn:hover,
.pricing-card--school .subscribe-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.cta-section {
  margin-top: 4rem;
  text-align: center;
  animation: fadeUp 0.6s ease 0.8s both;
}

.cta-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 1.5rem;
  padding: 2.5rem;
  max-width: 42rem;
  margin: 0 auto;
  box-shadow: 0 6px 24px rgba(62, 42, 27, 0.1);
}

.cta-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3E2A1B;
  margin: 0 0 0.75rem;
}

.cta-subtitle {
  color: #5A3A22;
  margin: 0 0 1.5rem;
  font-size: 0.95rem;
}

.cta-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
}

@media (min-width: 640px) {
  .cta-buttons {
    flex-direction: row;
  }
}

.btn-outline {
  padding: 0.75rem 2rem;
  border-radius: 999px;
  font-weight: 600;
  border: 2px solid #A95A1C;
  color: #A95A1C;
  background: transparent;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease, transform 0.2s ease;
}

.btn-outline:hover {
  background: #A95A1C;
  color: #fff;
  transform: scale(1.05);
}

.btn-solid {
  padding: 0.75rem 2rem;
  border-radius: 999px;
  font-weight: 600;
  border: none;
  background: #3E2A1B;
  color: #fff;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.btn-solid:hover {
  background: #5A3A22;
  transform: scale(1.05);
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>