'use strict'

const assert = require('assert')
const CmdAdapter = require('../src/cmd/adapter')
const Tools = require('../src/tools')
const cfgBuilder = require('./cfg-builder')

const cfg = cfgBuilder.build()
const cmdAdapter = new CmdAdapter(cfg)

cmdAdapter.pingServer()
.then(r => console.log(r))
.catch(err => {
  console.log('ERROR: \n', err)
  process.exit(1)
})
