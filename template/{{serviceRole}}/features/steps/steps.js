const {defineSupportCode} = require('cucumber')
const ExoComMock = require('exocom-mock')
const {expect} = require('chai')
const fs = require('fs')
const N = require('nitroglycerin')
const portReservation = require('port-reservation')
const yaml = require('js-yaml')
const wait = require('wait')
const ObservableProcess = require('observable-process')


const serviceConfig = yaml.safeLoad(fs.readFileSync('service.yml'), 'utf8')


defineSupportCode(function({Given, When, Then}) {

  Given(/^an ExoCom server$/, function(done) {
    portReservation.getPort(N( exocomPort => {
      this.exocomPort = exocomPort
      this.exocom = new ExoComMock()
      this.exocom.listen(exocomPort, done)
    }))
  })


  Given(/^an instance of this service$/, {timeout: 15 * 1000}, function(done) {
    this.process = new ObservableProcess(serviceConfig.startup.command, {
      env: {
        EXOCOM_PORT: this.exocomPort,
        EXOCOM_HOST: 'localhost',
        ROLE: serviceConfig.type
      },
      stdout: process.stdout,
      stderr: process.stderr
    })
    this.process.wait(serviceConfig.startup['online-text'], done)
  })


  When(/^receiving the "([^"]*)" command$/, function(commandName) {
    this.exocom.reset()
    this.exocom.send({
      service: serviceConfig.type,
      name: commandName
    })
  })


  Then(/^this service replies with a "([^"]*)" message/, function(expectedMessageName, done) {
    this.exocom.onReceive( () => {
      const receivedMessages = this.exocom.receivedMessages
      expect(receivedMessages).to.have.length(1)
      expect(receivedMessages[0].name).to.equal(expectedMessageName)
      done()
    })
  })

  Given(/^the service contains the records:$/, function(table, done) {
    async.each(table.hashes(), function(data, cb) {
      this.exocom.send({
        service: '{{serviceRole}}',
        name: 'create {{modelName}}',
        payload: data
      })
      this.exocom.onReceive(cb)
    }, done)
  })

  Then(/^the service contains no {{modelName}}s$/, function(done) {
    this.exocom.send({
      service: '{{serviceRole}}',
      name: 'list {{modelName}}'
    })
    this.exocom.onReceive( () => {
      expect(this.exocom.receivedMessages[0].payload.count).to.equal(0)
      done()
    })
  })


  Then(/^the service now contains the {{modelName}}s:$/, function(table, done) {
    this.exocom.send({
      service: '{{serviceRole}}',
      name: '{{modelName}} listed'
    })
    this.exocom.onReceive( () => {
      actual = this.exocom.receivedMessages[0].payload
      expected = table.hashes()
      expect(actual).to.eql(expected)
      done()
    })
  })

})
