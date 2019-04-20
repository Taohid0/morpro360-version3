'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Loads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      adminId: {
        type: Sequelize.INTEGER(11),
        onDelete: 'CASCADE',
        references: {
          model: 'Admins',
          key: 'id'
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      distance: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      pickUpDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      dropOffDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      weight: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      rate: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
  
      productDetails: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pickUpAddress: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pickUpCity: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pickUpZipCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pickUpState: {
        type: Sequelize.STRING,
        allowNull: false
      },
  
      dropOffAddress: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dropOffCity: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dropOffZipCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dropOffState: {
        type: Sequelize.STRING,
        allowNull: false
      },
  
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
  
      status: {
        type: Sequelize.STRING,
        // A = Active/Available
        // P = Picked up
        // I = Inroute
        // D = delivered
        values: ["A", "P", "I", "D"],
        allowNull: false,
        defaultValue: "A"
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Loads');
  }
};