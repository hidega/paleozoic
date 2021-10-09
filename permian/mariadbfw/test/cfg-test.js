'use strict'

const assert = require('assert')
const path = require('path')
const cfgBuilder = require('./cfg-builder')
const createConfig = require('../src/cfg/creator')
const mariadbfw = require('../src')

const caseSmoketest = () => {
  const cfg = cfgBuilder.build()
  const configStr = createConfig(cfg)
  console.log(mariadbfw)
  console.log(cfg, '\n-----------------------------\n')
  console.log(configStr)
}

caseSmoketest()
