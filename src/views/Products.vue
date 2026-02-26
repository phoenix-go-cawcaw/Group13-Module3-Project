<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCart } from '../composables/useCart'

const route = useRoute()
const router = useRouter()

const showWelcome = ref(false)
const welcomeMessage = ref('')
import paintImg from '../assets/paint.png'
import leatherImg from '../assets/leatherworks.png'
import crochetImg from '../assets/crochet.png'
import plantsImg from '../assets/plants.png'
import scienceImg from '../assets/science.png'
import spicesImg from '../assets/spices.png'

const { addToCart } = useCart()

const categories = ["All","Arts & DIY","Lifestyle","STEM","Food & Culture"]

const selectedCategory = ref("All")
const searchQuery = ref("")
const sortOption = ref("default")
const showModal = ref(false)
const selectedProduct = ref(null)
const currentImageIndex = ref(0)
const slideDirection = ref(1)
const isSliding = ref(false)
const addedToCart = ref(null)

const products = [
  { product_id: 1, product_name: "The Watercolorist Box", category: "Arts & DIY", description: "A curated watercolor kit including paints, brushes, and premium paper for creative exploration", price: 549.00, images: [paintImg,"https://images.unsplash.com/photo-1761145275111-e62cbdba6f57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080","https://images.unsplash.com/photo-1732376879742-7e88f0fadaa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080","https://images.unsplash.com/photo-1613672029520-5de7376a6379?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"] },
  { product_id: 2, product_name: "Leatherworking Craft Box", category: "Arts & DIY", description: "A beginner-friendly leatherworking kit including pre-cut leather pieces, stitching tools, thread, and step-by-step instructions to create a handcrafted accessory.", price: 629.00, images: [leatherImg,"https://images.unsplash.com/photo-1668874184010-87aa286683dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080","https://images.unsplash.com/photo-1531188929123-0cfa61e6c770?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080","https://images.unsplash.com/photo-1711548244678-be7019032b59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"] },
  { product_id: 3, product_name: "Crochet Starter Box", category: "Arts & DIY", description: "A creative crochet kit featuring premium yarn, crochet hooks, and a guided pattern to help beginners create their own handmade project.", price: 499.00, images: [crochetImg,"https://images.unsplash.com/photo-1768218983339-0415a4ca932d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080","https://images.unsplash.com/photo-1630191631464-24a005b8cfda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080","https://images.unsplash.com/photo-1633002075487-7285c7a5d6a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"] },
  { product_id: 4, product_name: "The Plant Lover Box", category: "Lifestyle", description: "A sustainable gardening kit with seasonal seeds, organic soil pods, fertilizer, and a ceramic pot.", price: 499.00, images: [plantsImg,"https://images.unsplash.com/photo-1643902211235-c4123e314d98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080","https://images.unsplash.com/photo-1658867833383-a3710ca72c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080","https://images.unsplash.com/photo-1761206669413-0ca2c3d55bea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"] },
  { product_id: 5, product_name: "The Science Box", category: "STEM", description: "A child-friendly STEM kit containing materials for a guided monthly science experiment.", price: 649.00, images: [scienceImg,"https://images.unsplash.com/photo-1758685734153-132c8620c1bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080","https://images.unsplash.com/photo-1758685848543-5c8ba81bc822?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080","https://images.unsplash.com/photo-1676293107432-1b6753581201?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"] },
  { product_id: 6, product_name: "The Spice Box", category: "Food & Culture", description: "A global culinary experience featuring unique spices and authentic recipes from a featured country.", price: 579.00, images: [spicesImg,"https://images.unsplash.com/photo-1771148885088-81b45902fe8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080","https://images.unsplash.com/photo-1767327142231-ae442ca63fe2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080","https://images.unsplash.com/photo-1597359553885-944a619b9c99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"] }
]

const filteredProducts = computed(() => {
  let result = products
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p => p.product_name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
  }
  if (selectedCategory.value !== "All") result = result.filter(p => p.category === selectedCategory.value)
  switch (sortOption.value) {
    case 'price-asc': result = [...result].sort((a, b) => a.price - b.price); break
    case 'price-desc': result = [...result].sort((a, b) => b.price - a.price); break
    case 'name-asc': result = [...result].sort((a, b) => a.product_name.localeCompare(b.product_name)); break
    case 'name-desc': result = [...result].sort((a, b) => b.product_name.localeCompare(a.product_name)); break
  }
  return result
})

const hasActiveFilters = computed(() => searchQuery.value.trim() || selectedCategory.value !== 'All' || sortOption.value !== 'default')

function clearFilters() { searchQuery.value = ''; selectedCategory.value = 'All'; sortOption.value = 'default' }

function openQuickView(product) { selectedProduct.value = product; currentImageIndex.value = 0; showModal.value = true; document.body.style.overflow = 'hidden' }
function closeModal() { showModal.value = false; document.body.style.overflow = '' }

function handleAddToCart(product) {
  addToCart({ id: product.product_id, name: product.product_name, price: product.price, description: product.description, category: product.category, type: 'product' })
  addedToCart.value = product.product_id
  setTimeout(() => { addedToCart.value = null }, 1800)
  if (showModal.value) closeModal()
}

function goToImage(index) {
  if (!selectedProduct.value || isSliding.value) return
  slideDirection.value = index > currentImageIndex.value ? 1 : -1
  isSliding.value = true
  setTimeout(() => { currentImageIndex.value = index; isSliding.value = false }, 200)
}
function nextImage() { if (!selectedProduct.value) return; goToImage((currentImageIndex.value + 1) % selectedProduct.value.images.length) }
function prevImage() { if (!selectedProduct.value) return; goToImage((currentImageIndex.value - 1 + selectedProduct.value.images.length) % selectedProduct.value.images.length) }

function initObserver() {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible') }), { threshold: 0.1 })
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))
}

onMounted(() => {
  const q = route.query.welcome
  if (q === 'new') { welcomeMessage.value = '✦ Welcome to Hobby in a Box!'; showWelcome.value = true }
  if (q === 'back') { welcomeMessage.value = '✦ Welcome Back!'; showWelcome.value = true }
  if (showWelcome.value) setTimeout(() => { showWelcome.value = false; router.replace({ query: {} }) }, 4000)
  initObserver()
})
watch(filteredProducts, async () => { await nextTick(); initObserver() })
</script>

<template>
  <main class="products-bg">
    <Transition name="banner">
      <div v-if="showWelcome" class="welcome-banner" role="status" aria-live="polite">{{ welcomeMessage }}</div>
    </Transition>

    <div class="container pb-5">
      <!-- Breadcrumb -->
      <nav class="breadcrumb-nav" aria-label="breadcrumb">
        <ol class="breadcrumb-list">
          <li><RouterLink to="/" class="breadcrumb-link">Home</RouterLink></li>
          <li><span class="breadcrumb-sep">›</span></li>
          <li v-if="selectedCategory === 'All'"><span class="breadcrumb-current">All Products</span></li>
          <template v-else>
            <li><button class="breadcrumb-link breadcrumb-btn" @click="selectedCategory = 'All'">All Products</button></li>
            <li><span class="breadcrumb-sep">›</span></li>
            <li><span class="breadcrumb-current">{{ selectedCategory }}</span></li>
          </template>
        </ol>
      </nav>

      <!-- Hero -->
      <div class="text-center mb-3 hero-section">
        <h1 class="luxury-title">Our Curated Collection</h1>
        <p class="luxury-subtitle">Discover thoughtfully crafted experiences designed to inspire.</p>
      </div>

      <!-- Search Bar -->
      <div class="search-wrapper">
        <div class="search-input-group">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input v-model="searchQuery" type="search" placeholder="Search by name, category, or keyword…" class="search-input" aria-label="Search products" />
          <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''" aria-label="Clear search">✕</button>
        </div>
      </div>

      <!-- Filters & Sort Row -->
      <div class="controls-row">
        <div class="filter-buttons" role="group" aria-label="Filter by category">
          <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat" :class="['filter-btn', selectedCategory === cat ? 'active' : '']" :aria-pressed="selectedCategory === cat">{{ cat }}</button>
        </div>
        <div class="sort-group">
          <label class="sort-label" for="sort-select">Sort:</label>
          <select id="sort-select" v-model="sortOption" class="sort-select" aria-label="Sort products">
            <option value="default">Featured</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name-asc">Name: A–Z</option>
            <option value="name-desc">Name: Z–A</option>
          </select>
        </div>
      </div>

      <!-- Results bar -->
      <div class="results-bar">
        <span class="results-count" aria-live="polite" aria-atomic="true">
          <strong>{{ filteredProducts.length }}</strong> {{ filteredProducts.length === 1 ? 'box' : 'boxes' }}
          <template v-if="selectedCategory !== 'All'"> in <em>{{ selectedCategory }}</em></template>
          <template v-if="searchQuery.trim()"> matching "<em>{{ searchQuery }}</em>"</template>
        </span>
        <button v-if="hasActiveFilters" class="clear-filters-btn" @click="clearFilters">✕ Clear all</button>
      </div>

      <!-- Product Grid -->
      <div class="row g-4 mt-1">
        <div class="col-12 col-md-6 col-lg-4 animate-on-scroll" v-for="(product, index) in filteredProducts" :key="product.product_id" :style="{ transitionDelay: `${index * 0.08}s` }">
          <div class="luxury-card">
            <div class="card-image-wrapper">
              <img :src="product.images[0]" :alt="product.product_name" class="card-img" loading="lazy" />
              <div class="card-overlay">
                <button class="overlay-quick-btn" @click="openQuickView(product)">Quick View</button>
              </div>
              <div v-if="product.images.length > 1" class="image-count-badge">+{{ product.images.length - 1 }} photos</div>
              <Transition name="added-toast">
                <div v-if="addedToCart === product.product_id" class="added-toast" role="status">✓ Added!</div>
              </Transition>
            </div>
            <div class="card-content">
              <span class="category-tag">{{ product.category }}</span>
              <h4>{{ product.product_name }}</h4>
              <p>{{ product.description }}</p>
              <div class="price">R{{ product.price.toFixed(2) }}</div>
              <div class="card-actions">
                <button class="add-cart-btn-small" @click="handleAddToCart(product)">Add to Cart</button>
                <button class="quick-view-btn-small" @click="openQuickView(product)" aria-label="Quick view {{ product.product_name }}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filteredProducts.length === 0" class="empty-state" role="status">
        <div class="empty-icon">🔍</div>
        <h3>No boxes found</h3>
        <p>Nothing matched your search. Try different keywords or clear your filters.</p>
        <button class="clear-filters-btn large" @click="clearFilters">Clear all filters</button>
      </div>
    </div>

    <!-- Quick View Modal -->
    <Transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal" role="dialog" aria-modal="true" :aria-label="selectedProduct?.product_name">
        <Transition name="modal-pop">
          <div class="luxury-modal" v-if="showModal" @click.stop>
            <button class="modal-close-btn" @click="closeModal" aria-label="Close modal">✕</button>

            <!-- Modal breadcrumb -->
            <div class="modal-breadcrumb" v-if="selectedProduct">
              <RouterLink to="/products" class="breadcrumb-link" style="font-size:0.78rem">Products</RouterLink>
              <span class="breadcrumb-sep">›</span>
              <span style="color:#A95A1C;font-size:0.78rem">{{ selectedProduct.category }}</span>
              <span class="breadcrumb-sep">›</span>
              <span class="breadcrumb-current" style="font-size:0.78rem">{{ selectedProduct.product_name }}</span>
            </div>

            <div class="modal-body-row">
              <div class="modal-image-section">
                <button class="carousel-btn left" @click="prevImage" aria-label="Previous image">‹</button>
                <div class="carousel-viewport">
                  <Transition :name="slideDirection > 0 ? 'slide-left' : 'slide-right'" mode="out-in">
                    <img :key="currentImageIndex" :src="selectedProduct.images[currentImageIndex]" :alt="selectedProduct.product_name" class="modal-img" />
                  </Transition>
                </div>
                <button class="carousel-btn right" @click="nextImage" aria-label="Next image">›</button>
                <div class="carousel-dots">
                  <button v-for="(_, idx) in selectedProduct.images" :key="idx" :class="['dot', idx === currentImageIndex ? 'active' : '']" @click="goToImage(idx)" :aria-label="`Image ${idx + 1}`" />
                </div>
              </div>

              <div class="modal-details">
                <span class="modal-category-tag">{{ selectedProduct.category }}</span>
                <h2>{{ selectedProduct.product_name }}</h2>
                <p>{{ selectedProduct.description }}</p>
                <div class="modal-price">R{{ selectedProduct.price.toFixed(2) }}</div>
                <button class="add-cart-btn" @click="handleAddToCart(selectedProduct)">Add to Cart</button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.products-bg { padding-top: 0; padding-bottom: 60px; }

/* Breadcrumb */
.breadcrumb-nav { padding: 1rem 0 0.25rem; }
.breadcrumb-list { list-style: none; margin: 0; padding: 0; display: flex; align-items: center; gap: 6px; font-size: 0.82rem; flex-wrap: wrap; }
.breadcrumb-link { color: #A95A1C; text-decoration: none; font-weight: 500; transition: color 0.2s; }
.breadcrumb-link:hover { color: #3E2A1B; text-decoration: underline; }
.breadcrumb-btn { background: none; border: none; cursor: pointer; padding: 0; font-size: 0.82rem; }
.breadcrumb-sep { color: #C9A27B; }
.breadcrumb-current { color: #5A3A22; font-weight: 600; }

/* Welcome Banner */
.welcome-banner { position: fixed; top: 80px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #A95A1C, #C06A22); color: #fff; padding: 14px 32px; border-radius: 40px; font-size: 1rem; font-weight: 700; letter-spacing: 0.04em; box-shadow: 0 8px 24px rgba(169,90,28,.45); z-index: 9999; white-space: nowrap; pointer-events: none; }
.banner-enter-active, .banner-leave-active { transition: transform .5s cubic-bezier(.34,1.56,.64,1), opacity .4s ease; }
.banner-enter-from, .banner-leave-to { transform: translateX(-50%) translateY(-60px); opacity: 0; }

.hero-section { animation: fadeUp 0.7s ease both; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

.luxury-title { font-size: clamp(2.2rem, 6vw, 3.5rem); font-weight: 800; color: #3E2A1B; margin: 0 0 1rem; }
.luxury-subtitle { font-size: 1.125rem; color: #5A3A22; max-width: 40rem; margin: 0 auto; }

/* Search */
.search-wrapper { max-width: 580px; margin: 1.5rem auto 1.25rem; }
.search-input-group { position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; left: 14px; color: #A95A1C; pointer-events: none; }
.search-input { width: 100%; padding: 11px 40px 11px 44px; border: 2px solid #E2C49A; border-radius: 40px; background: #fff; color: #3E2A1B; font-size: 0.95rem; outline: none; transition: border-color 0.25s, box-shadow 0.25s; }
.search-input:focus { border-color: #A95A1C; box-shadow: 0 0 0 3px rgba(169,90,28,0.15); }
.search-input::placeholder { color: #C9A27B; }
.search-input::-webkit-search-cancel-button { -webkit-appearance: none; }
.search-clear { position: absolute; right: 14px; background: none; border: none; color: #A95A1C; cursor: pointer; font-size: 0.9rem; padding: 2px 5px; border-radius: 50%; transition: background 0.2s; }
.search-clear:hover { background: #F3E6D3; }

/* Controls row */
.controls-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.75rem; }
.filter-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-btn { padding: 7px 16px; border-radius: 30px; border: 2px solid #A95A1C; background: transparent; color: #A95A1C; font-weight: 600; font-size: 0.875rem; transition: background 0.25s, color 0.25s, transform 0.2s, box-shadow 0.2s; cursor: pointer; white-space: nowrap; }
.filter-btn.active, .filter-btn:hover { background: #A95A1C; color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(169,90,28,.35); }

/* Sort */
.sort-group { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.sort-label { font-size: 0.82rem; color: #5A3A22; font-weight: 600; white-space: nowrap; }
.sort-select { padding: 7px 30px 7px 12px; border: 2px solid #E2C49A; border-radius: 8px; background: #fff; color: #3E2A1B; font-size: 0.875rem; font-weight: 600; cursor: pointer; outline: none; -webkit-appearance: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23A95A1C' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; transition: border-color 0.2s; }
.sort-select:focus { border-color: #A95A1C; }

/* Results bar */
.results-bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.4rem 0 0.75rem; border-bottom: 1px solid #F0DCC4; margin-bottom: 0.5rem; flex-wrap: wrap; }
.results-count { font-size: 0.85rem; color: #7A5230; }
.results-count strong, .results-count em { color: #3E2A1B; font-style: normal; }
.clear-filters-btn { background: none; border: 1.5px solid #C9A27B; color: #A95A1C; font-size: 0.8rem; font-weight: 600; padding: 4px 12px; border-radius: 20px; cursor: pointer; transition: background 0.2s, border-color 0.2s; }
.clear-filters-btn:hover { background: #F3E6D3; border-color: #A95A1C; }
.clear-filters-btn.large { font-size: 0.95rem; padding: 10px 24px; margin-top: 1rem; }

/* Scroll animation */
.animate-on-scroll { opacity: 0; transform: translateY(32px); transition: opacity 0.55s ease, transform 0.55s ease; }
.animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

/* Cards */
.luxury-card { background: #fff; border-radius: 18px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,.08); transition: transform 0.35s ease, box-shadow 0.35s ease; height: 100%; display: flex; flex-direction: column; }
.luxury-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,.15); }
.card-image-wrapper { position: relative; overflow: hidden; background: #F3E6D3; }
.card-img { width: 100%; height: 240px; object-fit: contain; padding: 1rem; display: block; transition: transform 0.4s ease; }
.luxury-card:hover .card-img { transform: scale(1.04); }
.card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,.55) 0%, transparent 60%); display: flex; align-items: flex-end; justify-content: center; padding-bottom: 1.25rem; opacity: 0; transition: opacity 0.3s ease; }
.luxury-card:hover .card-overlay { opacity: 1; }
.overlay-quick-btn { background: white; color: #3E2A1B; border: none; padding: 8px 22px; border-radius: 30px; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,.2); transition: transform 0.2s, box-shadow 0.2s; }
.overlay-quick-btn:hover { transform: scale(1.06); }
.image-count-badge { position: absolute; top: 10px; right: 10px; background: rgba(62,42,27,.75); color: #fff; font-size: 0.72rem; font-weight: 600; padding: 3px 10px; border-radius: 20px; backdrop-filter: blur(4px); pointer-events: none; }
.added-toast { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); background: #3E2A1B; color: white; padding: 8px 18px; border-radius: 30px; font-weight: 700; font-size: 0.9rem; pointer-events: none; z-index: 10; }
.added-toast-enter-active { transition: opacity 0.2s, transform 0.3s cubic-bezier(.34,1.56,.64,1); }
.added-toast-leave-active { transition: opacity 0.3s; }
.added-toast-enter-from { opacity: 0; transform: translate(-50%,-50%) scale(0.7); }
.added-toast-leave-to { opacity: 0; }

.card-content { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
.category-tag { display: inline-block; background: #F3E6D3; color: #A95A1C; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 3px 10px; border-radius: 20px; margin-bottom: 0.6rem; }
.card-content h4 { color: #3E2A1B; margin-bottom: 0.5rem; font-size: 1.15rem; font-weight: 700; }
.card-content p { color: #5A3A22; font-size: 0.92rem; line-height: 1.5; flex: 1; }
.price { font-size: 1.2rem; color: #C06A22; font-weight: 700; margin: 0.6rem 0; }
.card-actions { display: flex; gap: 8px; margin-top: 10px; align-items: center; }
.add-cart-btn-small { background: #3E2A1B; border: none; color: white; padding: 8px 18px; border-radius: 25px; transition: background 0.25s, transform 0.2s; cursor: pointer; flex: 1; font-weight: 600; font-size: 0.875rem; }
.add-cart-btn-small:hover { background: #5A3A22; transform: translateY(-1px); }
.quick-view-btn-small { background: #F3E6D3; border: none; color: #A95A1C; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s, transform 0.2s; flex-shrink: 0; }
.quick-view-btn-small:hover { background: #E2C49A; transform: scale(1.1); }

/* Empty state */
.empty-state { text-align: center; padding: 4rem 1rem; animation: fadeUp 0.5s ease both; }
.empty-icon { font-size: 3rem; margin-bottom: 1rem; }
.empty-state h3 { color: #3E2A1B; font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
.empty-state p { color: #7A5230; max-width: 400px; margin: 0 auto 1rem; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.55); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 1500; padding: 1rem; }
.luxury-modal { background: white; width: 920px; max-width: 96%; max-height: 92vh; border-radius: 24px; display: flex; flex-direction: column; overflow: hidden; position: relative; box-shadow: 0 30px 80px rgba(0,0,0,.3); }
.modal-breadcrumb { padding: 0.65rem 1.5rem; display: flex; align-items: center; gap: 6px; border-bottom: 1px solid #F0DCC4; flex-shrink: 0; flex-wrap: wrap; }
.modal-body-row { display: flex; flex: 1; overflow: hidden; min-height: 0; }
.modal-close-btn { position: absolute; top: 10px; right: 14px; z-index: 10; background: rgba(255,255,255,.9); border: none; color: #3E2A1B; font-size: 1rem; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s, transform 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,.12); }
.modal-close-btn:hover { background: #fff; transform: rotate(90deg); }
.modal-image-section { position: relative; width: 50%; background: #F3E6D3; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
.carousel-viewport { width: 80%; max-height: 320px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.modal-img { width: 100%; max-height: 300px; object-fit: contain; display: block; }
.carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); background: #A95A1C; color: white; border: none; font-size: 1.6rem; width: 38px; height: 38px; cursor: pointer; border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0.8; transition: opacity 0.25s, transform 0.2s, background 0.2s; z-index: 2; }
.carousel-btn:hover { opacity: 1; background: #3E2A1B; transform: translateY(-50%) scale(1.1); }
.carousel-btn.left { left: 10px; }
.carousel-btn.right { right: 10px; }
.carousel-dots { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; align-items: center; }
.dot { width: 8px; height: 8px; border-radius: 999px; background: #C9A27B; border: none; cursor: pointer; transition: width 0.25s ease, background 0.25s ease; padding: 0; }
.dot.active { width: 22px; background: #A95A1C; }
.modal-details { padding: 2rem; width: 50%; display: flex; flex-direction: column; overflow-y: auto; }
.modal-category-tag { display: inline-block; background: #F3E6D3; color: #A95A1C; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 12px; border-radius: 20px; margin-bottom: 1rem; }
.modal-details h2 { color: #3E2A1B; margin-bottom: 1rem; font-size: 1.6rem; font-weight: 700; line-height: 1.25; }
.modal-details p { color: #5A3A22; line-height: 1.7; flex: 1; }
.modal-price { font-size: 1.6rem; color: #C06A22; margin: 1.2rem 0; font-weight: 700; }
.add-cart-btn { background: #C06A22; border: none; color: white; padding: 13px 25px; border-radius: 30px; font-weight: 700; cursor: pointer; width: 100%; font-size: 1rem; transition: background 0.25s, transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 12px rgba(192,106,34,.35); }
.add-cart-btn:hover { background: #A95A1C; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(169,90,28,.4); }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-pop-enter-active { transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1); }
.modal-pop-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.modal-pop-enter-from { opacity: 0; transform: scale(0.92) translateY(20px); }
.modal-pop-leave-to { opacity: 0; transform: scale(0.96) translateY(10px); }
.slide-left-enter-active, .slide-left-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.slide-left-enter-from { opacity: 0; transform: translateX(40px); }
.slide-left-leave-to { opacity: 0; transform: translateX(-40px); }
.slide-right-enter-active, .slide-right-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.slide-right-enter-from { opacity: 0; transform: translateX(-40px); }
.slide-right-leave-to { opacity: 0; transform: translateX(40px); }

@media (max-width: 767px) {
  .controls-row { flex-direction: column; align-items: stretch; }
  .sort-group { justify-content: flex-end; }
  .modal-body-row { flex-direction: column; overflow-y: auto; }
  .modal-image-section, .modal-details { width: 100%; }
  .modal-image-section { min-height: 240px; }
  .modal-details { padding: 1.5rem; }
  .luxury-modal { max-height: 94vh; }
}
@media (max-width: 480px) {
  .filter-btn { padding: 6px 12px; font-size: 0.8rem; }
}
</style>
