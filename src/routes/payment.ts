import express from 'express';
import {
    depositPaymentController,
    buyPaymentController,
    resetPaymentController
} from '../controller/payment';
import { productExistAvailableCost } from "../middleware/payment";
import { validate } from '../middleware/validate';
import { PaymentValidators } from '../validators/payment';

const router = express.Router();

router.post("/deposit", validate(PaymentValidators.addDepositeBody, 'body'), depositPaymentController);
router.post("/buy", productExistAvailableCost, buyPaymentController);
router.put("/reset", resetPaymentController);

export const Payment = router;