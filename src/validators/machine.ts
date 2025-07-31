import Joi from "joi";
const joiObjectId = require("joi-objectid");
Joi.objectId = joiObjectId(Joi);



export const addMachineValidation = (machine: any, isUpdate = false) => {
    const locationSchema = Joi.object({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().items(
            Joi.number().min(-180).max(180).required(),
            Joi.number().min(-90).max(90).required()
        ).required()
    }).presence(isUpdate ? 'optional' : 'required');

    const vendingMachineSchema = Joi.object({
        name: Joi.string().min(5).max(255).presence(isUpdate ? 'optional' : "required"),
        location: locationSchema.presence(isUpdate ? "optional" : 'required')
    });

    return vendingMachineSchema.validate(machine, { abortEarly: false });
}

export const getMachineQueryValidation = (machine: any) => {
    /**
     * DONE: convert location string to array
     * DONE: validate machine object
     */
    if (machine.location) {
        machine.location = machine.location.slice(1, -1).split(',').map(Number)
    }

    const schema = Joi.object({
        page: Joi.number().integer().min(1).max(300).required(),
        name: Joi.string().min(5).max(255).optional(),
        _id: Joi.objectId().optional(),
        location: Joi.array().items(
            Joi.number().min(-180).max(180).required(),
            Joi.number().min(-90).max(90).required()
        ).optional(),
    }).options({ abortEarly: false })

    return schema.validate(machine);
}

export const getNearestMachineValidation = (parameters: any) => {
    parameters.longitude = Number(parameters.longitude);
    parameters.latitude = Number(parameters.latitude);

    const schema = Joi.object({
        longitude: Joi.number().min(-180).max(180).required(),
        latitude: Joi.number().min(-90).max(90).required()
    }).options({ abortEarly: false })

    return schema.validate(parameters)
}