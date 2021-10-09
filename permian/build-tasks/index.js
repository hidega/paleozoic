var taskrunner = require('./src/taskrunner')

taskrunner({
  commands: process.argv.splice(2),
  buildTasksCtr: false,
  cwd: process.cwd(),
  buildTasks: {
    workingDir: process.cwd()
  }
})
