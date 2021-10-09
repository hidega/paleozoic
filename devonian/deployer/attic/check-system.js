'use strict'

var commons = require('./commons')

var findCommand = command => commons.spawnProcess('whereis', [command]).then(result => {
  var locations = ['/bin', '/sbin', '/usr/bin', '/usr/sbin', '/etc', 'usr/local/bin', 'usr/local/sbin']
  var txt = result.output.error + result.output.info
  var location = locations.find(l => txt.includes(l + '/' + command))
  return commons.when(location)
    .then(() => Promise.resolve([command, location + '/' + command]))
    .otherwise(() => Promise.reject('Unsupported platform'))
})

module.exports = deploymentPlan => {
  commons.linuxOrThrow()
  var f = (commands, r) => commons.when(commands.length > 0)
    .then(() => findCommand(commands.pop()).then(cmd => f(commands, (r[cmd[0]] = cmd[1]) && r)))
    .otherwise(() => Promise.resolve(r))
  return f(['podman', 'bash', 'logger', 'cat', 'chmod', 'touch', 'mkdir', 'crontab'], {})
    .then(commands => ({
      deploymentPlan: commons.assignRecursive(deploymentPlan, { commands }),
      revert: e => commons.terminateProcess('error: ' + e, 1)
    }))
}
