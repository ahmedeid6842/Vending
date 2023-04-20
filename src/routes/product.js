const express = require('express');
const {
    addProductController,
    getProductController,
    updateProductController,
    deleteProductController,
    getNearestProductController
} = require('../controller/product');
const { isAuthenticated } = require("../middleware/isAuthenticated")
const { role } = require("../middleware/role");

const router = express.Router();

router.post("/", isAuthenticated, role('seller'), addProductController);
router.get("/", getProductController);
router.get("/nearest",getNearestProductController)
router.put("/:productID", isAuthenticated, role('seller'), updateProductController);
router.delete("/:productID", isAuthenticated, role('seller'), deleteProductController);


module.exports.Product = router;