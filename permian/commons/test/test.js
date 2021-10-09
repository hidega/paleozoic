'use strict'

// run  from this directory

var commons = require('..')
var assert = require('assert')
var fs = require('fs')
var stream = require('stream')
var path = require('path')
var _ = require('lodash')

var assertEquals = (a, b) => assert(commons.lang.isEqual(a, b))

assert(commons.lang.isNil(commons.lang.undef))

{
  assert.equal(2, commons.lang.functionify(n => n + 1)(1))
  assert.equal(1, commons.lang.functionify(1)())
}

{
  var subject = {
    x: 2,
    a: 1,
    b: 3,
    f: () => subject.x,
    g: () => { }
  }

  subject.x = 5

  var target = {}

  commons.lang.wireFunctions(subject, target)
  assert(!target.a)
  assert(!target.b)
  assert(_.isFunction(target.g))
  assert(5 === target.f())
}

assert(!commons.string.isNonemptyStr())
assert(!commons.string.isNonemptyStr(1))
assert(!commons.string.isNonemptyStr(''))
assert(!commons.string.isNonemptyStr({}))
assert(!commons.string.isNonemptyStr(true))
assert(!commons.string.isNonemptyStr(() => 1))
assert(!commons.string.isNonemptyStr(null))
assert(!commons.string.isNonemptyStr(undefined))
assert(!commons.string.isNonemptyStr([]))
assert(commons.string.isNonemptyStr(' '))
assert(commons.string.isNonemptyStr('a'))
assert(commons.string.isNonemptyStr('ab'))

assert(commons.string.simpleHash('DFGHJKLKJHG88ppkk,,7898765fghjkjhg') === '224de47f07')

assert(commons.string.byteArrayToString([]) === '')
assert(commons.string.byteArrayToString([65]) === 'A')
assert(commons.string.byteArrayToString([65, 66, 67]) === 'ABC')

assert(commons.string.reverse('') === '')
assert(commons.string.reverse('a') === 'a')
assert(commons.string.reverse('ab') === 'ba')
assert(commons.string.reverse('abc') === 'cba')
assert(commons.string.reverse('abcd') === 'dcba')

{
  var ba1 = commons.string.stringToByteArray('')
  assert(Array.isArray(ba1) && ba1.length === 0)

  var ba2 = commons.string.stringToByteArray('A')
  assert(Array.isArray(ba2) && ba2.length === 1 && ba2[0] === 65)

  var ba3 = commons.string.stringToByteArray('ABC')
  assert(Array.isArray(ba3) && ba3.length === 3 && ba3[0] === 65 && ba3[1] === 66 && ba3[2] === 67)
}

assert(commons.files.pathFromArray(['a', 'b', 'c']) === path.sep + 'a' + path.sep + 'b' + path.sep + 'c')

assert(commons.date.millisecondsNow() > 1478791000244)

assert(commons.date.isDate(new Date()))

assert(commons.date.isDate(new Date(1231324564)))

assert(commons.date.isDate(new Date('fghjkjhg6787')))

assert(commons.date.isValidDate(new Date()))

assert(commons.date.isValidDate(new Date(1231324564)))

assert(!commons.date.isValidDate(new Date('fghjkjhg6787')))

assert(commons.bitwise.highestBitOfNat(255) === 7)

assert(commons.bitwise.highestBitOfNat(0) === -1)

assert(commons.bitwise.highestBitOfNat(1) === 0)

assert(commons.bitwise.shiftLeft(2, 2) === 8)

assert(commons.bitwise.shiftLeft(2) === 4)

assert(_.isEqual(commons.bitwise.bufferToSimpleArray(Buffer.from([])), []))

assert(_.isEqual(commons.bitwise.bufferToSimpleArray(Buffer.from([1, 2])), [1, 2]))

assert(commons.math.betweenInclusive(1, -9.01, 10))

assert(commons.math.betweenExclusive(1, -9.01, 10))

assert(!commons.math.betweenInclusive(null, 10, 1))

assert(!commons.math.betweenInclusive(5, 10, null))

assert(!commons.math.betweenInclusive(-9.01, false, 1))

assert(!commons.math.betweenExclusive(1, 1, 1))

assert(!commons.math.betweenExclusive(1, 1, 2))

assert(commons.math.betweenExclusive(5, 1, 10.51))

assert(commons.math.betweenInclusive(1, 1, 1))

assert(commons.math.betweenInclusive(1, 1, 2))

assert(commons.math.betweenInclusive(1, -10, 1.51))

assert(commons.math.power(-9, 0) === 1)

assert(commons.math.power(0, 0) === 0)

assert(commons.math.power(0, 2) === 0)

assert(commons.math.power(-9, 5) === 1)

assert(commons.math.power(9, 1) === 9)

assert(commons.math.power(9, 5) === 59049)

assert(commons.math.intDiv(0, 8) === 0)

assert(commons.math.intDiv(5, 8) === 0)

assert(commons.math.intDiv(8, 8) === 1)

assert(commons.math.intDiv(19, 8) === 2)

assert(commons.math.halfFloor(9) === 4)

assert(commons.math.halfFloor(8) === 4)

assert(commons.math.isEven(8))

assert(commons.math.isEven(0))

assert(commons.math.divides(5, 45))

assert(commons.math.isOdd(111))

{
  {
    let y = 0
    var f0 = callback => {
      y = 1
      callback(false, 1)
    }
    var g0 = commons.lang.promisifyIfNoCallback0(f0)
    g0((err, result) => {
      assert(!err && result === 1 && y === 1)
      y = 0
      g0().then(result => assert(result === 1 && y === 1)).catch(assert.fail)
    })
  }

  {
    var f0e = callback => callback(-1)
    var g0e = commons.lang.promisifyIfNoCallback0(f0e)
    g0e((err, r) => {
      assert(err)
      g0e().then(() => assert.fail()).catch(err => assert(err === -1))
    })
  }

  {
    let y = 0
    var f1 = (a, callback) => {
      y = a
      callback(false, a)
    }
    var g1 = commons.lang.promisifyIfNoCallback1(f1)
    g1(2, (err, result) => {
      assert(!err && result === 2 && y === 2)
      y = 0
      g1(2).then(result => assert(result === 2 && y === 2)).catch(assert.fail)
    })
  }

  {
    var f1e = (a, callback) => callback(-1)
    var g1e = commons.lang.promisifyIfNoCallback1(f1e)
    g1e(2, (err, r) => {
      assert(err)
      g1e(2).then(() => assert.fail()).catch(err => assert(err === -1))
    })
  }

  {
    let y = 0
    var f2 = (a, b, callback) => {
      y = a + b
      callback(false, a + b)
    }
    var g2 = commons.lang.promisifyIfNoCallback2(f2)
    g2(2, 3, (err, result) => {
      assert(!err && result === 5 && y === 5)
      y = 0
      g2(2, 3).then(result => assert(result === 5 && y === 5)).catch(assert.fail)
    })
  }

  {
    var f2e = (a, b, callback) => callback(-1)
    var g2e = commons.lang.promisifyIfNoCallback2(f2e)
    g2e(2, 3, (err, r) => {
      assert(err)
      g2e(2, 3).then(() => assert.fail()).catch(err => assert(err === -1))
    })
  }

  {
    let y = 0
    var f3 = (a, b, c, callback) => {
      y = a + b + c
      callback(false, a + b + c)
    }
    var g3 = commons.lang.promisifyIfNoCallback3(f3)
    g3(1, 2, 3, (err, result) => {
      assert(!err && result === 6 && y === 6)
      y = 0
      g3(1, 2, 3).then(result => assert(result === 6 && y === 6)).catch(assert.fail)
    })
  }

  {
    var f3e = (a, b, c, callback) => callback(-1)
    var g3e = commons.lang.promisifyIfNoCallback3(f3e)
    g3e(1, 2, 3, (err, r) => {
      assert(err)
      g3e(1, 2, 3).then(() => assert.fail()).catch(err => assert(err === -1))
    })
  }
}

assert(commons.lang.bufferize().equals(Buffer.from([])))

assert(commons.lang.bufferize([]).equals(Buffer.from([])))

assert(commons.lang.bufferize(Buffer.from([1, 2])).equals(Buffer.from([1, 2])))

assert(commons.lang.bufferize('AB').equals(Buffer.from([65, 66])))

assert(commons.lang.bufferize(true).equals(Buffer.from([1])))

assert(commons.lang.bufferize(false).equals(Buffer.from([0])))

assert(commons.lang.bufferize({ valueOf: () => [1] }).equals(Buffer.from([1])))

assert(!commons.lang.hasObjectOtherKeysThan({ a: 1, b: 2 }, ['a', 'b']))

assert(!commons.lang.hasObjectOtherKeysThan({ a: 1, b: 2 }, ['a', 'b', 'c']))

assert(commons.lang.hasObjectOtherKeysThan({ a: 1, b: 2 }, ['a']))

assert(commons.string.equalTrimmed('', ''))

assert(commons.string.equalTrimmed('  n ', 'n'))

assert(commons.string.equalTrimmed('n', 'n  '))

assert(commons.string.equalIgnoreCase('', ''))

assert(commons.string.equalIgnoreCase('n', 'N'))

assert(commons.string.equalIgnoreCase('NMAB ', 'nMAb '))

{
  /*const loggerA = new commons.proc.StdLogger()
  var loggerB = new commons.proc.StdLogger('owner')
  loggerA.info()
  loggerA.info('one')
  loggerA.info('two', 'three')
  loggerA.info(null)
  loggerA.info('two', null)
  loggerA.info(null, 'three')
  loggerA.info(null, null)
  loggerA.info({}, {})
  loggerA.info({a:1}, null)
  loggerA.info(null, {b:2})
  loggerA.info({a:1}, {b:1})  
  loggerA.info([2,3], {})
  loggerA.info([1], null)
  loggerA.info(null, [4,5])
  loggerA.info({a:1}, [])
  loggerB.info()
  loggerB.info('one')
  loggerB.info('two', 'three')
  console.log('logger output as expected')*/
}

assert(commons.lang.isFunction(() => { }))
assert(!commons.lang.isFunction(null))
assert(!commons.lang.isFunction(undefined))
assert(!commons.lang.isFunction([][0]))
assert(!commons.lang.isFunction(Number(8)))
assert(!commons.lang.isFunction({}))
assert(!commons.lang.isFunction(''))
assert(!commons.lang.isFunction(true))
assert(!commons.lang.isFunction([]))

{
  let result = commons.lang.extractParamsAndCallback1(null, null)
  assertEquals(result.parameters, {})
  assert(commons.lang.isFunction(result.callback))

  result = commons.lang.extractParamsAndCallback1(null, () => 11)
  assertEquals(result.parameters, {})
  assert(result.callback() === 11)

  result = commons.lang.extractParamsAndCallback1(5, () => 11)
  assertEquals(result.parameters, 5)
  assert(result.callback() === 11)

  result = commons.lang.extractParamsAndCallback1({ a: 1 }, () => 11)
  assertEquals(result.parameters, { a: 1 })
  assert(result.callback() === 11)

  result = commons.lang.extractParamsAndCallback1('', () => 11)
  assertEquals(result.parameters, '')
  assert(result.callback() === 11)

  result = commons.lang.extractParamsAndCallback1('w', () => 11)
  assertEquals(result.parameters, 'w')
  assert(result.callback() === 11)

  result = commons.lang.extractParamsAndCallback1('w', 'g')
  assertEquals(result.parameters, 'w')
  assert(commons.lang.isFunction(result.callback))

  result = commons.lang.extractParamsAndCallback1('w')
  assertEquals(result.parameters, 'w')
  assert(commons.lang.isFunction(result.callback))

  result = commons.lang.extractParamsAndCallback1()
  assertEquals(result.parameters, {})
  assert(commons.lang.isFunction(result.callback))

  result = commons.lang.extractParamsAndCallback1(() => 11)
  assertEquals(result.parameters, {})
  assert(result.callback() === 11)
}

assertEquals(commons.lang.createObject([['b', 2], ['a', 1]]), { a: 1, b: 2 })
assertEquals(commons.lang.createObject([]), {})

assertEquals(commons.lang.narrowObject({ a: 1, b: 2, c: 3 }, ['a', 'b']), { a: 1, b: 2 })
assertEquals(commons.lang.narrowObject({ a: 1, b: 2, c: 3 }, []), {})
assertEquals(commons.lang.narrowObject({}, ['a', 'b']), {})
assert(commons.lang.narrowObject({ f: a => a + 1 }, ['f']).f(2) === 3)

{
  var builder = new commons.lang.ObjectBuilder()
  builder.add('a', 1)
  builder.add('b', 2)
  assert(commons.lang.isEqual({ a: 1, b: 2 }, builder.build()))

  var obj = commons.lang.ObjectBuilder.newInstance()
    .add('a', 1)
    .add('b', 2)
    .add('c', 3)
    .unset('c')
    .build()
  assert(commons.lang.isEqual({ a: 1, b: 2 }, obj))
}

{
  var obj = {
    f: () => 1,
    g: a => a + 1
  }
  commons.lang.disableDeclaredFunctions(obj)
  assert(!obj.f() && !obj.g(8))
}

{
  assert(commons.bitwise.Base64w.encode('') === '')
  assert(commons.bitwise.Base64w.decode('').toString() === '')
  assert(commons.bitwise.Base64w.encode('dfskljbndasfR967824____q5kljh())("+!%') === 'ZGZza2xqYm5kYXNmUjk2NzgyNF9fX19xNWtsamgoKSkoIishJQ__')
  assert(commons.bitwise.Base64w.decode('ZGZza2xqYm5kYXNmUjk2NzgyNF9fX19xNWtsamgoKSkoIishJQ__').toString() === 'dfskljbndasfR967824____q5kljh())("+!%')
}

{
  assert(commons.bitwise.Base62.encode('').toString() === '')
  assert(commons.bitwise.Base62.decode('').toString() === '')
  assert(commons.bitwise.Base62.encode('dfskljbndas dfa  poi dsf poisdf   ü98253 lk fR967824____q5kljh())("+!%').toString() === 'ZGZza2xqYm5kYXMgZGZhICBwb2kgZHNmIHBvaXNkZiAgIMO8OTgyNTMgbGsgZlI5Njc4MjRfX19fcTVrbGpoKCkpKCIrISU03')
  assert(commons.bitwise.Base62.decode('ZGZza2xqYm5kYXMgZGZhICBwb2kgZHNmIHBvaXNkZiAgIMO8OTgyNTMgbGsgZlI5Njc4MjRfX19fcTVrbGpoKCkpKCIrISU03').toString() === 'dfskljbndas dfa  poi dsf poisdf   ü98253 lk fR967824____q5kljh())("+!%')
  var array = Buffer.from('AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==', 'base64')
  var encoded = 'AAECAwQFBgcICQoLDA04ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0402P04BBQkNERUZHSElKS04xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN04dXZ3eHl6e3x9fn02AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq02wsbKztLW2t7i5uru8vb601wMHCw8TFxsfIycrLzM3Oz9DR04tPU1dbX2Nna29zd3t01g4eLj5OXm502jp6uvs7e7v8PHy801T19vf402fr701P30201w0303'
  assert(commons.bitwise.Base62.encode(array).toString() === encoded)
  assert(commons.bitwise.Base62.decode(encoded).equals(Buffer.from(array)))
}

{
  var wrapped = commons.lang.wrap({ g: () => { }, f: (a, b, c) => a + b + c }, ['f'])
  assert(wrapped.f(1, 2, 3) === 6)
  assert(!wrapped.g)
}

{
  var wrapped = commons.lang.wrap({ g: () => { }, f: 'F' }, ['f'])
  assert(!wrapped.f)
  assert(!wrapped.g)
}

{
  let result = commons.lang.assignRecursive({}, null)
  assert(commons.lang.isEqual(result, {}))

  result = commons.lang.assignRecursive({}, {})
  assert(commons.lang.isEqual(result, {}))

  result = commons.lang.assignRecursive({ a: 1, b: {} }, { x: [1, 2, 3] })
  assert(commons.lang.isEqual(result, { a: 1, b: {}, x: [1, 2, 3] }))

  result = commons.lang.assignRecursive({ a: 1, b: { x: 1, y: 2, z: 3 } }, { a: 2, b: { x: 1, y: 0 } })
  assert(commons.lang.isEqual(result, { a: 2, b: { x: 1, y: 0, z: 3 } }))
}

{
  commons.lang.traverseObject(null, e => assert(e.obj === null && e.parent === null && e.key === null && e.depth === 0 && e.leaf))
  commons.lang.traverseObject(1, e => assert(e.obj === 1 && e.parent === null && e.key === null && e.depth === 0 && e.leaf))
  commons.lang.traverseObject([], e => assert(e.obj && e.parent === null && e.key === null && e.depth === 0 && e.leaf))
  commons.lang.traverseObject({}, e => assert(e.obj && e.parent === null && e.key === null && e.depth === 0 && e.leaf))

  let result = {
    nulls: 0,
    nodes: 0,
    leafs: 0,
    innerNodes: 0,
    parentless: 0,
    numbers: [],
    arrays: 0,
    objects: 0,
    strings: [],
    bools: []
  }

  commons.lang.traverseObject({
    x: [1, 2, {
      a: 'a'
    }
    ],
    y: {
      j: {
        a: true,
        b: false
      },
      k: {
        k1: [100, 200],
        k2: [],
        k3: 'k3',
        k4: { n: -1 }
      },
      l: 111
    },
    z: {
      z1: {
        z11: 11,
        z12: 12,
        z13: null
      },
      z2: {
        z21: 21,
        z22: 22
      }
    }
  }, e => {
    result.nodes++
    e.parent === null && result.parentless++
    e.leaf ? result.leafs++ : result.innerNodes++
    if (_.isString(e.obj)) {
      result.strings.push(e.obj)
    } else if (_.isNumber(e.obj)) {
      result.numbers.push(e.obj)
    } else if (_.isArray(e.obj)) {
      result.arrays++
    } else if (_.isObject(e.obj)) {
      result.objects++
    } else if (_.isBoolean(e.obj)) {
      result.bools.push(e.obj)
    } else if (e.obj === null) {
      result.nulls++
    }
  })

  assert(result.nulls === 1)
  assert(result.nodes === 27)
  assert(result.leafs === 16)
  assert(result.innerNodes === 11)
  assert(result.parentless === 1)
  assert(result.objects === 9)
  assert(result.arrays === 3)

  assert(_.isEmpty(_.difference([true, false], result.bools)))
  assert(_.isEmpty(_.difference(['k3', 'a'], result.strings)))
  assert(_.isEmpty(_.difference([11, 12, 21, 22, 1, 2, 111, 100, 200, -1], result.numbers)))
}

{
  var obj = commons.lang.deepFreeze({
    x: [1, 2, {
      a: 'a'
    }
    ],
    y: {
      j: {
        a: true,
        b: false
      },
      k: {
        k1: [100, 200],
        k2: [],
        k3: 'k3',
        k4: { n: -1 }
      },
      l: 111
    },
    z: {
      z1: {
        z11: 11,
        z12: 12,
        z13: null
      },
      z2: {
        z21: 21,
        z22: 22
      }
    }
  })

  var assertFails = f => {
    try {
      f()
      assert(false)
    } catch (e) { }
  }

  assertFails(() => obj.x[0] = 999)
  assertFails(() => obj.z.z.z11 = 999)
  assertFails(() => obj.y.k1[0] = 999)
  assertFails(() => obj.y.l = 999)
  assertFails(() => obj.y = 999)
}

{
  assert(!commons.lang.chainFunctions([]))
  var add1 = n => n + 1;
  var add2 = n => n + 2;
  var appendA = n => '' + n + 'A'
  assert(commons.lang.chainFunctions([add1, add2, appendA], 2) === '5A')
}

//commons.lang.sleep(1000, () => console.log(1))
//commons.lang.sleep(1000).then(() => console.log(2))

assert(!!commons.files.systemTmpDir)

assert(commons.random.rndBytes(8).length === 8)

assert(commons.proc.getSimpleUid() === '1')
assert(commons.proc.getSimpleUid() === '2')
assert(commons.proc.getSimpleUid() === '3')

{
  var r = commons.lang.try(() => 3, () => assert.fail(), r => { assert(r === 3); return 4 })
  assert(r === 4)
  r = commons.lang.try(() => 3, () => assert.fail())
  assert(r === 3)
  r = commons.lang.try(() => { throw (8) }, e => { assert(e === 8); return 3 }, r => { assert(r === 3); return 6 })
  assert(r === 6)
  r = commons.lang.try(() => { throw (8) }, e => { assert(e === 8); return 3 })
  assert(r === 3)
  r = commons.lang.try(() => { throw (8) })
  assert(!r)
  r = commons.lang.try(() => 7)
  assert(r === 7)
  r = commons.lang.try(() => { throw (8) }, 2)
  assert(r === 2)
}

{
  var a, b, c, d, e
  var obj = {
    f: () => a = null,
    g: x => b = x,
    h: (x, y, z) => {
      c = x
      d = y
      e = z
    }
  }
  commons.lang.fluentizeMethods(obj, ['f', 'g', 'h'])
  obj.f().g(1).h(2, 3, 4)
  assert(a === null)
  assert(b === 1)
  assert(c === 2)
  assert(d === 3)
  assert(e === 4)
}

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
  assert(commons.lang.isPromise(Promise.resolve()))
  assert(commons.lang.isPromise(new Promise((a, b) => { })))
  assert(commons.lang.isntPromise(3))
}

{
  var p = Promise.resolve(3)
  var fun = commons.lang.callbackify(p)
  fun((err, r) => {
    assert(!err)
    assert(r === 3)
  })
}

{
  var p = Promise.reject(2)
  var fun = commons.lang.callbackify(p)
  fun((err, r) => {
    assert(err === 2)
    assert(!r)
  })
}

{
  function Obj(a, b) {
    this.getA = () => a
    this.getB = () => b
  }
  var obj = commons.lang.newInstance(Obj, 1, 2)
  assert(obj.getA() === 1)
  assert(obj.getB() === 2)
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

{
  assert(commons.lang.isSymbol(Symbol('a')))
  assert(commons.lang.isntSymbol('abc'))
}

{
  var str1 = ''
  commons.string.iterateOver('12345', c => {
    var result = false
    if (c === '4') {
      result = true
    } else {
      str1 += c
    }
    return result
  }, true)
  assert(str1 === '123')

  str1 = ''
  commons.string.iterateOver('12345', c => str1 += c)
  assert(str1 === '12345')
}

{
  var otherState = {
    name: 'OTHER',
    delta: s => s === 8 ? Promise.resolve(otherState) : assert.fail()
  }
  var someState = {
    name: 'SOME',
    delta: s => {
      if(s === 5) {
        return new Promise((resolve, reject) => setImmediate(() => startState))
      } else if(s === 6) {
        return someState
      } else if(s === 7) {
        return otherState
      }
    }
  }
  var startState = false
  var startMatcher = commons.lang.matcher.MatcherBuilder()
      .on(s => s === 1 || s === 2, () => startState)
      .on(s => s === 4, someState)
      .build()
  startState = {
    name: 'START',
    delta: startMatcher
  }
  var fsa1 = commons.proc.Fsa.createInstance(startState)
  fsa1.delta(1)
    .catch(assert.fail)
    .then(() => fsa1.delta(2))
    .catch(assert.fail)
    .then(() => fsa1.delta(3))
    .then(assert.fail)
    .catch(() => { })
  var fsa2 = commons.proc.Fsa.createInstance(startState)
  fsa2.delta(1)
    .catch(assert.fail)
    .then(() => fsa2.delta(2))
    .catch(assert.fail)
    .then(() => fsa2.delta(4))
    .catch(assert.fail)
    .then(() => fsa2.delta(6))
    .catch(assert.fail)
    .then(() => fsa2.delta(5))
    .catch(assert.fail)
    .then(() => fsa2.delta(4))
    .catch(assert.fail)
    .then(() => fsa2.delta(7))
    .catch(assert.fail)
    .then(() => fsa2.delta(8))
    .catch(assert.fail)
    .then(() => fsa2.delta(8))
    .catch(assert.fail)
  var fsa3 = commons.proc.Fsa.createInstance(startState)
  fsa3.delta(1)
    .catch(assert.fail)
    .then(() => fsa3.delta(2))
    .catch(assert.fail)
    .then(() => fsa3.delta(4))
    .catch(assert.fail)
    .then(() => fsa3.delta(6))
    .catch(assert.fail)
    .then(() => fsa3.delta(5))
    .catch(assert.fail)
    .then(() => fsa3.delta(4))
    .catch(assert.fail)
    .then(() => fsa3.delta(3))
    .then(assert.fail)
    .catch(() => { })
    .then(() => fsa3.delta(7))
    .then(assert.fail)
    .catch(() => { })
    .then(() => fsa3.delta(8))
    .then(assert.fail)
    .catch(() => { })
}

{
  assert(commons.lang.isInteger(-1))
  assert(commons.lang.isInteger(0))
  assert(commons.lang.isInteger(1))
  assert(!commons.lang.isInteger("0"))
  assert(!commons.lang.isInteger("a"))
  assert(!commons.lang.isInteger())
  assert(!commons.lang.isInteger(2.33333))
  assert(commons.lang.isntInteger(2.33333))
  assert(commons.lang.isntInteger(null))
}

setTimeout(() => {
  var buffer = Buffer.from(fs.readFileSync('./testdata_128k.txt'))
  assert(buffer.equals(commons.compress.gunzip(commons.compress.gzip(buffer))))
  commons.compress.gzipPromise(buffer)
    .then(d => commons.compress.gunzipPromise(d))
    .then(b => assert(b.equals(buffer)))
    .then(() => console.log('\n--------------\nTests are OK'))
}, 1000)

