const Joi = require("joi");

const AdminSchema = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password:Joi.string().required(),
    roleId : Joi.number().integer().min(1).required()
};

module.exports = UserSchema;