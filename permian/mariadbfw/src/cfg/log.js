'use strict'

var commons = require('../commons')

var validate = cfg => {
  commons.assert(cfg.logBinExpireLogsDays, 1250)
}

var validateOnlyReplication = cfg => {
  commons.assert(cfg.logBin, 1201)
  commons.assert(cfg.logBinIndex, 1202)
}

module.exports = p => {
  if (!p.cfg.log && p.cfg.replication) {
    validateOnlyReplication(p.cfg)
    p.cfgBuilder.addMariadbOpt('log_bin', p.cfg.log.logBin)
    p.cfgBuilder.addMariadbOpt('log_bin_index', p.cfg.log.logBinIndex)
  } else if (p.cfg.log) {
    validate(p.cfg.log)
    p.cfgBuilder.addMariadbOpt('log_output', p.cfg.log.logOutput)
    p.cfgBuilder.addMariadbOpt('log_bin', p.cfg.log.logBin)

    if (p.cfg.log.generalLogFile) {
      commons.assert(p.cfg.log.generalLogFile, 1230)
      p.cfgBuilder.addMariadbOpt('general_log', 1)
      p.cfgBuilder.addMariadbOpt('general_log_file', p.cfg.log.generalLogFile)
    } else {
      p.cfgBuilder.addMariadbOpt('general_log', 0)
    }

    if (p.cfg.log.errorLogfile) {
      p.cfgBuilder.addMariadbOpt('log_error', p.cfg.log.errorLogfile)
    }

    p.cfgBuilder.addMariadbOpt('expire_logs_days', p.cfg.log.logBinExpireLogsDays)
    p.cfgBuilder.addMariadbOpt('slow_query_log', 'OFF')

    p.cfg.log.logBinIndex && p.cfgBuilder.addMariadbOpt('log_bin_index', p.cfg.log.logBinIndex)
  } else {
    p.cfgBuilder.addMariadbOpt('general_log', 0)
  }

  p.cfg.log.logBinFileMaxSizeMB && p.cfgBuilder.addMariadbOpt('max_binlog_size', p.cfg.log.logBinFileMaxSizeMB)

  return p
}
