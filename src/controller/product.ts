import { Request, Response } from 'express'
import { getProductsService, updateProductService, deleteProductService, getNearestProductService, addProductService, updateProductWithValidationService, deleteProductWithValidationService } from "../services/product";
import { updateMachineService } from "../services/machine";

export const addProductController = async (req: Request, res: Response) => {
    /**
     * DONE: user must be authenticated 
     * DONE: check the user role , only seller can add product 
     * DONE: validate request body to ensure it matches create product criteria 
     * DONE: check if the vedningId exsist or not
     * DONE: attach the vending location to product location
     * DONE: attach user._id as sellerID
     * DONE: save the product
     * DONE: push the added product ID to list of products at vending Machine
     */
    const user = req.user;
    const productData = req.body;

    const result = await addProductService(user, productData);

    if (!result.success) {
        return res.status(result.statusCode || 400).send(result.error);
    }

    return res.status(201).send({
        message: result.message,
        ...result.data,
    });
}

export const getProductController = async (req: Request, res: Response) => {
    /**
     * DONE: validate incoming request query 
     * DONE: if there is a requst query passed then find prodcut based on query  - else return all prodcuts
     * DONE: adding pagination
     * DONE: populate the sellerID to get seller data too
     */

    const productsPerPage = 20, pageNumber = Number(req.query.page) || 1;
    delete req.query.page;

    const prodcuts = await getProductsService(req.query, true, true, (productsPerPage * pageNumber) - productsPerPage, productsPerPage);
    if (!prodcuts) return res.status(404).send({ message: "No product found" })

    return res.status(200).send(prodcuts);
}

export const getNearestProductController = async (req: Request, res: Response) => {
    /**
     * DONE: validating the incoming request query 
     *  DONE: in the query the client provide his current location     
     * DONE: call getNearestProductService to find where nearest 100 KiloMeter product in the query  
     */

    const products = await getNearestProductService(req.query);
    if (!products) return res.status(404).send({ message: "This product is not available in your vicinity " })

    return res.status(200).send(products);
}

export const updateProductController = async (req: Request, res: Response) => {
    /**
     * DONE: user must be authenticated 
     * DONE: check the user role , only seller can update product 
     * DONE: validate request body to ensure it matches update product criteria 
     * DONE: check if product exsist or not
     * DONE: check if seller is the product's owner
     * DONE: update product with given ID
     */

    const result = await updateProductWithValidationService(
        req.params.productID, 
        req.user?._id?.toString() || "", 
        req.body
    );

    if (!result.success) {
        return res.status(result.statusCode || 400).send(result.error);
    }

    return res.status(201).send({
        message: result.message,
        ...result.data,
    });
}

export const deleteProductController = async (req: Request, res: Response) => {
    /**
        * DONE: user must be authenticated 
        * DONE: check the user role , only seller can update product 
        * DONE: check if seller is the product's owner
        * DONE: delete product with given ID
        * DONE: delete this product from the vending Machine products list
    */
    const result = await deleteProductWithValidationService(
        req.params.productID, 
        req.user?._id?.toString() || ""
    );

    if (!result.success) {
        return res.status(result.statusCode || 400).send(result.error);
    }

    return res.status(200).send({ message: result.message });
}