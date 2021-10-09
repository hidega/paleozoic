var taskProvider = require('.')
var api = require('@permian/build-tasks/api') 

var tasks = new api.BuildTasks({ workingDir: __dirname })

tasks.image = taskProvider.get({ 
  imageName: 'devonian-static-httpd:1',
  port: 18000,
  keepTmpData: false,
  dataDir: __dirname + '/test/component-test/data',
  targetPath: __dirname + '/test/component-test/devonian-static-httpd.img',
  podmanOpts: ' --cgroup-manager=cgroupfs'
}) 

module.exports = tasks
