const Joi = require("joi");

function getErrorArray(error)
{
    let errors = [];

    for(let err of error.details)
    {
        errors.push(err.message);
    }
    return errors;
}




function isValidRequestData(data,schema)
{
    const {error, value} = Joi.validate(data,schema);
    if (error)
    {
        const errors = getErrorArray(error);
        return errors;
    }
    return false;
}


module.exports = {
    getErrorArray,
    isValidRequestData,
}