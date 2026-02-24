import { ref, computed, onMounted } from "vue";
import axios from "axios";

const cartItems = ref([]);
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function useCart() {
  const getUserId = () => {
    try {
      let user = JSON.parse(localStorage.getItem("user") || "null");
      // If not in localStorage, check sessionStorage
      if (!user) {
        user = JSON.parse(sessionStorage.getItem("user") || "null");
      }
      console.log("User:", user);
      if (!user) return null;
      if (user.user_id) return user.user_id;
      if (user.user?.id) return user.user.id;
      if (user.id) return user.id;

      return null;
    } catch (error) {
      console.error("Failed to parse user:", error);
      return null;
    }
  };

  // Checks if user is logged in
  const isLoggedIn = computed(() => {
    return !!getUserId();
  });

  // Loads the cart from database for logged-in user
  const loadCart = async () => {
    const userId = getUserId();
    if (!userId) {
      cartItems.value = [];
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/cart/${userId}`);
      cartItems.value = response.data.map((item) => ({
        id: item.product_id,
        name: item.product_name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        type: "product",
      }));
    } catch (error) {
      console.error("Failed to load cart:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("user"); // Handle unauthorized user data
      }
    }
  };

  const addToCart = async (product) => {
    const userId = getUserId();
    if (!userId) {
      alert("Please log in to add items to cart");
      return;
    }

    try {
      const existingItem = cartItems.value.find(
        (item) => item.id === product.id,
      );

      if (existingItem) {
        await axios.put(`${API_URL}/cart/${userId}/${product.id}`, {
          quantity: existingItem.quantity + 1,
        });
        existingItem.quantity += 1;
      } else {
        // Adds new item to database
        await axios.post(`${API_URL}/cart`, {
          user_id: userId,
          product_id: product.id,
          quantity: 1,
        });
        cartItems.value.push({
          ...product,
          quantity: 1,
        });
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      if (error.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("user");
      } else {
        alert("Failed to add item to cart. Please try again.");
      }
    }
  };

  const removeFromCart = async (productId) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      await axios.delete(`${API_URL}/cart/${userId}/${productId}`);
      cartItems.value = cartItems.value.filter((item) => item.id !== productId);
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      if (error.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("user");
      }
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    const userId = getUserId();
    if (!userId) return;

    const item = cartItems.value.find((item) => item.id === productId);
    if (item) {
      if (newQuantity <= 0) {
        await removeFromCart(productId);
      } else {
        try {
          await axios.put(`${API_URL}/cart/${userId}/${productId}`, {
            quantity: newQuantity,
          });
          item.quantity = newQuantity;
        } catch (error) {
          console.error("Failed to update quantity:", error);
          if (error.response?.status === 401) {
            alert("Your session has expired. Please log in again.");
            localStorage.removeItem("user");
          }
        }
      }
    }
  };

  const clearCart = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      await axios.delete(`${API_URL}/cart/clear/${userId}`);
      cartItems.value = [];
    } catch (error) {
      console.error("Failed to clear cart:", error);
      if (error.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("user");
      }
    }
  };

  onMounted(() => {
    loadCart();
  });

  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  });

  const cartCount = computed(() => {
    return cartItems.value.reduce((count, item) => count + item.quantity, 0);
  });

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    loadCart,
    isLoggedIn,
  };
}
