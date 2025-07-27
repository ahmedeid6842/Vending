import mongoose, { PipelineStage } from "mongoose";
import { ProductModel } from "../models/product";

export const createProductService = async (product: any) => {
    try {
        let savedProduct = await ProductModel.create(product);
        return savedProduct;
    } catch (error: any) {
        throw new Error(error);
    }
}

export const getProductsService = async (queryObject: any, isCache = false, populateCheck = false, numOfSkip = 0, numOfLimit = 0) => {
    try {
        /**
         * DONE: adding skip and limit to the query with default value 0 ,, so if no value passed it'll not limit or skip
         * DONE: populate the sellerID based on populateCheck 
         */
        let query = ProductModel
        .find(queryObject)
        .skip(numOfSkip)
        .limit(numOfLimit)
        .cache({ useCache: isCache });
  
        // Conditionally apply populate
        if (populateCheck) {
            query = query.populate("sellerID");
        }
  
        const products = await query.exec();
  
        if (products.length == 0) return false;
        return products;
    } catch (error: any) {
        throw new Error(error);
    }
}

export const getNearestProductService = async (queryObject: any) => {
    try {
        //DONE: find the nearest product based on property in queryObject 
        let pipeLine: PipelineStage[] = [];
        if (queryObject.location) {
            pipeLine.push({
                $geoNear: {
                    near: {
                        type: 'Point' as const,
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
    } catch (error: any) {
        throw new Error(error);
    }
}

export const updateProductService = async (queryObject: any, updateOperation: any) => {
    try {
        let updatedProduct = await ProductModel.findOneAndUpdate(queryObject, updateOperation, { new: true });
        return updatedProduct;
    } catch (error: any) {
        throw new Error(error)
    }
}

export const deleteProductService = async (queryObject: any) => {
    try {
        let deleteProduct = await ProductModel.findOneAndDelete(queryObject);
        return deleteProduct ? true : false
    } catch (error: any) {
        throw new Error(error);
    }
}