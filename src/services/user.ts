import { UserModel } from "../models/user";

export const getUserService = async (queryObject: any, isCache = false) => {
    try {

        let user = await UserModel.findOne(queryObject).cache({ useCache: isCache })
        return user ? user : null;
    } catch (error: any) {
        throw new Error(error);
    }
}

export const createUserService = async (user: any) => {
    try {
        let savedUser = await UserModel.create(user);
        return savedUser;
    } catch (error: any) {
        throw new Error(error);
    }
}

export const updateUserService = async (queryObject: any, updateOperation: any) => {
    try {
        let updatedUser = await UserModel.findOneAndUpdate(queryObject, updateOperation, { new: true })
        return updatedUser;
    } catch (error: any) {
        throw new Error(error);
    }
}

export const deleteUserService = async (queryObject: any) => {
    try {
        let deleteUser = await UserModel.findOneAndDelete(queryObject);
        return deleteUser ? true : false;
    } catch (error: any) {
        throw new Error(error);
    }
}

export const addOrderToUserService = async (userID: any, order: any) => {
    try {

        let updatedUser = await UserModel.findByIdAndUpdate(userID, { $push: { orders: order } }, { new: true })
        return updatedUser;
    } catch (error: any) {
        throw new Error(error);
    }

}