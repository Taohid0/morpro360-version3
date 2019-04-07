// Requiring bcrypt for password hashing. Using the bcrypt-nodejs version as the regular bcrypt module
var bcrypt = require("bcrypt-nodejs");
module.exports = function(sequelize, DataTypes) {
  var Admin = sequelize.define("Admin", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    // The email cannot be null, and must be a proper email before creation
    email: {
      type: DataTypes.STRING,
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
