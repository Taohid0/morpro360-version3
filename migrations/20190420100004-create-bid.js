'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Bids', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bidderId: {
        type: Sequelize.INTEGER(11),
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      loadId: {
        type: Sequelize.INTEGER(11),
        onDelete: 'CASCADE',
        references: {
          model: "Loads",
          key: 'id'
        }
      },
      driverId: {
        type: Sequelize.INTEGER(11),
        onDelete: 'CASCADE',
        references: {
          model: 'Drivers',
          key: 'id'
        }
      },
      rate: {
        type: Sequelize.INTEGER
      },
      note: {
        type: Sequelize.STRING
      },
      isAssigned: {
        type: Sequelize.BOOLEAN
      },
      isDeleted: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('Bids');
  }
};