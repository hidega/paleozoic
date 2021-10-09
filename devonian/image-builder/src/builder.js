var commons = require('@devonian/commons')
var parseOptions = require('./parse-options')
var { when } = commons

var PODMAN_CMD = 'podman'

var createDockerfile = options => `
FROM ${options.baseImage}

COPY opt /opt

RUN ${options.runScript || '/bin/true'}
`

var saveCmd = options => when(options.donotSave === true)
  .then('')
  .otherwise(`${PODMAN_CMD} ${options.podmanOpts} save -o ${options.targetPath} ${options.imageName} `)

var createBuildScript = options => `#!/bin/bash
  mkdir -p ${options.buildDir}/opt
  cp -r ${options.optDir}/* ${options.buildDir}/opt/
  ${PODMAN_CMD} ${options.podmanOpts} image rm -f ${options.imageName}
  ${PODMAN_CMD} ${options.podmanOpts} build -t ${options.imageName} ${options.buildDir}
  rm -f ${options.targetPath}
  ${saveCmd(options)}
`

var build = (opts, options = parseOptions(opts)) => commons.createTmpDir()
  .then(tmpDir => {
    options.buildDir = tmpDir
    var resolveInBuildDir = path => commons.resolvePath(options.buildDir, path)
    return commons.writeFile(resolveInBuildDir('build.sh'), createBuildScript(options))
      .then(() => commons.writeFile(resolveInBuildDir('Dockerfile'), createDockerfile(options)))
      .then(() => commons.execCmd('bash', [resolveInBuildDir('build.sh'), '>', resolveInBuildDir('build.out')]))
  })
  .finally(() => when(options.keepTmpData === true)
    .then(() => Promise.resolve())
    .otherwise(() => commons.rmDir(options.buildDir).catch(console.error)))

module.exports = {
  build
}
