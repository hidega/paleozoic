'use strict'

const assert = require('assert')
const CmdAdapter = require('../src/cmd/adapter')

const cmdAdapter = new CmdAdapter(cfg)
cmdAdapter.shutdownServer()
.then(r => console.log(r) || assert(r.code===0))
.then(() => console.log('Tests are OK :)'))
.catch(err => {
  console.log('ERROR: \n', err)
  process.exit(3)
})
