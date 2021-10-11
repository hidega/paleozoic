var _ = require('./lodash')
var matcher = require('./matcher')
var extractParamsCallback1= require('./extract-params-and-callback1.js')
var when = require('./when')
var tryIt = require('./try')
var fluent = require('./fluent')
var promisify = require('./promisify')
var bufferize = require('./bufferize')
var traverseObject = require('./traverse-object')
var ObjectBuilder = require('./object-builder')

var wrap = (obj, publicFns) => {
  var result = {}
  Object.entries(obj).forEach(e => _.isFunction(e[1]) && publicFns.includes(e[0]) && (result[e[0]] = e[1]))
  return result
}

var isPromise = o => _.isFunction(o?.then)

var isSymbol = o => typeof o === 'symbol'

var lang = {
  functionify: o => _.isFunction(o) ? o : () => o,
  setIfNil: (obj, propertyName, val) => (obj[propertyName] === null || obj[propertyName] === undefined) && (obj[propertyName] = val),
  assignRecursive: (src, tar) => _.merge(src, tar),
  bufferize,
  valueObj: Object.freeze({
    KEY: 'val',
    create: v => ({ val: v }),
    empty: () => ({}),
    setIfNil: (vo, v) => lang.setIfNil(vo, 'val', v),
    unwrap: vo => vo.val,
    has: vo => _.has(vo, 'val')
  }),
  extractParamsCallback1,
  matcherBuilder: matcher,
  whenBuilder: when,
  newInstance: (Ctr, ...args) => new Ctr(...args),
  wrap,
  createError: (message, code) => {
    var e = new Error(message.toString())
    code && (e.code = code)
    return e
  },
  throwError: (message, code) => {
    throw lang.createError(message, code)
  },
  try: tryIt,
  undef: [][0],
  wireFunctions: (subject, target) => Object.keys(subject).forEach(key => (!_.isFunction(subject[key])) || (target[key] = subject[key])),
  countLoop: (n, f, terminate) => {
    var i = -1
    while (++i < n) {
      var r = f(i)
      if (terminate && r) {
        break
      }
    }
    return i
  },
  hasObjectOtherKeysThan: (o, keys) => {
    var k = Object.keys(o)
    return _.union(keys, k).length !== keys.length
  },
  fluentizeMethods: (obj, methodNames) => methodNames.forEach(m => {
    var originalMethod = obj[m]
    obj[m] = (...p) => {
      originalMethod(...p)
      return obj
    }
  }),
  clone: o => _.clone(o),
  cloneDeep: o => _.cloneDeep(o),
  isNil: e => _.isNil(e),
  isntNil: e => !_.isNil(e),
  isInteger: o => _.isInteger(o),
  isntInteger: o => !_.isInteger(o),
  isString: o => _.isString(o),
  isntString: o => !_.isString(o),
  isObject: o => _.isObject(o),
  isntObject: o => !_.isObject(o),
  isDate: o => _.isDate(o),
  isNumber: o => _.isNumber(o),
  isBoolean: o => _.isBoolean(o),
  isntBoolean: o => !_.isBoolean(o),
  isEmpty: o => _.isEmpty(o),
  isntEmpty: o => !_.isEmpty(o),
  isEqual: (o, p) => _.isEqual(o, p),
  isntEqual: (o, p) => !_.isEqual(o, p),
  isUndefined: o => _.isUndefined(o),
  isArray: o => _.isArray(o),
  isntArray: o => !_.isArray(o),
  isFunction: o => _.isFunction(o),
  isntFunction: o => !_.isFunction(o),
  isPromise,
  isntPromise: o => !isPromise(o),
  isSymbol,
  isntSymbol: o => !isSymbol(o),
  traverseObject,
  deepFreeze: obj => {
    var clone = _.cloneDeep(obj)
    lang.traverseObject(clone, e => e.parent && (e.parent[e.key] = Object.freeze(e.obj)))
    return clone
  },
  removeFromArray: (array, element) => {
    var index = array.indexOf(element)
    index === -1 || array.splice(index, 1)
  },
  chainFunctions: (functions, params) => {
    var f = (n, r) => functions[n] ? f(n + 1, functions[n](r)) : r
    return f(0, params)
  },
  callbackify: promise => callback => promise.then(r => callback(false, r)).catch(e => callback(e || -1)),
  promisifyIfNoCallback0: promisify.promisifyIfNoCallback0,
  promisifyIfNoCallback1: promisify.promisifyIfNoCallback1,
  promisifyIfNoCallback2: promisify.promisifyIfNoCallback2,
  promisifyIfNoCallback3: promisify.promisifyIfNoCallback3,
  extractParamsAndCallback1: promisify.extractParamsAndCallback1,
  ObjectBuilder,
  createObject: (kvps, clone) => kvps.reduce((acc, kvp) => {
    acc[kvp[0]] = clone ? _.cloneDeep(kvp[1]) : kvp[1]
    return acc
  }, {}),
  fluent,
  narrowObject: (obj, keys) => lang.createObject(keys.filter(k => lang.isntNil(obj[k])).map(k => [k, obj[k]]), false),
  disableDeclaredFunctions: obj => Object.entries(obj).forEach(entry => lang.isFunction(entry[1]) && (obj[entry[0]] = () => { }))
}

lang.sleep = lang.promisifyIfNoCallback1((timeout, callback) => setTimeout(callback, timeout))

module.exports = lang
