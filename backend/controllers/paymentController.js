import pool from "../config/db.js";
import crypto from "crypto";
import axios from "axios";

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

function generateSignature(data) {
  const sortedKeys = Object.keys(data)
    .filter((key) => data[key] !== "" && key !== "signature")
    .sort();

  let pfOutput = sortedKeys
    .map((key) => {
      return `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}`;
    })
    .join("&");

  // console.log("FINAL RAW SIGN STRING:", pfOutput);

  return crypto.createHash("md5").update(pfOutput).digest("hex");
}

export const createPayfast = async (req, res) => {
  try {
    const { user_id, total_amount, voucher_code } = req.body;

    const amount = parseFloat(total_amount).toFixed(2);

    const [checkoutRows] = await pool.execute(
      `SELECT checkout_id FROM checkout WHERE user_id = ? ORDER BY checkout_id DESC LIMIT 1`,
      [user_id],
    );

    if (!checkoutRows.length) {
      return res.status(400).json({
        error: "No checkout record found. Please complete checkout first.",
      });
    }

    const checkoutId = checkoutRows[0].checkout_id;

    await pool.execute(
      `UPDATE checkout SET total_amount = ?, voucher_code = ?, status = ? WHERE checkout_id = ?`,
      [amount, voucher_code || null, "pending", checkoutId],
    );

    //PAYMENT RECORD
    await pool.execute(
      `INSERT INTO payments (checkout_id, provider, status)
       VALUES (?, ?, ?)`,
      [checkoutId, "payfast", "pending"],
    );

    const paymentData = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID,
      merchant_key: process.env.PAYFAST_MERCHANT_KEY,
      return_url: `${frontendUrl}/payment-success?checkout_id=${checkoutId}`,
      cancel_url: `${frontendUrl}/payment-cancel`,
      m_payment_id: checkoutId.toString(),
      amount: amount,
      item_name: "Hobby Box Order",
      email_address: "customerEmail",
    };

    paymentData.signature = generateSignature(paymentData);

    res.json({
      paymentData,
      payfastUrl: process.env.PAYFAST_URL,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to create payment" });
  }
};

export const handleITN = async (req, res) => {
  try {
    console.log("ITN HIT:", req.body);

    const data = { ...req.body };

    const receivedSignature = data.signature;
    delete data.signature;

    const generatedSignature = generateSignature(data);
    if (receivedSignature !== generatedSignature) {
      console.error("Invalid signature");
      return res.status(400).send("Invalid signature");
    }

    if (data.merchant_id !== process.env.PAYFAST_MERCHANT_ID) {
      console.error("Merchant ID mismatch:", {
        received: data.merchant_id,
        expected: process.env.PAYFAST_MERCHANT_ID,
      });

      return res.status(400).send("Merchant mismatch");
    }

    const validationResponse = await axios.post(
      process.env.PAYFAST_VALIDATE_URL,
      new URLSearchParams(req.body).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    if (validationResponse.data !== "VALID") {
      console.error("PayFast validation failed");
      return res.status(400).send("Invalid ITN validation");
    }

    const checkoutId = data.m_payment_id;

    const [rows] = await pool.execute(
      "SELECT total_amount FROM checkout WHERE id = ?",
      [checkoutId],
    );

    if (!rows.length) {
      return res.status(404).send("Order not found");
    }

    const dbAmount = parseFloat(rows[0].total_amount).toFixed(2);
    const payfastAmount = parseFloat(data.amount).toFixed(2);

    if (dbAmount !== payfastAmount) {
      console.error("Amount mismatch:", {
        dbAmount,
        payfastAmount,
      });
      return res.status(400).send("Amount mismatch");
    }

    if (data.payment_status === "COMPLETE") {
      await pool.execute(
        `UPDATE payments
         SET status = ?, transaction_id = ?
         WHERE checkout_id = ?`,
        ["paid", data.pf_payment_id, checkoutId],
      );

      await pool.execute(
        `UPDATE checkout
         SET status = 'completed'
         WHERE id = ?`,
        [checkoutId],
      );

      console.log("Payment marked as COMPLETE:", checkoutId);
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error("ITN Error:", error);
    return res.status(500).send("ITN processing error");
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { checkoutId, payment_status, pf_payment_id, amount } = req.body;

    console.log("Confirm payment request received:", {
      checkoutId,
      payment_status,
      pf_payment_id,
      amount,
    });

    if (!checkoutId) {
      return res.status(400).json({ error: "checkoutId is required" });
    }

    const [rows] = await pool.execute(
      "SELECT total_amount FROM checkout WHERE checkout_id = ?",
      [checkoutId],
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Order not found" });
    }

    const dbAmount = parseFloat(rows[0].total_amount).toFixed(2);
    const payfastAmount = parseFloat(amount).toFixed(2);

    console.log("Amount comparison:", { dbAmount, payfastAmount });

    if (dbAmount !== payfastAmount) {
      return res.status(400).json({ error: "Amount mismatch" });
    }

    if (payment_status === "COMPLETE") {
      await pool.execute(
        `UPDATE payments
         SET status = 'paid', transaction_id = ?
         WHERE checkout_id = ?`,
        [pf_payment_id || null, checkoutId],
      );

      await pool.execute(
        `UPDATE checkout
         SET status = 'completed'
         WHERE checkout_id = ?`,
        [checkoutId],
      );
    }

    res.json({ message: "Payment updated successfully" });
  } catch (error) {
    console.error("Confirm error:", error);
    res.status(500).json({ error: error.message || "Confirm failed" });
  }
};
