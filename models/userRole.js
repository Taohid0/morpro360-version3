module.exports = function(sequelize, DataTypes) {
    var UserRole = sequelize.define("UserRole", {
    });
  
    UserRole.associate = function(models) {
      // Associating Author with Posts
      // When an Author is deleted, also delete any associated Posts
      UserRole.belongsTo(models.User, {through:'user'});
      UserRole.belongsTo(models.Company,{through:"company"});
      UserRole.belongsTo(models.Role,{thgouth:"role"});
      
      
    };
  
    return UserRole;
  };