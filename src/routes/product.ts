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
import { validate } from '../middleware/validate';
import { ProductValidators } from '../validators/product';

const router = express.Router();

router.post("/", isAuthenticated, role('seller'), validate(ProductValidators.createProductBody, 'body'), addProductController);
router.get("/", validate(ProductValidators.getProductQuery, 'query'), getProductController);
router.get("/nearest", validate(ProductValidators.getNearestProductQuery, 'query'), getNearestProductController)
router.put("/:productID", isAuthenticated, role('seller'), validate(ProductValidators.updateProductBody, 'body'), updateProductController);
router.delete("/:productID", isAuthenticated, role('seller'), deleteProductController);


export const Product = router;