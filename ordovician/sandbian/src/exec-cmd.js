var { exec } = require('child_process')

var execCmd = (path, args, env, callback) => exec([path].concat(args).join(' '), { env: Object.assign(process.env, env) }, callback)

var errorObj = (error, stdout, stderr) => ({ msg: `${error || ''}\nstdout:\n${stdout}\nstderr:\n${stderr}` })

module.exports = (path, args, env) => new Promise((resolve, reject) => execCmd(path, args, env, (error, stdout, stderr) => {
  var ret = errorObj(error, stdout, stderr)
  error ? reject(ret.msg) : resolve(ret)
}))

