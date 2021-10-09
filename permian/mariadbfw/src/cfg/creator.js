'use strict'

var commons = require('../commons')
var ConfigBuilder = require('./builder')
var processMiscCfg = require('./misc')
var processInmemoryCfg = require('./inmemory')
var processOqgraphCfg = require('./oqgraph')
var processNetCfg = require('./net')
var processLogCfg = require('./log')
var processBasicsCfg = require('./basics')
var processInnodb = require('./innodb')
var processSslCfg = require('./ssl')
var processReplicationCfg = require('./replication')

module.exports = config => {
  var cfg = commons.cloneDeep(config)
  var cfgBuilder = new ConfigBuilder()
  commons.chainFunctions([
    processBasicsCfg,
    processMiscCfg,
    processInmemoryCfg,
    processReplicationCfg,
    processOqgraphCfg,
    processInnodb,
    processSslCfg,
    processNetCfg,
    processLogCfg
  ], { cfg, cfgBuilder })
  return cfgBuilder.build()
}
