'use strict';
const bcrypt = require("bcrypt-nodejs");
module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define("Driver", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
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

    license: {
      type: DataTypes.STRING,
      allowNull: false
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

  Driver.associate = function(models) {
    Driver.belongsTo(models.User, { as: "user", allowNull: false });
  };
  Driver.addHook("beforeCreate", function(driver) {
    driver.password = bcrypt.hashSync(
      driver.password,
      bcrypt.genSaltSync(10),
      null
    );
    console.log("Hooked before create");
  });

  Driver.addHook("beforeUpdate", function(driver) {
    console.log("Hooked after update");
    if (!!driver.password) {
      driver.password = bcrypt.hashSync(
        driver.password,
        bcrypt.genSaltSync(10),
        null
      );
      console.log(driver);
    }
  });
  return Driver;
};