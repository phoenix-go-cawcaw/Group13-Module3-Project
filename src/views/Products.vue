<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import paintImg from '../assets/paint.png'
import leatherImg from '../assets/leatherworks.png'
import crochetImg from '../assets/crochet.png'
import plantsImg from '../assets/plants.png'
import scienceImg from '../assets/science.png'
import spicesImg from '../assets/spices.png'

const categories = [
  "All",
  "Arts & DIY",
  "Lifestyle",
  "STEM",
  "Food & Culture"
]

const selectedCategory = ref("All")
const showModal = ref(false)
const selectedProduct = ref(null)
const currentImageIndex = ref(0)

const products = [
  {
    name: "The Watercolorist Box",
    price: 549.00,
    category: "Arts & DIY",
    images: [paintImg]
  },
  {
    name: "The Leathercraft Box",
    price: 699.00,
    category: "Arts & DIY",
    images: [leatherImg]
  },
  {
    name: "The Crochet Box",
    price: 499.00,
    category: "Arts & DIY",
    images: [crochetImg]
  },
  {
    name: "The Plant Lover Box",
    price: 599.00,
    category: "Lifestyle",
    images: [plantsImg]
  },
  {
    name: "The Science Box",
    price: 649.00,
    category: "STEM",
    images: [scienceImg]
  },
  {
    name: "The Spice Box",
    price: 579.00,
    category: "Food & Culture",
    images: [spicesImg]
  }
]

const filteredProducts = computed(() => {
  if (selectedCategory.value === "All") return products
  return products.filter(p => p.category === selectedCategory.value)
})

function openQuickView(product) {
  selectedProduct.value = product
  currentImageIndex.value = 0
  showModal.value = true
}

function nextImage() {
  if (!selectedProduct.value) return
  currentImageIndex.value =
    (currentImageIndex.value + 1) % selectedProduct.value.images.length
}

function prevImage() {
  if (!selectedProduct.value) return
  currentImageIndex.value =
    (currentImageIndex.value - 1 + selectedProduct.value.images.length) %
    selectedProduct.value.images.length
}

function initObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, { threshold: 0.2 })

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el)
  })
}

onMounted(() => {
  initObserver()
})

watch(filteredProducts, async () => {
  await nextTick()
  initObserver()
})
</script>


<template>
  <main class="products-bg">

    <div class="container pb-5">

      <div class="text-center mb-4">
        <h1 class="luxury-title">Our Curated Collection</h1>
        <p class="luxury-subtitle">
          Discover thoughtfully crafted experiences designed to inspire.
        </p>
      </div>

      <div class="filter-buttons">
        <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat"
          :class="['filter-btn', selectedCategory === cat ? 'active' : '']">
          {{ cat }}
        </button>
      </div>

      <!-- <p>Products showing: {{ filteredProducts.length }}</p> -->

      <div class="row g-4 mt-3">
        <div class="col-12 col-md-6 col-lg-4 animate-on-scroll" v-for="(product, i) in filteredProducts" :key="i">
          <div class="luxury-card">

            <img :src="product.images[0]" />

            <div class="card-content">
              <h4>{{ product.name }}</h4>
              <p>{{ product.description }}</p>

              <div class="price">R{{ product.price }}</div>

              <button class="quick-btn" @click="openQuickView(product)">
                Quick View
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>



    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="luxury-modal">

        <div class="modal-image-section">
          <button class="carousel-btn left" @click="prevImage">‹</button>
          <img :src="selectedProduct.images[currentImageIndex]" />
          <button class="carousel-btn right" @click="nextImage">›</button>
        </div>

        <div class="modal-details">
          <h2>{{ selectedProduct.name }}</h2>
          <p>{{ selectedProduct.description }}</p>
          <div class="modal-price">R{{ selectedProduct.price }}</div>

          <button class="add-cart-btn">
            Add to Cart
          </button>
        </div>

      </div>
    </div>



  </main>
</template>

<style>
.products-bg {
  padding-top: 0;
  padding-bottom: 60px;
}

.products-hero {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.products-hero h1 {
  margin-top: 0;
}

.luxury-title {
  font-size: 2.5rem;
  color: #3E2A1B;
  font-weight: 700;
}

.luxury-subtitle {
  color: #5A3A22;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 20px;
  border-radius: 30px;
  border: 2px solid #A95A1C;
  background: transparent;
  color: #A95A1C;
  font-weight: 600;
  transition: 0.3s;
}

.filter-btn.active,
.filter-btn:hover {
  background: #A95A1C;
  color: white;
}

.luxury-card {
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transition: 0.4s ease;
}

.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: 0.6s ease;
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}

.luxury-card img {
  width: 100%;
  height: 240px;
  object-fit: contain;
  background: #F3E6D3;
  padding: 1rem;
}

.luxury-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.card-content {
  padding: 1.5rem;
}

.price {
  font-size: 1.2rem;
  color: #C06A22;
  font-weight: 700;
  margin: 0.5rem 0;
}

.quick-btn {
  background: #C06A22;
  border: none;
  color: white;
  padding: 8px 18px;
  border-radius: 25px;
  transition: 0.3s;
}

.quick-btn:hover {
  background: #A95A1C;
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
  transition: 0.6s ease;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.luxury-modal {
  background: white;
  width: 900px;
  max-width: 95%;
  border-radius: 20px;
  display: flex;
  overflow: hidden;
}

.modal-image-section {
  position: relative;
  width: 50%;
  background: #F3E6D3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-image-section img {
  width: 80%;
}

.carousel-btn {
  position: absolute;
  background: #A95A1C;
  color: white;
  border: none;
  font-size: 1.5rem;
  padding: 5px 12px;
  cursor: pointer;
}

.carousel-btn.left {
  left: 10px;
}

.carousel-btn.right {
  right: 10px;
}

.modal-details {
  padding: 2rem;
  width: 50%;
}

.modal-price {
  font-size: 1.5rem;
  color: #C06A22;
  margin: 1rem 0;
}

.add-cart-btn {
  background: #C06A22;
  border: none;
  color: white;
  padding: 12px 25px;
  border-radius: 30px;
  font-weight: 600;
}

.add-cart-btn:hover {
  background: #A95A1C;
}
</style>