import pool from "../config/db.js";

console.log("[paymentController] module loaded - Simulated Payment Mode");

function generateTransactionId() {
  return `SIM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

export const processPayment = async (req, res) => {
  console.log("[processPayment] invoked with simulated payment");
  try {
    const {
      checkoutId,
      cardNumber,
      expiryDate,
      cvv,
      cardholderName,
      amount,
      email,
    } = req.body;

    if (
      !checkoutId ||
      !cardNumber ||
      !expiryDate ||
      !cvv ||
      !cardholderName ||
      !amount
    ) {
      return res.status(400).json({
        error: "Missing required payment fields",
      });
    }

    if (!/^\d{13,19}$/.test(cardNumber.replace(/\s/g, ""))) {
      return res.status(400).json({
        error: "Invalid card number format",
      });
    }

    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      return res.status(400).json({
        error: "Invalid expiry date format. Use MM/YY",
      });
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      return res.status(400).json({
        error: "Invalid CVV",
      });
    }

    if (cardholderName.trim().length < 3) {
      return res.status(400).json({
        error: "Invalid cardholder name",
      });
    }

    const [checkoutRows] = await pool.execute(
      `SELECT checkout_id FROM checkout WHERE checkout_id = ?`,
      [checkoutId],
    );

    if (!checkoutRows.length) {
      return res.status(404).json({
        error: "Checkout not found",
      });
    }

    const paymentAmount = parseFloat(amount);
    if (Number.isNaN(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({
        error: "Invalid payment amount",
      });
    }

    const transactionId = generateTransactionId();

    await pool.execute(
      `INSERT INTO payments (checkout_id, provider, status, transaction_id, amount)
       VALUES (?, ?, ?, ?, ?)`,
      [checkoutId, "simulated", "paid", transactionId, paymentAmount],
    );

    await pool.execute(
      `UPDATE checkout
       SET status = 'completed', total_amount = ?
       WHERE checkout_id = ?`,
      [paymentAmount, checkoutId],
    );

    console.log(`[processPayment] Success - Transaction ID: ${transactionId}`);

    res.json({
      success: true,
      message: "Payment processed successfully",
      transactionId,
      checkoutId,
      amount: paymentAmount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[processPayment] Error:", error);
    res.status(500).json({
      error: error.message || "Payment processing failed",
    });
  }
};

export const initializePayment = async (req, res) => {
  try {
    const { user_id, total_amount } = req.body;

    if (!user_id || !total_amount) {
      return res.status(400).json({
        error: "user_id and total_amount are required",
      });
    }

    const amount = parseFloat(total_amount).toFixed(2);

    const [checkoutRows] = await pool.execute(
      `SELECT checkout_id, email, first_name, last_name FROM checkout 
       WHERE user_id = ? OR checkout_id = (SELECT MAX(checkout_id) FROM checkout LIMIT 1)
       ORDER BY checkout_id DESC LIMIT 1`,
      [user_id],
    );

    if (!checkoutRows.length) {
      return res.status(400).json({
        error: "No checkout record found. Please complete checkout first.",
      });
    }

    const checkoutId = checkoutRows[0].checkout_id;

    await pool.execute(
      `UPDATE checkout SET total_amount = ?, status = ? WHERE checkout_id = ?`,
      [amount, "pending", checkoutId],
    );

    await pool.execute(
      `INSERT INTO payments (checkout_id, provider, status, amount)
       VALUES (?, ?, ?, ?)`,
      [checkoutId, "simulated", "pending", amount],
    );

    res.json({
      success: true,
      checkoutId,
      amount,
      message: "Payment form initialized",
    });
  } catch (error) {
    console.error("[initializePayment] Error:", error);
    res.status(500).json({
      error: error.message || "Failed to initialize payment",
    });
  }
};
