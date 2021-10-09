var commons = require('@permian/commons')

module.exports = {
  simpleHashNat: commons.string.simpleHashNat,
  matcher: commons.lang.matcher,
  throwError: commons.lang.throwError,
  cloneDeep: commons.lang.cloneDeep,
  chainFunctions: commons.lang.chainFunctions,
  resolvePath: commons.files.resolvePath,
  isNumber: commons.lang.isNumber,
  isString: commons.lang.isString,
  isDate: commons.date.isValidDate,
  stream: commons.stream,
  disableDeclaredFunctions: commons.lang.disableDeclaredFunctions,
  promisifyIfNoCallback2: commons.lang.promisifyIfNoCallback2,
  promisifyIfNoCallback1: commons.lang.promisifyIfNoCallback1,
  promisifyIfNoCallback0: commons.lang.promisifyIfNoCallback0,
  uuid: commons.proc.uuidHex
}

