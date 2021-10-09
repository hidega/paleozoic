var commons = require('./commons')

var webpack

try {
  webpack = require('webpack')
} catch(e) { 
  console.log('Warning: Could not load webpack.  If webpack is intended to be used, then make sure that the  webpack  package is added as a dev or normal dependency in  package.json  of this project')
} 

var toError = (err, stats) => ({
  err,
  compileErrors: stats.toJson().errors
})

var callWebpack = (webpackConfig, callback) => webpack(webpackConfig, (err, stats) =>  (err || stats.hasErrors()) ? callback(toError(err, stats)) : callback())

var createWebpackConfig = params => ({
  mode: 'production',
  output: {
    filename: params.distFile,
    path: params.distDir
  },
  entry: params.entryFile,
  target: ['node', 'es4'],
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
})

var standardWebpack = (params, callback) => commons.rmDir(params.distDir)
  .then(() => commons.mkDir(params.distDir))
  .then(() => callWebpack(createWebpackConfig(params), callback))
  .catch(e => callback(e || -1))

module.exports = (params, callback) => params.webpackConfig ? callWebpack(webpackConfig, callback) : standardWebpack(params, callback)
