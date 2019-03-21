const Joi = require("joi");

const UserSchema = {
    userName: Joi.string().alphanum().min(3).max(25).required(),
    firstName: Joi.string().allow("").optional(),
    lastName: Joi.string().allow("").optional(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required()
};

module.exports = UserSchema;