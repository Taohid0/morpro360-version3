module.exports = function(sequelize, DataTypes) {
  var Session = sequelize.define("Session", {
    // Giving the Tokens model an attribute token of type STRING
    "token": DataTypes.STRING
  });

  Session.associate = function(models) {
    // Associating Tokens with User
    Session.belongsTo(models.User);
    
    
  };

  return Session;
};