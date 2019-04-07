module.exports = function(sequelize, DataTypes) {
  var Session = sequelize.define("Session", {
    token: DataTypes.STRING,
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Session.associate = function(models) {
    Session.belongsTo(models.User, { through: "user" });
  };

  return Session;
};
