var config = require('./config')
var commons = require('@devonian/commons')
var ShSupport = require('@devonian/sh-support')

var shSupport = ShSupport.newInstance({
  errorFile: `${commons.tmpDir}/image-pull-error.txt`
})

var removeGz = i => i.replaceAll(/.gz$/g, '')

var pullGunzipFile = (url, i, tmpDir) => `
  echo "Downloading ${url}/${i}"
  wget -P ${tmpDir} ${url}/${i}
  ${shSupport.exitErrorIfLastFailedCmd('Could not download file ' + i)}
  gunzip ${tmpDir}/${i}
  podman pull docker-archive:${tmpDir}/${removeGz(i)}
  ${shSupport.exitErrorIfLastFailedCmd('Could not pull file ' + i)}
`

var createPullScript = cfg => shSupport.normalizeScript(`
  ${shSupport.shebang()}
  ${shSupport.clearErrorsCmd()} 
  ${cfg.images.map(i => pullGunzipFile(cfg.imageRepositoryUrl, i, cfg.tmpDir))}
  echo "OK"
  exit 0
`)

var pull = cfg => commons.createTmpDir()
  .then(tmpDir => {
    cfg = Object.assign(config, cfg, {
      tmpDir,
      scriptFile: commons.resolvePath(tmpDir, 'pull.sh')
    })  
    return commons.writeFile(cfg.scriptFile, createPullScript(cfg))
  })
  .then(() => commons.execCmd('bash', [cfg.scriptFile])) 
  .finally(() => commons.rmDir(cfg.tmpDir).catch(console.error)) 

var pullConsole = cfg => {
  console.log('Downloading images')
  var intervalHandle = setInterval(() => process.stdout.write('.'), 1000)
  return pull(cfg).finally(() => clearInterval(intervalHandle))
}

module.exports = Object.freeze({ pull, pullConsole })
