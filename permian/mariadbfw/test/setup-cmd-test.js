'use strict'

const assert = require('assert')
const cfgBuilder = require('./cfg-builder')
const createConfig = require('../src/cfg/creator')
const CmdAdapter = require('../src/cmd/adapter')
const commons = require('@permian/commons')

const fs = commons.files.fsExtra
const assertOk = r => console.log(r) || assert(r.code===0)
const cleanDataDir = commons.lang.promisifyIfNoCallback1(commons.files.deleteDirContents)
const cfg = cfgBuilder.build()
const configStr = createConfig(cfg)
const cmdAdapter = new CmdAdapter(cfg)

fs.outputFile(cfg.configFilePath, configStr)
.then(() => cleanDataDir(cfg.dataDir))
.then(() => fs.ensureDir(cfg.dataDir))
.then(() => cmdAdapter.initializeDatabase()) 
.then(assertOk)
.then(() => console.log('Database was initialized'))
.then(() => cmdAdapter.mariadbd([], {  
  spawnOpts: { detached: true }, 
  waitForExit: false
}))
.then(r => console.log('Database is started\n', r))
.then(() => commons.lang.sleep(5000))
.then(() => cmdAdapter.pingServer())
.then(assertOk) 
.then(() => console.log('Tests are OK :)'))
.catch(err => {
  console.log('ERROR: \n', err)
  process.exit(1)
})
