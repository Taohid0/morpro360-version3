module.exports = function(sequelize, DataTypes) {
  var Tokens = sequelize.define("Tokens", {
    // Giving the Author model a name of type STRING
    "token": DataTypes.STRING
  });

  Tokens.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    Tokens.belongsTo(models.User);
    
    
  };

  return Tokens;
};