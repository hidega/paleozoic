var deployment = require('@alembic/deployment')
var api = require('@permian/build-tasks/api') 
var taskProvider = require('@devonian/statichttpd-task')

var tasks = new api.BuildTasks({ workingDir: __dirname })

tasks.image = taskProvider.get({ 
  imageName: deployment.fileServer.imageName,
  targetPath: deployment.fileServer.imageName + '.img',
  keepTmpData: true,
  port: deployment.fileServer.internalPort,
  podmanOpts: ' --cgroup-manager=cgroupfs'
}) 

module.exports = tasks
