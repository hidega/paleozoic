'use strict'

const _ = require('lodash')

let a = 1

function MyModule(arg1) {
  let internalVariable = 1
  internalVariable++
  this.sayHello = () => console.log('Hello world ' + internalVariable)
  const bigint = BigInt(121212)
  console.log(bigint, BigInt(6))
}

MyModule.FOO = 'foo'

MyModule.lodash = _

//

module.exports = MyModule
