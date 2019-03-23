module.exports = function(sequelize, DataTypes) {
  var CompanyUser = sequelize.define("CompanyUser", {
    // Giving the Author model a name of type STRING
    "CompanyId": DataTypes.STRING,
    "UserId": DataTypes.STRING,
  });

  return CompanyUser;

  CompanyUser.associate = function(models) {
  };
};
