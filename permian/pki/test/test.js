'use strict'

var assert = require('assert')
var pki = require('../src')

var checkError = err => err && (console.log(err) || assert(!err))

var caseGenerateKeys = () => {
  var cs = new pki.CryptoServices()  
  cs.generateKeyPair((err, publicKey, privateKey) => {
    checkError(err)
    console.log('keys:', publicKey.toString(), privateKey.toString(), '\n')
  })
}

var caseWarmup = () => {
  try {
    new pki.CryptoServices({ secretKey:'234567' })
    assert(false)    
  } catch(e) {}
}

var caseHash = () => {
  var cs = new pki.CryptoServices()
  console.log('hash:', cs.hashSync('furulya'), '\n')
}

var caseHashPwd = () => {
  var cs = new pki.CryptoServices()
  assert(!cs.testPassword('ll56Dkj_ llo'))
  assert(!cs.testPassword('lo'))
  assert(!cs.testPassword('l84848484j48jOOHOIOIH9999999999999999999999999999999o'))
  assert(cs.testPassword('l8484jhRjOO_o'))
  var bufA = cs.hashPassword('Furulya123_A')
  var bufB = cs.hashPassword('Furulya123_B')
  assert(cs.checkPasswordHash(bufA, 'Furulya123_A'))
  assert(!cs.checkPasswordHash(bufA, 'Furulya123_B'))
  assert(!cs.checkPasswordHash(bufB, 'Furulya123_A'))
  console.log('password A hash', bufA.toString('hex'))
  console.log('password B hash', bufB.toString('hex'))
}

var caseEndecode = () => {
  var cs = new pki.CryptoServices()
  assert(cs.decodeSync(cs.encodeSync('furulya')).toString()==='furulya')  
}

var caseSalt = () => {
  var cs = new pki.CryptoServices()
  var result = pki.CryptoServices.prependSalt('furulya', 4).toString()
  console.log('\nsalted: ', result, '\n')
  assert(result.length===11 && result.endsWith('furulya'))
}

caseGenerateKeys()
caseHash()
caseHashPwd()
caseWarmup()
caseEndecode()
caseSalt()

setTimeout(() => console.log('---------------', '\nTests are OK', '\n---------------'), 2000)
