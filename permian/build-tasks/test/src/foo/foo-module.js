'use strict'

function FooModule() {

  this.sayHello =

    () => console.log('Hello world by Foo!')

  this.property = 1

  this.method = (a, b, c) => {}
}

module.exports = FooModule
