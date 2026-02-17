import express from 'express';
import {
    createPayfast,
    handleITN
} from "../controllers/paymentCon.js";

const router = express.Router();

router.post("/create", createPayfast);
router.post("/itn", handleITN);

export default router;