module.exports = function(sequelize, DataTypes) {
  var CompanyUser = sequelize.define("CompanyUser", {
  });

  CompanyUser.associate = function(models) {
      CompanyUser.belongsTo(models.User, {through:'user'});
      CompanyUser.belongsTo(models.Company,{through:"company"});
  }; 
   return CompanyUser;
};
