'use strict'

const mongodbfw = require('../src')
const assert = require('assert')

const caseUrl = () => {
  const url = mongodbfw.getUrl([{ host: 'localhost', port: 27028 }, { host: 'anotherhost', port: 17028 }], 'uname', 'pwd', 'admin')
  assert(url==='mongodb://uname:pwd@localhost:27028,anotherhost:17028/admin')
}

const caseConnectorDefaultPromise = () => {
  const connector = new mongodbfw.Connector({
    hosts: [{ host: 'localhost', port: 27017 }],
    username: 'superuser',
    password: 'superuser',
    authDbName: 'admin'
  })
  
  connector.getDb('middlewareCenter').then(db => {})
  .then(() => connector.getClient().then(client => {}))
  .then(() => connector.getCollection('tmp', 'middlewareCenter'))
  .then(collection => collection.find().forEach(data => {}, err => err && assert.fail('error 4')))
  .catch(err => console.log(err) && assert.fail('error 1'))
  .finally(() => connector.shutdown())

}

const caseServerStatus = () => {
  const connector = new mongodbfw.Connector({
    hosts: [{ host: 'localhost', port: 27017 }],
    username: 'superuser',
    password: 'superuser',
    authDbName: 'admin'
  })
  
  connector.getServerStatus('middlewareCenter')
  .then(console.log) 
  .catch(err => console.log(err) && assert.fail('error 2'))
  .finally(() => connector.shutdown())
}

const caseDrop = () => {
  const connector = new mongodbfw.Connector({
    hosts: [{ host: 'localhost', port: 27017 }],
    username: 'superuser',
    password: 'superuser',
    authDbName: 'admin'
  })
  
  connector.dropDatabase('kjhkjh876876')
  .then(() => console.log('nonexisting database dropped without error message'))
  .catch(err => console.log('nonexisting database dropped with error message', err))
  .finally(() => connector.shutdown())
}

const caseConnectorDefaultCallback = () => {
  const connector = new mongodbfw.Connector({
    hosts: [{ host: 'localhost', port: 27017 }],
    username: 'mwuser',
    password: 'mwuserpwd',
    authDbName: 'admin'
  })
  
  connector.getDb('middlewareCenter', (err, db) => {
    console.log(err, db)
  })
  .finally(() => connector.shutdown())
}
 
const caseConvertNumber = () => {
  console.log(mongodbfw.objectIdFromDate(100000, true))
  console.log(mongodbfw.objectIdFromDate(100000, false))
  console.log(mongodbfw.uniqueObjectId())
  assert(mongodbfw.longFromNumber(-8).toNumber()===-8)
  assert(mongodbfw.intFromNumber(-8).valueOf()===-8)
}

setTimeout(() => console.log('\n--- Tests are OK ---'), 2000)

//caseConnectorDefaultPromise()
caseServerStatus()
caseDrop()
//caseConnectorDefaultCallback()
//caseConvertNumber()

