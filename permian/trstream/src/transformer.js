var stream = require('stream')

function Transformer(tr, handlers, cfg) {
  cfg || (cfg = {})
  handlers || (handlers = {})

  var nop = callback => callback() 

  stream.Transform.call(this, {
    highWaterMark: cfg.highWaterMark || 16384,
    flush: handlers.flush || nop,
    construct: handlers.construct || nop,
    destroy: handlers.destroy || ((err, callback) => callback()),
    final: handlers.final || nop,
    transform: (buf, enc, callback) => tr(Buffer.isBuffer(buf) ? buf : Buffer.from(buf.toString()), callback, this)
  })

  handlers.close && this.on('close', handlers.close)

  handlers.error && this.on('error', handlers.error) 
}

Transformer.createInstance = (tr, handlers, cfg) => Object.freeze(new Transformer(tr, handlers, cfg))

module.exports = Transformer
