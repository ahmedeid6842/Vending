import express from 'express';
import {
    addProductController,
    getProductController,
    updateProductController,
    deleteProductController,
    getNearestProductController
} from '../controller/product';
import { isAuthenticated } from "../middleware/isAuthenticated";
import { role } from "../middleware/role";

const router = express.Router();

router.post("/", isAuthenticated, role('seller'), addProductController);
router.get("/", getProductController);
router.get("/nearest",getNearestProductController)
router.put("/:productID", isAuthenticated, role('seller'), updateProductController);
router.delete("/:productID", isAuthenticated, role('seller'), deleteProductController);


export const Product = router;