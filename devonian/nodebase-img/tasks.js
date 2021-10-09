var api = require('@permian/build-tasks/api')
var imageBuilder = require('@devonian/image-builder')
var contract = require('@devonian/deployment-contract')
var commons = require('@devonian/commons')

var tasks = new api.BuildTasks({ workingDir: __dirname })

var runScript = `apk add libstdc++ libgcc openssl && chmod -c 755 /opt/prg/nodejs/bin/*`

var targetPath = commons.resolvePath(__dirname, commons.imageNameToFileName(contract.NODEBASE_IMAGE) + '.img')

var buildOptions = {
  keepTmpData: false,
  podmanOpts: '--cgroup-manager=cgroupfs',
  imageName: contract.NODEBASE_IMAGE,
  optDir: commons.resolvePath(__dirname, 'res', 'opt'),
  donotSave: false,
  baseImage: contract.BASE_LINUX_IMAGE,
  runScript,
  targetPath
}

tasks.image = (params, callback) => imageBuilder.build(buildOptions)
  .then(() => callback())
  .catch(e => callback(e || -1))

module.exports = tasks
