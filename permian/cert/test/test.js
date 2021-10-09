'use strict'

var assert = require('assert')
var pki = require('../src')

var checkError = err => err && (console.log(err) || assert(!err))

var caseCert = () => {
  var cs = new pki.CryptoServices({ secretKey: 'k?-XFGg=765hgdfgh8976/-fsdg.dgfKGH56' })
  var keypair = cs.generateKeyPair()

  var attrs = {
    serialNumber: '01',
    validNotBefore: new Date('2020-10-10'),
    validNotAfter: new Date('2021-10-10'),
    privateKeyPwd: Buffer.from('k?-XFGg=765hgdfgh8976/-fsdg.dgfKGH56'),
    publicKey: keypair.publicKey,
    privateKey: keypair.privateKey,
    subject: [{ 
      name: 'commonName',
      value: 'example.org'
    }, {
      name: 'countryName',
      value: 'US'
    }, {
      shortName: 'ST',
      value: 'Virginia'
    }, {
      name: 'localityName',
      value: 'Blacksburg'
    }, {
      name: 'organizationName',
      value: 'Test'
    }, {
      shortName: 'OU',
      value: 'Test'
    }]
  }
  attrs.issuer = attrs.subject

  var cert = cs.createCertificate(attrs)
  console.log('CERT:\n' + cert)  
}

caseCert()

