var BuildTasks = require('../src/build-tasks')
var commons = require('../src/commons')

var promisify = (method, params) => new Promise((resolve, reject) => method(params, err => err ? reject(err) : resolve()))
 
var caseTasks = () => {
  var buildTasks = new BuildTasks()
  console.log('cfg:', buildTasks.getConfiguration())
  return promisify(buildTasks.tasks, {}).then(() => console.log('- caseTasks OK\n'))
}

var casePkgsum = () => {
  var buildTasks = new BuildTasks({}) 
  return promisify(buildTasks.pkgsum, {
    packageJson: commons.resolvePath(__dirname, '..', 'package.json')
  }).then(() => console.log('- casePkgsum OK\n'))
}

var caseJshint = () => {
  var buildTasks = new BuildTasks() 
  return promisify(buildTasks.jshint, {}).then(() => console.log('- caseJshint OK\n'))
} 

var caseDocs = () => {
  var buildTasks = new BuildTasks() 
  return promisify(buildTasks.docs, {
    packageJson: commons.resolvePath(__dirname, '..', 'package.json')
  }).then(() => console.log('- caseDocs OK\n'))
}

var caseFormat = () => {
  var buildTasks = new BuildTasks() 
  return promisify(buildTasks.format, {}).then(() => console.log('- caseFormat OK\n'))
}

caseTasks()
  .then(casePkgsum)
  .then(caseJshint)
  .then(caseDocs)
  .then(caseFormat)
  .then(() => console.log('\nOK\n'))
  .catch(e => console.error('\nERROR\n', e))
