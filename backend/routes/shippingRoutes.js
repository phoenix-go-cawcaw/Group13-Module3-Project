import express from "express";
import { 
  getShippingOptions, 
  addShippingOption 
} from "../controllers/shippingController.js";

const router = express.Router();

router.get("/", getShippingOptions);
router.post("/", addShippingOption);

export default router;
