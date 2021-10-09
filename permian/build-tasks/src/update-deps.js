var commons = require('./commons')
var findAndSortPackages = require('./find-sort-pkg')

var extractPackages = (dep, workflow) => {
  return Object.entries(dep)
    .filter(e => workflow.localPkgPrefixes.find(p => !!e[1].startsWith(workflow.httpBasePath + p)))
    .map(e => ({ name: e[0], url: e[1] }))
}

var packageNameFromUrl = url => { 
  var result = url.split('/').pop().split('-')
  result.pop()
  return result.join('-') + '-'
} 

var updateDependencies = (remoteFiles, workflow) => {
  var updateEntry = (target, name, value) => target[name] && (target[name] = value)
  workflow.depEntries.forEach(e => {
    var latestPkg = findAndSortPackages(remoteFiles, packageNameFromUrl(e.url), '.tgz').pop()
    if(latestPkg) {
      updateEntry(workflow.pkg.dependencies, e.name, workflow.httpBasePath + latestPkg)
      updateEntry(workflow.pkg.devDependencies, e.name, workflow.httpBasePath + latestPkg)
    }
  })
  commons.writeFile(workflow.packageJson, commons.prettyPrint(workflow.pkg))
}

var listDir = workflow => {
  var lsCmd = `ssh -p ${workflow.upload.sshPort} -l ${workflow.upload.user} ${workflow.upload.host} 'ls ${workflow.upload.remoteDir}'`
  return commons.execCmd(lsCmd)
}

module.exports = (p, callback, workflow = Object.assign({}, p)) => commons.readJson(workflow.packageJson)
  .then(pkg => {
    workflow.httpBasePath = `${workflow.upload.protocol}://${workflow.upload.host}:${workflow.upload.httpPort}/${workflow.upload.npmPath}/`
    workflow.pkg = Object.assign({}, pkg)
    workflow.depEntries = extractPackages(workflow.pkg.dependencies || {}, workflow)
      .concat(extractPackages(workflow.pkg.devDependencies || {}, workflow))
    return listDir(workflow)
  })
  .then((r, remoteFiles = r.stdout.split('\n')) => updateDependencies(remoteFiles, workflow))
  .then(() => callback())
  .catch(e => callback(e || -1))
