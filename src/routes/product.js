const express = require('express');
const {
    addProductController,
    getProductController,
    updateProductController,
    deleteProductController
} = require('../controller/product');
const { isAuthenticated } = require("../middleware/isAuthenticated")
const { role } = require("../middleware/role");

const router = express.Router();

router.post("/", isAuthenticated, role('seller'), addProductController);
router.get("/", getProductController);
router.put("/:productID", isAuthenticated, role('seller'), updateProductController);
router.delete("/:productID", isAuthenticated, role('seller'), deleteProductController);


module.exports.Product = router;