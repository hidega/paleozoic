var path = require('path')

module.exports = {
  mode: 'development',
  output: {
    filename: 'test.js',
    path: path.resolve(__dirname)
  },
  entry: path.resolve(__dirname, 'index.js'),
  target: ['web', 'es4'],
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
}
