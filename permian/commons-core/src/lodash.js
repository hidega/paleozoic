var isBoolean = require('lodash.isboolean')
var isString = require('lodash.isstring')
var isFunction = require('lodash.isfunction')
var isObject = require('lodash.isobject')
var isNumber = require('lodash.isnumber')
var isNil = require('lodash.isnil')
var isInteger = require('lodash.isinteger')
var isEqual = require('lodash.isequal')
var isUndefined = require('lodash.isundefined')
var merge = require('lodash.merge')
var unset = require('lodash.unset')
var has = require('lodash.has')
var min = require('lodash.min')
var max = require('lodash.max')
var clamp = require('lodash.clamp')
var random = require('lodash.random')
var toSafeInteger = require('lodash.tosafeinteger')
var uniqueId = require('lodash.uniqueid')
var union = require('lodash.union')
var clone = require('lodash.clone')
var cloneDeep = require('lodash.clonedeep')
var isEmpty = require('lodash.isempty')

module.exports = {
  isArray: Array.isArray,
  uniqueId,
  union,
  isEmpty,
  isUndefined,
  merge,
  cloneDeep,
  has,
  unset,
  clone,
  isEqual,
  min,
  max,
  clamp,
  random,
  toSafeInteger,
  isObject,
  isBoolean,
  isString,
  isFunction,
  isNumber,
  isInteger,
  isNil
}
