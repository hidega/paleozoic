var crypto = require('crypto')
var commons = require('./commons')

function DefaultProfile(p) {
  this.params = Object.assign({
    keySize: 2048,
    iv: Buffer.alloc(16, 37),
    publicExponent: 0x10001,
    secretKey: Buffer.from('k?-fFGg=765hgdfgh8976/-fsdg.dgfKGH56')
  }, p)

  this.params.secretKey.length === 36 || commons.throwError('Bad secret key')

  this.symmetric = Object.freeze({
    pwdMatcher: /^[a-zA-Z0-9_]{8,16}$/,
    pwdSalt: Buffer.from('kjhH76g8'),
    encoding: 'aes-192-cbc',
    hashAlgoritm: 'sha256',
    secretKey: Buffer.from(this.params.secretKey.slice(0, 24)),
    iv: this.params.iv
  })

  this.asymmetric = Object.freeze({
    iv: this.params.iv,
    family: 'rsa',
    format: 'pem',
    keySize: this.params.keySize,
    type: 'pkcs1',
    encoding: 'aes-256-cbc',
    secretKey: Buffer.from(this.params.secretKey),
    publicExponent: this.params.publicExponent
  })

  this.generateKeyPair = callback => {
    var privateKeyEncoding = {
      type: this.asymmetric.type,
      format: this.asymmetric.format
    }
    privateKeyEncoding.cipher = this.asymmetric.encoding
    privateKeyEncoding.passphrase = this.asymmetric.secretKey
    var cfg = {
      modulusLength: this.asymmetric.keySize,
      publicExponent: this.asymmetric.publicExponent,
      publicKeyEncoding: {
        type: this.asymmetric.type,
        format: this.asymmetric.format
      },
      privateKeyEncoding
    }
    return callback ? crypto.generateKeyPair('rsa', cfg, callback) : crypto.generateKeyPairSync('rsa', cfg)
  }
}

module.exports = DefaultProfile
