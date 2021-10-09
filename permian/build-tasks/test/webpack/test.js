var BuildTasks = require('../../src/build-tasks')

var buildTasks = new BuildTasks()

buildTasks.webpack({}, err => err ? console.error('ERROR:', err) : console.log('OK'))
