module.exports = function(sequelize, DataTypes) {
    var AdminRole= sequelize.define("AdminRole", {
    });
  
       AdminRole.associate = function(models) {
        AdminRole.belongsTo(models.Admin, {as:"admin", allowNull:false});
        AdminRole.belongsTo(models.Role, {as:"role", allowNull:false});
     };
  
    return AdminRole;
  };
  