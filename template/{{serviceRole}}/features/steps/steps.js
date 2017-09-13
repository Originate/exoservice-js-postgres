const {defineSupportCode} = require('cucumber')
const ExoComMock = require('exocom-mock')
const {expect} = require('chai')
const fs = require('fs')
const N = require('nitroglycerin')
const portReservation = require('port-reservation')
const yaml = require('js-yaml')
const wait = require('wait')
const ObservableProcess = require('observable-process')
const async = require('async')
const lowercaseKeys = require('lowercase-keys')

const serviceConfig = yaml.safeLoad(fs.readFileSync('service.yml'), 'utf8')


function normalizePayload(obj) {
  if (Array.isArray(obj)) {
    return obj.map(normalizePayload)
  }
  const newObj = Object.assign({}, obj)
  if (newObj.id) {
    newObj.id = "<uuid>"
  }
  if (newObj.createdAt) {
    newObj.createdAt = "<timestamp>"
  }
  if (newObj.updatedAt) {
    newObj.updatedAt = "<timestamp>"
  }
  return newObj
}

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
      stdout: false,
      stderr: false
    })
    this.process.wait(serviceConfig.startup['online-text'], done)
  })

  When(/^receiving the message "([^"]*)"$/, function(message) {
    this.exocom.send({
      service: '{{serviceRole}}',
      name: message
    })
  })


  When(/^receiving the message "([^"]*)" with the payload:$/, function(message, payloadStr) {
    const payload = JSON.parse(payloadStr)
    if (payload.id == "<uuid of one>") {
      payload.id = this.instanceNameToId.one
    }
    this.exocom.send({
      service: '{{serviceRole}}',
      name: message,
      payload
    })
  })


  Then(/^the service replies with "([^"]*)"$/, function(expectedMessageName, done) {
    this.exocom.onReceive( () => {
      const receivedMessages = this.exocom.receivedMessages
      expect(receivedMessages).to.have.length(1)
      expect(receivedMessages[0].name).to.equal(expectedMessageName)
      done()
    })
  })

  Given(/^the service contains the {{modelName}}s:$/, function(table, done) {
    this.instanceNameToId = {}
    async.eachSeries(table.hashes().map(lowercaseKeys), (data, cb) => {
      this.exocom.send({
        service: '{{serviceRole}}',
        name: 'create {{modelName}}',
        payload: data
      })
      this.exocom.onReceive(() => {
        this.instanceNameToId[data.name] = this.exocom.receivedMessages[0].payload.id
        cb()
      })
    }, done)
  })

  Then(/^the service replies with "([^"]*)" and the payload:$/, function(message, payload, done) {
    var expectedPayload = JSON.parse(payload)
    this.exocom.onReceive( () => {
      expect(this.exocom.receivedMessages[0].name).to.equal(message)
      const actualPayload = normalizePayload(this.exocom.receivedMessages[0].payload)
      expect(actualPayload).to.eql(expectedPayload)
      done()
    })
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
      name: 'list {{modelName}}'
    })
    this.exocom.onReceive( () => {
      const actualNames = this.exocom.receivedMessages[0].payload.map(x => x.name)
      const expectedNames = table.hashes().map(lowercaseKeys).map(x => x.name)
      expect(actualNames).to.have.members(expectedNames)
      done()
    })
  })

})
