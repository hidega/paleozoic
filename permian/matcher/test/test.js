var assert = require('assert')
var matcher = require('..')

var caseMatcher = () => {
  var matcher_1a = matcher.MatcherBuilder()
    .on(3, 4)
    .on(12, 22)
    .on(1, 2)
    .on(1, 3)
    .build()

  assert.equal(matcher_1a(1), 2)
  assert.equal(matcher_1a(3), 4)
  assert.equal(matcher_1a(5), undefined)

  var matcher_1b = matcher.MatcherBuilder()
    .all()
    .on(1, 2)
    .on(1, 2)
    .on(3, 4)
    .otherwise(10)
    .build()

  assert.deepEqual(matcher_1b(1), [2, 2])
  assert.deepEqual(matcher_1b(3), [4])
  assert.deepEqual(matcher_1b(5), [10])

  var matcher_1c = matcher.MatcherBuilder()
    .all() 
    .otherwise(10)
    .build()

  assert.deepEqual(matcher_1c(5), [10])

  var matcher_2a = matcher.MatcherBuilder()
    .all()
    .on(1, () => 2)
    .on(5, arg => arg - 1)
    .on(3, () => 4)
    .otherwise(10)
    .build()

  assert.deepEqual(matcher_2a(1), [2])
  assert.deepEqual(matcher_2a(5), [4])
  assert.deepEqual(matcher_2a(2), [10])

  var matcher_2b = matcher.MatcherBuilder()
    .all()
    .on(5, arg => arg - 1)
    .on(1, () => 2)
    .on(6, assert.fail)
    .on(5, arg => arg - 2)
    .on(5, arg => arg - 3)
    .on(3, () => 4)
    .on(5, arg => arg - 4)
    .otherwise(10)
    .build()

  assert.deepEqual(matcher_2b(1), [2])
  assert.deepEqual(matcher_2b(5), [4, 3, 2, 1])
  assert.deepEqual(matcher_2b(2), [10])

  var matcher_3a = matcher.MatcherBuilder()
    .on(3, 4)
    .on(12, 22)
    .on(1, 2)
    .on(1, 3)
    .otherwise(arg => arg + 1)
    .build()

  assert.equal(matcher_3a(1), 2)
  assert.equal(matcher_3a(3), 4)
  assert.equal(matcher_3a(5), 6)

  var matcher_3b = matcher.MatcherBuilder()
    .on(3, 4)
    .on(12, 22)
    .on(1, 2)
    .on(1, 3)
    .otherwise(arg => undefined)
    .build()

  assert.equal(matcher_3b(1), 2)
  assert.equal(matcher_3b(3), 4)
  assert.equal(matcher_3b(5), undefined)

  var matcher_4 = matcher.MatcherBuilder()
    .on(3, arg => {
      assert(arg === 3)
      return 4
    })
    .on(12, assert.fail)
    .on(1, arg => {
      assert(arg === 1)
      return 2
    })
    .on(1, assert.fail)
    .otherwise(arg => arg + 1)
    .build()

  assert.equal(matcher_4(1), 2)
  assert.equal(matcher_4(3), 4)
  assert.equal(matcher_4(5), 6)

  var matcher_5a = matcher.MatcherBuilder()
    .all()
    .on(arg => arg === 3, 4)
    .on(arg => arg < 3, 2)
    .on(arg => arg < 3, 1)
    .otherwise(null)
    .build()

  assert.deepEqual(matcher_5a(1), [2, 1])
  assert.deepEqual(matcher_5a(2), [2, 1])
  assert.deepEqual(matcher_5a(3), [4])
  assert.deepEqual(matcher_5a(42), [null])

  var matcher_5b = matcher.MatcherBuilder()
    .on(arg => arg === 3, 4)
    .on(arg => arg < 3, 2)
    .on(arg => arg < 3, 1)
    .otherwise(5)
    .build()

  assert.equal(matcher_5b(1), 2)
  assert.equal(matcher_5b(3), 4)
  assert.equal(matcher_5b(42), 5)

  var matcher_6 = matcher.MatcherBuilder()
    .on(() => false, assert.fail)
    .on(arg => arg === 3, arg => {
      assert(arg === 3)
      return 4
    })
    .on(arg => arg < 3, () => 2)
    .on(arg => arg < 3, assert.fail)
    .otherwise('50')
    .build()

  assert.equal(matcher_6(1), 2)
  assert.equal(matcher_6(3), 4)
  assert.equal(matcher_6(42), '50')

  var matcher_7 = matcher.MatcherBuilder()
    .on(arg => arg === 3, 4)
    .on(() => false, 22)
    .on(arg => arg === 1, 2)
    .on(arg => arg === 1, 3)
    .otherwise(arg => arg + 1)
    .build()

  assert.equal(matcher_7(1), 2)
  assert.equal(matcher_7(3), 4)
  assert.equal(matcher_7(5), 6) 

  var matcher_8 = matcher.MatcherBuilder()
    .on(arg => arg === 3, () => 4)
    .on(() => false, assert.fail)
    .on(arg => arg === 1, arg => arg + 1)
    .on(arg => arg === 1, () => 3)
    .otherwise(arg => arg + 1)
    .build()

  assert.equal(matcher_8(1), 2)
  assert.equal(matcher_8(3), 4)
  assert.equal(matcher_8(5), 6)
}

var caseWhen = () => {
  var when_0a = matcher.WhenBuilder().build()
  assert.equal(when_0a({ a: 1 }), undefined)
  assert.equal(when_0a(null), undefined)

  var when_0b = matcher.WhenBuilder().otherwise(1).build()
  assert.equal(when_0b({ a: 1 }), 1)
  assert.equal(when_0b(null), 1)

  var when_1a = matcher.WhenBuilder()
    .isNil(2)
    .then(3)
    .otherwise(4)
    .build()
  assert.equal(when_1a(false), 4)
  assert.equal(when_1a(), 2)
  assert.equal(when_1a(10), 3)

  var when_1b = matcher.WhenBuilder()
    .isNil(2)
    .then(33)
    .build()
  assert.equal(when_1b(1), 33)
  assert.equal(when_1b(null), 2)
  assert.equal(when_1b(false), undefined)

  var when_1c = matcher.WhenBuilder()
    .isNil(2)
    .build()
  assert.equal(when_1c(1), undefined)
  assert.equal(when_1c(), 2)
  assert.equal(when_1c(10), undefined)

  var when_2 = matcher.WhenBuilder()
    .isNil(a => {
      assert(a === undefined)
      return 2
    })
    .then(3)
    .otherwise(4)
    .build()
  assert.equal(when_2('1'), 3)
  assert.equal(when_2(), 2)
  assert.equal(when_2(false), 4)

  var when_3 = matcher.WhenBuilder()
    .isNil(2)
    .then(3)
    .otherwise(a => {
      assert(a === false)
      return 4
    })
    .build()
  assert.equal(when_3('1'), 3)
  assert.equal(when_3(null), 2)
  assert.equal(when_3(false), 4)

  var when_4 = matcher.WhenBuilder()
    .isNil(a => {
      assert(a === undefined)
      return 2
    })
    .then(3)
    .otherwise(a => {
      assert(a === false)
      return 4
    })
    .build()
  assert.equal(when_4('1'), 3)
  assert.equal(when_4(undefined), 2)
  assert.equal(when_4(false), 4)

  var when_5 = matcher.WhenBuilder()
    .isNil(2)
    .then(a => {
      assert(a === '1')
      return 3
    })
    .otherwise(4)
    .build()
  assert.equal(when_5('1'), 3)
  assert.equal(when_5(), 2)
  assert.equal(when_5(false), 4)

  var when_5a = matcher.WhenBuilder()
    .isNil((a, k) => {
      assert(k === 10)
      return 2
    })
    .then((a, k) => {
      assert(k === 10)
      assert(a === '1')
      return 3
    })
    .otherwise((a, k) => {
      assert(k === 10)
      return 4 
    })
    .build()
  assert.equal(when_5a('1', 10), 3)
  assert.equal(when_5a(undefined, 10), 2)
  assert.equal(when_5a(false, 10), 4)

  var when_6 = matcher.WhenBuilder()
    .isNil((a, k) => {
      assert(a === null)
      return 2
    })
    .then((a, k) => {
      assert(a === '1')
      return 3
    })
    .otherwise(4)
    .build()
  assert.equal(when_6('1'), 3)
  assert.equal(when_6(null), 2)
  assert.equal(when_6(false), 4)

  var when_7 = matcher.WhenBuilder()
    .isNil(2)
    .then(a => {
      assert(a === '1')
      return 3
    })
    .otherwise(a => {
      assert(a === false)
      return 4
    })
    .build()
  assert.equal(when_7('1'), 3)
  assert.equal(when_7(null), 2)
  assert.equal(when_7(false), 4)

  var when_8 = matcher.WhenBuilder()
    .isNil(a => {
      assert(a === null)
      return 2
    })
    .then(a => {
      assert(a === '1')
      return 3
    })
    .otherwise(a => {
      assert(a === false)
      return 4
    })
    .build()
  assert.equal(when_8('1'), 3)
  assert.equal(when_8(null), 2)
  assert.equal(when_8(false), 4)
}

caseMatcher()
caseWhen()
console.log('Tests are OK')
