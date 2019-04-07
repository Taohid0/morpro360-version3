module.exports = function(sequelize, DataTypes) {
    var AdminSession = sequelize.define("AdminSession", {
      "token": DataTypes.STRING,
      "isDeleted":{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
      },
    });
  
    AdminSession.associate = function(models) {
      // Associating Tokens with User
      AdminSession.belongsTo(models.Admin,{through:"admin"});
      
      
    };
  
    return AdminSession;
  };