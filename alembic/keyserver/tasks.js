var deployment = require('@alembic/deployment')
var api = require('@permian/build-tasks/api') 
var taskProvider = require('@devonian/statichttpd-task')

var tasks = new api.BuildTasks({ workingDir: __dirname })

tasks.image = taskProvider.get({ 
  imageName: deployment.keyServer.imageName,
  targetPath: deployment.keyServer.imageName + '.img',
  keepTmpData: true,
  port: deployment.keyServer.internalPort,
  dataDir: __dirname + '/data',
  podmanOpts: ' --cgroup-manager=cgroupfs'
}) 

module.exports = tasks
