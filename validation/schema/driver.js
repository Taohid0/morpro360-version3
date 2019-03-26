const Joi = require("joi");

const DriverSchema = {
    name : Joi.string().required(),
    phone : Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    address : Joi.string().required(),
    license : Joi.string().required(),
    token : Joi.string().required()
}

module.exports = DriverSchema;