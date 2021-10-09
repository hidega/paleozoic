var commons = require('./commons')
var BuildTasks = require('./build-tasks')

var prepareTasks = () => {
  var tasks = false
  var tasksJsPath = commons.resolvePath(commons.cwd, 'tasks.js')
  if(commons.pathExistsSync(tasksJsPath)) {
    try {
      tasks = require(tasksJsPath)
    } catch(e) { 
      console.log('ERROR:\n' + tasksJsPath + '   was found but an error was thrown:\n', e)
      process.exit(1)
    }
  } else {
    console.log('No local tasks.js')
  }
  return tasks
}

var tasks = prepareTasks()

var getCallback = cb => {
  var callback = cb
  if(!callback) {
    callback = e => {
      if(e) {
        console.log('TASKRUNNER ERROR:\n', e, '\n')
        process.exit(1)
      } else {
        process.exit(0)
      }
    }
  }
  return callback
} 

var runTasks = (tasks1, cfg) => new Promise((resolve, reject) => {
  var run = commands => { 
    try {
      if(commands.length === 0) {
        console.log('\nDone\n')
        resolve()
      } else {
        var cmd = commands.shift().split(':')
        console.log('\nRunning "' + cmd[0] + '"')
        if(commons.isFunction(tasks1[cmd[0]])) {
          tasks1[cmd[0]]({
            cwd: cfg.cwd,
            args: cmd.splice(1)
          }, err => err ? reject(err) : setImmediate(() => run(commands)))
        } else {
          reject('Unknown command: ' + cmd[0])
        }
      }
    } catch(e) {
      reject(e)
    }
  }
  run(cfg.commands)
}) 

var createTasks = cfg => {
  var BuildTasksCtr = cfg.buildTasksCtr || BuildTasks
  return new BuildTasksCtr(Object.assign({ 
    packageJson: cfg.packageJson || commons.resolvePath(cfg.cwd, 'package.json'),
    workingDir: cfg.cwd
  }, cfg.buildTasks)) 
}

var taskRunner = (cfg, cb) => {
  cfg.cwd = cfg.cwd ? commons.resolvePath(cfg.cwd) : commons.cwd
  var callback = getCallback(cb)
  runTasks(tasks || createTasks(cfg), cfg).then(() => callback()).catch(e => callback(e || -1))
}

module.exports = taskRunner
