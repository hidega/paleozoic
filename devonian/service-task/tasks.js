var taskProvider = require('.')
var api = require('@permian/build-tasks/api')

var tasks = new api.BuildTasks({ workingDir: __dirname })

var IMAGE_NAME = 'test-rest-sevice'

tasks.image = taskProvider.get({
  imageName: IMAGE_NAME , 
  targetPath: __dirname + '/test/component-test/' + IMAGE_NAME + '.img',
  keepTmpData: true,
  devonianService: {
    setupScriptPath: __dirname + '/test/component-test/service/setup1.sh',
    mainJsPath: __dirname + '/test/component-test/service/index.js'
  },
  podmanOpts: ' --cgroup-manager=cgroupfs'
}) 

module.exports = tasks
