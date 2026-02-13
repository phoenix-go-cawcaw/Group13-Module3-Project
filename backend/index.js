import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/payments", paymentRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});