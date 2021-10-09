'use strict'

const parseConfiguration = require('../src/configuration')

const caseDefault = () => {
  const cfg = {
    systemLog: {
      destination: 'file',
      path: '/var/log/mongodb/mongod.log',
      logAppend: true
    },
    storage: {
      journal: {
        enabled: true
      }
    },
    processManagement: {
      fork: true
    },
    net: {
      bindIp: '127.0.0.1',
      port: 27017
    },
    setParameter: {
      enableLocalhostAuthBypass: false
    }
  }

  console.log(parseConfiguration(cfg))
}

caseDefault()
