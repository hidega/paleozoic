'use strict'

var commons = require('@permian/commons')

module.exports = {
  narrowObject: commons.lang.narrowObject,
  splitToChars: commons.string.splitToChars,
  throwError: commons.lang.throwError,
  isObject: commons.lang.isObject,
  try: commons.lang.try,
  checkIfPortIsReachable: commons.net.checkIfPortIsReachable,
  StdLogger: commons.proc.StdLogger,
  isoDateNow: commons.date.isoDateNow,
  cloneDeep: commons.lang.cloneDeep,
  uuid: commons.proc.uuid,
  httpGet: commons.net.http.get,
  httpsGet: commons.net.https.get,
  isFunction: commons.lang.isFunction,
  disableDeclaredFunctions: commons.lang.disableDeclaredFunctions,
  extractParamsAndCallback1: commons.lang.extractParamsAndCallback1
}
