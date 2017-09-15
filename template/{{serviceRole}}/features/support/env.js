const { defineSupportCode } = require('cucumber')
const World = require('./world')
const Model = require('../../src/database/model')

defineSupportCode(({ After, setDefaultTimeout, setWorldConstructor }) => {
  setDefaultTimeout(5000)
  setWorldConstructor(World)
  After(function(_testCaseResult, done) {
    Model.destroy({ truncate: true })
      .then(() => {
        this.process.kill()
        this.exocom.close(done)
      })
      .catch(done)
  })
})
