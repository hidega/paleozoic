var commons = require('./commons')

var checkDesktopChrome = window => true

var checkDesktopMozilla = window => true

var clientOk = window => Promise.resolve(window)

var checkCompatibility = commons.MatcherBuilder()
  .on(checkDesktopChrome, clientOk)
  .on(checkDesktopMozilla, clientOk)
  .otherwise(window => Promise.reject('Unsupported user agent: ' + window.navigator.userAgent))
  .build()

module.exports = window => checkCompatibility(window) 
