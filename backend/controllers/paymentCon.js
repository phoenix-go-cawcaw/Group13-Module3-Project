import pool from '../pool.js';

export const createPayfast = async(req, res) => {
    try {
        const {user_id, total_amount} = req.body;

        const [result] = await pool.execute(
         `INSERT INTO checkout (user_id, total_amount, payment_method, payment_status) VALUES (?, ?, ?, ?)`, [user_id, total_amount, "payfast", "pending"]
    );
    const checkoutId = result.insertId;

    res.json({redirectUrl: `http://localhost:5173/payfast/${checkoutId}`});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to create payment"});
    }
};

export const updatePayfast = async (req, res) => {
  try {
    const { checkoutId, status } = req.body;

    const TransactionId = "HB-" + Math.floor(Math.random() * 100000000);

    await pool.execute(
      `UPDATE checkout SET payment_status=?, transaction_id=? WHERE id=?`, [status, TransactionId, checkoutId]
    );

    await pool.execute(
      `INSERT INTO payments (checkout_id, provider, transaction_id, status) VALUES (?, ?, ?, ?)`, [checkoutId, "payfast", TransactionId, status]
    );

    res.json({ message: "Payment updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Payment update failed" });
  }
};