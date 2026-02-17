import pool from "../config/db.js";
import crypto from "crypto";
import axios from "axios";

function generateSignature(data) {
  const sortedKeys = Object.keys(data)
    .filter(key => data[key] !== "" && key !== "signature")
    .sort();

  let pfOutput = sortedKeys
    .map(key => {
      return `${key}=${encodeURIComponent(data[key])
        .replace(/%20/g, "+")}`;
    })
    .join("&");

  if (process.env.PAYFAST_PASSPHRASE) {
    pfOutput += `&passphrase=${encodeURIComponent(process.env.PAYFAST_PASSPHRASE)
      .replace(/%20/g, "+")}`;
  }

  console.log("FINAL RAW SIGN STRING:", pfOutput);

  return crypto
    .createHash("md5")
    .update(pfOutput)
    .digest("hex");
}

export const createPayfast = async (req, res) => {
  try {
    const { user_id, total_amount, voucher_code } = req.body;

    const amount = parseFloat(total_amount).toFixed(2);

    // 1️⃣ Create checkout
    const [checkoutResult] = await pool.execute(
      `INSERT INTO checkout (user_id, total_amount, voucher_code, status)
       VALUES (?, ?, ?, ?)`,
      [user_id, amount, voucher_code || null, "pending"],
    );

    const checkoutId = checkoutResult.insertId;

    // 2️⃣ Create payment record
    await pool.execute(
      `INSERT INTO payments (checkout_id, provider, status)
       VALUES (?, ?, ?)`,
      [checkoutId, "payfast", "pending"],
    );

    const paymentData = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID,
      merchant_key: process.env.PAYFAST_MERCHANT_KEY,
      return_url: "http://localhost:5173/payment-success",
      cancel_url: "http://localhost:5173/payment-cancel",
      notify_url:
        "https://sylas-indorsable-epifania.ngrok-free.dev/payfast/itn",
      amount: amount,
      item_name: "Hobby Box Test",
      email_address: "test@test.com",
    };

    paymentData.signature = generateSignature(paymentData);

    res.json({
      paymentData,
      payfastUrl: process.env.PAYFAST_URL,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create payment" });
  }
};

export const handleITN = async (req, res) => {
  try {
    console.log("ITN HIT:", req.body);

    const data = { ...req.body };

    const receivedSignature = data.signature;
    delete data.signature;

    // 1️⃣ Validate Signature
    const generatedSignature = generateSignature(
      data,
      process.env.PAYFAST_PASSPHRASE,
    );

    if (receivedSignature !== generatedSignature) {
      return res.status(400).send("Invalid signature");
    }

    // 2️⃣ Validate With PayFast Server
    const validationResponse = await axios.post(
      process.env.PAYFAST_VALIDATE_URL,
      new URLSearchParams(req.body).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    if (validationResponse.data !== "VALID") {
      return res.status(400).send("Invalid ITN validation");
    }

    const checkoutId = data.m_payment_id;

    // 3️⃣ Confirm amount matches DB
    const [rows] = await pool.execute(
      "SELECT total_amount FROM checkout WHERE id = ?",
      [checkoutId],
    );

    if (!rows.length) {
      return res.status(404).send("Order not found");
    }

    const dbAmount = parseFloat(rows[0].total_amount).toFixed(2);

    if (dbAmount !== parseFloat(data.amount).toFixed(2)) {
      return res.status(400).send("Amount mismatch");
    }

    // 4️⃣ Update DB ONLY if COMPLETE
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
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("ITN Error:", error);
    res.status(500).send("ITN processing error");
  }
};
