'use strict'

var commons = require('./commons')

function JsonWriter(stream, opts) {
  var stack = []
  var prev = false
  var started = false

  var write = data => stream.write(data)

  var toSztring = str => !str ? null : str.replace(/\"/g, `\"`)

  var withinArray = () => stack[stack.length - 1] === ']'

  var writeWithPrev = str => {
    var comma = prev ? ',' : ''
    prev = true
    return write(`${comma}${str}`)
  }

  this.startObject = key => {
    var result
    if (started) {
      result = write(`${prev ? ',' : ''}` + (withinArray() ? '{' : `"${toSztring(key)}":{`))
    } else {
      started = true
      result = write('{')
    }
    prev = false
    stack.push('}')
    return result
  }

  this.closeObject = () => {
    stack[stack.length - 1] !== '}' && commons.throwError('Cannot close object', 3097)
    var result = write('}')
    prev = true
    stack.pop()
    return result
  }

  this.startArray = key => {
    var result
    if (started) {
      result = write(`${prev ? ',' : ''}` + (withinArray() ? '[' : `"${toSztring(key)}":[`))
    } else {
      started = true
      result = write('[')
    }
    prev = false
    stack.push(']')
    return result
  }

  this.closeArray = () => {
    stack[stack.length - 1] !== ']' && commons.throwError('Cannot close array', 2834)
    var result = write(']')
    prev = true
    stack.pop()
    return result
  }

  this.flushObject = (key, obj) => writeWithPrev(withinArray() ? JSON.stringify(key) : `"${toSztring(key)}":${JSON.stringify(obj)}`)

  this.writeNumber = (key, val) => writeWithPrev(withinArray() ? Number(key).toString() : `"${toSztring(key)}":${Number(val).toString()}`)

  this.writeBoolean = (key, val) => writeWithPrev(withinArray() ? !!key : `"${toSztring(key)}":${!!val}`)

  this.writeString = (key, val) => writeWithPrev(withinArray() ? `"${toSztring(key)}"` : `"${toSztring(key)}":"${toSztring(val)}"`)

  this.appendString = (key, val) => commons.throwError('not implemented', 1201)

  this.writeNull = key => writeWithPrev(withinArray() ? 'null' : `"${toSztring(key.toString())}":null`)

  this.close = () => stack.reverse().forEach(write)
}

module.exports = JsonWriter

