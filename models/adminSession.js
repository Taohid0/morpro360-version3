module.exports = function(sequelize, DataTypes) {
    var AdminSession = sequelize.define("AdminSession", {
      // Giving the Tokens model an attribute token of type STRING
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