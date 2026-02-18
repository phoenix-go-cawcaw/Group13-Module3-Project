import pool from "../config/db.js";
import crypto from "crypto";
import axios from "axios";

function generateSignature(data) {
  const sortedKeys = Object.keys(data)
    .filter((key) => data[key] !== "" && key !== "signature")
    .sort();

  let pfOutput = sortedKeys
    .map((key) => {
      return `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}`;
    })
    .join("&");

  if (process.env.PAYFAST_PASSPHRASE) {
    pfOutput += `&passphrase=${encodeURIComponent(
      process.env.PAYFAST_PASSPHRASE,
    ).replace(/%20/g, "+")}`;
  }

  console.log("FINAL RAW SIGN STRING:", pfOutput);

  return crypto.createHash("md5").update(pfOutput).digest("hex");
}

export const createPayfast = async (req, res) => {
  try {
    const { user_id, total_amount, voucher_code } = req.body;

    const amount = parseFloat(total_amount).toFixed(2);

    //CHECKOUT RECORD
    const [checkoutResult] = await pool.execute(
      `INSERT INTO checkout (user_id, total_amount, voucher_code, status)
       VALUES (?, ?, ?, ?)`,
      [user_id, amount, voucher_code || null, "pending"],
    );

    const checkoutId = checkoutResult.insertId;

    //PAYMENT RECORDS
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
      m_payment_id: checkoutId,
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

    // 1️⃣ Extract and remove signature
    const receivedSignature = data.signature;
    delete data.signature;

    // 2️⃣ Generate signature
    const generatedSignature = generateSignature(data);

    if (receivedSignature !== generatedSignature) {
      console.error("Invalid signature");
      return res.status(400).send("Invalid signature");
    }

    // 3️⃣ Confirm merchant ID matches yours
    if (data.merchant_id !== process.env.PAYFAST_MERCHANT_ID) {
      console.error("Merchant ID mismatch:", {
        received: data.merchant_id,
        expected: process.env.PAYFAST_MERCHANT_ID,
      });

      return res.status(400).send("Merchant mismatch");
    }

    // 4️⃣ Validate with PayFast server
    const validationResponse = await axios.post(
      process.env.PAYFAST_VALIDATE_URL,
      new URLSearchParams(req.body).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    if (validationResponse.data !== "VALID") {
      console.error("PayFast validation failed");
      return res.status(400).send("Invalid ITN validation");
    }

    // 5️⃣ Get checkout ID
    const checkoutId = data.m_payment_id;

    const [rows] = await pool.execute(
      "SELECT total_amount FROM checkout WHERE id = ?",
      [checkoutId]
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

    // 6️⃣ Only update if payment is COMPLETE
    if (data.payment_status === "COMPLETE") {
      await pool.execute(
        `UPDATE payments
         SET status = ?, transaction_id = ?
         WHERE checkout_id = ?`,
        ["paid", data.pf_payment_id, checkoutId]
      );

      await pool.execute(
        `UPDATE checkout
         SET status = 'completed'
         WHERE id = ?`,
        [checkoutId]
      );

      console.log("Payment marked as COMPLETE:", checkoutId);
    }

    // 7️⃣ Respond OK
    return res.status(200).send("OK");

  } catch (error) {
    console.error("ITN Error:", error);
    return res.status(500).send("ITN processing error");
  }
};

