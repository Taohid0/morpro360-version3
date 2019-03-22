const Joi = require("joi");

const CompanySchema = {
    name : Joi.string().alphanum().required(),
    email : Joi.string().email({minDomainAtoms:2}).required(),
    phone : Joi.string().required(),
    description : Joi.string().allow("").optional(),
}

module.exports = CompanySchema;