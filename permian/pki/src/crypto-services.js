var crypto = require('crypto')
var DefaultProfile = require('./default')
var commons = require('./commons')

function CryptoServices(p) {
  p = Object.assign({
    profile: 'default'
  }, p)

  var Mixin = p.profile.toLowerCase() === 'default' ? DefaultProfile : commons.throwError('Unsupported profile')

  var { symmetric, generateKeyPair } = new Mixin(p)

  this.generateKeyPair = generateKeyPair

  this.testPassword = pwd => symmetric.pwdMatcher.test(pwd.toString())

  this.hashPassword = (pwd, salt) => this.hashSync(Buffer.concat([salt || symmetric.pwdSalt, Buffer.from(pwd)]))

  this.checkPasswordHash = (pwdHash, candidatePwd) => pwdHash.equals(this.hashPassword(candidatePwd))

  this.encodeSync = buffer => {
    var cipher = crypto.createCipheriv(symmetric.encoding, symmetric.secretKey, symmetric.iv)
    return Buffer.concat([cipher.update(buffer), cipher.final()])
  }

  this.decodeSync = buffer => {
    var decipher = crypto.createDecipheriv(symmetric.encoding, symmetric.secretKey, symmetric.iv)
    return Buffer.concat([decipher.update(buffer), decipher.final()])
  }

  this.hashSync = data => {
    var hmac = crypto.createHmac(symmetric.hashAlgoritm, symmetric.secretKey)
    hmac.update(data)
    return hmac.digest()
  }

  this.hashStream = (stream, raw, callback) => callback('Not implemented')

  this.encodeStream = (instream, outstream) => {
    throw new Error('Not implemented')
  }

  this.decodeStream = (instream, outstream) => {
    throw new Error('Not implemented')
  }
}

var passphraseChars = Buffer.from('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$__', 'utf-8')

CryptoServices.generatePassphrase = len => {
  var passphrase = Buffer.alloc(len)
  passphrase.forEach((b, i) => passphrase[i] = passphraseChars[parseInt(Math.random() * passphraseChars.length)])
  return passphrase
}

CryptoServices.prependSalt = (data, saltLen) => Buffer.concat([CryptoServices.generatePassphrase(saltLen), Buffer.from(data)])

module.exports = Object.freeze(CryptoServices)
