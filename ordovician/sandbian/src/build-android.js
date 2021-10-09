var execCmd = require('./exec-cmd')
var parameters = require('./project-parameters')
var commons = require('./commons')

var CLASSES_DEX = 'classes.dex'
var UNALIGNED_APK = '.unaligned.apk'
var APK = '.apk'

var dxTask = (p, env) => {
  var args = [
    '--dex',
    '--output', commons.resolvePath(p.distPath, CLASSES_DEX),
    p.libPath + commons.pathSeparator + '*.jar',
    p.objPath 
  ]
  return execCmd(p.dxPath, args, env) 
}

var packageTask = (p, env) => {
  var args = [
    'package',
    '-f',
    '-m',
    '-F', commons.resolvePath(p.distPath, p.apkName + UNALIGNED_APK),
    '-M', commons.resolvePath(p.codePath, 'AndroidManifest.xml'),
    '-S', p.resPath,
    '-I', p.androidJarPath
  ]
  return execCmd(p.aaptPath, args, env) 
}

var copyTask = p => commons.copyFile(commons.resolvePath(p.distPath, CLASSES_DEX), commons.resolvePath(p.codePath, CLASSES_DEX))

var addTask = (p, env) => {
  var args = [
    'add', 
    commons.resolvePath(p.distPath, p.apkName + UNALIGNED_APK), 
    commons.resolvePath(p.codePath, CLASSES_DEX)
  ]
  return execCmd(p.aaptPath, args, env) 
}

var signTask = p => {
  var result = Promise.resolve({ msg: 'Could not sign ' + p.apkName + APK })
  if(p.keystorePassword) { 
    var args = [
      'sign',
      '--ks', p.keystoreFileName,
      '--ks-pass', 'env:KSPWD',
      '--min-sdk-version', '30',
      commons.resolvePath(p.distPath, p.apkName + APK)
    ]
    result = execCmd(p.apksignerPath, args, { JAVA_HOME: p.jdkPath, KSPWD: p.keystorePassword })
  }
  return result
}

var alignTask = (p, env) => {
  var args = [
    '-f', '4',
    commons.resolvePath(p.distPath, p.apkName + UNALIGNED_APK),
    commons.resolvePath(p.distPath, p.apkName + APK)
  ]
  return execCmd(p.zipalignPath, args, env)
}

module.exports = () => parameters.get()
  .then((p, env = { JAVA_HOME: p.jdkPath }) => dxTask(p, env)
    .then(() => packageTask(p, env))
    .then(() => copyTask(p))
    .then(() => addTask(p, env))
    .then(() => alignTask(p, env))
    .then(() => signTask(p)))

