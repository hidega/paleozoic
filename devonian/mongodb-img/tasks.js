var api = require('@permian/build-tasks/api')
var imageBuilder = require('@devonian/image-builder')
var contract = require('@devonian/deployment-contract')
var commons = require('@devonian/commons')

var tasks = new api.BuildTasks({ workingDir: __dirname })
var runScript = 'chmod -c 755 /opt/prg/mongodb/bin/*'
var targetPath = commons.resolvePath(__dirname, commons.imageNameToFileName(contract.MONGODB_IMAGE) + '.img')
var FEDORA_IMG = 'fedora:34'

var buildOptions = {
  keepTmpData: false,
  podmanOpts: '--cgroup-manager=cgroupfs',
  imageName: contract.MONGODB_IMAGE,
  optDir: commons.resolvePath(__dirname, 'res', 'opt'),
  donotSave: false,
  baseImage: FEDORA_IMG,
  runScript,
  targetPath
}

tasks.image = (params, callback) => imageBuilder.build(buildOptions)
  .then(() => callback())
  .catch(e => callback(e || -1))

module.exports = tasks
