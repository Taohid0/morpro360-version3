module.exports = function(sequelize, DataTypes) {
  var user_Company = sequelize.define("user_Company", {
    // Giving the Author model a name of type STRING
    "CompanyId": DataTypes.STRING,
    "UserId": DataTypes.STRING,
  });

  return user_Company;

  user_Company.associate = function(models) {
  };
};
