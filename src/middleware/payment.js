const { getProductsService } = require("../services/product")

//  middleware function to check product's existence for both prodcutID and amount Available and calculate order cost
module.exports.productExistAvailableCost = async (req, res, next) => {

    /**
     * DONE: find all order products' by passed productsIDs
     * DONE: iterate over all returned products
     *  DONE: check if each product exist in list of returned products
     *  DONE: check if each product amount available cover the ordered product's quantity 
     *  DONE: increment the order total cost by product cost
     *  DONE: map the product cost to each product (quantity*productCost)
     *  DONE: map the product quantity to each product 
     */
    const { productsIDs, quantites } = req.body;

    let products = await getProductsService({ _id: { $in: productsIDs } });
    if (!products) return res.status(404).send({ message: "No product found" })

    let errors = [], orderTotalCost = 0, orderedProducts = [];
    for (let index in productsIDs) {

        let orderedProduct = products.find((product) => product._id == productsIDs[index]);
        if (!orderedProduct) {
            errors.push({ path: "productID", message: `product with ID:"${productsIDs[index]}" not found` })
        }
        else if (quantites[index] > orderedProduct.amountAvailable) {
            errors.push({ message: `product's '${orderedProduct.name}' quantity '${quantites[index]}' exceed amount available '${orderedProduct.amountAvailable}'` });
        } else {
            orderTotalCost += orderedProduct.cost * quantites[index];
            orderedProduct.totalCost = orderedProduct.cost * quantites[index];
            orderedProduct.quantity = quantites[index];
            orderedProducts.push(orderedProduct);
        }

    }

    if (errors.length !== 0) {
        return res.status(400).send(errors)
    }

    req.orderedProducts = orderedProducts;
    req.orderTotalCost = orderTotalCost;

    next();
}