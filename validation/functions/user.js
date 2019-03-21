const Joi = require("joi");
const UserSchema = require("../schema/user");

function isValidUderData(data) {
    console.log(data);
  const { error, value } = Joi.validate(data, UserSchema);

  if (error) {
    let errors = [];

    for (let err of error.details) {
      console.log(err);
      errors.push(err.message);
    }
    return errors;
  }
  return false;
}

module.exports = { isValidUderData };
