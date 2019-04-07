const Joi = require("joi");

const UserSchema = {
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    MC: Joi.number().integer().required(),
    DOT: Joi.number().integer().required(),
    state:Joi.string().required(),
    city:Joi.string().required(),
    address: Joi.string().required(),
    description:Joi.string().allow("").optional(),
    password:Joi.string().required()
};

module.exports = UserSchema;