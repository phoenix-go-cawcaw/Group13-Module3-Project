import express from 'express';
import {
    createPayfast,
    updatePayfast
} from "../controllers/paymentCon.js";


const router = express.Router();

router.post("/payfast/create", createPayfast)
router.post("/payfast/update", updatePayfast)

export default router;