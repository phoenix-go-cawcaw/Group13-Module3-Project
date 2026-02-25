import { db } from "../config/db.js";

export const addCheckoutInfo = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      address,
      city,
      postal_code,
      user_id = null, //null for guest checkout
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !address ||
      !city ||
      !postal_code
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: first_name, last_name, email, address, city, and postal_code are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const result = await db.query(
      `INSERT INTO checkout
       (user_id, first_name, last_name, email, address, city, postal_code)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, first_name, last_name, email, address, city, postal_code],
    );

    const checkoutId = result[0].insertId;

    res.status(201).json({
      message: "Checkout information saved successfully",
      data: { first_name, last_name, email, city },
      checkout_id: checkoutId,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getCheckoutInfo = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT checkout_id, user_id, first_name, last_name, email, address, city, postal_code 
      FROM checkout 
      ORDER BY checkout_id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Gets checkout info by user ID (for logged-in users)
export const getCheckoutByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      `SELECT checkout_id, first_name, last_name, email, address, city, postal_code 
       FROM checkout 
       WHERE user_id = ? 
       ORDER BY checkout_id DESC`,
      [userId],
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
