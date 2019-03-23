module.exports = function(sequelize, DataTypes) {
    var UserRole = sequelize.define("UserRole", {
    });
  
    UserRole.associate = function(models) {
      UserRole.belongsTo(models.User, {through:'user'});
      UserRole.belongsTo(models.Company,{through:"company"});
      UserRole.belongsTo(models.Role,{thgouth:"role"});
    };
  
    return UserRole;
  };