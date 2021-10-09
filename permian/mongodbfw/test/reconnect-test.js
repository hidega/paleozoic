'use strict'

const assert = require('assert')
const mongodb = require('mongodb')

const caseReconnect = () => {
  const mongoUrl = 'mongodb://mwuser:mwuserpwd@localhost:27017/admin'
  
  const fetchData = db => db.collection('tmp').find().forEach(data => console.log(data, new Date()), err => {
    console.log(err)
    err && assert.fail('error 2')
  })
  
  mongodb.MongoClient.connect(mongoUrl, { 
    useNewUrlParser: true,
    connectTimeoutMS: 30000,
    autoReconnect: true,
    reconnectTries: 5,
    reconnectInterval: 5000    
  }, (err, client) => {
    console.log(err)  
    err && assert.fail('error 1')
    const db = client.db('middlewareCenter')
    setInterval(() => fetchData(db), 2000)
  })
}

caseReconnect()
