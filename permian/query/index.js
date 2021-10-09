var http = require('http')
var https = require('https')
var { promisify } = require('util')

var MAX_DATA_LENGTH_KB = 10000
var REQUEST_TIMEOUT_MS = 12000

var query = (h, method, url, payload, callback) => {
  var request = h.request(url, { method, timeout: REQUEST_TIMEOUT_MS }, resp => {
    var data = Buffer.alloc(0)
    resp.on('data', chunk => {
      data = Buffer.concat([data, chunk])
      data.length > MAX_DATA_LENGTH_KB * 1000 && response.end()
    })
    resp.on('end', () => callback(false, data))
    resp.on('error', e => callback(e || -1))
  })
  request.on('error', e => callback(e || -2))
  payload ? request.end(payload) : request.end()
}

var isFunction = obj => obj && typeof obj === 'function'

var checkUrl = url => {
  if (!url) {
    throw new Error('Bad or missing url: ' + url)
  }
  return url
}

var promisify2 = f => (u, callback, url = checkUrl(u)) => callback ? f(url, callback) : promisify(f)(url)

var promisify3 = f => (u, payload, callback, url = checkUrl(u)) => {
  if (isFunction(payload)) {
    payload = false
    callback = payload
  }
  return callback ? f(url, payload, callback) : promisify(f)(url, payload)
}

var createFacade = h => ({
  get: promisify2((url, callback) => query(h, 'GET', url, false, callback)),
  put: promisify3((url, payload, callback) => query(h, 'PUT', url, payload, callback)),
  post: promisify3((url, payload, callback) => query(h, 'POST', url, payload, callback)),
  delete: promisify2((url, callback) => query(h, 'DELETE', url, false, callback))
})

module.exports = Object.freeze({
  MAX_DATA_LENGTH_KB,
  REQUEST_TIMEOUT_MS,
  http: createFacade(http),
  https: createFacade(https)
})
