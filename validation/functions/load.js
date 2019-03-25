const Joi = require("joi");
const LoadSchema = require("../schema/load");
const errorUtils = require("./utils");

function isValidLoadData(data)
{
    const {error,value} = Joi.validate(data,LoadSchema);
    console.log(error);
    if(error)
    {
        const errors = errorUtils.getErrorArray(error);
        return errors;
    }
    return false;
}
module.exports = {isValidLoadData};


