var execCmd = require('./exec-cmd')

var quoteCmd = cmd => cmd.startsWith('"') ? cmd : `"${cmd.replace(/"/g, '\\"')}"`

var parseOptions = o => {
  var options = {}
  options.env || (options.env = {})
  options.shell || (options.shell = '/bin/bash')
  return options 
}

module.exports = (cmd, o, options = parseOptions(o)) => execCmd(options.shell, ['-c', quoteCmd(cmd)], options.env)

