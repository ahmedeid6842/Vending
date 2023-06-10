const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
module.exports.create_updateProdcutValidation = (product, isUpdate = false) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(255).presence(isUpdate ? 'optional' : 'required'),
        cost: Joi.number().min(1).max(9999).presence(isUpdate ? 'optional' : 'required'),
        amountAvailable: Joi.number().min(1).max(9999).presence(isUpdate ? 'optional' : 'required'),
        machineID: Joi.objectId().presence(isUpdate ? 'optional' : 'required')
    }).or('name', 'cost', 'amountAvailable').options({ abortEarly: false })
    return schema.validate(product);
}

module.exports.getProductQueryValidation = (product) => {
    const schema = Joi.object({
        page: Joi.number().integer().min(1).max(300).required(),
        name: Joi.string().min(5).max(255).optional(),
        cost: Joi.number().integer().min(1).max(9999).optional(),
        sellerID: Joi.objectId().optional()
    }).options({ abortEarly: false })
    return schema.validate(product);
}

module.exports.getNearestProductQueryValidation = (product) => {

    if (product.location) {
        product.location = product.location.slice(1, -1).split(',').map(Number)
    }

    const schema = Joi.object({
        name: Joi.string().min(5).max(255),
        _id: Joi.objectId(),
        location: Joi.array().items(
            Joi.number().min(-180).max(180).required(),
            Joi.number().min(-90).max(90).required()
        )
    }).or("name", "_id").options({ abortEarly: false });

    return schema.validate(product);
}