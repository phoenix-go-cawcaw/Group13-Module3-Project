import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import shippingRoutes from "./routes/shippingRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/shipping", shippingRoutes);

app.get("/api/test-db", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ message: "✅ Database connected successfully" });
  } catch (error) {
    res.status(500).json({ message: "❌ Database connection failed" });
  }
});

app.get("/", (req, res) => {
  res.send("HobbyInABox API is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
