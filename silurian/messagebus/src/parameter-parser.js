var { lang } = require('@permian/commons')

var mqCollectionNameMatcher = /^[A-Za-z][A-Za-z_0-9]{5,255}$/

var topicNameMatcher = /^[A-Za-z][A-Za-z_0-9]{5,4095}$/

var parseParameters = (subs, cfg) => {
  var subscriptions = Object.assign({}, subs)
  var configuration = Object.assign({
    onError: (() => {}),
    mqCollection: 'messageQueue',
    messageQueueMaxSize: 100 * 1000 * 1000
  }, cfg)
  mqCollectionNameMatcher.test(configuration.mqCollection) || lang.throwError(`Bad MQ collection name: ${configuration.mqCollection}`)
  Object.keys(subscriptions).find(key => !topicNameMatcher.test(key)) && lang.throwError('Invalid subscription topic name')
  return { subscriptions, configuration }
}

module.exports = {
  mqCollectionNameMatcher,
  topicNameMatcher,
  parseParameters
}
