var mongodb = require('mongodb')
var commons = require('./commons') 

var getUrl = (hosts, username, password, authDbName, replicaSetName) => `mongodb://${username}:${password}` +
  ('@' + hosts.map(e => e.host + ':' + e.port).join(',') + '/') +
  (authDbName || '') +
  (replicaSetName ? '?replicaSet=' + replicaSetName : '') 

var objectIdFromDate = (d, padRnd) => {
  var date = commons.matcher()
    .value(d)
    .on(commons.isNumber, d)
    .on(commons.isNumber, () => new Date(d).getTime())
    .on(commons.isDate, () => d.getTime())
    .end()
  var hexStr = parseInt(date/1000).toString(16).padStart(8, '0')
  var suffix = padRnd ? '0000000000' + (100000 + parseInt(Math.random()*899999)) : '0000000000000000'
  return new mongodb.ObjectID(hexStr + suffix)
}

module.exports = {
  getUrl,
  getServerDate: collection => collection.aggregate([{ $collStats: {} }, { $project : { localTime: 1 } }]),
  longFromNumber: n => mongodb.Long.fromNumber(n),
  intFromNumber: n => new mongodb.Int32(n),
  doubleFromNumber: n => new mongodb.Double(n),
  objectIdOf: str => new mongodb.ObjectID(str),
  uniqueObjectId: new mongodb.ObjectID(commons.uuid().substr(3, 27)),
  timestampFromObjectId: oid => new mongodb.ObjectID(oid).getTimestamp(),
  objectIdFromDate
}
