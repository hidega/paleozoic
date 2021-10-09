var commons = require('./commons')
var http = require('./http')
var ResponseTypeSetter = require('./response-type-setter')

var writeResponse = (obj, response) => response.end(commons.isString(obj) || Buffer.isBuffer(obj) ? obj : JSON.stringify(obj))

var fetchPayloadObject = request => commons.readStreamToBuffer(request).then(buffer => commons.try(() => JSON.parse(buffer.toString()), {}))

var bufferToBuffer = (request, response, f) => commons.readStreamToBuffer(request).then(f).then(output => writeResponse(output, response))

var objectToBuffer = (request, response, f) => fetchPayloadObject(request).then(f).then(output => writeResponse(output, response))

var streamToBuffer = (request, response, f) => Promise.resolve(f(request)).then(output => writeResponse(output, response))

var emptyToBuffer = (request, response, f) => Promise.resolve(f()).then(output => writeResponse(output, response))

var emptyToStream = (request, response, f) => f(response)

var bufferToStream = (request, response, f) => commons.readStreamToBuffer(request).then(buffer => f(buffer, response))

var objectToStream = (request, response, f) => fetchPayloadObject(request).then(buffer => f(buffer, response))

var defaulth = (request, response, f) => f(request, response)

function ContextFactory(request, response) {
  var responseTypeSetter = processor => new ResponseTypeSetter(processor)
  this.default = () => responseTypeSetter(defaulth)
  this.bufferToBuffer = () => responseTypeSetter(bufferToBuffer)
  this.objectToBuffer = () => responseTypeSetter(objectToBuffer)
  this.streamToBuffer = () => responseTypeSetter(streamToBuffer)
  this.emptyToBuffer = () => responseTypeSetter(emptyToBuffer)
  this.emptyToStream = () => responseTypeSetter(emptyToStream)
  this.bufferToStream = () => responseTypeSetter(bufferToStream)
  this.objectToStream = () => responseTypeSetter(objectToStream)
}

module.exports = ContextFactory
