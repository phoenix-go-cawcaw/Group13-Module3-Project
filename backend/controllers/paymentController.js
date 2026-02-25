import pool from "../config/db.js";
import crypto from "crypto";
import axios from "axios";

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

function generateSignature(data) {
  // Create a copy with all values as strings
  const stringData = {};
  for (const key in data) {
    if (data[key] != null && data[key] !== "") {
      stringData[key] = String(data[key]);
    }
  }

  // Add passphrase
  const dataWithPassphrase = {
    ...stringData,
    passphrase: process.env.PAYFAST_PASSPHRASE || "",
  };

  // Sort keys alphabetically
  const sortedKeys = Object.keys(dataWithPassphrase)
    .filter((key) => dataWithPassphrase[key] !== "")
    .sort();

  // Build the signature string
  let pfOutput = sortedKeys
    .map((key) => {
      const value = dataWithPassphrase[key];
      const encoded = encodeURIComponent(value).replace(/%20/g, "+");
      return `${key}=${encoded}`;
    })
    .join("&");

  console.log("DEBUG: Signature string components:");
  console.log("Keys:", sortedKeys);
  console.log(
    "Raw values:",
    sortedKeys.map((k) => `${k}=${dataWithPassphrase[k]}`).join("\n"),
  );
  console.log("FINAL RAW SIGN STRING:", pfOutput);

  const signature = crypto.createHash("md5").update(pfOutput).digest("hex");
  console.log("Generated signature:", signature);

  return signature;
}

export const createPayfast = async (req, res) => {
  try {
    const { user_id, total_amount } = req.body;

    const amount = parseFloat(total_amount).toFixed(2);

    console.log("DEBUG: Creating payment with amount:", amount);
    console.log("DEBUG: PayFast Merchant ID:", process.env.PAYFAST_MERCHANT_ID);
    console.log(
      "DEBUG: PayFast Passphrase set:",
      !!process.env.PAYFAST_PASSPHRASE,
    );

    const [checkoutRows] = await pool.execute(
      `SELECT checkout_id, email, first_name, last_name FROM checkout WHERE user_id = ? ORDER BY checkout_id DESC LIMIT 1`,
      [user_id],
    );

    if (!checkoutRows.length) {
      return res.status(400).json({
        error: "No checkout record found. Please complete checkout first.",
      });
    }

    const checkoutId = checkoutRows[0].checkout_id;
    const customerEmail = checkoutRows[0].email;
    const firstName = checkoutRows[0].first_name;
    const lastName = checkoutRows[0].last_name;

    await pool.execute(
      `UPDATE checkout SET total_amount = ?, status = ? WHERE checkout_id = ?`,
      [amount, "pending", checkoutId],
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
      m_payment_id: String(checkoutId),
      amount: String(amount),
      item_name: "Hobby Box Order",
      item_description: `Order for ${firstName} ${lastName}`,
      email: customerEmail,
      signature: "", // Will be calculated and added
    };

    // Only add notify_url if ITN_URL is explicitly set in env
    if (process.env.ITN_URL) {
      paymentData.notify_url = process.env.ITN_URL;
    }

    // Only add currency if explicitly enabled
    if (process.env.PAYFAST_INCLUDE_CURRENCY !== "false") {
      paymentData.currency = "ZAR";
    }

    console.log("DEBUG: Payment data before signature:");
    console.log(JSON.stringify(paymentData, null, 2));

    paymentData.signature = generateSignature(paymentData);

    console.log(
      "DEBUG: Final payment data with signature:",
      JSON.stringify(paymentData, null, 2),
    );

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
      "SELECT total_amount FROM checkout WHERE checkout_id = ?",
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
         WHERE checkout_id = ?`,
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
