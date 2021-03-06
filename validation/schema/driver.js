const Joi = require("joi");

const DriverSchema = {
    name : Joi.string().required(),
    phone : Joi.string().required(),
    email : Joi.string().email({minDomainAtoms:2}).required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    address : Joi.string().required(),
    license : Joi.string().required(),
    password:Joi.string().required(),
    userId: Joi.number().integer().min(1).required(),
    
}

module.exports = DriverSchema;