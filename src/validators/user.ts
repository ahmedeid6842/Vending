import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const joiPassword = Joi.extend(joiPasswordExtendCore);

const createUserBody = Joi.object({
  userName: Joi.string().min(8).max(255).required(),
  password: joiPassword
    .string()
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(6)
    .noWhiteSpaces()
    .required(),
  role: Joi.string().valid('buyer', 'seller').required(),
}).options({ abortEarly: false });

const updateUserBody = Joi.object({
  userName: Joi.string().min(8).max(255).optional(),
  password: joiPassword
    .string()
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(6)
    .noWhiteSpaces()
    .optional(),
  role: Joi.string().valid('buyer', 'seller').optional(),
})
  .or('userName', 'password', 'role')
  .options({ abortEarly: false });

const loginBody = Joi.object({
  userName: Joi.string().required(),
  password: Joi.string().required(),
}).options({ abortEarly: false });

export const UserValidators = {
  createUserBody,
  updateUserBody,
  loginBody,
};
