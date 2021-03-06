'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bid =  sequelize.define("Bid", {
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isAssigned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Bid.associate = function(models) {
    Bid.belongsTo(models.Load, { as: "load", allowNull: false });
    Bid.belongsTo(models.User, { as: "bidder", allowNull: false });
    Bid.belongsTo(models.Driver, { as: "driver", allowNull: false });
  };

  return Bid;
};