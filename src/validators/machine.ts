import Joi from "joi";
const joiObjectId = require("joi-objectid");
Joi.objectId = joiObjectId(Joi);



const locationSchema = Joi.object({
    type: Joi.string().valid("Point").required(),
    coordinates: Joi.array()
        .ordered(
            Joi.number().min(-180).max(180).required(), // longitude
            Joi.number().min(-90).max(90).required()    // latitude
        )
        .required()
});

const addMachineBody = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    location: locationSchema.required()
});

const updateMachineBody = Joi.object({
    name: Joi.string().min(5).max(255).optional(),
    location: locationSchema.optional()
});

const getMachineQuery = Joi.object({
    page: Joi.number().integer().min(1).max(300).required(),
    name: Joi.string().min(5).max(255).optional(),
    _id: Joi.objectId().optional(),
    location: Joi.array()
        .ordered(
            Joi.number().min(-180).max(180).required(), // longitude
            Joi.number().min(-90).max(90).required()    // latitude
        )
        .optional()
});

const getNearestMachineParams = Joi.object({
    longitude: Joi.number().min(-180).max(180).required(),
    latitude: Joi.number().min(-90).max(90).required()
});

export const MachineValidators = {
    addMachineBody,
    updateMachineBody,
    getMachineQuery,
    getNearestMachineParams,
}