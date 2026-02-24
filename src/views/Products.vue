<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useCart } from '../composables/useCart'
import paintImg from '../assets/paint.png'
import leatherImg from '../assets/leatherworks.png'
import crochetImg from '../assets/crochet.png'
import plantsImg from '../assets/plants.png'
import scienceImg from '../assets/science.png'
import spicesImg from '../assets/spices.png'

const { addToCart } = useCart()

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
const slideDirection = ref(1)
const isSliding = ref(false)

const products = [
  {
    product_id: 1,
    product_name: "The Watercolorist Box",
    category: "Arts & DIY",
    description: "A curated watercolor kit including paints, brushes, and premium paper for creative exploration",
    price: 549.00,
    images: [
      paintImg,
      "https://images.unsplash.com/photo-1761145275111-e62cbdba6f57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1732376879742-7e88f0fadaa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1613672029520-5de7376a6379?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
    ]
  },
  {
    product_id: 2,
    product_name: "Leatherworking Craft Box",
    category: "Arts & DIY",
    description: "A beginner-friendly leatherworking kit including pre-cut leather pieces, stitching tools, thread, and step-by-step instructions to create a handcrafted accessory.",
    price: 629.00,
    images: [
      leatherImg,
      "https://images.unsplash.com/photo-1668874184010-87aa286683dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1531188929123-0cfa61e6c770?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1711548244678-be7019032b59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
    ]
  },
  {
    product_id: 3,
    product_name: "Crochet Starter Box",
    category: "Arts & DIY",
    description: "A creative crochet kit featuring premium yarn, crochet hooks, and a guided pattern to help beginners create their own handmade project.",
    price: 499.00,
    images: [
      crochetImg,
      "https://images.unsplash.com/photo-1768218983339-0415a4ca932d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1630191631464-24a005b8cfda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1633002075487-7285c7a5d6a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
    ]
  },
  {
    product_id: 4,
    product_name: "The Plant Lover Box",
    category: "Lifestyle",
    description: "A sustainable gardening kit with seasonal seeds, organic soil pods, fertilizer, and a ceramic pot.",
    price: 499.00,
    images: [
      plantsImg,
      "https://images.unsplash.com/photo-1643902211235-c4123e314d98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1658867833383-a3710ca72c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1761206669413-0ca2c3d55bea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
    ]
  },
  {
    product_id: 5,
    product_name: "The Science Box",
    category: "STEM",
    description: "A child-friendly STEM kit containing materials for a guided monthly science experiment.",
    price: 649.00,
    images: [
      scienceImg,
      "https://images.unsplash.com/photo-1758685734153-132c8620c1bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1758685848543-5c8ba81bc822?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1676293107432-1b6753581201?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
    ]
  },
  {
    product_id: 6,
    product_name: "The Spice Box",
    category: "Food & Culture",
    description: "A global culinary experience featuring unique spices and authentic recipes from a featured country.",
    price: 579.00,
    images: [
      spicesImg,
      "https://images.unsplash.com/photo-1771148885088-81b45902fe8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1767327142231-ae442ca63fe2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1597359553885-944a619b9c99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
    ]
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
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  showModal.value = false
  document.body.style.overflow = ''
}

function handleAddToCart(product) {
  const cartItem = {
    id: product.product_id,
    name: product.product_name,
    price: product.price,
    description: product.description,
    category: product.category,
    type: 'product'
  }
  addToCart(cartItem)
  closeModal()
}

function goToImage(index) {
  if (!selectedProduct.value || isSliding.value) return
  slideDirection.value = index > currentImageIndex.value ? 1 : -1
  isSliding.value = true
  setTimeout(() => {
    currentImageIndex.value = index
    isSliding.value = false
  }, 200)
}

function nextImage() {
  if (!selectedProduct.value) return
  const next = (currentImageIndex.value + 1) % selectedProduct.value.images.length
  goToImage(next)
}

function prevImage() {
  if (!selectedProduct.value) return
  const prev = (currentImageIndex.value - 1 + selectedProduct.value.images.length) % selectedProduct.value.images.length
  goToImage(prev)
}

function initObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, { threshold: 0.15 })

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
      <div class="text-center mb-4 hero-section">
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

      <div class="row g-4 mt-3">
        <div class="col-12 col-md-6 col-lg-4 animate-on-scroll" v-for="(product, index) in filteredProducts"
          :key="product.product_id" :style="{ transitionDelay: `${index * 0.08}s` }">
          <div class="luxury-card">
            <div class="card-image-wrapper">
              <img :src="product.images[0]" :alt="product.product_name" class="card-img" />
              <div class="card-overlay">
                <button class="overlay-quick-btn" @click="openQuickView(product)">
                  Quick View
                </button>
              </div>
              <div v-if="product.images.length > 1" class="image-count-badge">
                +{{ product.images.length - 1 }} photos
              </div>
            </div>

            <div class="card-content">
              <span class="category-tag">{{ product.category }}</span>
              <h4>{{ product.product_name }}</h4>
              <p>{{ product.description }}</p>

              <div class="price">R{{ product.price.toFixed(2) }}</div>

              <div class="card-actions">
                <button class="add-cart-btn-small" @click="handleAddToCart(product)">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <Transition name="modal-pop">
          <div class="luxury-modal" v-if="showModal" @click.stop>
            <button class="modal-close-btn" @click="closeModal">✕</button>

            <div class="modal-image-section">
              <button class="carousel-btn left" @click="prevImage">‹</button>

              <div class="carousel-viewport">
                <Transition :name="slideDirection > 0 ? 'slide-left' : 'slide-right'" mode="out-in">
                  <img :key="currentImageIndex" :src="selectedProduct.images[currentImageIndex]"
                    :alt="selectedProduct.product_name" class="modal-img" />
                </Transition>
              </div>

              <button class="carousel-btn right" @click="nextImage">›</button>

              <div class="carousel-dots">
                <button v-for="(_, idx) in selectedProduct.images" :key="idx"
                  :class="['dot', idx === currentImageIndex ? 'active' : '']" @click="goToImage(idx)" />
              </div>
            </div>

            <div class="modal-details">
              <span class="modal-category-tag">{{ selectedProduct.category }}</span>
              <h2>{{ selectedProduct.product_name }}</h2>
              <p>{{ selectedProduct.description }}</p>
              <div class="modal-price">R{{ selectedProduct.price.toFixed(2) }}</div>

              <button class="add-cart-btn" @click="handleAddToCart(selectedProduct)">
                Add to Cart
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.products-bg {
  padding-top: 0;
  padding-bottom: 60px;
}

.hero-section {
  animation: fadeUp 0.7s ease both;
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

.luxury-title {
  font-size: clamp(2.5rem, 6vw, 3.75rem);
  font-weight: 800;
  color: #3E2A1B;
  margin: 0 0 1rem;
}

.luxury-subtitle {
  font-size: 1.125rem;
  color: #5A3A22;
  max-width: 40rem;
  margin: 0 auto;
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
  transition: background 0.25s, color 0.25s, transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.filter-btn.active,
.filter-btn:hover {
  background: #A95A1C;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(169, 90, 28, 0.35);
}

.animate-on-scroll {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}

.luxury-card {
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.luxury-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.card-image-wrapper {
  position: relative;
  overflow: hidden;
  background: #F3E6D3;
}

.card-img {
  width: 100%;
  height: 240px;
  object-fit: contain;
  padding: 1rem;
  display: block;
  transition: transform 0.4s ease;
}

.luxury-card:hover .card-img {
  transform: scale(1.04);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.55) 0%, transparent 60%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 1.25rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.luxury-card:hover .card-overlay {
  opacity: 1;
}

.overlay-quick-btn {
  background: white;
  color: #3E2A1B;
  border: none;
  padding: 8px 22px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
}

.overlay-quick-btn:hover {
  transform: scale(1.06);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
}

.image-count-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(62, 42, 27, 0.75);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  pointer-events: none;
}

.card-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.category-tag {
  display: inline-block;
  background: #F3E6D3;
  color: #A95A1C;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 10px;
  border-radius: 20px;
  margin-bottom: 0.6rem;
}

.card-content h4 {
  color: #3E2A1B;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  font-weight: 700;
}

.card-content p {
  color: #5A3A22;
  font-size: 0.92rem;
  line-height: 1.5;
  flex: 1;
}

.price {
  font-size: 1.2rem;
  color: #C06A22;
  font-weight: 700;
  margin: 0.6rem 0;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.add-cart-btn-small {
  background: #3E2A1B;
  border: none;
  color: white;
  padding: 8px 18px;
  border-radius: 25px;
  transition: background 0.25s, transform 0.2s;
  cursor: pointer;
  flex: 1;
  font-weight: 600;
}

.add-cart-btn-small:hover {
  background: #5A3A22;
  transform: translateY(-1px);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1500;
  padding: 1rem;
}

.luxury-modal {
  background: white;
  width: 900px;
  max-width: 95%;
  max-height: 90vh;
  border-radius: 24px;
  display: flex;
  overflow: hidden;
  position: relative;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
}

.modal-close-btn {
  position: absolute;
  top: 14px;
  right: 16px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #3E2A1B;
  font-size: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.modal-close-btn:hover {
  background: #fff;
  transform: rotate(90deg);
}

.modal-image-section {
  position: relative;
  width: 50%;
  background: #F3E6D3;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 420px;
  overflow: hidden;
}

.carousel-viewport {
  width: 80%;
  max-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.modal-img {
  width: 100%;
  max-height: 340px;
  object-fit: contain;
  display: block;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #A95A1C;
  color: white;
  border: none;
  font-size: 1.6rem;
  width: 38px;
  height: 38px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: opacity 0.25s, transform 0.2s, background 0.2s;
  z-index: 2;
  line-height: 1;
}

.carousel-btn:hover {
  opacity: 1;
  background: #3E2A1B;
  transform: translateY(-50%) scale(1.1);
}

.carousel-btn.left {
  left: 10px;
}

.carousel-btn.right {
  right: 10px;
}

.carousel-dots {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  align-items: center;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #C9A27B;
  border: none;
  cursor: pointer;
  transition: width 0.25s ease, background 0.25s ease;
  padding: 0;
}

.dot.active {
  width: 22px;
  background: #A95A1C;
}

.modal-details {
  padding: 2.2rem 2rem;
  width: 50%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.modal-category-tag {
  display: inline-block;
  background: #F3E6D3;
  color: #A95A1C;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 1rem;
}

.modal-details h2 {
  color: #3E2A1B;
  margin-bottom: 1rem;
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.25;
}

.modal-details p {
  color: #5A3A22;
  line-height: 1.7;
  flex: 1;
}

.modal-price {
  font-size: 1.6rem;
  color: #C06A22;
  margin: 1.2rem 0;
  font-weight: 700;
}

.add-cart-btn {
  background: #C06A22;
  border: none;
  color: white;
  padding: 13px 25px;
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  transition: background 0.25s, transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 12px rgba(192, 106, 34, 0.35);
}

.add-cart-btn:hover {
  background: #A95A1C;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(169, 90, 28, 0.4);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-pop-enter-active {
  transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-pop-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.modal-pop-enter-from {
  opacity: 0;
  transform: scale(0.92) translateY(20px);
}

.modal-pop-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(10px);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-40px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

@media (max-width: 768px) {
  .luxury-modal {
    flex-direction: column;
    max-height: 85vh;
    overflow-y: auto;
  }

  .modal-image-section,
  .modal-details {
    width: 100%;
  }

  .modal-image-section {
    min-height: 280px;
  }

  .modal-close-btn {
    top: 10px;
    right: 10px;
  }
}
</style>