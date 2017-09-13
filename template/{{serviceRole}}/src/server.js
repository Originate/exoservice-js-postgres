const sequelizeInstance = require('./database/sequelize_instance')
const Model = require('./database/model')
const {bootstrap} = require('exoservice')

bootstrap({

  beforeAll: async (done) => {
    try {
      await sequelizeInstance.authenticate()
      console.log('Connected to postgres database')
    } catch (error) {
      console.error('Unable to connect to the postgres database:', error)
    }
    done()
  },

  'get {{modelName}}': async ({id}, {reply}) => {
    try {
      const instance = await Model.findById(id)
      if (instance) {
        reply('{{modelName}} details', instance)
      } else {
        reply('{{modelName}} not-found', instance)
      }
    } catch (error) {
      console.error("Error getting: ", err)
    }
  },

  'list {{modelName}}': async (_, {reply}) => {
    try {
      const instances = await Model.findAll()
      reply('{{modelName}} list', instances)
    } catch (error) {
      console.error("Error listing: ", err)
    }
  },

  'create {{modelName}}': async (data, {reply}) => {
    try {
      const instance = await Model.create(data)
      reply('{{modelName}} created', instance)
    } catch (error) {
      console.error("Error creating: ", err)
    }
  },

  'update {{modelName}}': async (data, {reply}) => {
    try {
      const instance = await Model.findById(data.id)
      if (instance) {
        await instance.update(data)
        reply('{{modelName}} updated', instance)
      } else {
        reply('{{modelName}} not-found')
      }
    } catch (error) {
      console.error("Error updating: ", err)
    }
  },

  'delete {{modelName}}': async ({id}, {reply}) => {
    try {
      const instance = await Model.findById(id)
      if (instance) {
        await instance.destroy()
        reply('{{modelName}} deleted', instance)
      } else {
        reply('{{modelName}} not-found')
      }
    } catch (error) {
      console.error("Error deleting: ", err)
    }
  },

})
