var imageBuilder = require('.')
var api = require('@permian/build-tasks/api') 

var tasks = new api.BuildTasks({ workingDir: __dirname })

tasks.image = (args, callback) => imageBuilder.build({
    imageName: 'teststuff:1',
    podmanOpts: ' --cgroup-manager=cgroupfs',
    runScript: 'apk add busybox-extras && chmod -c 755 /opt/prg/foo/* && echo `date -uIseconds` > /opt/timestamp',
    baseImage: 'alpine:3.14',
    keepTmpData: false,
    donotSave: false,
    optDir: __dirname + '/test/component-test/opt',
    targetPath: __dirname + '/test/component-test/teststuff.img'
  })
  .then(() => callback())
  .catch(e => callback(e || 1))

module.exports = tasks
  