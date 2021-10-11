var commons = require('./commons')

var checkDesktopChrome = window => true

var checkDesktopMozilla = window => true

var clientOk = w => w

var checkCompatibility = commons.matcherBuilder()
  .on(checkDesktopChrome, clientOk)
  .on(checkDesktopMozilla, clientOk)
  .otherwise(window => Promise.reject('Unsupported user agent: ' + window.navigator.userAgent))
  .build()

module.exports = window => checkCompatibility(window) 
