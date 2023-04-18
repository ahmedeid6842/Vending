const { UserModel } = require("../models/user")

module.exports.getUserService = async (queryObject, isCache = false) => {
    try {

        let user = await UserModel.findOne(queryObject).cache({ useCache: isCache })
        return user ? user : false;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports.createUserService = async (user) => {
    try {
        let savedUser = await UserModel.create(user);
        return savedUser;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports.updateUserService = async (queryObject, updateOperation) => {
    try {
        let updatedUser = await UserModel.findOneAndUpdate(queryObject, updateOperation, { new: true })
        return updatedUser;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports.deleteUserService = async (queryObject) => {
    try {
        let deleteUser = await UserModel.findOneAndDelete(queryObject);
        return deleteUser ? true : false;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports.addOrderToUserService = async (userID, order) => {
    try {

        let updatedUser = await UserModel.findByIdAndUpdate(userID, { $push: { orders: order } }, { new: true })
        return updatedUser;
    } catch (error) {
        throw new Error(error);
    }

}