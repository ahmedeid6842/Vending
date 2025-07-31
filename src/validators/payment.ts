import Joi from 'joi';

export const addDepositeBody = Joi.object({
  amount: Joi.number()
    .integer()
    .valid(5, 10, 20, 50, 100)
    .messages({
      'any.only': 'Invalid coin amount, only accept [5, 10, 20, 50, 100]',
    })
    .required(),
});

export const PaymentValidators = {
  addDepositeBody,
};
