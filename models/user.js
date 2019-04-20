'use strict';
const bcrypt = require("bcrypt-nodejs");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING(25),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    MC: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    DOT: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  User.associate = function (models) { };
  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.addHook("beforeCreate", function (user) {
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(10),
      null
    );
    console.log("Hooked before create");
  });

  User.addHook("beforeUpdate", function (user) {
    console.log("Hooked after update");
    if (!!user.password) {
      user.password = bcrypt.hashSync(
        user.password,
        bcrypt.genSaltSync(10),
        null
      );
      console.log(user);
    }
  });
  return User;
};