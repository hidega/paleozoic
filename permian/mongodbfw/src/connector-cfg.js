module.exports = config => {
  var configuration = Object.assign({
    hosts: [{ host: 'localhost', port: 27017 }],
    username: 'mongodb',
    password: 'mongodb',
    authDbName: 'admin'
  }, config)
  configuration.connectOptions = Object.assign({ useUnifiedTopology: true }, config.connectOptions)
  configuration.connectOptions.useNewUrlParser = true
  return configuration
}
