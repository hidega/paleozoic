'use strict'

const path = require('path') 
const commons = require('@permian/commons')
const CmdAdapter = require('../src/cmd/adapter')

const builder = {
  build: () => {
    const dataDir = path.resolve('/opt/data/mariadb')
    const prgDir = path.resolve('/opt/prg/mariadb')
    const cfg = {
      host: '127.0.0.1',
      port: '3306',
      dataDir,
      prgDir,
      configFilePath: path.resolve(prgDir, 'etc', 'mariadb.cnf'),
      appBinDir: path.resolve(prgDir, 'bin'),
      pidFilePath: path.resolve(dataDir, 'server.pid'),
      uid: Number(commons.platform.getUid(CmdAdapter.Constants.MYSQL)), 
      gid: Number(commons.platform.getGid(CmdAdapter.Constants.MYSQL)),
      defaultHostname: CmdAdapter.Constants.LOCALHOST, // egyelore NE legyen mas!
      superuserName: CmdAdapter.Constants.ROOT, // NE legyen mas!
      superuserPwd: 'rootpwd', 
      mysqlUserName: CmdAdapter.Constants.MYSQL, // NE legyen mas!
      mysqlUserPwd: 'mysqlpwd', 
      ssl: {
        acceptUnauthorized: true,
        serverCaFile: path.resolve(prgDir, 'cert', 'ca-cert.pem'),
        serverCertFile: path.resolve(prgDir, 'cert', 'server-cert.pem'),
        serverKeyFile: path.resolve(prgDir, 'cert', 'server-key.pem')
      },
      log: {
        rotateOnHealthcheck: true,
        dir: dataDir,
        logBinExpireLogsDays: 2,
        errorLogfile: path.resolve(dataDir, 'mariadb_error.log'),
        logErrorVerbosity: 3,
        logBin: 'log_bin',
        generalLogFile: path.resolve(dataDir, 'mariadb_general.log'),
        logOutput: 1
      }
    }
    return cfg
  }
}

module.exports = builder
