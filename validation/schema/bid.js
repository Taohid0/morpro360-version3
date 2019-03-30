const Joi = require("joi");

const BidSchema = {
    rate: Joi.number().integer().min(1).required(),
    note: Joi.string().allow("").optional(),
    isAssigned: Joi.string().allow("").optional(),
    loadId : Joi.number().integer().min(1).required(),
    bidderId : Joi.number().integer().min(1).required(),
    // bidderCompanyId:Joi.number().integer().min(1).required(),
    driverId:Joi.number().integer().min(1).required(),
}
module.exports = BidSchema;