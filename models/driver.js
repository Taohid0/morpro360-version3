var bcrypt = require("bcrypt-nodejs");

module.exports = function(sequelize, DataTypes) {
  var Driver = sequelize.define("Driver", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
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
    "isDeleted":{
      type:DataTypes.BOOLEAN,
      defaultValue:false,
    },
  });

  Driver.associate = function(models) {
    // Driver.belongsTo(models.Company,{as:"company",allowNull:false});
    Driver.belongsTo(models.User, { as: "user", allowNull: false });
  };
  Driver.addHook("beforeCreate", function(driver) {
    driver.password = bcrypt.hashSync(driver.password, bcrypt.genSaltSync(10), null);
    console.log("Hooked before create");
  });

  Driver.addHook("beforeUpdate", function(driver) {
    console.log("Hooked after update");
    if(!!driver.password) {
      driver.password = bcrypt.hashSync(driver.password, bcrypt.genSaltSync(10), null);
      console.log(driver);
    }
  });
  return Driver;
};
