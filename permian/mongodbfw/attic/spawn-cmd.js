var commons = require('./commons')

module.exports = (cmdName, args, cfg, opts) => {
  args ??= args || []
  var options = Object.assign({ asRoot: false, omitDefaultsFile: false }, opts)
  options.asRoot && (args = [`--user=${cfg.mysqlUserName}`, `--password=${cfg.mysqlUserPwd}`].concat(args))
  options.uid = cfg.uid
  options.gid = cfg.gid
  var argumentz = (options.omitDefaultsFile ? [] : [`--defaults-file=${cfg.configFilePath}`]).concat(args)
  return commons.spawnProcess(commons.resolvePath(cfg.appBinDir, cmdName), argumentz, opts)
}
