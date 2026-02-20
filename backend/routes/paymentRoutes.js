import express from 'express';
import {
    createPayfast,
    handleITN,
    confirmPayment
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/confirm", confirmPayment);
router.post("/create", createPayfast);
router.post("/itn", handleITN);

export default router;