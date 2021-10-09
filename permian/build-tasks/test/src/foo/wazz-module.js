'use strict'

const bar = require('./bar')
const _ = require('lodash')

function WazzModule() {
  this.wazz = () => console.log('Wazz!')

  this.bar = bar
  let abc = true
  const text = 'TEXT'

  var t = _.isString(8)

  if (abc) {
    const foo = {}
    foo.param1 = 1

    foo.param2 = 2
    this.foo = foo
  }
}

module.exports = WazzModule
