'use strict'

require('./extras')

const MyModule = require('./my-module')
const FooModule = require('./foo/foo-module')
const WazzModule = require('./foo/wazz-module')

const myModule = new MyModule()
const fooModule = new FooModule()
const wazzModule = new WazzModule()

myModule.sayHello()
fooModule.sayHello()
wazzModule.wazz()

module.exports = {
  a: {
    b1: false,
    b2: 'Str',
    b3: 123,
    b4: [1, 2],
    b5: null,
    b6: undefined
  },
  Ctr: function(arg1, arg2) {
    console.log(arg1 + arg2)
    this.p1 = 1
    this.p2 = 'z'
    this.pr = []
    this.p4 = {}
    this.m1 = (j, k) => {}
  },
  x: {
    y1: {
      z1: function(param) {
        console.log(param)
      },
      z2: function(param1, param2) {},
      z3: (u, v) => console.log(u, v)
    },
    y2: (param1, param2) => {}
  }
}
