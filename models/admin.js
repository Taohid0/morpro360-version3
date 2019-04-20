'use strict';
const bcrypt = require("bcrypt-nodejs");
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define("Admin", {
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING (50),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(25),
      allowNull: false,
      unique: true
    },
    // The email cannot be null, and must be a proper email before creation
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
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

  Admin.associate = function(models) {
    Admin.belongsTo(models.Role, { through: "role" });
  };
  // Creating a custom method for our Admin model. This will check if an unhashed password entered by the Admin can be compared to the hashed password stored in our database
  Admin.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the Admin Model lifecycle
  // In this case, before a Admin is created, we will automatically hash their password
  Admin.addHook("beforeCreate", function(Admin) {
    Admin.password = bcrypt.hashSync(
      Admin.password,
      bcrypt.genSaltSync(10),
      null
    );
    console.log("Hooked before create");
  });

  Admin.addHook("beforeUpdate", function(Admin) {
    console.log("Hooked after update");
    if (!!Admin.password) {
      Admin.password = bcrypt.hashSync(
        Admin.password,
        bcrypt.genSaltSync(10),
        null
      );
      console.log(Admin);
    }
  });
  return Admin;
};