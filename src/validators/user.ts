import Joi from "joi";
import { joiPasswordExtendCore } from "joi-password";

const joiPassword = Joi.extend(joiPasswordExtendCore);


export const create_updateUserValidation = (user: any, isUpdate = false) => {
    const schema = Joi.object({
        userName: Joi.string().min(8).max(255).presence(isUpdate ? 'optional' : 'required'),
        password: joiPassword.string()
            .minOfSpecialCharacters(1)
            .minOfLowercase(1)
            .minOfUppercase(1)
            .minOfNumeric(6)
            .noWhiteSpaces()
            .presence(isUpdate ? 'optional' : 'required'),
        role: Joi.string().valid('buyer', 'seller').presence(isUpdate ? 'optional' : 'required')
    }).or('userName', 'password', 'role').options({ abortEarly: false })
    return schema.validate(user);
}

export const loginValidation = (user: any) => {
    const schema = Joi.object({
        userName: Joi.string().required(),
        password: Joi.string().required()
    })
    return schema.validate(user);
}
