import mongoose, { PipelineStage } from 'mongoose';
import { IProductDocument, ProductModel } from '../models/product';
import { IUserDocument } from '../models/user';
import { getMachinesService, updateMachineService } from './machine';

export const addProductService = async (
  user: IUserDocument,
  productData: Partial<IProductDocument>
) => {
  const machine = await getMachinesService({ _id: productData.machineID });

  if (!machine || machine.length === 0) {
    return {
      success: false,
      statusCode: 404,
      error: {
        path: 'vendingID',
        message: `No vending machine found with ID ${productData.machineID}`,
      },
    };
  }

  // Attach additional context
  productData.location = machine[0].location;
  productData.sellerID = user._id;

  const savedProduct = await ProductModel.create(productData);
  await updateMachineService(
    { _id: productData.machineID },
    { $push: { products: savedProduct._id } }
  );

  return {
    success: true,
    message: 'Product saved successfully',
    data: { product: savedProduct },
  };
};

export const getProductsService = async (
  queryObject: any,
  isCache = false,
  populateCheck = false,
  numOfSkip = 0,
  numOfLimit = 0
) => {
  try {
    /**
     * DONE: adding skip and limit to the query with default value 0 ,, so if no value passed it'll not limit or skip
     * DONE: populate the sellerID based on populateCheck
     */
    let query = ProductModel.find(queryObject)
      .skip(numOfSkip)
      .limit(numOfLimit)
      .cache({ useCache: isCache });

    // Conditionally apply populate
    if (populateCheck) {
      query = query.populate('sellerID');
    }

    const products = await query.exec();

    if (products.length == 0) return false;
    return products;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getNearestProductService = async (queryObject: any) => {
  try {
    //DONE: find the nearest product based on property in queryObject
    const pipeLine: PipelineStage[] = [];
    if (queryObject.location) {
      pipeLine.push({
        $geoNear: {
          near: {
            type: 'Point' as const,
            coordinates: [
              parseFloat(queryObject.location[0]),
              parseFloat(queryObject.location[1]),
            ],
          },

          distanceField: 'distance',
          spherical: true,
          maxDistance: 100000,
        },
      });
      delete queryObject.location;
    }

    if (queryObject.name) {
      pipeLine.push({
        $match: {
          name: {
            $regex: queryObject.name,
            $options: 'i',
          },
        },
      });
      delete queryObject.name;
    }

    if (queryObject._id) {
      pipeLine.push({
        $match: { _id: new mongoose.Types.ObjectId(queryObject._id) },
      });
      delete queryObject._id;
    }

    const products = await ProductModel.aggregate([...pipeLine]);

    if (products.length == 0) return false;
    return products;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const updateProductService = async (
  queryObject: any,
  updateOperation: any
) => {
  try {
    const updatedProduct = await ProductModel.findOneAndUpdate(
      queryObject,
      updateOperation,
      { new: true }
    );
    return updatedProduct;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const updateProductWithValidationService = async (
  productId: string,
  userId: string,
  updateData: any
) => {
  try {
    // Check if product exists
    const product = await getProductsService({ _id: productId });
    if (!product || product.length === 0) {
      return {
        success: false,
        statusCode: 404,
        error: { message: 'No product found' },
      };
    }

    // Check if user is the product owner
    if (!product[0].sellerID.equals(userId)) {
      return {
        success: false,
        statusCode: 403,
        error: { message: 'Unauthorized to update this product' },
      };
    }

    // Update the product
    const updatedProduct = await updateProductService(
      { _id: productId },
      { $set: updateData }
    );

    return {
      success: true,
      message: 'Updated successfully',
      data: { updatedProduct },
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: 500,
      error: { message: error.message },
    };
  }
};

export const deleteProductService = async (queryObject: any) => {
  try {
    const deleteProduct = await ProductModel.findOneAndDelete(queryObject);
    return deleteProduct ? true : false;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteProductWithValidationService = async (
  productId: string,
  userId: string
) => {
  try {
    // Check if product exists
    const product = await getProductsService({ _id: productId });
    if (!product || product.length === 0) {
      return {
        success: false,
        statusCode: 404,
        error: { path: 'productID', message: 'No product found' },
      };
    }

    // Check if user is the product owner
    if (product[0]?.sellerID?.toString() !== userId) {
      return {
        success: false,
        statusCode: 403,
        error: { message: 'Unauthorized to delete this product' },
      };
    }

    // Delete the product
    const deleted = await deleteProductService({ _id: productId });
    if (!deleted) {
      return {
        success: false,
        statusCode: 404,
        error: { path: 'productID', message: 'Product not found' },
      };
    }

    // Remove product from vending machine's products list
    await updateMachineService(
      { _id: product[0].machineID },
      { $pull: { products: product[0]._id } }
    );

    return {
      success: true,
      message: 'Product deleted',
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: 500,
      error: { message: error.message },
    };
  }
};
