'use strict'

// run  from this directory

var commons = require('..')
var assert = require('assert')
var fs = require('fs')
var stream = require('stream')
var path = require('path')
var _ = require('lodash')

var assertEquals = (a, b) => assert(commons.lang.isEqual(a, b))

assert(commons.files.pathFromArray(['a', 'b', 'c']) === path.sep + 'a' + path.sep + 'b' + path.sep + 'c')

assert(!!commons.files.systemTmpDir)
{
  var str = 'Abdefghi01234567'
  var istream = stream.Readable.from(str)
  commons.stream.readStreamToBuffer(istream, 10000, (err, buffer) => {
    assert(!err)
    assert.equal(str, buffer.toString())
  })
}

{
  var str = 'Abdefghi01234567'
  var istream = stream.Readable.from(str)
  commons.stream.readStreamToBuffer(istream, 10, (err, buffer) => {
    assert(err)
  })
}

{
  var strx = 'Abdefghi01234567'
  var istream = stream.Readable.from(strx)
  commons.stream.readStreamToBuffer(istream, 100)
    .then(buf => assert.equal(strx, buf.toString()))
    .catch(assert.fail)
}

{
  var input = 'abcdefghijkLmnopqRstuvwxyz123 [] () : "'
  var done = false
  var transformStream = commons.stream.createTransformStream({
    transform: (chunk, transform, callback) => {
      transform.push(chunk.toString().toUpperCase())
      callback(19)
    },
    onError: e => {
      assert(e === 19)
      done = true
    }
  })
  var istream = stream.Readable.from(input)
  transformStream.on('close', () => assert(done === true))
  istream.pipe(transformStream)
}

{
  var input = 'abcdefghijkLmnopqRstuvwxyz123 [] () : "'
  var flushed = false
  var transformStream = commons.stream.createTransformStream({
    transform: (chunk, transform, callback) => {
      transform.push(chunk.toString().toUpperCase())
      callback()
    },
    flush: (transform, callback) => {
      flushed = true
      callback()
    }
  })
  var checkStream = commons.stream.createTransformStream({
    transform: (chunk, transform, callback) => {
      assert(input.toUpperCase() === chunk.toString())
      transform.push('Stream done\n')
      callback()
    },
    flush: (transform, callback) => {
      assert(flushed === true)
      callback()
    }
  })
  var istream = stream.Readable.from(input)
  istream.pipe(transformStream).pipe(checkStream).pipe(process.stdout, { end: false })
}

setTimeout(() => {
  var buffer = Buffer.from(fs.readFileSync('./testdata_128k.txt'))
  assert(buffer.equals(commons.compress.gunzip(commons.compress.gzip(buffer))))
  commons.compress.gzipPromise(buffer)
    .then(d => commons.compress.gunzipPromise(d))
    .then(b => assert(b.equals(buffer)))
    .then(() => console.log('\n--------------\nTests are OK'))
}, 1000)

