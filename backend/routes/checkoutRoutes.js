import express from "express";
import {
  addCheckoutInfo,
  getCheckoutInfo,
  getCheckoutByUser,
} from "../controllers/checkoutController.js";

const router = express.Router();

router.get("/", getCheckoutInfo);
router.get("/user/:userId", getCheckoutByUser);
router.post("/", addCheckoutInfo);

export default router;
