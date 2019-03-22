function getErrorArray(error)
{
    let errors = [];

    for(let err of error.details)
    {
        errors.push(err.message);
    }
    return errors;
}

module.exports = getErrorArray;