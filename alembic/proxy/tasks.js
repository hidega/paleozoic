var api = require('@permian/build-tasks/api')
var deployment = require('@alembic/deployment')

var IMAGE_NAME = 'alembic-proxy'

var tasks = new api.BuildTasks({ workingDir: __dirname })

var IMAGE_NAME = deployment.proxy.imageName

tasks.image = taskProvider.get({
  imageName: IMAGE_NAME, 
  targetPath: IMAGE_NAME + '.img',
  keepTmpData: true,
  devonianService: {
    //setupScriptPath: __dirname + '/test/setup1.sh',
    mainJsPath: __dirname + '/dist/main.js'
  },
  podmanOpts: ' --cgroup-manager=cgroupfs'
}) 

module.exports = tasks

