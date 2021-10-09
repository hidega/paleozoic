var execCmd = require('./exec-cmd')
var parameters = require('./project-parameters')
var commons = require('./commons')

var getJars = path => commons.readFilesFromDir(path)
  .then(files => files.length ===0 ? '' : files.filter(f => f.endsWith('.jar')).map(f => ':' + f))
  .catch(() => '')

var aaptTask = () => parameters.get().then(p => {
  var args = [
    'package',
    '-f',
    '-m',
    '-J', p.srcPath,
    '-M', commons.resolvePath(p.codePath, 'AndroidManifest.xml'),
    '-S', p.resPath,
    '-I', p.androidJarPath
  ]
  return execCmd(p.aaptPath, args, { JAVA_HOME: p.jdkPath }).then(() => p)  
})

var javacTask = p => getJars(p.libPath).then(jars => {
  var args = [
    '-d', p.objPath,
    '-source', '1.7',
    '-target', '1.7',
    '-classpath', `${p.srcPath}${jars}`,
    '-bootclasspath', p.androidJarPath,
    commons.resolvePath(p.srcPath, p.mainPkg) + '/*.java'
  ] 
  return execCmd(p.javacPath, args, { JAVA_HOME: p.jdkPath })
})

module.exports = () => aaptTask().then(javacTask)

