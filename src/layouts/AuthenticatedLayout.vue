<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import hobbyLogo from '../assets/HobbyinaBox.png'
import { useCart } from '../composables/useCart'
import { ref } from 'vue'

const router = useRouter()
const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart()
const showCartModal = ref(false)
const menuOpen = ref(false)

function handleLogout() {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
  router.replace({ name: 'login' })
}

function toggleCartModal() {
  showCartModal.value = !showCartModal.value
}

function formatPrice(price) {
  return price.toFixed(2)
}

function getItemTotal(item) {
  return item.price * item.quantity
}
</script>

<template>
  <div class="auth-layout">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <img :src="hobbyLogo" alt="Hobby in a Box Logo" class="nav-logo me-2" />

        <RouterLink class="navbar-brand brand-title me-auto" to="/">
          Hobby in a Box
        </RouterLink>

        <div class="d-flex align-items-center gap-2 d-lg-none">
          <button class="btn btn-outline-light cart-btn" @click="toggleCartModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <span class="cart-badge" v-if="cartCount > 0">{{ cartCount }}</span>
          </button>
          <button class="hamburger-btn" @click="menuOpen = !menuOpen" aria-label="Toggle navigation">
            <span class="bar" :class="{ open: menuOpen }"></span>
            <span class="bar" :class="{ open: menuOpen }"></span>
            <span class="bar" :class="{ open: menuOpen }"></span>
          </button>
        </div>

        <ul class="navbar-nav ms-auto me-0 align-items-center gap-2 d-none d-lg-flex">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/products">Products</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/subscriptions">Subscriptions</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/about">About Us</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/contact">Contact</RouterLink>
          </li>
          <li class="nav-item">
            <button class="btn btn-outline-light cart-btn" @click="toggleCartModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              <span class="cart-badge" v-if="cartCount > 0">{{ cartCount }}</span>
            </button>
          </li>
          <li class="nav-item">
            <button class="btn btn-sm btn-outline-light" type="button" @click="handleLogout">Logout</button>
          </li>
        </ul>

        <div class="mobile-menu" :class="{ open: menuOpen }">
          <RouterLink class="mobile-nav-link" to="/" @click="menuOpen = false">Home</RouterLink>
          <RouterLink class="mobile-nav-link" to="/products" @click="menuOpen = false">Products</RouterLink>
          <RouterLink class="mobile-nav-link" to="/subscriptions" @click="menuOpen = false">Subscriptions</RouterLink>
          <RouterLink class="mobile-nav-link" to="/about" @click="menuOpen = false">About Us</RouterLink>
          <RouterLink class="mobile-nav-link" to="/contact" @click="menuOpen = false">Contact</RouterLink>
          <button class="mobile-logout-btn" @click="handleLogout">Logout</button>
        </div>
      </div>
    </nav>

    <div v-if="showCartModal" class="modal-overlay" @click.self="showCartModal = false">
      <div class="cart-modal">
        <div class="cart-modal-header">
          <h3>Your Cart</h3>
          <button class="close-btn" @click="showCartModal = false">&times;</button>
        </div>

        <div class="cart-modal-body">
          <div v-if="cartItems.length === 0" class="empty-cart">
            <p>Your cart is empty</p>
          </div>

          <div v-else class="cart-items">
            <div v-for="item in cartItems" :key="item.id" class="cart-item">
              <div class="item-info">
                <h4>{{ item.name }}</h4>
                <p class="item-price">R{{ formatPrice(item.price) }}</p>
              </div>

              <div class="item-actions">
                <div class="quantity-control">
                  <button @click="updateQuantity(item.id, item.quantity - 1)" class="qty-btn">-</button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button @click="updateQuantity(item.id, item.quantity + 1)" class="qty-btn">+</button>
                </div>

                <div class="item-total">
                  R{{ formatPrice(getItemTotal(item)) }}
                </div>

                <button @click="removeFromCart(item.id)" class="remove-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="cartItems.length > 0" class="cart-modal-footer">
          <div class="cart-total">
            <span>Total:</span>
            <span class="total-amount">R{{ formatPrice(cartTotal) }}</span>
          </div>

          <div class="cart-actions">
            <button class="btn btn-outline-secondary" @click="showCartModal = false">Continue Shopping</button>
            <RouterLink class="btn btn-success" to="/checkout" @click="showCartModal = false">Checkout</RouterLink>
          </div>
        </div>
      </div>
    </div>

    <RouterView />
  </div>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.navbar.bg-body-tertiary {
  background-color: #3E2A1B !important;
}

.nav-logo {
  height: 45px;
}

@media (min-width: 992px) {
  .nav-logo {
    height: 65px;
  }
}

.brand-title {
  color: #F3E6D3;
  font-weight: 800;
  text-decoration: none;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-size: 1rem;
}

@media (min-width: 992px) {
  .brand-title {
    font-size: 1.25rem;
  }
}

.nav-link {
  color: #E2C49A;
  font-weight: 500;
}

.nav-link:hover {
  color: #F3E6D3;
}

.nav-link.router-link-active {
  text-decoration: underline;
  text-underline-offset: 4px;
  color: #F3E6D3;
}

.btn-outline-light {
  border-color: #E2C49A;
  color: #E2C49A;
}

.btn-outline-light:hover {
  background-color: #A95A1C;
  border-color: #A95A1C;
  color: #fff;
}

.cart-btn {
  position: relative;
  padding: 6px 10px;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #A95A1C;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 11px;
  min-width: 18px;
  text-align: center;
}

.hamburger-btn {
  background: none;
  border: 1px solid #E2C49A;
  border-radius: 4px;
  padding: 5px 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bar {
  display: block;
  width: 20px;
  height: 2px;
  background-color: #E2C49A;
  border-radius: 2px;
  transition: all 0.25s ease;
}

.mobile-menu {
  display: none;
  flex-direction: column;
  width: 100%;
  padding: 8px 0 12px;
  border-top: 1px solid rgba(226, 196, 154, 0.2);
  margin-top: 8px;
}

.mobile-menu.open {
  display: flex;
}

.mobile-nav-link {
  color: #E2C49A;
  text-decoration: none;
  font-weight: 500;
  padding: 10px 4px;
  border-bottom: 1px solid rgba(226, 196, 154, 0.1);
  transition: color 0.15s;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  color: #F3E6D3;
}

.mobile-logout-btn {
  margin-top: 10px;
  background: none;
  border: 1px solid #E2C49A;
  color: #E2C49A;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9rem;
  align-self: flex-start;
  transition: background 0.15s;
}

.mobile-logout-btn:hover {
  background-color: #A95A1C;
  border-color: #A95A1C;
  color: #fff;
}

.auth-layout {
  padding-top: 65px;
}

@media (min-width: 992px) {
  .auth-layout {
    padding-top: 85px;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 2000;
}

.cart-modal {
  background: white;
  width: 450px;
  max-width: 100vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
}

@media (max-width: 480px) {
  .cart-modal {
    width: 100vw;
  }
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.cart-modal-header {
  padding: 20px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #3E2A1B;
  color: #F3E6D3;
}

.cart-modal-header h3 {
  margin: 0;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #F3E6D3;
}

.close-btn:hover {
  color: #E2C49A;
}

.cart-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.empty-cart {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 16px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 15px;
}

.item-info {
  margin-bottom: 10px;
}

.item-info h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #3E2A1B;
}

.item-price {
  margin: 0;
  color: #C06A22;
  font-weight: 600;
  font-size: 14px;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
}

.qty-btn {
  background: none;
  border: none;
  padding: 5px 12px;
  cursor: pointer;
  font-weight: bold;
  background-color: #f8f8f8;
}

.qty-btn:hover {
  background-color: #e5e5e5;
}

.quantity {
  padding: 0 8px;
  font-weight: 500;
}

.item-total {
  font-weight: 600;
  color: #A95A1C;
  flex: 1;
  text-align: right;
}

.remove-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 5px;
}

.remove-btn:hover {
  color: #c82333;
}

.cart-modal-footer {
  padding: 20px;
  border-top: 1px solid #e5e5e5;
  background-color: #f9f9f9;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

.total-amount {
  color: #A95A1C;
  font-size: 20px;
}

.cart-actions {
  display: flex;
  gap: 10px;
}

.cart-actions .btn {
  flex: 1;
  padding: 10px;
}

.btn-success {
  background-color: #A95A1C;
  border-color: #A95A1C;
}

.btn-success:hover {
  background-color: #8B4A17;
  border-color: #8B4A17;
}
</style>