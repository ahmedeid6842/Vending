import express from 'express';
import {
    depositPaymentController,
    buyPaymentController,
    resetPaymentController
} from '../controller/payment';
import { productExistAvailableCost } from "../middleware/payment";

const router = express.Router();

router.post("/deposit", depositPaymentController);
router.post("/buy", productExistAvailableCost, buyPaymentController);
router.put("/reset", resetPaymentController);

export const Payment = router;