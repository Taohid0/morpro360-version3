'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Drivers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER(11),
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
  
      phone: {
        type: Sequelize.STRING(25),
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false
      },
  
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
  
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
  
      license: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // The password cannot be null
      password: {
        type: Sequelize.STRING,
        allowNull: false
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
    return queryInterface.dropTable('Drivers');
  }
};