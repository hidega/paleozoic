'use strict'

var { spawn } = require('child_process')
var os = require('os')
var path = require('path')
var fs = require('fs-extra')
var commons = require('@permian/commons')

function MongoDbTools(cfg) {
  var self = this
  
  self.isWindows = commons.platform.isWindows

  self.isLinux = commons.platform.isLinux

  self.cleanStr = obj => obj ? obj.toString().replace(/\\\\\\\\/g, '\\\\').replace(/\\\\\\/g, '\\\\') : ''

  self.error = err => console.error(`ERROR: ${self.cleanStr(err)}`)

  self.errorJson = err => console.error(`ERROR:\n${self.cleanStr(JSON.stringify(err, null, 2))}`)

  self.info = str => console.log(`INFO: ${self.cleanStr(str)}`)

  self.infoJson = str => console.log(`INFO:\n${self.cleanStr(JSON.stringify(str, null, 2))}`)

  self.exit = code => {
    console.log(code===0 ? '\nOK\n' : '\nFAILURE ' + code + '\n')
    process.exit(code)
  }
  
  self.startServer = (delay, setOutput) => new Promise((resolve, reject) => {
    delay || (delay = 5)
    setOutput || (setOutput = () => {})
    var output = { error: '', info: '' }
    var args = [`--config=${cfg.mongodb.configFilePath}`]
    var spawnOpts = commons.platform.isLinux() ? { uid: cfg.mongodb.uid, gid: cfg.mongodb.gid } : {} 
    spawnOpts.detached = true
    var proc = spawn(path.resolve(cfg.mongodb.appBinDir, 'mongod'), args, spawnOpts)
    var error = false
    proc.on('error', err => error = err )
    var onStdoutData = data => output.info += data
    proc.stdout.on('data', onStdoutData)
    var onStderrData = data => output.error += data
    proc.stderr.on('data', onStderrData)
    var interval = setInterval(() => {
      if(--delay===0) {
        clearInterval(interval)
        console.log()        
        output.failure = error
        if(output.failure) {
          reject(output) 
        } else {
          proc.stderr.removeListener('data', onStderrData)
          proc.stdout.removeListener('data', onStdoutData)
          setOutput(proc.stdout, proc.stderr)
          resolve(output)                     
        }
      } else {
        process.stdout.write('.')
      }
    }, 1000)
  })

  self.pingServer = () => self.mongoShell('print("Server is alive"); quit(0);')

  self.mongoShell = (commandStr, auth) => new Promise((resolve, reject) => {    
    try {
      var scriptFilePath = path.resolve(os.tmpdir(), 'tmpscript.js')
      fs.writeFileSync(scriptFilePath, commandStr)
      var output = { error: '', info: ''}
      var baseArgs = ['--host', cfg.mongodb.ip, '--port', cfg.mongodb.port] 
      var authArgs = auth ? ['-u', `${cfg.mongodb.superuserName}`, '-p', `${cfg.mongodb.superuserPwd}`, '--authenticationDatabase', `${cfg.mongodb.authenticationDatabase}`] : []
      var args = baseArgs.concat(authArgs).concat([scriptFilePath])
      var spawnOpts = commons.platform.isLinux() ? { uid: cfg.mongodb.uid, gid: cfg.mongodb.gid } : {}
      var proc = spawn(path.resolve(cfg.mongodb.appBinDir, 'mongo'), args, spawnOpts) 
      proc.on('error', reject)
      proc.stdout.on('data', data => output.info += data)
      proc.stderr.on('data', data => output.error += data)
      proc.on('close', code => resolve({ code: code, output: output, process: proc }))
    } catch(e) { 
      reject({ error: e })
    }
  })

  self.shutdownServer = () => self.mongoShell('db.adminCommand({ shutdown: 1}); print("Shutdown command has been issued on the server."); quit(0);', true)
}
 
module.exports = MongoDbTools
