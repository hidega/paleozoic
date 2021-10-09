var Transformer = require('./transformer')

module.exports = Object.freeze({
  createTransformer: Transformer.createInstance,
  Transformer
})
