var mongodb = require('mongodb')
var commons = require('./commons') 

var getUrl = (hosts, username, password, authDbName, replicaSetName) => `mongodb://${username}:${password}` +
  ('@' + hosts.map(e => e.host + ':' + e.port).join(',') + '/') +
  (authDbName || '') +
  (replicaSetName ? '?replicaSet=' + replicaSetName : '') 

var objectIdFromDate = (d, padRnd) => {
  var date = 0
  if(commons.lang.isNumber(d)) { 
    date = d
  } else if(commons.lang.isString(d)) {  
    date = new Date(d).getTime()
    isNaN(date) && (date = 0)
  } else if(d instanceof Date) {
    date = d.getTime()
  }
  var hexStr = parseInt(date/1000).toString(16).padStart(8, '0')
  var suffix = padRnd ? '0000000000' + (100000 + parseInt(Math.random()*899999)) : '0000000000000000'
  return new mongodb.ObjectID(hexStr + suffix)
}

var upstreamData = (stream, collection, callback) => {
  var bundleSize = 100
  var buffer = []
 
  stream.on('error', callback)
  
  stream.on('end', () => collection.insertMany(buffer, {}, callback))
  
  stream.on('data', data => {
    buffer.push(data)
    buffer.length===bundleSize && collection.insertMany(buffer, {}, err => {
      buffer.length = 0
      err && stream.destroy(err)
    }) 
  })
}

var uniqueObjectId = () => {
  var u = commons.proc.uuid() 
  var arr = Array.from(commons.bitwise.natToByteArray(Date.now(), 4))
  .concat(Array.from(commons.bitwise.natToByteArray(commons.string.simpleHashNat(u.substr(0, 15), 4))))
  .concat(Array.from(commons.bitwise.natToByteArray(commons.string.simpleHashNat(u.substr(16), 4))))
  while(arr.length<12) {
    arr.push(parseInt(Math.random()*255))
  }
  return new mongodb.ObjectID(commons.string.byteArrayToString(arr))
}

module.exports = {
  upstreamData,
  getUrl,
  getServerDate: collection => collection.aggregate([{ $collStats: {} }, { $project : { localTime: 1 } }]),
  longFromNumber: n => mongodb.Long.fromNumber(n),
  intFromNumber: n => new mongodb.Int32(n),
  doubleFromNumber: n => new mongodb.Double(n),
  objectIdOf: str => new mongodb.ObjectID(str),
  uniqueObjectId,
  timestampFromObjectId: oid => new mongodb.ObjectID(oid).getTimestamp(),
  objectIdFromDate
}
