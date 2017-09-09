const Sequelize = require('sequelize')
const sequelizeInstance = require('../sequelize_instance.js')

module.exports = sequelizeInstance.define('{{modelName}}', {
  name: {
    allowNull: true,
    type: Sequelize.STRING
  },
  id: {
     allowNull: false,
     defaultValue: Sequelize.UUIDV4,
     primaryKey: true,
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
