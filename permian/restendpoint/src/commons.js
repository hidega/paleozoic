var commons = require('@permian/commons')

var bufferSize = 1000000

module.exports = {
  hasObjectOtherKeysThan: commons.lang.hasObjectOtherKeysThan,
  splitToChars: commons.string.splitToChars,
  throwError: commons.lang.throwError,
  isObject: commons.lang.isObject,
  isntObject: commons.lang.isntObject,
  isString: commons.lang.isString,
  when: commons.lang.when,
  readStreamToBuffer: stream => new Promise((resolve, reject) => commons.stream.readStreamToBuffer(stream, bufferSize, (err, buffer) => err ? reject(err) : resolve(buffer))),
  try: commons.lang.try,
  checkIfPortIsReachable: commons.net.checkIfPortIsReachable,
  StdLogger: commons.proc.StdLogger,
  isoDateNow: commons.date.isoDateNow,
  cloneDeep: commons.lang.cloneDeep,
  uuid: commons.proc.uuid,
  matcher: commons.lang.matcher,
  resolvePath: commons.files.resolvePath,
  httpGet: commons.net.http.get,
  httpsGet: commons.net.https.get,
  isFunction: commons.lang.isFunction,
  isntNil: commons.isntNil
}
