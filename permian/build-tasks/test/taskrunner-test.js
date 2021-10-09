var taskrunner = require('../src/taskrunner')

taskrunner({
  packageJson: '../package.json', 
  commands: ['tasks', 'docs', 'jshint', 'format', 'pkgsum']
})

