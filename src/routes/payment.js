const express = require('express');
const {
    depositPaymentController,
    buyPaymentController,
    resetPaymentController
} = require('../controller/payment');
const { productExistAvailableCost } = require("../middleware/payment")

const router = express.Router();

router.post("/deposit", depositPaymentController);
router.post("/buy", productExistAvailableCost, buyPaymentController);
router.put("/reset", resetPaymentController);

module.exports.Payment = router;