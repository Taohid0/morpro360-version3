const Joi = require("joi");

const CompanySchema = {
    name : Joi.string().required(),
    email : Joi.string().email({minDomainAtoms:2}).required(),
    phone : Joi.string().required(),
    // description : Joi.string().allow("").optional(),
    description : Joi.string().required(),
    token : Joi.string().required()
}

module.exports = CompanySchema;