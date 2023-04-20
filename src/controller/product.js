const { create_updateProdcutValidation, getProductQueryValidation, getNearestProductQueryValidation } = require("../validators/product")
const { createProductService, getProductsService, updateProductService, deleteProductService, getNearestProductService } = require("../services/product");
const { getMachinesService, updateMachineService } = require("../services/machine");

module.exports.addProductController = async (req, res) => {
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
    const { error } = create_updateProdcutValidation(req.body);
    if (error) return res.status(400).send(error.details);

    let machine = await getMachinesService({ _id: req.body.machineID })
    if (!machine) return res.status(404).send({ path: "vendingID", message: `no machine found with this ID ${req.body.vendingID}` })

    req.body.location = machine[0].location
    req.body.sellerID = req.user._id;

    let savedProdcut = await createProductService(req.body);

    await updateMachineService({ _id: req.body.machineID }, { $push: { products: savedProdcut._id } });

    return res.status(201).send({ message: "product saved succesfully", product: savedProdcut });
}

module.exports.getProductController = async (req, res) => {
    /**
     * DONE: validate incoming request query 
     * DONE: if there is a requst query passed then find prodcut based on query  - else return all prodcuts
     * DONE: adding pagination
     * DONE: populate the sellerID to get seller data too
     */
    const { error } = getProductQueryValidation(req.query);
    if (error) return res.status(400).send(error.details);

    const productsPerPage = 20, pageNumber = req.query.page || 1;
    delete req.query.page;

    const prodcuts = await getProductsService(req.query, true, true, (productsPerPage * pageNumber) - productsPerPage, productsPerPage);
    if (!prodcuts) return res.status(404).send({ message: "No product found" })

    return res.status(200).send(prodcuts);
}

module.exports.getNearestProductController = async (req, res) => {
    /**
     * DONE: validating the incoming request query 
     *  DONE: in the query the client provide his current location     
     * DONE: call getNearestProductService to find where nearest 100 KiloMeter product in the query  
     */

    const { error } = getNearestProductQueryValidation(req.query);
    if (error) return res.status(400).send(error.details);

    const products = await getNearestProductService(req.query);
    if (!products) return res.status(404).send({ message: "This product is not available in your vicinity " })

    return res.status(200).send(products);
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
        * DONE: delete this product from the vending Machine products list
    */
    let product = await getProductsService({ _id: req.params.productID });
    if (!product) return res.status(404).send({ path: "productID", message: "No product found " });

    if (toString(product[0].sellerID) != toString(req.user._id)) {
        return res.status(403).send({ message: "unauthorized to update this product" })
    }

    let deleted = await deleteProductService({ _id: req.params.productID })
    if (!deleted) return res.status(404).send({ path: "productID", message: `product not found` });

    await updateMachineService({ _id: product[0].machineID }, { $pull: { products: product[0]._id } },)
    return res.send({ message: "product deleted" })
}