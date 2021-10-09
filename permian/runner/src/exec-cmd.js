var { exec } = require('child_process')

var execCmd = (path, args, env, callback) => exec([path].concat(args).join(' '), { env: Object.assign(process.env, env) }, callback)

module.exports = (path, args, o, options = o || {}) => new Promise((resolve, reject) => execCmd(path, args, options.env, (error, stdout, stderr) => {
  var ret = { stdout, stderr: error + ' | ' + stderr }
  error ? reject(ret) : resolve(ret)
}))

