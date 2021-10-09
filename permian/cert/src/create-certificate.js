var forge = require('node-forge')
var { pki } = forge

var createExtensions = params => {
  var exts = [{
    name: 'basicConstraints',
    cA: true
  }, {
    name: 'keyUsage',
    keyCertSign: true,
    digitalSignature: true,
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true
  }, {
    name: 'extKeyUsage',
    serverAuth: true,
    clientAuth: true,
    codeSigning: true,
    emailProtection: true,
    timeStamping: true
  }, {
    name: 'nsCertType',
    client: true,
    server: true,
    email: true,
    objsign: true,
    sslCA: true,
    emailCA: true,
    objCA: true
  }]

  var subjectAltName = {
    name: 'subjectAltName',
    altNames: []
  }

  params.altNameIp && subjectAltName.altNames.push({
    type: 7,
    ip: params.altNameIp
  })

  params.altNameUri && subjectAltName.altNames.push({
    type: 6,
    ip: params.altNameUri
  })

  subjectAltName.altNames.length && exts.push(subjectAltName)

  exts.push({ name: 'subjectKeyIdentifier' })
  return exts
}

module.exports = params => {
  var publicKey = pki.publicKeyFromPem(params.publicKey)
  var privateKey = pki.decryptRsaPrivateKey(params.privateKey, params.privateKeyPwd)

  var cert = pki.createCertificate();
  cert.publicKey = publicKey;
  cert.serialNumber = params.serialNumber;
  cert.validity.notBefore = params.validNotBefore
  cert.validity.notAfter = params.validNotAfter
  cert.setSubject(params.subject)
  cert.setIssuer(params.issuer)
  cert.setExtensions(createExtensions({
    altNameIp: params.altNameIp,
    altNameUri: params.altNameUri
  }))
  cert.sign(privateKey)
  return pki.certificateToPem(cert)
}
