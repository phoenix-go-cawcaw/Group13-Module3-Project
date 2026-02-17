import { db } from "../config/db.js";

export const createCheckout = async (req, res) => {
  try {
    const {
      user_id,
      total_amount,
      payment_method,
      owner_name,
      card_number,
      expiry_date,
      security_code,
      voucher_code
    } = req.body;

    if (!user_id || !total_amount)
      return res.status(400).json({ message: "Missing required fields" });

    const [result] = await db.query(
      `INSERT INTO checkout 
       (user_id, total_amount, payment_method, owner_name,
        card_number, expiry_date, security_code, voucher_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        total_amount,
        payment_method,
        owner_name,
        card_number,
        expiry_date,
        security_code,
        voucher_code
      ]
    );

    res.status(201).json({
      message: "Checkout successful",
      checkoutId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
