'use strict';
module.exports = (sequelize, DataTypes) => {
  const AdminSession = sequelize.define("AdminSession", {
    "token": DataTypes.STRING,
    "isDeleted":{
      type:DataTypes.BOOLEAN,
      defaultValue:false,
    },
  });

  AdminSession.associate = function(models) {
    // Associating Tokens with User
    AdminSession.belongsTo(models.Admin,{as:"admin"});
    
    
  };

  return AdminSession;
};