module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('{{modelName}}s', {
      id: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    })
  },

  down(queryInterface) {
    return queryInterface.dropTable('{{modelName}}')
  },
}
