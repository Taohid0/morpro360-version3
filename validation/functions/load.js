const Joi = require("joi");
const LoadSchema = require("../schema/load");
const getErrorArray = require("./utils");

function isValidLoadData(data)
{
    const {error,value} = Joi.valid(data,LoadSchema);
    if(error)
    {
        const errors = getErrorArray(error);
        return errors;
    }
    return false;
}
module.exports = {isValidLoadData};


