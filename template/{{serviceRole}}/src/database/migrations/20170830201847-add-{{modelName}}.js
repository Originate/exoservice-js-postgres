'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('{{modelName}}', {
      id: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAd: {
        allowNull: true,
        type: Sequelize.DATE
      }
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('{{modelName}}')
  }
};
