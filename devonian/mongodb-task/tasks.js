var taskProvider = require('.')
var api = require('@permian/build-tasks/api') 

var tasks = new api.BuildTasks({ workingDir: __dirname })

tasks.image = taskProvider.get({ 
  imageName: 'devonian-mongodb:1',
  port: 27017,
  keepTmpData: false,
  dataDir: __dirname + '/test/component-test/data',
  targetPath: __dirname + '/test/component-test/devonian-mongodb.img',
  podmanOpts: ' --cgroup-manager=cgroupfs'
}) 

module.exports = tasks
