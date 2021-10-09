var commons = require('./commons')
var findAndSortPackages = require('./find-sort-pkg')

var incrementVersion = ver => {
  var minorChangeLimit = 998
  var verNrs = ver.split('.').map(Number)
  verNrs.length === 3 || commons.throwError('Invalid version number: ' + ver)
  if(++verNrs[2] > minorChangeLimit) {
    verNrs[1]++
    verNrs[2] = 1
  }
  return verNrs.join('.')
}

var normalizePkgName = n => n.replace('@', '').replace('/', '-')

var handleError = (e, workflow, callback) => commons.writeFile(workflow.packageJson, commons.prettyPrint(workflow.pkgOriginal))
  .catch(console.error)
  .finally(() => callback(e || -1))

var uploadFile = workflow => {
  var cmd = `scp -P ${workflow.upload.sshPort} ${workflow.pkgFilename} ${workflow.upload.user}@${workflow.upload.host}:${workflow.upload.remoteDir}`
  return commons.execCmd(cmd)
}

var removeOldPackages = (workflow, sortedPackages) => {
  sortedPackages.pop()
  var oldFiles = sortedPackages.map(p => ' ' + workflow.upload.remoteDir + '/' + p).join('')
  var rmCmd = `ssh -p ${workflow.upload.sshPort} -l ${workflow.upload.user} ${workflow.upload.host} 'rm -f ${oldFiles}'` 
  return commons.execCmd(rmCmd)
}

var removeOldFiles = workflow => {
  var pkgName = normalizePkgName(workflow.pkg.name) + '-'
  var lsCmd = `ssh -p ${workflow.upload.sshPort} -l ${workflow.upload.user} ${workflow.upload.host} 'ls ${workflow.upload.remoteDir}'`
  return commons.execCmd(lsCmd).then(r => removeOldPackages(workflow, findAndSortPackages(r.stdout.split('\n'), pkgName, '.tgz')))
}

module.exports = (p, callback, workflow = Object.assign({}, p)) => commons.readJson(workflow.packageJson)
  .then(pkg => {
    workflow.pkgOriginal = Object.assign({}, pkg)
    workflow.pkg = Object.assign({}, pkg)
    workflow.pkg.version = incrementVersion(workflow.pkg.version)
    workflow.pkgFilename = commons.resolvePath(workflow.workingDir, normalizePkgName(workflow.pkg.name) + '-' + workflow.pkg.version + '.tgz')
  })
  .then(() => commons.writeFile(workflow.packageJson, commons.prettyPrint(workflow.pkg)))
  .then(() => commons.execCmd('npm', ['pack']))
  .then(() => uploadFile(workflow))
  .then(() => removeOldFiles(workflow).catch(() => console.log('Warning! could not remove old files')))
  .then(() => callback())
  .catch(e => handleError(e, workflow, callback))
  .finally(() => commons.deleteFile(workflow.pkgFilename))
  .catch(console.error)
  
