const Joi = require("joi");
const UserSchema = require("../schema/user");
const getErrorArray = require("./utils");

function isValidUserData(data) {
    console.log(data);
  const { error, value } = Joi.validate(data, UserSchema);

  if (error) {
    const errors = getErrorArray(error);
    return errors;
  }
  return false;
}

module.exports = { isValidUserData };
