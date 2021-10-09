var commons = {
  isNil: o => o === null || o === undefined,
  isArray: o => Array.isArray(o),
  isFunction: o => !commons.isNil(o) && typeof o === 'function',
  isString: o => !commons.isNil(o) && typeof o === 'string' || o instanceof String,
  isBoolean: o => !commons.isNil(o) && typeof o === 'boolean',
  isNumber: o => !commons.isNil(o) && !commons.isBoolean(o) && !commons.isString(o) && !isNaN(o),
  isObject: o => !commons.isNil(o) && typeof o === 'object',
  isSymbol: o => typeof o === 'symbol', 
  throwError: e => { throw new Error(e) }
}

module.exports = commons
