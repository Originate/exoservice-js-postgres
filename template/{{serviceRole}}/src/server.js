const sequelizeInstance = require('./database/sequelize_instance')
const Model = require('./database/model')
const {bootstrap} = require('exoservice')

bootstrap({

  beforeAll: (done) => {
    sequelizeInstance
      .authenticate()
      .then(() => {
        console.log('Connected to postgres database');
      })
      .catch(err => {
        console.error('Unable to connect to the postgres database:', err);
      })
      .then(done)
  },

  'list {{modelName}}': (_, {reply}) => {
    Model.findAll()
      .then((instances) => {
        reply('{{modelName}} list', instances)
      })
      .catch((err) => {
        console.error("Error listing {{modelName}}s: ", err)
      })
  },

  'create {{modelName}}': (input, {reply}) => {
    Model.create(tradeData)
      .then((instance) => {
        reply('{{modelName}} created', instance)
      })
      .catch((err) => {
        console.error("Error creating {{modelName}}: ", err)
      })
  }

})
