var commons = require('./commons')

/* global window */

var getWindow = commons.whenBuilder()
  .then((b, w) => Promise.resolve(w))
  .otherwise(() => Promise.reject('Could not detect window object.'))
  .build()

module.exports = () => getWindow(commons.isObject(window), window) 
