var commons = require('./commons')
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

var newInstance = () => {
  var responseTypeSetter = processor => ResponseTypeSetter.newInstance(processor)
  return {
    default: () => responseTypeSetter(defaulth),
    bufferToBuffer: () => responseTypeSetter(bufferToBuffer),
    objectToBuffer: () => responseTypeSetter(objectToBuffer),
    streamToBuffer: () => responseTypeSetter(streamToBuffer),
    emptyToBuffer: () => responseTypeSetter(emptyToBuffer),
    emptyToStream: () => responseTypeSetter(emptyToStream),
    bufferToStream: () => responseTypeSetter(bufferToStream),
    objectToStream: () => responseTypeSetter(objectToStream)
  }
}

module.exports = { newInstance }
