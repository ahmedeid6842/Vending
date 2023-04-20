const { ProductModel } = require("../models/product");
const cache = require('../utils/cache');

module.exports.createProductService = async (product) => {
    try {
        let savedProduct = await ProductModel.create(product);
        return savedProduct;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports.getProductsService = async (queryObject, isCache = false, populateCheck = false, numOfSkip = 0, numOfLimit = 0) => {
    try {
        /**
         * DONE: adding skip and limit to the query with default value 0 ,, so if no value passed it'll not limit or skip
         * DONE: populate the sellerID based on populateCheck 
         */
        let products = await ProductModel
            .find(queryObject)
            .skip(numOfSkip)
            .limit(numOfLimit)
            .populate(populateCheck ? "sellerID" : null)
            .cache({ useCache: isCache })

        if (products.length == 0) return false;

        return products;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports.getNearestProductService = async (queryObject) => {
    try {
        //DONE: find the nearest product based on property in queryObject 
        let pipeLine = [];
        if (queryObject.location) {
            pipeLine.push({
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [parseFloat(queryObject.location[0]), parseFloat(queryObject.location[1])]
                    },

                    distanceField: 'distance',
                    spherical: true,
                    maxDistance: 100000
                }
            })
            delete queryObject.location;
        }

        if (queryObject.name) {
            pipeLine.push({
                $match: {
                    name: {
                        $regex: queryObject.name,
                        $options: 'i'
                    }
                }
            });
            delete queryObject.name;
        }

        if (queryObject._id) {
            pipeLine.push({ $match: { _id: new mongoose.Types.ObjectId(queryObject._id) } })
            delete queryObject._id;
        }

        let products = await ProductModel.aggregate([...pipeLine]);

        if (products.length == 0) return false;
        return products;
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