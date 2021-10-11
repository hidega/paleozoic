var stream = require('stream')
var commonsCore = require('@permian/commons-core') 
var lang = commonsCore.lang

var ERROR = 'error'
var DATA = 'data'
var END = 'end'
var CLOSE = 'close'

var parseParams = params => {
  params.flush ??= (t, cb) => cb()
  params.onError ??= console.error
  lang.isntFunction(params.transform) && lang.throwError('transform() must be a function')
  lang.isntFunction(params.flush) && lang.throwError('flush() must be a function or omitted')
  lang.isntFunction(params.onError) && lang.throwError('onError() must be a function or omitted')
}

var createTransformStream = params => {
  parseParams(params)
  var result = new stream.Transform({
    objectMode: true,
    transform: function (chunk, encoding, callback) {
      params.transform(chunk, this, callback)
    },
    flush: function (callback) {
      params.flush(this, callback)
    }
  })
  result.on(ERROR, params.onError)
  return result
}

var readStreamToBuffer = (rstream, bufferSize, cb) => {
  var callback = (err, data) => {
    cb(err, data)
    callback = () => { }
  }
  bufferSize || (bufferSize = 1000000)
  var data = Buffer.from([])
  var len = 0
  rstream.on(ERROR, e => callback(1))
  rstream.on(DATA, d => {
    len += d.length
    if (len < bufferSize) {
      data = Buffer.concat([data, Buffer.from(d)])
    } else {
      rstream.destroy(1)
      callback(2)
    }
  })
  rstream.on(END, () => callback(false, data))
}

module.exports = {
  events: Object.freeze({
    DATA,
    END,
    ERROR,
    CLOSE
  }),
  bufferToStream: buf => stream.Readable.from(buf),
  createTransformStream,
  readStreamToBuffer: lang.promisifyIfNoCallback2(readStreamToBuffer)
}
