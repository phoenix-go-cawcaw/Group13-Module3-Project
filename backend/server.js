import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { db } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const localOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;
const ngrokPattern = /^https:\/\/.*\.ngrok(?:-free)?\.dev$/i;
const lanPattern = /^https?:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/i;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (localOriginPattern.test(origin)) return callback(null, true);
      if (ngrokPattern.test(origin)) return callback(null, true);
      if (lanPattern.test(origin)) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/payments", paymentRoutes);

app.get("/test-db", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ message: "Database connected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.get("/", (req, res) => {
  res.send("HobbyInABox is running");
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(
    `Server running on http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}`,
  );
});