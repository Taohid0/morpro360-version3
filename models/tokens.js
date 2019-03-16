module.exports = function(sequelize, DataTypes) {
  var Tokens = sequelize.define("Tokens", {
    // Giving the Tokens model an attribute token of type STRING
    "token": DataTypes.STRING
  });

  Tokens.associate = function(models) {
    // Associating Tokens with User
    Tokens.belongsTo(models.User);
    
    
  };

  return Tokens;
};