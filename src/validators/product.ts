import Joi from "joi";
const JoiObjectId = require("joi-objectid");
Joi.objectId = JoiObjectId(Joi);

const createProductBody = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    cost: Joi.number().min(1).max(9999).required(),
    amountAvailable: Joi.number().min(1).max(9999).required(),
    machineID: Joi.objectId().required()
});

const updateProductBody = Joi.object({
    name: Joi.string().min(5).max(255).optional(),
    cost: Joi.number().min(1).max(9999).optional(),
    amountAvailable: Joi.number().min(1).max(9999).optional(),
    machineID: Joi.objectId().optional()
})
    .or("name", "cost", "amountAvailable")
    .options({ abortEarly: false });

const getProductQuery = Joi.object({
    page: Joi.number().integer().min(1).max(300).required(),
    name: Joi.string().min(5).max(255).optional(),
    cost: Joi.number().integer().min(1).max(9999).optional(),
    sellerID: Joi.objectId().optional()
}).options({ abortEarly: false });

const getNearestProductQuery = Joi.object({
    name: Joi.string().min(5).max(255),
    _id: Joi.objectId(),
    location: Joi.array()
        .ordered(
            Joi.number().min(-180).max(180).required(), // longitude
            Joi.number().min(-90).max(90).required()    // latitude
        )
})
    .or("name", "_id")
    .options({ abortEarly: false });

export const ProductValidators = {
    createProductBody,
    updateProductBody,
    getProductQuery,
    getNearestProductQuery
};