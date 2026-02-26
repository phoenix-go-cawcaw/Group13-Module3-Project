import express from "express";
import {
  processPayment,
  initializePayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/initialize", initializePayment);
router.post("/process", processPayment);

export default router;
