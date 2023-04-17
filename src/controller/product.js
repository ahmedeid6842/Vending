const { create_updateProdcutValidation, getProductQueryValidation } = require("../validators/product")
const { createProductService, getProductsService, updateProductService, deleteProductService } = require("../services/product");
module.exports.addProductController = async (req, res) => {
    /**
     * DONE: user must be authenticated 
     * DONE: check the user role , only seller can add product 
     * DONE: validate request body to ensure it matches create product criteria 
     * DONE: add product and attach user._id as sellerID
     */
    const { error } = create_updateProdcutValidation(req.body);
    if (error) return res.status(400).send(error.details);

    req.body.sellerID = req.user._id;
    let savedProdcut = await createProductService(req.body);

    return res.status(201).send({ message: "product saved succesfully", product: savedProdcut });
}

module.exports.getProductController = async (req, res) => {
    /**
     * DONE: validate incoming request query 
     * DONE: if there is requrest query passed then find prodcut based on query  - else return all prodcuts
     * DONE: adding pagination
     * DONE: populate the sellerID to get seller data too
     */
    const { error } = getProductQueryValidation(req.query);
    if (error) return res.status(400).send(error.details);

    const productsPerPage = 20, pageNumber = req.query.page || 1;
    delete req.query.page;

    const prodcuts = await getProductsService(req.query, true, (productsPerPage * pageNumber) - productsPerPage, productsPerPage);
    if (!prodcuts) return res.status(404).send({ message: "No product found" })

    return res.status(200).send(prodcuts);
}

module.exports.updateProductController = async (req, res) => {
    /**
     * DONE: user must be authenticated 
     * DONE: check the user role , only seller can update product 
     * DONE: validate request body to ensure it matches update product criteria 
     * DONE: check if product exsist or not
     * DONE: check if seller is the product's owner
     * DONE: update product with given ID
     */
    const { error } = create_updateProdcutValidation(req.body, true);
    if (error) return res.status(400).send(error.details);

    let prodcut = await getProductsService({ _id: req.params.productID });
    if (!prodcut) return res.status(404).send({ message: "No product found " });
   
    if (toString(prodcut[0].sellerID) != toString(req.user._id)) {
        return res.status(403).send({ message: "unauthorized to update this product" })
    }

    let updatedProduct = await updateProductService({ _id: req.params.productID }, { $set: req.body });
    return res.status(201).send({ message: "updated succesfully", updatedProduct });
}

module.exports.deleteProductController = async (req, res) => {
    /**
        * DONE: user must be authenticated 
        * DONE: check the user role , only seller can update product 
        * DONE: check if seller is the product's owner
        * DONE: delete product with given ID
    */
    let prodcut = await getProductsService({ _id: req.params.productID });
    if (!prodcut) return res.status(404).send({ message: "No product found " });

    if (toString(prodcut[0].sellerID) != toString(req.user._id)) {
        return res.status(403).send({ message: "unauthorized to update this product" })
    }

    let deleted = await deleteProductService({ _id: req.params.productID })
    if (!deleted) return res.status(404).send({ path: "productID", message: `product not found` });
    return res.send({ message: "product deleted" })
}