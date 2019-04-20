'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define("Role", {
    "name":
    {
      type: DataTypes.STRING,
      allowNull: false
    },
    "isDeleted": {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Role;
};