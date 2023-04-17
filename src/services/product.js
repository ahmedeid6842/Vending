const { ProductModel } = require("../models/product");

module.exports.createProductService = async (product) => {
    try {
        let savedProduct = await ProductModel.create(product);
        return savedProduct;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports.getProductsService = async (queryObject, populateCheck = false, numOfSkip = 0, numOfLimit = 0) => {
    try {
        /**
         * DONE: adding skip and limit to the query with default value 0 ,, so if no value passed it'll not limit or skip
         * DONE: populate the sellerID based on populateCheck 
         */
        let prodcuts = await ProductModel
            .find(queryObject)
            .skip(numOfSkip)
            .limit(numOfLimit)
            .populate(populateCheck ? "sellerID" : null)
            .cache()
        if (prodcuts.length == 0) return false;

        return prodcuts;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports.updateProductService = async (queryObject, updateOperation) => {
    try {
        let updatedProduct = await ProductModel.findOneAndUpdate(queryObject, updateOperation, { new: true });
        return updatedProduct;
    } catch (error) {
        throw new Error(error)
    }
}

module.exports.deleteProductService = async (queryObject) => {
    try {
        let deleteProduct = await ProductModel.findOneAndDelete(queryObject);
        return deleteProduct ? true : false
    } catch (error) {
        throw new Error(error);
    }
}