import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import paymentRoutes from "./routes/paymentRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

//Global json for every other route except PayFast ITN
app.use(express.json());

//middleware JUST for PayFast ITN
app.use("/payfast/itn", express.urlencoded({ extended: false }));

app.use("/auth", authRoutes);
app.use("/payfast", paymentRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
});