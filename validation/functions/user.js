const Joi = require("joi");
const UserSchema = require("../schema/user");
const errorUtils = require("./utils");

function isValidUserData(data) {
  const { error, value } = Joi.validate(data, UserSchema);

  if (error) {
    const errors = errorUtils.getErrorArray(error);
    return errors;
  }
  return false;
}

module.exports = { isValidUserData };
