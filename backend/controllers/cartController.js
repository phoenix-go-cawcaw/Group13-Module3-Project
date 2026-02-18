import { db } from "../config/db.js";

export const addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id || !quantity)
      return res.status(400).json({ message: "Missing fields" });

    await db.query(
      "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
      [user_id, product_id, quantity]
    );

    res.status(201).json({ message: "Item added to cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const [cart] = await db.query(
      `SELECT cart.id, products.product_name, products.price, cart.quantity
       FROM cart
       JOIN products ON cart.product_id = products.product_id
       WHERE cart.user_id = ?`,
      [userId]
    );

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
