'use strict';
module.exports = (sequelize, DataTypes) => {
  const Load = sequelize.define("Load", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    distance: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pickUpDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    dropOffDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    productDetails: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pickUpAddress: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pickUpCity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pickUpZipCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pickUpState: {
      type: DataTypes.STRING,
      allowNull: false
    },

    dropOffAddress: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dropOffCity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dropOffZipCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dropOffState: {
      type: DataTypes.STRING,
      allowNull: false
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },

    status: {
      type: DataTypes.STRING,
      // A = Active/Available
      // P = Picked up
      // I = Inroute
      // D = delivered
      values: ["A", "P", "I", "D"],
      allowNull: false,
      defaultValue: "A"
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Load.associate = function(models) {
    Load.belongsTo(models.Admin, { as: "admin", allowNull: false });
  };

  return Load;
};