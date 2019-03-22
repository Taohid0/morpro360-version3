const Joi = require("joi");
const CompanySchema = require("../schema/company");
const getErrorArray = require("./utils");

function isValidCompanyData(data)
{
    const {error, value} = Joi.validate(data,CompanySchema);
    if (error)
    {
        const errors = getErrorArray(error);
        return errors;
    }
    return false;
}
module.exports = {isValidCompanyData};