var commons = require('./commons')
var fsPromises = require('fs/promises')

var PARAMETERS_FILE = 'project-parameters.json'

var resolveRelativePath = p => commons.resolvePath(commons.cwd, p)

var validate = p => {
  p.basedir = commons.cwd,
  p.projectName || (p.projectName = 'Android app')
  p.apkName || (p.apkName = 'androidapp')
  p.keystoreFileName || (p.keystoreFileName == null) 
  p.keystorePassword || (p.keystorePassword == null) 
  p.androidSdkPath || (p.androidSdkPath = resolveRelativePath('sdk'))
  p.androidBuildToolsPath || (p.androidBuildToolsPath = commons.resolvePath(p.androidSdkPath, 'build-tools'))
  p.libPath || (p.libPath = resolveRelativePath('lib'))
  p.codePath || (p.codePath = resolveRelativePath('code'))
  p.androidJarPath || (p.androidJarPath = null)
  p.mainPkg || (p.mainPkg = '*')
  p.jdkPath || (p.jdkPath = process.env.JDK_HOME || process.env.JAVA_HOME || resolveRelativePath('jdk'))
  p.objPath = commons.resolvePath(p.codePath, 'obj')
  p.distPath = commons.resolvePath(p.codePath, 'bin')
  p.srcPath = commons.resolvePath(p.codePath, 'src')
  p.resPath = commons.resolvePath(p.codePath, 'res')
  p.javaPath = commons.resolvePath(p.jdkPath, 'bin', 'java')
  p.javacPath = commons.resolvePath(p.jdkPath, 'bin', 'javac')
  p.aaptPath = commons.resolvePath(p.androidBuildToolsPath, 'aapt')
  p.dxPath = commons.resolvePath(p.androidBuildToolsPath, 'dx')
  p.apksignerPath = commons.resolvePath(p.androidBuildToolsPath, 'apksigner')  
  p.zipalignPath = commons.resolvePath(p.androidBuildToolsPath, 'zipalign')
  return p
}

var get = () => fsPromises.readFile(resolveRelativePath(PARAMETERS_FILE))
  .then(data => validate(JSON.parse(data.toString())))
  .catch(console.error)
  .catch(e => Promise.reject('Invalid or missing parameters file: ' + resolveRelativePath(PARAMETERS_FILE)))

module.exports = { PARAMETERS_FILE, get }

