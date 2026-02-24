import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/", addToCart);
router.delete("/clear/:userId", clearCart);
router.get("/:userId", getCart);
router.put("/:userId/:productId", updateCartItem);
router.delete("/:userId/:productId", removeFromCart);

export default router;
