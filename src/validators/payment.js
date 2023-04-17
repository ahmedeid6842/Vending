const Joi = require("joi");

module.exports.addDepositValidation = (deposit) => {
    const schema = Joi.object({
        amount: Joi.number().integer().valid(5, 10, 20, 50, 100).messages({
            'any.only': 'Invalid coin amount, only accept [5, 10, 20, 50, 100]'
        }).required()
    })
    return schema.validate(deposit);
}