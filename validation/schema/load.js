const Joi = require("joi");

const LoadSchema ={
    name: Joi.string().required(),
    // loadNumber : Joi.string().required(),
    pickUpDate : Joi.date().required(),
    dropOffDate: Joi.string().required(),
    weight : Joi.string().required(),
    rate: Joi.number().integer().min(0).required(),
    distance: Joi.number().integer().min(0).required(),
    // driverStatus: Joi.string().required(),
    productDetails: Joi.string().required(),
    pickUpAddress : Joi.string().required(),
    pickUpCity: Joi.string().required(),
    pickUpZipCode : Joi.string().required(),
    pickUpState : Joi.string().required(),
    dropOffAddress : Joi.string().required(),
    dropOffCity : Joi.string().required(),
    dropOffZipCode: Joi.string().required(),
    dropOffState : Joi.string().required(),
    // phone : Joi.string().required(),
    status : Joi.string().allow("").optional(),
    offererCompanyId : Joi.number().integer().min(1).required(),
    // brokerId : Joi.number().integer().min(1).required(),
    // token : Joi.string().required()
}

module.exports = LoadSchema;