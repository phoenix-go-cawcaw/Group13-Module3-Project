import { db } from "../config/db.js";

export const addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id || !quantity) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const [existing] = await db.query(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
      [user_id, product_id],
    );

    if (existing.length > 0) {
      await db.query(
        "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
        [quantity, user_id, product_id],
      );
    } else {
      await db.query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [user_id, product_id, quantity],
      );
    }

    res.status(201).json({ message: "Item added to cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const [cart] = await db.query(
      `SELECT c.id, c.product_id, p.product_name, p.price, c.quantity
       FROM cart c
       JOIN products p ON c.product_id = p.product_id
       WHERE c.user_id = ?`,
      [userId],
    );

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    await db.query(
      "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
      [quantity, userId, productId],
    );

    res.json({ message: "Cart updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    await db.query("DELETE FROM cart WHERE user_id = ? AND product_id = ?", [
      userId,
      productId,
    ]);

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    await db.query("DELETE FROM cart WHERE user_id = ?", [userId]);

    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
