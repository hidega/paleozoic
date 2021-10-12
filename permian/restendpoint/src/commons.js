var commons = require('@permian/commons')

var streamBufferSize = 1000000

module.exports = Object.freeze({
  hasObjectOtherKeysThan: commons.lang.hasObjectOtherKeysThan,
  splitToChars: commons.string.splitToChars,
  throwError: commons.lang.throwError,
  isObject: commons.lang.isObject,
  isntObject: commons.lang.isntObject,
  isString: commons.lang.isString,
  whenBuilder: commons.lang.whenBuilder,
  streamBufferSize,
  readStreamToBuffer: stream => new Promise((resolve, reject) => commons.stream.readStreamToBuffer(stream, streamBufferSize, (err, buffer) => err ? reject(err) : resolve(buffer))),
  try: commons.lang.try,
  checkIfPortIsReachable: commons.net.checkIfPortIsReachable,
  StdLogger: commons.proc.StdLogger,
  isoDateNow: commons.date.isoDateNow,
  cloneDeep: commons.lang.cloneDeep,
  uuid: commons.proc.uuid,
  matcherBuilder: commons.lang.matcherBuilder,
  resolvePath: commons.files.resolvePath,
  httpGet: commons.net.http.get,
  httpsGet: commons.net.https.get,
  isFunction: commons.lang.isFunction,
  isntNil: commons.isntNil
})
