'use strict';
module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define("Session", {
    token: DataTypes.STRING,
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Session.associate = function (models) {
    Session.belongsTo(models.User, { as: "user" });
  };

  return Session;
};